# WhatsApp Button Component

A floating WhatsApp button component that allows visitors to quickly start a conversation via WhatsApp.

## Features

- **Floating Design**: Fixed position button that stays visible as users scroll
- **Customizable**: Configurable through the CMS admin panel
- **Responsive**: Works on all device sizes
- **Smooth Animations**: Uses Framer Motion for smooth hover and click animations
- **Tooltip**: Shows helpful text on hover
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Configuration

The WhatsApp button can be configured through the CMS admin panel under "Globals" > "WhatsApp". Available settings:

- **Enable/Disable**: Toggle the button on or off
- **Phone Number**: WhatsApp phone number (include country code)
- **Default Message**: Pre-filled message when users click the button
- **Position**: Choose between bottom-right or bottom-left
- **Size**: Small, medium, or large button size
- **Tooltip Text**: Custom text shown on hover

## Usage

The WhatsApp button is automatically included in the main layout and will appear on all pages when enabled.

### Manual Integration

If you need to add the WhatsApp button to a specific component:

```tsx
import { WhatsAppButton } from '@/components/WhatsAppButton'

// Basic usage
<WhatsAppButton 
  phoneNumber="+1234567890"
  message="Hello! I need help."
/>

// With all options
<WhatsAppButton 
  phoneNumber="+1234567890"
  message="Hello! I need help."
  enabled={true}
  position="bottom-right"
  size="medium"
  tooltipText="Chat with us"
/>
```

## Technical Details

- **Component**: `src/components/WhatsAppButton/index.tsx` - Client-side button component
- **Wrapper**: `src/components/WhatsAppButton/WhatsAppButtonWrapper.tsx` - Server component that fetches CMS data
- **Config**: `src/WhatsApp/config.ts` - CMS global configuration
- **Utility**: `src/utilities/getWhatsApp.ts` - Helper function to fetch WhatsApp settings

## Styling

The button uses Tailwind CSS classes and includes:
- Green WhatsApp brand colors
- Smooth hover and click animations
- Responsive sizing
- Shadow effects
- Tooltip with arrow pointer

## Browser Support

- Modern browsers with ES6+ support
- WhatsApp Web API integration
- Fallback for unsupported browsers
