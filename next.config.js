const withOptimizedImages = require('next-optimized-images');

module.exports = withOptimizedImages({
  images: {
    webp: {
      quality: 10,
    },
  },
});
