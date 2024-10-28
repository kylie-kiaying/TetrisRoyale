export async function fetchHotPosts() {
  const response = await fetch(
    'https://www.reddit.com/r/tetris/hot.json?limit=5'
  );
  const data = await response.json();

  return data.data.children.map((post) => {
    // Check for high-resolution image in the preview field
    const previewImage = post.data.preview?.images[0]?.source?.url?.replace(
      '&amp;',
      '&'
    );
    const thumbnail = post.data.thumbnail?.startsWith('http')
      ? post.data.thumbnail
      : null;

    return {
      title: post.data.title,
      url: `https://reddit.com${post.data.permalink}`,
      score: post.data.score,
      // Use preview image if available; otherwise, fall back to thumbnail
      thumbnail: previewImage || thumbnail,
    };
  });
}
