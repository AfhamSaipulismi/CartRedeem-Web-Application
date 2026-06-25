/**
 * @param {{ activePage: 'home' | 'products' | 'points' | 'profile' | 'cart', onNavigate: (page: string) => void, onLogout: () => void, isDark?: boolean, onToggleTheme?: () => void, user?: { avatar?: string }, onViewCart?: () => void, cartCount?: number }} props
 */
const TopNavBar = ({ activePage = 'home', onNavigate, onLogout, isDark = false, onToggleTheme, user, onViewCart, cartCount = 0 }) => {
  const nav = (page) => (e) => {
    e.preventDefault();
    onNavigate?.(page);
  };

  const linkClass = (page) =>
    `nav-link${activePage === page ? ' nav-link--active' : ''}`;

  return (
    <header className="nav-bar">
      <div className="nav-bar__inner container-max page-px">

        {/* Brand */}
        <button className="nav-bar__brand" type="button" onClick={nav('home')}>
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            confirmation_number
          </span>
          CartRedeem
        </button>

        {/* Desktop Navigation Links */}
        <nav className="nav-bar__links">
          <button className={linkClass('home')} type="button" onClick={nav('home')}>Homepage</button>
          <button className={linkClass('products')} type="button" onClick={nav('products')}>Vouchers</button>
          <button className={linkClass('points')} type="button" onClick={nav('points')}>Points</button>
        </nav>

        {/* Trailing Actions */}
        <div className="nav-bar__actions">
          <div className="nav-bar__desktop-actions">
            <button
              className={`icon-btn nav-bar__cart${activePage === 'cart' ? ' nav-bar__cart--active' : ''}`}
              type="button"
              onClick={() => onViewCart?.()}
              aria-label={`View Cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {cartCount > 0 && <span className="nav-bar__cart-badge">{cartCount}</span>}
            </button>
            <button
              className="icon-btn"
              type="button"
              onClick={() => onToggleTheme?.()}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={isDark}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="material-symbols-outlined">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button
              className={`nav-bar__avatar${activePage === 'profile' ? ' nav-bar__avatar--active' : ''}`}
              type="button"
              onClick={nav('profile')}
              aria-label="View your profile"
              aria-current={activePage === 'profile' ? 'page' : undefined}
              title="Your profile"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="Your profile" />
              ) : (
                <span className="material-symbols-outlined nav-bar__avatar-icon">account_circle</span>
              )}
            </button>
            <button className="logout-btn" type="button" onClick={() => onLogout?.()}>
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button className="nav-bar__hamburger" aria-label="Open menu">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default TopNavBar;
