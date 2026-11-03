import { useEffect } from "react";

/**
 * SEO and metadata management for Cinematic Real Estate page
 */
export function useCinematicRealEstateMetadata() {
  useEffect(() => {
    // Set page title
    document.title = "Cinematic Real Estate Films | Orivon Studio";

    // Set or update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    const description = "Transform luxury property photography into cinematic films. Professional real estate video production designed to make high-end listings stand out.";
    
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Set keywords (optional, less important for modern SEO)
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    const keywords = "cinematic real estate, luxury property videos, real estate cinematography, property films, luxury listings, architectural videography";
    
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    } else {
      metaKeywords = document.createElement("meta");
      metaKeywords.name = "keywords";
      metaKeywords.content = keywords;
      document.head.appendChild(metaKeywords);
    }

    // Open Graph tags for social sharing
    const setOGTag = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (tag) {
        tag.setAttribute("content", content);
      } else {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        tag.setAttribute("content", content);
        document.head.appendChild(tag);
      }
    };

    setOGTag("og:title", "Cinematic Real Estate Films | Orivon Studio");
    setOGTag("og:description", description);
    setOGTag("og:type", "website");
    // setOGTag("og:image", "/images/og-cinematic-real-estate.jpg"); // TODO: Add OG image
    
    // Cleanup function to restore original title when leaving the page
    const originalTitle = document.title;
    
    return () => {
      document.title = originalTitle;
    };
  }, []);
}
