import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

function MemeCard({ meme, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="aspect-w-16 aspect-h-12">
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={meme.imageUrl}
          alt={meme.title}
          className="w-full h-64 object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800">
          {meme.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span className="font-semibold text-orange-500">r/{meme.subreddit}</span>
          <span>u/{meme.author}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>↑ {meme.score.toLocaleString()}</span>
          <span>{meme.num_comments} comments</span>
        </div>
        <a
          href={meme.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
        >
          View on Reddit
        </a>
      </div>
    </motion.div>
  );
}

function App() {
  const [memes, setMemes] = useState([]);
  const [query, setQuery] = useState('coding');
  const [searchInput, setSearchInput] = useState('coding');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [after, setAfter] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [subredditMode, setSubredditMode] = useState('meme-subreddits');

  const fetchMemes = async (searchQuery, afterParam = '', replace = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE}/api/memes`, {
        params: {
          query: searchQuery,
          subreddit: subredditMode,
          after: afterParam,
          limit: 25
        }
      });

      if (response.data.success) {
        const newMemes = response.data.memes;
        
        if (replace) {
          setMemes(newMemes);
        } else {
          setMemes(prev => [...prev, ...newMemes]);
        }
        
        setAfter(response.data.after || '');
        setHasMore(response.data.after !== null && newMemes.length > 0);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch memes');
      console.error('Error fetching memes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes(query, '', true);
  }, [subredditMode]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(searchInput);
    setAfter('');
    setMemes([]);
    fetchMemes(searchInput, '', true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchMemes(query, after, false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              🎭 Meme Discovery
            </h1>
            <p className="text-sm text-gray-500">
              Discover the best memes from Reddit
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search memes..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSubredditMode('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                subredditMode === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Reddit
            </button>
            <button
              onClick={() => setSubredditMode('meme-subreddits')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                subredditMode === 'meme-subreddits'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Meme Subreddits
                </button>
            <button
              onClick={() => setSubredditMode('memes')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                subredditMode === 'memes'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              r/memes
            </button>
            <button
              onClick={() => setSubredditMode('dankmemes')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                subredditMode === 'dankmemes'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              r/dankmemes
            </button>
            <button
              onClick={() => setSubredditMode('wholesomememes')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                subredditMode === 'wholesomememes'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              r/wholesomememes
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
          >
            {error}
          </motion.div>
        )}

        {memes.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No memes found. Try a different search term.</p>
          </div>
        )}

        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {memes.map((meme, index) => (
              <MemeCard key={meme.id} meme={meme} index={index} />
            ))}
          </div>
        </AnimatePresence>

        {hasMore && memes.length > 0 && (
          <div className="text-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoadMore}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-purple-500 text-white font-bold rounded-lg hover:from-orange-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {loading ? 'Loading...' : 'Load More Memes'}
            </motion.button>
          </div>
        )}

        {!hasMore && memes.length > 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-500">You've reached the end of results!</p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>Meme Discovery App • Powered by Reddit API</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
