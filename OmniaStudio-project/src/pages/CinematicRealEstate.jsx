import React, { useState, useEffect, useRef } from "react";
import Footer from "../components/Footer";
import { GALLERY_VIDEOS, HERO_VIDEO, getVideosForEnvironment } from "../data/cinematicRealEstateVideos";
import { useCinematicRealEstateMetadata } from "../hooks/useCinematicRealEstateMetadata";

// Hero video component
function HeroVideo({ src, className = "" }) {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedData = () => setIsLoaded(true);
    video.addEventListener("loadeddata", handleLoadedData);

    return () => video.removeEventListener("loadeddata", handleLoadedData);
  }, []);

  return (
    <div className={`relative overflow-hidden bg-gray-900 ${className}`}>
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

// Gallery video player component
function GalleryVideoPlayer({ video, onVideoClick }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);

  const handlePlayPause = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl.play().catch((err) => {
        console.error("Video play error:", err);
        setError(true);
      });
    } else {
      videoEl.pause();
    }
  };

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => setError(true);

    videoEl.addEventListener("play", handlePlay);
    videoEl.addEventListener("pause", handlePause);
    videoEl.addEventListener("error", handleError);

    return () => {
      videoEl.removeEventListener("play", handlePlay);
      videoEl.removeEventListener("pause", handlePause);
      videoEl.removeEventListener("error", handleError);
    };
  }, []);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  if (error) {
    return (
      <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white/60 p-8">
          <p className="text-sm">Video temporarily unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative group cursor-pointer"
      onClick={() => onVideoClick && onVideoClick(video)}
    >
      <div className="relative overflow-hidden rounded-lg bg-gray-900">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          preload="metadata"
          playsInline
          onClick={(e) => {
            e.stopPropagation();
            handlePlayPause();
          }}
        >
          <source src={video.src} type={video.src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
        </video>

        {/* Play/Pause overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayPause();
            }}
            className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center transform hover:scale-110 transition-transform duration-200"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? (
              <div className="flex gap-1">
                <div className="w-1 h-6 bg-gray-900 rounded" />
                <div className="w-1 h-6 bg-gray-900 rounded" />
              </div>
            ) : (
              <div className="w-0 h-0 border-l-[12px] border-l-gray-900 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* Video info */}
      <div className="mt-4">
        <h3 className="text-lg font-heading font-semibold text-[var(--text-primary)]">
          {video.title}
        </h3>
        <p className="text-sm text-gray-600 mt-1">{video.description}</p>
      </div>
    </div>
  );
}

export default function CinematicRealEstate() {
  // Set page metadata and SEO
  useCinematicRealEstateMetadata();
  
  const scrollToGallery = () => {
    const gallery = document.getElementById("gallery");
    if (gallery) {
      gallery.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Get videos appropriate for current environment
  const displayVideos = getVideosForEnvironment();
  const isProduction = import.meta.env.PROD;
  const hasApprovedVideos = displayVideos.length > 0;

  return (
    <div className="min-h-screen bg-bg">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <HeroVideo
          src={HERO_VIDEO.src}
          className="absolute inset-0 w-full h-full"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 text-center">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight tracking-tight"
            data-aos="fade-up"
          >
            Every property has a story.
          </h1>

          <p
            className="mt-6 text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-light"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            We transform property photography into cinematic films designed to
            make luxury listings stand out.
          </p>

          {/* CTAs */}
          <div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <button
              onClick={scrollToGallery}
              className="w-full sm:w-auto px-8 py-4 bg-white text-[var(--text-primary)] font-semibold rounded-full hover:bg-white/90 transition-all duration-300 shadow-xl"
            >
              Explore Our Films
            </button>
            <a
              href="/#contact"
              className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[var(--text-primary)] transition-all duration-300"
            >
              Request a Property Film
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
            <div className="w-1 h-3 bg-white/50 rounded-full mx-auto animate-pulse" />
          </div>
        </div>
      </section>

      {/* Service Presentation Section */}
      <section className="py-20 md:py-32 bg-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-[var(--text-primary)] leading-tight"
              data-aos="fade-up"
            >
              Your photos. A different perspective.
            </h2>

            <div className="mt-8 space-y-6 text-lg text-gray-700" data-aos="fade-up" data-aos-delay="100">
              <p>
                We work with authorized property photography to create cinematic
                experiences that go beyond static images.
              </p>
              <p>
                Through carefully choreographed camera movements, depth
                composition, and editorial pacing, we transform your listing
                into a compelling visual narrative.
              </p>
              <p className="text-[var(--text-primary)] font-medium">
                Each film is crafted to showcase the property's most distinctive
                architectural features and spatial flow.
              </p>
            </div>
          </div>

          {/* Visual comparison concept */}
          <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold text-[var(--text-primary)] mb-2">
                Static Photography
              </h3>
              <p className="text-gray-600">
                Beautiful, professional images that capture moments in time.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-2)] rounded-2xl p-8 shadow-lg text-white">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">
                Cinematic Storytelling
              </h3>
              <p className="text-white/90">
                Movement, depth, transitions, and editorial pacing that bring the property to life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 md:py-32 bg-neutral-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-[var(--text-primary)] mb-4"
              data-aos="fade-up"
            >
              Selected Visual References
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
              Cinematic approaches to architectural storytelling. These reference pieces demonstrate the visual style and pacing we bring to luxury property marketing.
            </p>
          </div>

          {/* Gallery Grid */}
          {hasApprovedVideos ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {displayVideos.map((video, index) => (
                <div
                  key={video.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <GalleryVideoPlayer video={video} />
                </div>
              ))}
            </div>
          ) : (
            isProduction && (
              <div className="max-w-3xl mx-auto bg-white rounded-2xl p-12 text-center shadow-lg">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-2)] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-heading font-bold text-[var(--text-primary)] mb-4">
                  Curated Films Coming Soon
                </h3>
                <p className="text-gray-600 mb-6">
                  We're preparing a selection of cinematic property films to showcase our approach to luxury real estate storytelling.
                </p>
                <a
                  href="/#contact"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300"
                >
                  Contact Us for Examples
                </a>
              </div>
            )
          )}

          {/* Development notice - only show in dev mode */}
          {!isProduction && (
            <div className="mt-12 max-w-3xl mx-auto bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                <strong className="text-[var(--text-primary)]">Development Note:</strong> The films shown above are reference materials for design and layout purposes. Final production will feature only authorized Orivon Studio work or explicitly licensed content.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32 bg-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-center text-[var(--text-primary)] mb-16"
            data-aos="fade-up"
          >
            From photography to cinematic storytelling.
          </h2>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="text-center" data-aos="fade-up" data-aos-delay="0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-1)] to-[var(--accent-2)] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6 shadow-lg">
                01
              </div>
              <h3 className="text-xl font-heading font-semibold text-[var(--text-primary)] mb-3">
                Select the Photography
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We start with authorized, high-quality property photos.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center" data-aos="fade-up" data-aos-delay="100">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-2)] to-[var(--accent-3)] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6 shadow-lg">
                02
              </div>
              <h3 className="text-xl font-heading font-semibold text-[var(--text-primary)] mb-3">
                Create the Movement
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We develop cinematic camera movements and select the shots that
                best represent the property.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center" data-aos="fade-up" data-aos-delay="200">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-3)] to-[var(--accent-1)] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6 shadow-lg">
                03
              </div>
              <h3 className="text-xl font-heading font-semibold text-[var(--text-primary)] mb-3">
                Edit the Final Film
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We refine the sequence, pacing, transitions and sound into a
                polished marketing asset.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-[var(--text-primary)] via-[var(--accent-1)] to-[var(--accent-2)] text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-6"
            data-aos="fade-up"
          >
            Your next listing could be our next film.
          </h2>

          <p
            className="text-xl text-white/90 mb-10 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Let's create a cinematic experience around your property's most
            distinctive features.
          </p>

          <div data-aos="fade-up" data-aos-delay="200">
            <a
              href="/#contact"
              className="inline-block px-10 py-4 bg-white text-[var(--text-primary)] font-semibold rounded-full hover:bg-white/90 transition-all duration-300 shadow-2xl transform hover:scale-105"
            >
              Request a Property Film
            </a>
          </div>

          {/* Additional contact info */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
            <a
              href="mailto:orivonstudio@gmail.com"
              className="hover:text-white transition-colors"
            >
              orivonstudio@gmail.com
            </a>
            <span>·</span>
            <a
              href="https://wa.me/5492604309716"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
