# Levi's Poop Tracker

A simple, mobile-friendly web app for tracking poop entries. Built with vanilla HTML, CSS, and JavaScript.

## Features

- Multi-step form flow
- Date/time picker (defaults to current time)
- Size selection (Small, Medium, Large)
- Texture selection with helpful descriptions
- Optional notes
- Google Sheets integration for data storage

## Setup

### 1. Google Sheets Integration

1. Create a new Google Sheet
2. Name the first sheet "Entries"
3. Add headers in row 1: `Timestamp | Date | Time | Size | Texture | Notes`
4. Go to Extensions > Apps Script
5. Replace the code with the contents of `google-apps-script.js`
6. Deploy as a web app (Deploy > New deployment > Web app)
7. Copy the web app URL
8. Paste it in `app.js` where it says `YOUR_GOOGLE_SCRIPT_URL_HERE`

### 2. Local Development

Simply open `index.html` in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve
```

### 3. Deployment

This is a static site - deploy anywhere:
- GitHub Pages
- Netlify
- Vercel
- Any web hosting

## License

MIT
