/**
 * CINEMATIC REAL ESTATE - VIDEO GALLERY CONFIGURATION
 * 
 * This file centralizes all video references for the Cinematic Real Estate landing page.
 * Update this file to:
 * - Replace reference videos with authorized production content
 * - Add new videos to the gallery
 * - Update video metadata (titles, descriptions)
 * - Mark videos as approved for production deployment
 */

export const GALLERY_VIDEOS = [
  {
    id: "villa-1",
    src: "/videos/cinematic-real-estate/luxury-villa.mp4",
    poster: null, // TODO: Add poster image path when available (e.g., "/images/posters/villa-1.jpg")
    title: "Mediterranean Elegance",
    description: "Architectural cinematography showcasing contemporary design and natural light.",
    aspectRatio: "16/9",
    
    // ⚠️ IMPORTANT: Set to true only when this video is:
    // 1. Original Orivon Studio work, OR
    // 2. Explicitly licensed/authorized for commercial use
    approvedForProduction: false,
    
    // Optional: Add metadata for production tracking
    metadata: {
      sourceDate: "2026-10-28",
      notes: "Reference video for layout and design testing only",
    }
  },
  {
    id: "villa-2",
    src: "/videos/cinematic-real-estate/puglia-villa.mp4",
    poster: null,
    title: "Coastal Serenity",
    description: "Slow cinematic movements revealing the property's unique character.",
    aspectRatio: "16/9",
    approvedForProduction: false,
    metadata: {
      sourceDate: "2026-10-28",
      notes: "Reference video for layout and design testing only",
    }
  },
  {
    id: "villa-3",
    src: "/videos/cinematic-real-estate/video-1080.webm",
    poster: null,
    title: "Modern Sophistication",
    description: "Editorial pacing and transitions that emphasize luxury and space.",
    aspectRatio: "16/9",
    approvedForProduction: false,
    metadata: {
      sourceDate: "2026-10-28",
      notes: "Reference video for layout and design testing only",
    }
  },
];

/**
 * Hero video configuration
 */
export const HERO_VIDEO = {
  src: "/videos/cinematic-real-estate/luxury-villa.mp4",
  poster: null, // TODO: Add hero poster image
  approvedForProduction: false,
  metadata: {
    notes: "Reference video for hero section - replace before production deployment",
  }
};

/**
 * Filter videos approved for production
 * Use this in production builds to ensure only authorized content is shown
 */
export const getProductionVideos = () => {
  return GALLERY_VIDEOS.filter(video => video.approvedForProduction);
};

/**
 * Check if all videos are production-ready
 */
export const areAllVideosApproved = () => {
  return GALLERY_VIDEOS.every(video => video.approvedForProduction) && 
         HERO_VIDEO.approvedForProduction;
};

/**
 * Get videos for current environment
 * In production, only show approved videos
 * In development, show all videos
 */
export const getVideosForEnvironment = () => {
  const isProduction = import.meta.env.PROD;
  
  if (isProduction) {
    const approvedVideos = getProductionVideos();
    
    // If no videos are approved, return empty array or placeholder
    // (Handle this in the component UI)
    return approvedVideos;
  }
  
  // Development: show all videos
  return GALLERY_VIDEOS;
};
