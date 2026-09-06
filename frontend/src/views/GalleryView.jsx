import { useEffect, useRef, useState } from 'react'
import cafeInterior from '../assets/images/gallery-cafe-interior.webp'
import ribeyeSteak from '../assets/images/gallery-ribeye-steak.webp'
import specialEvent from '../assets/images/gallery-special-event.webp'

const galleryImages = [
    {
        source: cafeInterior,
        title: 'The Café Fausse Dining Room',
        description: 'An inviting interior prepared for an evening of dining.',
        alt: 'Interior dining room at Café Fausse with prepared tables',
    },
    {
        source: ribeyeSteak,
        title: 'Ribeye Presentation',
        description: 'A carefully presented ribeye entrée.',
        alt: 'Café Fausse ribeye steak entrée presented on a plate',
    },
    {
        source: specialEvent,
        title: 'A Special Evening',
        description: 'The restaurant arranged for a memorable gathering.',
        alt: 'Café Fausse dining space arranged for a special event',
    },
]

function GalleryView() {
    const [selectedIndex, setSelectedIndex] = useState(null)
    const closeButtonRef = useRef(null)
    const triggerButtonRef = useRef(null)

    const selectedImage =
        selectedIndex === null ? null : galleryImages[selectedIndex]

    function openLightbox(index, event) {
        triggerButtonRef.current = event.currentTarget
        setSelectedIndex(index)
    }

    function closeLightbox() {
        setSelectedIndex(null)

        window.requestAnimationFrame(() => {
            triggerButtonRef.current?.focus()
        })
    }

    function showPreviousImage() {
        setSelectedIndex((currentIndex) =>
            currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1,
        )
    }

    function showNextImage() {
        setSelectedIndex((currentIndex) =>
            currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1,
        )
    }

    useEffect(() => {
        if (selectedIndex === null) {
            return undefined
        }

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        closeButtonRef.current?.focus()

        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                closeLightbox()
            } else if (event.key === 'ArrowLeft') {
                showPreviousImage()
            } else if (event.key === 'ArrowRight') {
                showNextImage()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = previousOverflow
        }
    }, [selectedIndex])

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            closeLightbox()
        }
    }

    return (
        <main className="gallery-page">
            <section
                className="gallery-introduction"
                aria-labelledby="gallery-heading"
            >
                <p className="eyebrow">Café Fausse gallery</p>
                <h1 id="gallery-heading">A Glimpse of the Experience</h1>
                <p>
                    Explore the dining room, menu presentation, and atmosphere that
                    welcome guests to Café Fausse.
                </p>
            </section>

            <ul className="gallery-grid" aria-label="Café Fausse image gallery">
                {galleryImages.map((image, index) => (
                    <li className="gallery-item" key={image.title}>
                        <button
                            className="gallery-image-button"
                            type="button"
                            onClick={(event) => openLightbox(index, event)}
                            aria-label={`Open larger image: ${image.title}`}
                        >
                            <img src={image.source} alt={image.alt} />
                            <span className="gallery-caption">
                                <strong>{image.title}</strong>
                                <span>{image.description}</span>
                            </span>
                        </button>
                    </li>
                ))}
            </ul>

            {selectedImage && (
                <div
                    className="lightbox-backdrop"
                    role="presentation"
                    onMouseDown={handleBackdropClick}
                >
                    <section
                        className="lightbox"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="lightbox-title"
                        aria-describedby="lightbox-description"
                    >
                        <button
                            className="lightbox-close"
                            type="button"
                            onClick={closeLightbox}
                            ref={closeButtonRef}
                            aria-label="Close gallery image"
                        >
                            ×
                        </button>

                        <div className="lightbox-image-container">
                            <img src={selectedImage.source} alt={selectedImage.alt} />
                        </div>

                        <div className="lightbox-content">
                            <div>
                                <p className="lightbox-count">
                                    Image {selectedIndex + 1} of {galleryImages.length}
                                </p>
                                <h2 id="lightbox-title">{selectedImage.title}</h2>
                                <p id="lightbox-description">
                                    {selectedImage.description}
                                </p>
                            </div>

                            <div className="lightbox-controls">
                                <button
                                    type="button"
                                    onClick={showPreviousImage}
                                    aria-label="Show previous gallery image"
                                >
                                    ← Previous
                                </button>

                                <button
                                    type="button"
                                    onClick={showNextImage}
                                    aria-label="Show next gallery image"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </main>
    )
}

export default GalleryView