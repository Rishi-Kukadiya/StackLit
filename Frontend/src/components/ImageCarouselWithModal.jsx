import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

// Add new ImagePopup component
const ImagePopup = ({ isOpen, images, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            resetView();
        }
    }, [isOpen, initialIndex]);

    const resetView = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.01;
        const newZoom = Math.max(1, Math.min(3, zoom + delta));
        setZoom(newZoom);
    };

    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            setStartPos({ x: distance, y: distance });
        } else if (e.touches.length === 1) {
            setIsDragging(true);
            setStartPos({
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y
            });
        }
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            const scale = distance / startPos.x;
            const newZoom = Math.max(1, Math.min(3, scale * zoom));
            setZoom(newZoom);
        } else if (isDragging && zoom > 1) {
            setPosition({
                x: e.touches[0].clientX - startPos.x,
                y: e.touches[0].clientY - startPos.y
            });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl bg-[#17153B]/95 rounded-lg overflow-hidden">
                <div className="relative p-4">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 z-50 bg-red-600/90 p-2 rounded-full
                                 hover:bg-red-500 transition-all duration-300"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>

                    {/* Image container with touch events */}
                    <div 
                        className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden"
                        onWheel={handleWheel}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <img
                            ref={imageRef}
                            src={images[currentIndex]}
                            alt={`Expanded view ${currentIndex + 1}`}
                            className="max-w-full max-h-full object-contain transition-all duration-200"
                            style={{
                                transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                                cursor: zoom > 1 ? 'grab' : 'default'
                            }}
                        />
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 
                                   flex items-center gap-2 bg-[#2E236C]/90 backdrop-blur-md 
                                   px-4 py-2 rounded-full border border-[#433D8B]/40">
                        <button
                            onClick={() => setZoom(Math.max(1, zoom - 0.25))}
                            className="p-1.5 text-[#C8ACD6] hover:text-white transition-colors"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-[#C8ACD6] text-sm font-medium">
                            {Math.round(zoom * 100)}%
                        </span>
                        <button
                            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                            className="p-1.5 text-[#C8ACD6] hover:text-white transition-colors"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </button>
                        {/* <button
                            onClick={resetView}
                            className="p-1.5 text-[#C8ACD6] hover:text-white transition-colors"
                        >
                            <RotateCw className="w-4 h-4" />
                        </button> */}
                    </div>

                    {/* Navigation arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 
                                         bg-[#2E236C]/90 p-2 rounded-full
                                         text-[#C8ACD6] hover:text-white transition-colors"
                                disabled={currentIndex === 0}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setCurrentIndex(prev => Math.min(images.length - 1, prev + 1))}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 
                                         bg-[#2E236C]/90 p-2 rounded-full
                                         text-[#C8ACD6] hover:text-white transition-colors"
                                disabled={currentIndex === images.length - 1}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Update the ImageCarouselWithModal component to use the new ImagePopup
const ImageCarouselWithModal = ({ question }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (index) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const goToPrevious = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };

    const goToNext = () => {
        if (currentImageIndex < question.images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };

    const handleImageClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(currentImageIndex);
    };

    return (
        <>
            
            {question.images && question.images.length > 0 && (
                <div className="mt-6 relative group">
                    {/* Navigation Buttons - Hidden on mobile for cleaner look */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPrevious();
                        }}
                        className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10
                             bg-[#2E236C]/90 backdrop-blur-md p-2.5 rounded-full
                             border border-[#433D8B]/40 hover:border-[#C8ACD6]/60
                             text-[#C8ACD6] hover:text-white transition-all duration-300
                             opacity-0 group-hover:opacity-100 hover:scale-110 hidden sm:block
                             shadow-[0_0_15px_rgba(200,172,214,0.3)]
                             ${currentImageIndex === 0 ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'hover:opacity-100'}`}
                        aria-label="Previous image"
                        disabled={currentImageIndex === 0}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToNext();
                        }}
                        className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10
                             bg-[#2E236C]/90 backdrop-blur-md p-2.5 rounded-full
                             border border-[#433D8B]/40 hover:border-[#C8ACD6]/60
                             text-[#C8ACD6] hover:text-white transition-all duration-300
                             opacity-0 group-hover:opacity-100 hover:scale-110 hidden sm:block
                             shadow-[0_0_15px_rgba(200,172,214,0.3)]
                             ${currentImageIndex === question.images.length - 1 ? 'opacity-30 cursor-not-allowed pointer-events-none' : 'hover:opacity-100'}`}
                        aria-label="Next image"
                        disabled={currentImageIndex === question.images.length - 1}
                    >
                        <ChevronLeft className="w-5 h-5 transform rotate-180" />
                    </button>

                    {/* Image Container - Responsive */}
                    <div className="relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-[#17153B]/20 to-[#2E236C]/20 min-h-[250px] sm:min-h-[300px] flex items-center justify-center">
                        <div
                            className="w-full flex justify-center items-center p-3 sm:p-4 cursor-pointer group/image relative"
                            onClick={handleImageClick}
                        >
                            <img
                                src={question.images[currentImageIndex]}
                                alt={`Question attachment ${currentImageIndex + 1} of ${question.images.length}`}
                                className="w-full max-w-[400px] h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-contain rounded-lg border border-[#433D8B]/30 hover:border-[#C8ACD6]/50 transition-all duration-500 shadow-[0_0_15px_rgba(200,172,214,0.1)] hover:shadow-[0_0_25px_rgba(200,172,214,0.2)] hover:scale-105 cursor-pointer bg-white"
                                loading="lazy"
                                key={`current-image-${currentImageIndex}`}
                                onClick={handleImageClick}
                            />
                            {/* Zoom indicator overlay */}
                            <div
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 bg-black/20 rounded-lg cursor-pointer"
                                onClick={handleImageClick}
                            >
                                <div
                                    className="bg-[#2E236C]/90 backdrop-blur-md px-3 py-2 rounded-full border border-[#433D8B]/40 text-[#C8ACD6] text-sm font-medium flex items-center gap-2 cursor-pointer"
                                    onClick={handleImageClick} 
                                >
                                    <ZoomIn className="w-4 h-4" />
                                    <span className="hidden sm:inline">Click to expand</span>
                                    <span className="sm:hidden">Tap to expand</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thumbnails - Better mobile scrolling */}
                    {question.images.length > 1 && (
                        <div className="mt-4 flex justify-center">
                            <div className="flex overflow-x-auto gap-2 pb-2 px-4 max-w-full
                                     scrollbar-thin scrollbar-thumb-[#433D8B] scrollbar-track-[#17153B]/50
                                     scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
                                style={{
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#433D8B #17153B'
                                }}>
                                {question.images.map((imageUrl, thumbIndex) => (
                                    <button
                                        key={`question-${question._id}-thumbnail-${thumbIndex}`}
                                        onClick={() => {
                                            setCurrentImageIndex(thumbIndex);
                                            openModal(thumbIndex);
                                        }}
                                        className={`flex-shrink-0 relative transition-all duration-300 rounded-lg overflow-hidden
                                             ${currentImageIndex === thumbIndex
                                                ? 'ring-2 ring-[#C8ACD6] scale-105'
                                                : 'hover:ring-1 hover:ring-[#C8ACD6]/50 hover:scale-102'}`}
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={`Thumbnail ${thumbIndex + 1}`}
                                            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover border border-[#433D8B]/30"
                                        />
                                        {currentImageIndex === thumbIndex && (
                                            <div className="absolute inset-0 bg-[#C8ACD6]/20 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-[#C8ACD6] rounded-full"></div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Image Counter - Mobile friendly */}
                    {/* {question.images.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10">
                            <div className="bg-[#2E236C]/90 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full
                                         border border-[#433D8B]/40 text-[#C8ACD6] text-xs sm:text-sm font-medium
                                         shadow-[0_0_10px_rgba(200,172,214,0.2)]">
                                {currentImageIndex + 1} of {question.images.length}
                            </div>
                        </div>
                    )} */}

                    {/* Dot indicators - Better mobile spacing */}
                    {question.images.length > 1 && (
                        <div className="flex justify-center mt-3 sm:mt-4 gap-1.5 sm:gap-2">
                            {question.images.map((_, dotIndex) => (
                                <button
                                    key={`question-${question._id}-dot-indicator-${dotIndex}`}
                                    onClick={() => {
                                        setCurrentImageIndex(dotIndex);
                                        openModal(dotIndex);
                                    }}
                                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300
                                         ${currentImageIndex === dotIndex
                                            ? 'bg-[#C8ACD6] scale-125 shadow-[0_0_8px_rgba(200,172,214,0.4)]'
                                            : 'bg-[#433D8B] hover:bg-[#C8ACD6]/60 hover:scale-110'}`}
                                    aria-label={`Go to image ${dotIndex + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Full-screen Modal */}
            <ImagePopup
                isOpen={isModalOpen}
                images={question.images || []}
                initialIndex={currentImageIndex}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default ImageCarouselWithModal;