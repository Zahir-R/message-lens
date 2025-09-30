# Message Lens

A web application for filtering and analyzing important messages from chat exports based on customizable criteria. It can generate reports and send email notifications.

## Features

### Intelligent Message Filtering
- **Keyword-based categorization** - Create custom categories with relevant keywords
- **Pattern recognition** - Detect dates, times, links, and locations automatically
- **Sender importance** - Prioritize messages from specific senders
- **Scoring system** - Customizable weights and thresholds for message importance

### Advanced Output Options
- **Download filtered reports** - Generate and download categorized message files
- **Email notifications** - Send processed reports directly to your inbox (must change env variables)
- **Real-time preview** - Preview important messages before downloading

### User Experience
- **Dark/Light theme** - Seamless theme switching with system preference detection
- **Responsive design** - Optimized for desktop and mobile devices
- **Toast notifications** - User-friendly feedback for all actions

### Technical Excellence
- **Type-safe development** - Full TypeScript implementation
- **Modern React patterns** - Hooks, Context API, and functional components
- **Rate limiting** - Protected API endpoints against abuse
- **Error handling** - Comprehensive error handling and user feedback

## Installation

1. Clone or download the project files
2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env.local`
   - Update with your email credentials

## Configuration

Edit the `.env.local` file with your settings:

```env
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_specific_password"
```

For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an app-specific password

## Customization

The default parameters in src/app/page.tsx can be modified:
```typescript
keywords: {
   'important': ['urgent', 'important', ...],
   'academic': ['homework', 'assignment', ...],
},
patterns: {
   date: true,
   time: true,
   link: true,
   place: true
},
// ... more conf
```

## File Structure

```text
src/
├── app/                   # Next.js app directory
│   ├── api/               # API routes
│   │   ├── process/       # Message processing endpoint
│   │   └── email/         # Email sending endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── FileUpload.tsx     # File upload component
│   ├── MessageFilter.ts   # Main filter logic
│   ├── ParameterPanel.tsx # Filter configuration
│   ├── OutputOptions.tsx  # Output settings
│   ├── Toast.tsx          # Notification component
│   └── ThemeToggle.tsx    # Theme switcher
├── contexts/              # React contexts
│   └── ThemeContext.tsx   # Theme management
types/                     # TypeScript definitions
└── index.ts               # Main type definitions
```

## Usage

### Upload Chat File
- Click the upload area to select your chat export file (txt format)
- Supported format: WhatsApp-style chat exports with timestamps

### Configure Filters
- Pattern Detection: Toggle detection of dates, times, links, and places

- Important Senders: Specify senders whose messages get priority

- Keyword Categories: Create custom categories with relevant keywords

- Scoring System: Adjust weights and thresholds for message importance

### Set Output Options
- Choose to download the filtered report
- Optionally send email notifications with the report
- Enter email address for notifications

### Process & Review
- Click "Process Chat" to analyze your messages
- View results summary with message counts

## License

MIT License - see [LICENSE](LICENSE) file for details