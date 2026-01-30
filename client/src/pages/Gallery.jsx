import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../config/supabase';

const Gallery = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gallery, setGallery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchGallery();
  }, [id]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      
      const { data: gallery, error } = await supabase
        .from('galleries')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !gallery) {
        console.error('Error fetching gallery:', error);
        setError('Gallery not found or has been deleted');
        setGallery(null);
      } else {
        setGallery(gallery);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError('Gallery not found or has been deleted');
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === gallery.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? gallery.images.length - 1 : prev - 1
    );
  };

  const handleKeyDown = (e) => {
    if (!lightboxOpen) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentImageIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gallery Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'This gallery does not exist'}</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{gallery.title}</h1>
          <p className="text-gray-600">
            {gallery.images.length} {gallery.images.length === 1 ? 'image' : 'images'}
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.images.map((imageUrl, index) => (
            <div
              key={index}
              className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <img
                src={imageUrl}
                alt={`${gallery.title} - Image ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Previous Button */}
            {gallery.images.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-4 text-white hover:text-gray-300 transition-colors z-50"
              >
                <ChevronLeft className="w-12 h-12" />
              </button>
            )}

            {/* Image */}
            <div className="max-w-7xl max-h-screen p-4">
              <img
                src={gallery.images[currentImageIndex]}
                alt={`${gallery.title} - Image ${currentImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain mx-auto"
              />
              <div className="text-center text-white mt-4">
                <p className="text-lg">
                  {currentImageIndex + 1} / {gallery.images.length}
                </p>
              </div>
            </div>

            {/* Next Button */}
            {gallery.images.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-4 text-white hover:text-gray-300 transition-colors z-50"
              >
                <ChevronRight className="w-12 h-12" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
