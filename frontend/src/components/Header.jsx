function Header() {
    const navigationItems = ['Home', 'Menu', 'Reservations', 'About', 'Gallery']

    return (
        <header className="site-header">
            <div className="header-content">
                <a className="brand" href="#reservation" aria-label="Café Fausse">
                    <span className="brand-name">Café Fausse</span>
                    <span className="brand-tagline">French dining, thoughtfully served</span>
                </a>

                <nav aria-label="Primary navigation">
                    <ul className="navigation-list">
                        {navigationItems.map((item) => (
                            <li key={item}>
                                {item === 'Reservations' ? (
                                    <a
                                        className="navigation-link active"
                                        href="#reservation"
                                        aria-current="page"
                                    >
                                        {item}
                                    </a>
                                ) : (
                                    <span className="navigation-link unavailable">{item}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header