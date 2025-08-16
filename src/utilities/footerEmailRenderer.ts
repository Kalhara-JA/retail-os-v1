export interface TemplateVariables {
  email: string
  date: string
  time: string
  ip: string
}

export function replaceTemplateVariables(text: string, variables: TemplateVariables): string {
  return text
    .replace(/\{\{email\}\}/g, variables.email)
    .replace(/\{\{date\}\}/g, variables.date)
    .replace(/\{\{time\}\}/g, variables.time)
    .replace(/\{\{ip\}\}/g, variables.ip)
}

export async function renderEmailContent(content: any): Promise<string> {
  try {
    if (!content || !content.root || !content.root.children) {
      return ''
    }

    let html = ''

    for (const child of content.root.children) {
      if (child.type === 'paragraph' && child.children) {
        for (const textChild of child.children) {
          if (textChild.type === 'text' && textChild.text) {
            html += textChild.text
          }
        }
      }
    }

    return html
  } catch (error) {
    console.error('Error rendering email content:', error)
    return ''
  }
}
