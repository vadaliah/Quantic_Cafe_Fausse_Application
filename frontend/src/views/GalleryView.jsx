function GalleryView() {
    return (
        <main className="page-shell">
            <section className="page-shell-content" aria-labelledby="gallery-heading">
                <p className="eyebrow">Café Fausse gallery</p>
                <h1 id="gallery-heading">A Glimpse of the Experience</h1>
                <p>
                    Images of the restaurant, dining atmosphere, and menu presentation
                    will be displayed here.
                </p>

                <div className="page-placeholder" role="status">
                    Gallery images and lightbox coming in a later story.
                </div>
            </section>
        </main>
    )
}

export default GalleryView