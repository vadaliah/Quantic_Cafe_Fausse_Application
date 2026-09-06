import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMenu } from '../services/menuService'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function MenuView() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const abortController = new AbortController()
    let shouldUpdate = true

    async function loadMenu() {
      try {
        const menuCategories = await getMenu({
          signal: abortController.signal,
        })

        if (shouldUpdate) {
          setCategories(menuCategories)
        }
      } catch (error) {
        if (shouldUpdate && error.name !== 'AbortError') {
          setErrorMessage(error.message)
        }
      } finally {
        if (shouldUpdate) {
          setIsLoading(false)
        }
      }
    }

    loadMenu()

    return () => {
      shouldUpdate = false
      abortController.abort()
    }
  }, [])

  return (
    <main className="menu-page">
      <section className="menu-introduction" aria-labelledby="menu-heading">
        <p className="eyebrow">Café Fausse menu</p>
        <h1 id="menu-heading">Explore Our Menu</h1>
        <p>
          Discover starters, main courses, desserts, and beverages prepared for
          a thoughtful dining experience.
        </p>
      </section>

      {isLoading && (
        <p className="menu-status" role="status">
          Loading the Café Fausse menu…
        </p>
      )}

      {!isLoading && errorMessage && (
        <div className="menu-error" role="alert">
          <h2>Menu temporarily unavailable</h2>
          <p>{errorMessage}</p>
        </div>
      )}

      {!isLoading && !errorMessage && categories.length === 0 && (
        <p className="menu-status" role="status">
          No menu items are currently available.
        </p>
      )}

      {!isLoading && !errorMessage && categories.length > 0 && (
        <div className="menu-categories">
          {categories.map((category) => (
            <section
              className="menu-category"
              key={category.categoryId}
              aria-labelledby={`category-${category.categoryId}`}
            >
              <div className="menu-category-heading">
                <h2 id={`category-${category.categoryId}`}>
                  {category.categoryName}
                </h2>
                <span>{category.items.length} items</span>
              </div>

              <div className="menu-items">
                {category.items.map((item) => (
                  <article className="menu-item" key={item.menuItemId}>
                    <div className="menu-item-heading">
                      <h3>{item.itemName}</h3>
                      <p>{currencyFormatter.format(item.price)}</p>
                    </div>
                    <p className="menu-item-description">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <section className="menu-reservation-callout">
        <div>
          <p className="eyebrow">Plan your visit</p>
          <h2>Ready to join us?</h2>
          <p>Reserve your table and enjoy the Café Fausse experience.</p>
        </div>

        <Link className="primary-link" to="/reservations">
          Reserve a Table
        </Link>
      </section>
    </main>
  )
}

export default MenuView