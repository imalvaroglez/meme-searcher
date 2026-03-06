import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const MEME_SUBREDDITS = ['memes', 'dankmemes', 'wholesomememes', 'me_irl', 'dankmeme', 'MemeEconomy'];

const isValidImageUrl = (url) => {
  if (!url) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
};

const filterMemePosts = (posts) => {
  return posts
    .map(post => post.data)
    .filter(post => {
      const hasImageHint = post.post_hint === 'image';
      const hasImageUrl = isValidImageUrl(post.url);
      const isNotNSFW = !post.over_18;
      return (hasImageHint || hasImageUrl) && isNotNSFW && post.url;
    })
    .map(post => ({
      id: post.id,
      title: post.title,
      author: post.author,
      subreddit: post.subreddit,
      imageUrl: post.url,
      thumbnail: post.thumbnail,
      permalink: `https://reddit.com${post.permalink}`,
      score: post.score,
      num_comments: post.num_comments,
      created: post.created_utc
    }));
};

app.get('/api/memes', async (req, res) => {
  try {
    const { query = 'meme', subreddit = 'all', after = '', limit = 25 } = req.query;
    
    let redditUrl;
    
    if (subreddit === 'all') {
      redditUrl = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&limit=${limit}&after=${after}`;
    } else {
      const subreddits = subreddit === 'meme-subreddits' ? MEME_SUBREDDITS.join('+') : subreddit;
      redditUrl = `https://www.reddit.com/r/${subreddits}/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&sort=relevance&limit=${limit}&after=${after}`;
    }

    const response = await axios.get(redditUrl, {
      headers: {
        'User-Agent': 'MemeDiscoveryApp/1.0'
      }
    });

    const posts = response.data.data.children;
    const filteredMemes = filterMemePosts(posts);
    const afterParam = response.data.data.after;

    res.json({
      success: true,
      memes: filteredMemes,
      after: afterParam,
      count: filteredMemes.length
    });
  } catch (error) {
    console.error('Error fetching memes:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch memes from Reddit',
      details: error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Meme Discovery Backend running on http://localhost:${PORT}`);
});
