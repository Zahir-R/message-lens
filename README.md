# Message Filter

A TypeScript application that filters and analyzes .txt files to identify important messages based on customizable criteria. It can generate reports and send email notifications.

## Features

- Parses chat exports in standard format
- Identifies important messages using keyword matching and pattern recognition
- Scores messages based on relevance criteria
- Generates detailed reports of important messages
- Supports email notifications (Gmail)
- Customizable keywords and patterns

## Installation

1. Clone or download the project files
2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update with your email credentials

## Configuration

Edit the `.env` file with your settings:

```
EMAIL_USER="your_email@gmail.com"
EMAIL_PASS="your_app_specific_password"
# Optional: Custom chat file path
# CHAT_PATH="examples/chat.txt"
```

For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an app-specific password

## Usage

1. Export your chat (without media) as a .txt file
2. Place the chat file in the `examples/` directory or specify a custom path
3. Run the application:
```bash
npm run dev
```

## Customization

You can modify the filtering criteria by editing:

- **Keywords**: Update the `keywords` object in `message-filter.ts`
- **Patterns**: Modify the `patterns` object for different regex patterns
- **Important senders**: Adjust the `importantSenders` array

## File Structure

```
message-filter/
├── src/
│   └── message-filter.ts  # Main application
├── examples/
│   └── chat.txt           # Example chat file
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md           # This file
```

## License

MIT License - see [LICENSE](LICENSE) file for details