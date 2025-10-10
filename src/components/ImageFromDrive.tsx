import React, { useEffect, useState, useCallback } from 'react';

// Use a placeholder for the fallback image URL
const DEFAULT_FALLBACK =
  'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg';

// Helper to extract the file ID from various Drive link formats
function extractDriveFileId(url?: string | null): string | null {
  if (!url) return null;
  // /d/<id>/view
  let m = url.match(/\/d\/([^/]+)/);
  if (m && m[1]) return m[1];
  // id=... param
  m = url.match(/[?&]id=([^&]+)/);
  if (m && m[1]) return m[1];
  // download?id=... param (less common but good to have)
  m = url.match(/download\?id=([^&]+)/);
  if (m && m[1]) return m[1];
  return null;
}

interface Props {
  driveLink?: string | null;
  alt?: string;
  className?: string;
  fallback?: string;
}

// Define the hierarchy of image sources to try
const getCandidateUrls = (fileId: string, driveLink: string | null): string[] => {
    // 1. Direct view link (most reliable for public/shared files)
    const directView = `https://drive.google.com/uc?export=view&id=${fileId}`;
    // 2. Thumbnail (fastest loading, but lower quality)
    const thumbnail = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    
    // Fallback to the original driveLink if it wasn't a file-ID-based link (e.g. if it was a direct image URL)
    return [directView, thumbnail, driveLink || ''];
};

export default function ImageFromDrive({
  driveLink,
  alt = '',
  className = '',
  fallback = DEFAULT_FALLBACK,
}: Props) {
  const fileId = extractDriveFileId(driveLink);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [useIframe, setUseIframe] = useState(false);
  
  // Memoize the array of URLs we are going to cycle through
  const candidateUrls = useCallback(() => {
    if (fileId) {
        return getCandidateUrls(fileId, driveLink);
    }
    // If no fileId, just use the provided link or fallback
    return [driveLink || fallback];
  }, [fileId, driveLink, fallback]);

  // Determine the current image source based on the index
  const imgSrc = candidateUrls()[currentUrlIndex] || fallback;

  // Function to handle image loading error
  const handleImageError = () => {
    const nextIndex = currentUrlIndex + 1;
    
    if (nextIndex < candidateUrls().length) {
      // Try the next candidate URL
      setCurrentUrlIndex(nextIndex);
    } else {
      // All direct image URLs failed, switch to the iframe fallback
      setUseIframe(true);
    }
  };
  
  // Reset state when the driveLink changes
  useEffect(() => {
      setCurrentUrlIndex(0);
      setUseIframe(false);
  }, [driveLink]);
  
  // If we've exhausted image sources and moved to iframe
  if (useIframe && fileId) {
    const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    return (
      <iframe
        src={previewUrl}
        title={alt}
        className={className}
        style={{ border: 0 }}
        loading="lazy"
        // Ensure iframe takes full height/width of its container
        allowFullScreen 
      />
    );
  }

  // Render the image, with error handling to cycle through candidates
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleImageError}
    />
  );
}
