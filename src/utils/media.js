export const isGoogleDriveUrl = (url) => {
  if (!url) return false;
  return /(?:drive\.google\.com|docs\.google\.com)/.test(url);
};

export const getGoogleDriveId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:https?:\/\/)?(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/.*?id=)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};

export const isYouTubeUrl = (url) => {
  if (!url) return false;
  return /(?:youtube\.com|youtu\.be)/.test(url);
};

export const getYouTubeIframeUrl = (url) => {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
  }
  return url;
};

export const isTelegramUrl = (url) => {
  if (!url) return false;
  return /(?:t\.me|telegram\.me)\/[a-zA-Z0-9_]+\/[0-9]+/.test(url);
};

export const getTelegramIframeUrl = (url) => {
  if (!url) return '';
  const match = url.match(/(https?:\/\/(?:t\.me|telegram\.me)\/[a-zA-Z0-9_]+\/[0-9]+)/);
  if (match && match[1]) {
    return `${match[1]}?embed=1&dark=1`; // Auto dark mode!
  }
  return url;
};

export const getDirectMediaUrl = (url) => {
  if (!url) return '';
  
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  const id = getGoogleDriveId(url);
  if (id) {
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
  }

  return url;
};

export const getGoogleDriveIframeUrl = (url) => {
  const id = getGoogleDriveId(url);
  if (id) {
    return `https://drive.google.com/file/d/${id}/preview`;
  }
  return url;
};

export const getDownloadUrl = (url) => {
  if (!url) return '';
  const id = getGoogleDriveId(url);
  if (id) {
    return `https://drive.google.com/uc?export=download&id=${id}`;
  }
  return url;
};
