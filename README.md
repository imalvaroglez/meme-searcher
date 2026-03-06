# Reddit Meme Discovery App

A full-stack application that fetches and displays the latest memes from Reddit with a beautiful, responsive UI.

## Features

- 🔍 **Search Memes**: Search for memes across Reddit or specific subreddits
- 🎯 **Subreddit Toggle**: Switch between all Reddit, meme-heavy subreddits, or individual subreddits
- 🚫 **NSFW Filter**: Automatically filters out NSFW content
- 🖼️ **Image Filtering**: Only shows posts with valid image URLs
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- ⚡ **Smooth Animations**: Powered by Framer Motion
- 📄 **Pagination**: Load more memes with Reddit's pagination
- 🎨 **Beautiful UI**: Modern design with Tailwind CSS

## Tech Stack

### Backend
- Node.js + Express
- Axios for Reddit API requests
- CORS enabled
- Autum for architectural patterns

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion for animations
- Axios for API calls

## Project Structure

```
meme-searcher/
├── backend/
│   ├── server.js          # Express server with /api/memes endpoint
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   └── index.css      # Tailwind CSS
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

Or install individually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### Running the Application

#### Option 1: Run both servers simultaneously
```bash
npm run dev
```

#### Option 2: Run servers separately

Terminal 1 (Backend):
```bash
npm run backend
# or
cd backend && npm run dev
```

Terminal 2 (Frontend):
```bash
npm run frontend
# or
cd frontend && npm run dev
```

### Access the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## API Endpoints

### GET /api/memes

Query parameters:
- `query` (string): Search term (default: "meme")
- `subreddit` (string): Subreddit to search (default: "all")
  - Options: "all", "meme-subreddits", "memes", "dankmemes", "wholesomememes", etc.
- `after` (string): Reddit pagination token
- `limit` (number): Number of results (default: 25)

Response:
```json
{
  "success": true,
  "memes": [
    {
      "id": "string",
      "title": "string",
      "author": "string",
      "subreddit": "string",
      "imageUrl": "string",
      "thumbnail": "string",
      "permalink": "string",
      "score": number,
      "num_comments": number,
      "created": number
    }
  ],
  "after": "string",
  "count": number
}
```

### GET /api/health

Health check endpoint.

## Features in Detail

### Image Filtering
The backend filters posts to only include those with:
- `post_hint: 'image'`, or
- Valid image extensions (.jpg, .jpeg, .png, .gif, .webp)

### NSFW Filter
Posts with `over_18: true` are automatically excluded from results.

### Subreddit Options
- **All Reddit**: Searches across entire Reddit
- **Meme Subreddits**: Searches across r/memes, r/dankmemes, r/wholesomememes, r/me_irl, r/dankmeme, r/MemeEconomy
- **Individual Subreddits**: Search within a specific subreddit

### Pagination
Uses Reddit's `after` parameter to load additional results with the "Load More" button.

## Testing

To verify the app works correctly:

1. Start both backend and frontend servers
2. Open http://localhost:5173 in your browser
3. Search for "coding" (default search term)
4. Verify that at least 5 image cards render successfully
5. Test the subreddit toggle buttons
6. Test the "Load More" button

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm run dev
```

## License

MIT
