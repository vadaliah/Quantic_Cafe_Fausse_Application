function MenuView() {
    return (
        <main className="page-shell">
            <section className="page-shell-content" aria-labelledby="menu-heading">
                <p className="eyebrow">Café Fausse menu</p>
                <h1 id="menu-heading">Explore Our Menu</h1>
                <p>
                    Our starters, main courses, desserts, and beverages will be displayed
                    here from the Café Fausse database.
                </p>

                <div className="page-placeholder" role="status">
                    Database-driven menu coming in the next story.
                </div>
            </section>
        </main>
    )
}

export default MenuView