import { Link, NavLink } from 'react-router-dom'

const navigationItems = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'Reservations', path: '/reservations' },
  { label: 'About', path: '/about' },
  { label: 'Gallery', path: '/gallery' },
]

function Header() {
  return (
    <header className="site-header">
      <div className="header-content">
        <Link className="brand" to="/" aria-label="Café Fausse home">
          <span className="brand-name">Café Fausse</span>
          <span className="brand-tagline">
            French dining, thoughtfully served
          </span>
        </Link>

        <nav aria-label="Primary navigation">
          <ul className="navigation-list">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  className={({ isActive }) =>
                    `navigation-link${isActive ? ' active' : ''}`
                  }
                  to={item.path}
                  end={item.path === '/'}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header