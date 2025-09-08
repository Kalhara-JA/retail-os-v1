import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '../../../../../src/payload.config'
import { isValidEmail, sanitizeEmail, parseRecipientList } from '../../../../../src/utilities/email'
import {
  TemplateVariables,
  renderEmailContent,
  replaceTemplateVariables,
} from '../../../../../src/utilities/footerEmailRenderer'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Sanitize and validate email
    const sanitizedEmail = sanitizeEmail(email)
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Check if required environment variables are set
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email configuration missing: SMTP_USER or SMTP_PASS not set')
      // Return success but log that email was not sent
      console.log(
        `Newsletter subscription received for: ${sanitizedEmail} (email not sent - no SMTP config)`,
      )
      return NextResponse.json(
        {
          message: 'Successfully subscribed to newsletter',
          note: 'Email confirmation will be sent when service is configured',
        },
        { status: 200 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Get footer configuration for email content
    const footerConfig = await payload.findGlobal({
      slug: 'footer',
    })

    // Prepare template variables
    const templateVariables: TemplateVariables = {
      email: sanitizedEmail,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      ip: process.env.NODE_ENV === 'production' ? 'Hidden for privacy' : 'Development mode',
    }

    // Send confirmation email to the subscriber
    let welcomeSubject = 'Welcome to Retail OS Newsletter!'
    let welcomeHtml = `<p>Thank you for subscribing to our newsletter, ${sanitizedEmail}!</p>`

    if (footerConfig?.newsletterEmailConfig?.welcomeEmailBody) {
      welcomeSubject = footerConfig.newsletterEmailConfig.welcomeEmailSubject || welcomeSubject
      welcomeHtml = await renderEmailContent(footerConfig.newsletterEmailConfig.welcomeEmailBody)
      welcomeHtml = replaceTemplateVariables(welcomeHtml, templateVariables)
    }

    await payload.sendEmail({
      to: sanitizedEmail,
      subject: welcomeSubject,
      html: welcomeHtml,
    })

    // Send notification email to admin (optional)
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      let adminSubject = 'New Newsletter Subscription'
      let adminHtml = `<p>A new user has subscribed to your newsletter: ${sanitizedEmail}</p>`

      if (footerConfig?.newsletterEmailConfig?.adminNotificationBody) {
        adminSubject = footerConfig.newsletterEmailConfig.adminNotificationSubject || adminSubject
        adminHtml = await renderEmailContent(
          footerConfig.newsletterEmailConfig.adminNotificationBody,
        )
        adminHtml = replaceTemplateVariables(adminHtml, templateVariables)
      }

      const adminRecipients = parseRecipientList(adminEmail)
      for (const recipient of adminRecipients) {
        await payload.sendEmail({
          to: recipient,
          subject: adminSubject,
          html: adminHtml,
        })
      }
    }

    return NextResponse.json({ message: 'Successfully subscribed to newsletter' }, { status: 200 })
  } catch (error) {
    console.error('Newsletter subscription error:', error)

    // Provide more specific error messages based on the error type
    let errorMessage = 'Failed to subscribe to newsletter'
    let statusCode = 500

    if (error instanceof Error) {
      if (error.message.includes('Unexpected socket close')) {
        errorMessage = 'Email service connection failed. Please try again later.'
        statusCode = 503 // Service Unavailable
      } else if (error.message.includes('Invalid login')) {
        errorMessage = 'Email service authentication failed. Please contact support.'
        statusCode = 500
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Email service timeout. Please try again later.'
        statusCode = 503
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Email service unavailable. Please try again later.'
        statusCode = 503
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.message
              : 'Unknown error'
            : undefined,
      },
      { status: statusCode },
    )
  }
}
