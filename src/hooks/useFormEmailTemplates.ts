import type { CollectionAfterChangeHook } from 'payload'
import {
  TemplateVariables,
  renderEmailContent,
  replaceTemplateVariables,
} from '../utilities/footerEmailRenderer'
import { parseRecipientList } from '../utilities/email'

export const useFormEmailTemplates: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (operation !== 'create') return

  try {
    // Check if this is a form submission
    if (doc.collection === 'form-submissions') {
      const payload = req.payload

      // Get the form configuration
      const form = await payload.findByID({
        collection: 'forms',
        id: doc.form,
      })

      if (!form || !form.emails || form.emails.length === 0) return

      // Extract form data
      const formData: Record<string, any> = {}
      doc.submissionData?.forEach((item: any) => {
        formData[item.field] = item.value
      })

      // Get client information
      const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown'
      const userAgent = req.headers.get('user-agent') || 'Unknown'

      // Process each email configuration
      const emailPromises = form.emails.map(async (emailConfig: any) => {
        try {
          // Prepare template variables
          const templateVariables: TemplateVariables = {
            email: formData.email || formData.Email || '',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            ip: Array.isArray(ip) ? ip[0] : ip,
            ...formData, // Include all form data as variables
          }

          let emailSubject = emailConfig.subject
          let emailHtml = ''

          // Determine email template type based on recipient and subject
          let emailTemplateType: 'welcome' | 'admin-notification' | 'custom' | null = null

          // If sending to the subscriber ({{email}}), use welcome template
          if (
            emailConfig.emailTo === '{{email}}' ||
            emailConfig.emailTo === templateVariables.email
          ) {
            emailTemplateType = 'welcome'
          }
          // If sending to admin and subject contains "subscription", use admin notification
          else if (
            emailConfig.subject.toLowerCase().includes('subscription') ||
            emailConfig.subject.toLowerCase().includes('newsletter')
          ) {
            emailTemplateType = 'admin-notification'
          }

          // Get footer configuration for email content
          const footerConfig = await payload.findGlobal({
            slug: 'footer',
          })

          // Try to use footer email configuration first
          if (
            emailTemplateType === 'welcome' &&
            footerConfig?.newsletterEmailConfig?.welcomeEmailBody
          ) {
            emailSubject = footerConfig.newsletterEmailConfig.welcomeEmailSubject || emailSubject
            emailHtml = await renderEmailContent(
              footerConfig.newsletterEmailConfig.welcomeEmailBody,
            )
          } else if (
            emailTemplateType === 'admin-notification' &&
            footerConfig?.newsletterEmailConfig?.adminNotificationBody
          ) {
            emailSubject =
              footerConfig.newsletterEmailConfig.adminNotificationSubject || emailSubject
            emailHtml = await renderEmailContent(
              footerConfig.newsletterEmailConfig.adminNotificationBody,
            )
          } else if (emailConfig.message) {
            // Use custom message if no footer config available
            emailHtml = await renderEmailContent(emailConfig.message)
          }

          // Replace variables in subject and content
          emailSubject = replaceTemplateVariables(emailSubject, templateVariables)
          emailHtml = replaceTemplateVariables(emailHtml, templateVariables)

          // Determine recipients
          let toValue = emailConfig.emailTo
          if (toValue === '{{email}}' && templateVariables.email) {
            toValue = templateVariables.email
          }

          const toRecipients = parseRecipientList(toValue)
          const ccRecipients = parseRecipientList(emailConfig.cc)
          const bccRecipients = parseRecipientList(emailConfig.bcc)

          if (toRecipients.length === 0) {
            console.warn('No recipient specified for email notification')
            return
          }

          // Send email (send one per recipient for consistent provider handling)
          await Promise.all(
            toRecipients.map((to) =>
              payload.sendEmail({
                to,
                cc: ccRecipients,
                bcc: bccRecipients,
                replyTo: emailConfig.replyTo,
                from: emailConfig.emailFrom,
                subject: emailSubject,
                html: emailHtml,
              }),
            ),
          )

          console.log(`Email sent to ${toRecipients.join(', ')} for form submission ${doc.id}`)
        } catch (error) {
          console.error('Error sending email notification:', error)
        }
      })

      await Promise.allSettled(emailPromises)
    }
  } catch (error) {
    console.error('Error in form email template hook:', error)
  }
}
