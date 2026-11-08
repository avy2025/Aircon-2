import React, { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronRight,
  CircleHelp, Factory, FileText, Menu, Minus, PackageCheck, Plus, Search, ShoppingBag,
  SlidersHorizontal, X,
} from 'lucide-react'
import { categories, companyFacts, divisions, Product, products, projects } from './data'

type CartLine = { slug: string; quantity: number }
type RouteState = { path: string; navigate: (to: string) => void }

function useRoute(): RouteState {
  const [path, setPath] = useState(window.location.pathname + window.location.search)
  useEffect(() => {
    const update = () => setPath(window.location.pathname + window.location.search)
    window.addEventListener('popstate', update)
    return () => window.removeEventListener('popstate', update)
  }, [])
  const navigate = (to: string) => {
    if (to.startsWith('mailto:') || to.startsWith('tel:')) return
    window.history.pushState({}, '', to)
    setPath(to)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return { path, navigate }
}

function Link({ to, children, className = '', onClick, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const handle = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(event)
    if (!event.defaultPrevented && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault()
      window.dispatchEvent(new CustomEvent('aircon:navigate', { detail: to }))
    }
  }
  return <a href={to} className={className} onClick={handle} {...props}>{children}</a>
}

function PhotoPanel({ label, compact = false, className = '' }: { label: string; compact?: boolean; className?: string }) {
  return (
    <div className={`photo-panel ${compact ? 'photo-panel--compact' : ''} ${className}`} role="img" aria-label={`${label} photograph pending`}>
      <span className="photo-panel__index">AIRCON / FIELD NOTES</span>
      <div className="photo-panel__mark"><Factory size={compact ? 24 : 31} strokeWidth={1.3} /></div>
      <span className="photo-panel__label">{label}</span>
      <span className="photo-panel__pending">Original image pending</span>
    </div>
  )
}

function Brand({ inverse = false }: { inverse?: boolean }) {
  return <Link to="/" className={`brand ${inverse ? 'brand--inverse' : ''}`} aria-label="AIRCON Automation India home">
    <span className="brand__name">AIRCON<span>AUTOMATION INDIA PVT. LTD.</span></span>
  </Link>
}

function Header({ path, navigate, cartCount }: { path: string; navigate: (to: string) => void; cartCount: number }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [dropdown, setDropdown] = useState<'divisions' | 'products' | ''>('')
  const onNav = (event: Event) => {
    const custom = event as CustomEvent<string>
    navigate(custom.detail)
    setMenuOpen(false)
    setDropdown('')
  }
  useEffect(() => {
    window.addEventListener('aircon:navigate', onNav)
    return () => window.removeEventListener('aircon:navigate', onNav)
  }, [])
  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    navigate(`/products?search=${encodeURIComponent(search)}`)
    setSearchOpen(false)
  }
  const setPointerDropdown = (value: 'divisions' | 'products' | '') => {
    if (window.matchMedia('(min-width: 761px)').matches) setDropdown(value)
  }
  const active = (to: string) => path.split('?')[0] === to || (to !== '/' && path.split('?')[0].startsWith(to))
  return (
    <>
      <div className="utility-bar">
        <div className="container utility-bar__inner">
          <span>Engineered solutions. Built around your needs.</span>
          <span className="utility-bar__right"><span>Manesar, India</span><span className="utility-dot" /><Link to="/contact">Talk to our team <ArrowUpRight size={13} /></Link></span>
        </div>
      </div>
      <header className="site-header">
        <div className="container site-header__inner">
          <Brand />
          <button className="mobile-menu-button icon-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => { setMenuOpen(!menuOpen); setDropdown('') }}>{menuOpen ? <X /> : <Menu />}</button>
          <nav className={`main-nav ${menuOpen ? 'main-nav--open' : ''}`} aria-label="Main navigation">
            <Link to="/" className={active('/') && path.split('?')[0] === '/' ? 'is-active' : ''}>Home</Link>
            <Link to="/about" className={active('/about') ? 'is-active' : ''}>About us</Link>
            <div className="nav-dropdown" onMouseEnter={() => setPointerDropdown('divisions')} onMouseLeave={() => setPointerDropdown('')}>
              <Link to="/divisions" className={active('/divisions') ? 'is-active' : ''}>Our divisions <ChevronDown size={14} /></Link>
              <button className="mobile-submenu-toggle" aria-label="Show division links" aria-expanded={dropdown === 'divisions'} onClick={() => setDropdown(dropdown === 'divisions' ? '' : 'divisions')}><ChevronDown size={16} /></button>
              {dropdown === 'divisions' && <div className="dropdown-panel">
                {divisions.map(item => <Link key={item.slug} to={`/divisions/${item.slug}`}><span>{item.index}</span>{item.short}<ArrowUpRight size={14} /></Link>)}
              </div>}
            </div>
            <div className="nav-dropdown" onMouseEnter={() => setPointerDropdown('products')} onMouseLeave={() => setPointerDropdown('')}>
              <Link to="/products" className={active('/products') ? 'is-active' : ''}>Products <ChevronDown size={14} /></Link>
              <button className="mobile-submenu-toggle" aria-label="Show product categories" aria-expanded={dropdown === 'products'} onClick={() => setDropdown(dropdown === 'products' ? '' : 'products')}><ChevronDown size={16} /></button>
              {dropdown === 'products' && <div className="dropdown-panel dropdown-panel--small">
                {categories.slice(1).map(item => <Link key={item} to={`/products?category=${encodeURIComponent(item)}`}>{item}<ArrowUpRight size={14} /></Link>)}
              </div>}
            </div>
            <Link to="/projects" className={active('/projects') ? 'is-active' : ''}>Projects</Link>
            <Link to="/reviews" className={active('/reviews') ? 'is-active' : ''}>Reviews</Link>
            <Link to="/contact" className={active('/contact') ? 'is-active' : ''}>Contact</Link>
            <div className="nav-actions">
              <button className="icon-button" aria-label="Search products" onClick={() => setSearchOpen(!searchOpen)}><Search size={19} /></button>
              <Link to="/cart" className="cart-link" aria-label={`Cart, ${cartCount} items`}><ShoppingBag size={18} /><span className="cart-count">{cartCount}</span></Link>
              <Link to="/quote" className="button button--small button--dark">Request a quote <ArrowUpRight size={14} /></Link>
            </div>
          </nav>
        </div>
        {searchOpen && <form className="search-panel container" onSubmit={submitSearch}>
          <Search size={20} /><input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products and solutions" aria-label="Search products and solutions" />
          <button className="button button--dark button--small" type="submit">Search</button>
          <button className="icon-button" type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={18} /></button>
        </form>}
      </header>
    </>
  )
}

function Footer() {
  return <footer className="site-footer">
    <div className="container">
      <div className="footer-main">
        <div className="footer-intro">
          <Brand inverse />
          <p>Industrial automation, railway systems and engineered product solutions, delivered with a commitment to quality and reliability.</p>
          <Link className="text-link text-link--light" to="/contact">Start a conversation <ArrowUpRight size={15} /></Link>
        </div>
        <div className="footer-column"><p className="footer-title">Explore</p><Link to="/about">About AIRCON</Link><Link to="/divisions">Our divisions</Link><Link to="/products">Product catalogue</Link><Link to="/projects">Projects</Link><Link to="/reviews">Reviews</Link></div>
        <div className="footer-column"><p className="footer-title">Divisions</p>{divisions.map(d => <Link key={d.slug} to={`/divisions/${d.slug}`}>{d.short}</Link>)}</div>
        <div className="footer-column footer-contact"><p className="footer-title">Get in touch</p><p>Manesar manufacturing facility<br />Address details to be confirmed</p><Link to="/contact">Contact details pending profile</Link><Link className="footer-quote" to="/quote">Discuss a requirement <ArrowRight size={15} /></Link></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} AIRCON Automation India Pvt. Ltd.</span><span>Quality-led engineering since 2005</span></div>
    </div>
  </footer>
}

function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`container ${className}`}>{children}</div>
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <div className={`eyebrow ${light ? 'eyebrow--light' : ''}`}><span />{children}</div>
}

function SectionTitle({ eyebrow, title, text, light = false }: { eyebrow: string; title: React.ReactNode; text?: string; light?: boolean }) {
  return <div className={`section-title ${light ? 'section-title--light' : ''}`}><Eyebrow light={light}>{eyebrow}</Eyebrow><h2>{title}</h2>{text && <p>{text}</p>}</div>
}

function ButtonLink({ to, children, dark = false, light = false }: { to: string; children: React.ReactNode; dark?: boolean; light?: boolean }) {
  return <Link to={to} className={`button ${dark ? 'button--dark' : ''} ${light ? 'button--light' : ''}`}>{children}<ArrowUpRight size={16} /></Link>
}

function AnimatedFact({ value, suffix, label, index }: { value: string; suffix?: string; label: string; index: number }) {
  const node = useRef<HTMLSpanElement>(null)
  const isCount = /^~?[\d,]+$/.test(value)
  const numeric = isCount ? Number(value.replace(/[^\d]/g, '')) : NaN
  const prefix = value.startsWith('~') ? '~' : ''
  const [shown, setShown] = useState(isCount ? `${prefix}0` : value)
  useEffect(() => {
    if (!Number.isFinite(numeric) || !node.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value)
      return
    }
    const element = node.current
    const observer = new IntersectionObserver(entries => {
      if (!entries[0]?.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const duration = 850
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setShown(`${prefix}${Math.round(numeric * eased).toLocaleString('en-IN')}`)
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: .5 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [numeric, prefix, value])
  return <div className="fact"><span className="fact__value"><span ref={node}>{shown}</span>{suffix}</span><span className="fact__label">{label}</span><span className="fact__index">0{index + 1}</span></div>
}

function DivisionCard({ division }: { division: typeof divisions[number] }) {
  return <Link to={`/divisions/${division.slug}`} className="division-card reveal-on-view">
    <div className="division-card__image"><PhotoPanel label={division.short} compact /><span className="division-card__number">{division.index}</span></div>
    <div className="division-card__body"><h3>{division.title}</h3><p>{division.description}</p><span className="text-link">Explore division <ArrowUpRight size={15} /></span></div>
  </Link>
}

function ProductCard({ product, addToCart }: { product: Product; addToCart: (slug: string, quantity?: number) => void }) {
  return <article className="product-card reveal-on-view">
    <Link to={`/products/${product.slug}`} className="product-card__image"><PhotoPanel label={product.category} compact /><span className="product-card__badge">{product.type === 'standard' ? 'Standard product' : 'Engineered solution'}</span></Link>
    <div className="product-card__info"><span className="product-category">{product.category}</span><Link to={`/products/${product.slug}`}><h3>{product.name}</h3></Link><div className="product-card__bottom"><span>{product.price}</span>{product.type === 'standard' ? <button aria-label={`Add ${product.name} to cart`} className="add-button" onClick={() => addToCart(product.slug)}><Plus size={17} /></button> : <Link to={`/quote?product=${product.slug}`} className="mini-arrow" aria-label={`Request quote for ${product.name}`}><ArrowUpRight size={17} /></Link>}</div></div>
  </article>
}

function Home({ addToCart }: { addToCart: (slug: string, quantity?: number) => void }) {
  return <>
    <section className="hero">
      <PhotoPanel label="AIRCON factory building" className="hero__image" />
      <div className="hero__veil" />
      <Container className="hero__content">
        <div className="hero__topline"><Brand inverse /><span className="hero__location">MANESAR · INDIA <span /> ENGINEERED SINCE 2005</span></div>
        <div className="hero__copy">
          <Eyebrow light>Engineering, made practical</Eyebrow>
          <h1>Engineering excellence<br />across <em>industrial</em> solutions.</h1>
          <p>Delivering industrial automation, railway systems and engineered product solutions with a commitment to quality and reliability.</p>
          <div className="hero__buttons"><ButtonLink to="/divisions" light>Explore solutions</ButtonLink><ButtonLink to="/products">Browse products</ButtonLink></div>
        </div>
        <div className="hero__foot"><span>01 — Built around your application</span><Link to="/contact">Contact AIRCON <ArrowUpRight size={15} /></Link></div>
      </Container>
      <span className="hero__vertical">AIRCON AUTOMATION INDIA PVT. LTD.</span>
    </section>

    <section className="intro-section section-pad">
      <Container className="intro-grid">
        <div><Eyebrow>Who we are</Eyebrow><h2>Engineering capability,<br /><span>grounded in making.</span></h2></div>
        <div className="intro-copy"><p>AIRCON Automation India brings together railway equipment, manufacturing and automation, industrial products, and hose assembly capabilities to support demanding industrial applications.</p><Link to="/about" className="text-link">Get to know AIRCON <ArrowRight size={16} /></Link></div>
        <div className="facts-strip">{companyFacts.map((fact, index) => <AnimatedFact key={fact.label} value={fact.value} suffix={fact.suffix} label={fact.label} index={index} />)}</div>
      </Container>
    </section>

    <section className="section-pad divisions-section">
      <Container>
        <div className="section-heading-row"><SectionTitle eyebrow="What we do" title={<>Four disciplines.<br />One engineering partner.</>} text="From specialised railway systems to production automation and fluid power products, explore the capabilities AIRCON brings together." /><Link to="/divisions" className="text-link heading-link">View all divisions <ArrowUpRight size={15} /></Link></div>
        <div className="division-grid">{divisions.map(d => <DivisionCard key={d.slug} division={d} />)}</div>
      </Container>
    </section>

    <section className="feature-band">
      <Container className="feature-band__grid">
        <div className="feature-band__copy"><Eyebrow>Made to work together</Eyebrow><h2>From an engineering challenge to a working solution.</h2><p>We combine manufacturing infrastructure, technical capability and product knowledge to help teams move forward with confidence.</p><ButtonLink to="/about" dark>Discover our capabilities</ButtonLink></div>
        <PhotoPanel label="AIRCON manufacturing and automation" className="feature-band__photo" />
        <div className="feature-band__stamp"><span>45,000</span><small>sq. ft.<br />Manesar facility</small></div>
      </Container>
    </section>

    <section className="section-pad products-section">
      <Container>
        <div className="section-heading-row"><SectionTitle eyebrow="Product catalogue" title="Selected products & solutions" text="Browse industrial products and engineered systems. Product pricing and availability are confirmed on enquiry." /><Link to="/products" className="text-link heading-link">Browse catalogue <ArrowUpRight size={15} /></Link></div>
        <div className="product-grid product-grid--home">{products.slice(0, 4).map(p => <ProductCard key={p.slug} product={p} addToCart={addToCart} />)}</div>
      </Container>
    </section>

    <section className="customers-section section-pad">
      <Container className="customers-layout">
        <div><Eyebrow>Relationships that matter</Eyebrow><h2>Trusted by<br /><span>industry leaders.</span></h2><p>Customer identities shown here are subject to AIRCON approval. Official, high-resolution logo files are needed before publication.</p><Link to="/contact" className="text-link">Partner with AIRCON <ArrowRight size={15} /></Link></div>
        <div className="customer-art reveal-on-view"><div className="customer-art__frame"><span className="customer-art__overline">CUSTOMER LOGOS</span><div className="customer-art__center"><Factory size={30} /><span>Official customer<br />logo artwork pending</span></div><span className="customer-art__caption">Separate approved assets will be presented here</span></div><span className="customer-art__index">RELATIONSHIPS / 01</span></div>
      </Container>
    </section>

    <section className="projects-section section-pad">
      <Container>
        <div className="section-heading-row"><SectionTitle eyebrow="Selected work" title="Applications in focus" text="An overview of AIRCON’s work areas. Project-specific stories and outcomes will be added from the company profile." /><Link to="/projects" className="text-link heading-link">View projects <ArrowUpRight size={15} /></Link></div>
        <div className="project-grid">{projects.slice(0, 2).map((p, i) => <Link className="project-card reveal-on-view" to={`/projects/${p.slug}`} key={p.slug}><PhotoPanel label={`${p.category} project`} /><div className="project-card__caption"><span>0{i + 1} / {p.category}</span><h3>{p.title}</h3><ArrowUpRight size={18} /></div></Link>)}</div>
      </Container>
    </section>

    <section className="testimonial-section section-pad">
      <Container className="testimonial-layout"><div><Eyebrow>Testimonials</Eyebrow><h2>Customer voices<br /><em>belong to customers.</em></h2><p>Approved, attributable reviews will be added here when AIRCON supplies them.</p></div><div className="testimonial-placeholder"><span className="demo-tag">DEMONSTRATION CONTENT</span><div className="testimonial-placeholder__quote">“</div><p>Real customer testimonial content pending AIRCON approval.</p><span>— Verified reviewer details pending</span><Link to="/reviews" className="text-link">Reviews & feedback <ArrowRight size={15} /></Link></div></Container>
    </section>

    <section className="quote-strip">
      <Container className="quote-strip__inner"><div><Eyebrow>Let’s solve what’s next</Eyebrow><h2>Have an industrial requirement?</h2><p>Talk with our team about your application, specification or project.</p></div><ButtonLink to="/quote" dark>Request a quote</ButtonLink></Container>
    </section>
  </>
}

function PageHero({ eyebrow, title, description, imageLabel }: { eyebrow: string; title: React.ReactNode; description?: string; imageLabel?: string }) {
  return <section className={`page-hero ${imageLabel ? 'page-hero--image' : ''}`}><Container><div className="page-hero__copy"><Eyebrow>{eyebrow}</Eyebrow><h1>{title}</h1>{description && <p>{description}</p>}</div>{imageLabel && <PhotoPanel label={imageLabel} className="page-hero__photo" />}</Container></section>
}

function About() {
  return <>
    <PageHero eyebrow="About AIRCON" title={<>Engineering industry<br />since <em>2005.</em></>} description="An Indian engineering company bringing together industrial automation, railway equipment and product solutions." imageLabel="AIRCON company and facility" />
    <section className="section-pad"><Container className="about-intro"><div><Eyebrow>Company profile</Eyebrow><h2>Capability built around<br />real-world requirements.</h2></div><div><p>AIRCON Automation India Pvt. Ltd. was established in 2005. The company serves industrial buyers and engineering teams through its railway business, manufacturing and automation, sales and distribution, and hose assembly capabilities.</p><p>The company profile states a team of approximately 60 and a 45,000 sq. ft. manufacturing facility in Manesar. Further company history and profile-approved mission and vision statements will be added when the source document is available.</p></div></Container></section>
    <section className="about-photo-band"><Container><PhotoPanel label="Manesar manufacturing facility" /><div className="about-photo-note"><Eyebrow>Built for making</Eyebrow><h2>A manufacturing base<br />in Manesar, Haryana.</h2><p>Facility details are based on the company profile. Address and infrastructure specifications require confirmation.</p></div></Container></section>
    <section className="section-pad"><Container><SectionTitle eyebrow="Our capabilities" title="Where engineering meets execution" text="A broad offering with a practical focus on industrial applications and manufacturing needs." /><div className="division-grid division-grid--about">{divisions.map(d => <DivisionCard key={d.slug} division={d} />)}</div></Container></section>
    <section className="cert-band"><Container><div><Eyebrow>Quality commitment</Eyebrow><h2>ISO 9001:2015</h2><p>Certification is stated in the supplied brief. Certificate artwork and scope to be verified against the original company profile before publication.</p></div><FileText size={46} strokeWidth={1.2} /></Container></section>
  </>
}

function Divisions({ navigate }: { navigate: (to: string) => void }) {
  return <><PageHero eyebrow="Our divisions" title={<>Four capabilities.<br /><em>Connected</em> by engineering.</>} description="Explore AIRCON’s business areas and the product and system capabilities across each." />
    <section className="section-pad"><Container><div className="division-grid division-grid--large">{divisions.map(d => <DivisionCard key={d.slug} division={d} />)}</div><div className="division-cta"><h2>Need a solution across disciplines?</h2><ButtonLink to="/quote" dark>Talk to our engineers</ButtonLink></div></Container></section></>
}

function DivisionDetail({ slug }: { slug: string }) {
  const division = divisions.find(d => d.slug === slug)
  if (!division) return <NotFound />
  const related = products.filter(p => p.division === division.slug)
  return <><PageHero eyebrow={`Division / ${division.index}`} title={<>{division.title.split(' ').slice(0, -1).join(' ')}<br /><em>{division.title.split(' ').slice(-1)}</em></>} description={division.description} imageLabel={`${division.short} capability`} />
    <section className="section-pad"><Container className="division-detail-layout"><div><Eyebrow>Capabilities & offerings</Eyebrow><h2>Designed around<br />the application.</h2><p>Product selection and technical configuration should be confirmed with AIRCON for each requirement. Share your specifications with our team.</p><ButtonLink to={`/quote?division=${division.slug}`} dark>Discuss a requirement</ButtonLink></div><div className="offering-list">{division.offerings.map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong><ArrowUpRight size={16} /></div>)}</div></Container></section>
    {related.length > 0 && <section className="section-pad related-section"><Container><div className="section-heading-row"><SectionTitle eyebrow="Related catalogue" title="Products & systems" /><Link to="/products" className="text-link heading-link">View catalogue <ArrowUpRight size={15} /></Link></div><div className="product-grid">{related.map(p => <ProductCard key={p.slug} product={p} addToCart={() => {}} />)}</div></Container></section>}
  </>
}

function ProductListing({ path, addToCart }: { path: string; addToCart: (slug: string, quantity?: number) => void }) {
  const query = new URLSearchParams(path.split('?')[1] || '')
  const [category, setCategory] = useState(query.get('category') || 'All products')
  const [search, setSearch] = useState(query.get('search') || '')
  const [sort, setSort] = useState('featured')
  const filtered = useMemo(() => {
    const found = products.filter(p => (category === 'All products' || p.category === category) && `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'name') found.sort((a, b) => a.name.localeCompare(b.name))
    return found
  }, [category, search, sort])
  return <><PageHero eyebrow="Product catalogue" title={<>The right components<br />for <em>the job.</em></>} description="Browse standard products and engineered systems. Product details and availability are confirmed on enquiry." />
    <section className="catalog-section"><Container><div className="catalog-toolbar"><div className="catalog-search"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products" aria-label="Search products" /></div><label className="sort-label"><SlidersHorizontal size={16} /><span>Sort</span><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="name">Name A–Z</option></select></label></div>
      <div className="catalog-layout"><aside className="catalog-filters"><p className="filter-heading">Categories</p>{categories.map(item => <button key={item} className={item === category ? 'filter-option is-selected' : 'filter-option'} onClick={() => setCategory(item)}>{item}<span>{item === 'All products' ? products.length : products.filter(p => p.category === item).length}</span></button>)}</aside><div className="catalog-results"><div className="catalog-result-heading"><span>{filtered.length} products & solutions</span><span>Pricing on enquiry</span></div>{filtered.length > 0 ? <div className="product-grid">{filtered.map(p => <ProductCard key={p.slug} product={p} addToCart={addToCart} />)}</div> : <div className="empty-state"><CircleHelp size={28} /><h3>No products match your search.</h3><button className="text-link" onClick={() => { setCategory('All products'); setSearch('') }}>Clear filters <ArrowRight size={15} /></button></div>}</div></div>
    </Container></section></>
}

function ProductDetail({ slug, addToCart, navigate }: { slug: string; addToCart: (slug: string, quantity?: number) => void; navigate: (to: string) => void }) {
  const product = products.find(p => p.slug === slug)
  const [quantity, setQuantity] = useState(1)
  if (!product) return <NotFound />
  return <><div className="breadcrumb container"><Link to="/products">Products</Link><ChevronRight size={14} /><span>{product.category}</span><ChevronRight size={14} /><span>{product.name}</span></div>
    <section className="product-detail"><Container className="product-detail__grid"><PhotoPanel label={product.name} className="product-detail__photo" /><div className="product-detail__copy"><Eyebrow>{product.category} / AIRCON catalogue</Eyebrow><h1>{product.name}</h1><span className="availability"><span /> Availability confirmed on enquiry</span><p>{product.description}</p><div className="product-detail__price">{product.price}<small>Pricing confirmed by our team</small></div>
      <div className="quantity-row"><span>Quantity</span><div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={15} /></button><span>{quantity}</span><button aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}><Plus size={15} /></button></div></div>
      <div className="product-detail__actions">{product.type === 'standard' ? <button className="button button--dark" onClick={() => { addToCart(product.slug, quantity); navigate('/cart') }}>Add to cart <ShoppingBag size={16} /></button> : <Link to={`/quote?product=${product.slug}`} className="button button--dark">Request a quote <ArrowUpRight size={16} /></Link>}<Link to={`/quote?product=${product.slug}`} className="button button--outline">Ask a product question <ArrowUpRight size={15} /></Link></div>
      <div className="spec-table"><h3>Product information</h3>{product.specs.map(([key, val]) => <div key={key}><span>{key}</span><strong>{val}</strong></div>)}</div><div className="datasheet-note"><FileText size={18} /><span>Technical datasheet<br /><small>Available on request</small></span><ArrowDownRight size={16} /></div>
    </div></Container></section>
    <section className="section-pad related-section"><Container><SectionTitle eyebrow="Keep exploring" title="Related products" /><div className="product-grid">{products.filter(p => p.slug !== product.slug && p.category === product.category).slice(0, 3).map(p => <ProductCard key={p.slug} product={p} addToCart={addToCart} />)}</div></Container></section>
  </>
}

function Projects({ navigate }: { navigate: (to: string) => void }) {
  const [filter, setFilter] = useState('All')
  const types = ['All', 'Railway', 'Automation', 'Industrial products']
  const shown = projects.filter(p => filter === 'All' || p.category === filter)
  return <><PageHero eyebrow="Projects & applications" title={<>Engineering for<br /><em>industry in motion.</em></>} description="Explore AIRCON’s application areas. Specific project references, approved imagery and case details will be added from the company profile." />
    <section className="section-pad"><Container><div className="project-filters">{types.map(t => <button key={t} className={t === filter ? 'is-selected' : ''} onClick={() => setFilter(t)}>{t}</button>)}</div><div className="project-grid project-grid--all">{shown.map((p, index) => <Link className="project-card" to={`/projects/${p.slug}`} key={p.slug}><PhotoPanel label={`${p.category} application`} /><div className="project-card__caption"><span>0{index + 1} / {p.category}</span><h3>{p.title}</h3><p>{p.summary}</p><ArrowUpRight size={18} /></div></Link>)}</div><p className="content-note">Project references shown as capability areas, not confirmed customer case studies. Profile details and image approvals are pending.</p></Container></section>
  </>
}

function ProjectDetail({ slug }: { slug: string }) {
  const project = projects.find(p => p.slug === slug)
  if (!project) return <NotFound />
  return <><div className="breadcrumb container"><Link to="/projects">Projects</Link><ChevronRight size={14} /><span>{project.title}</span></div><PageHero eyebrow={`Application / ${project.category}`} title={<>{project.title}<br /><em>in focus.</em></>} description={project.summary} imageLabel={`${project.category} project photography`} /><section className="section-pad"><Container className="project-detail-copy"><div><Eyebrow>Project information</Eyebrow><h2>Capability area</h2></div><div><p>This page describes a business area based on the supplied brief, not an individual project result. Project name, customer, scope and technical details require confirmation from AIRCON’s company profile before publication.</p><ButtonLink to={`/divisions/${project.division}`} dark>Explore this division</ButtonLink></div></Container></section></>
}

function Reviews() {
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true) }
  return <><PageHero eyebrow="Reviews" title={<>Built on trust.<br /><em>Measured by delivery.</em></>} description="Customer feedback is an important part of choosing an engineering partner. Verified AIRCON reviews will appear here after approval." />
    <section className="section-pad"><Container><div className="review-demo-banner"><span className="demo-tag">DEMONSTRATION CONTENT</span><p>Sample review cards are intentionally omitted until real, approved customer reviews are provided.</p></div><div className="review-empty"><div className="review-empty__rating">—<span>/ 5</span></div><div><Eyebrow>Customer feedback</Eyebrow><h2>Real experiences,<br />shared with permission.</h2><p>No verified reviews are available for publication yet. AIRCON can add approved customer feedback here.</p><ButtonLink to="/contact" dark>Share your experience</ButtonLink></div></div></Container></section>
    <section className="section-pad review-form-section"><Container className="review-form-layout"><div><Eyebrow>Share feedback</Eyebrow><h2>Tell us about<br />your experience.</h2><p>Submissions are demonstration-only and will not be sent or published without review.</p></div><div className="form-card">{sent ? <div className="success-state"><span><Check size={22} /></span><Eyebrow>Feedback prepared</Eyebrow><h2>Thank you for sharing.</h2><p>This prototype did not transmit or publish your review.</p></div> : <form onSubmit={submit}><span className="form-card__eyebrow">REVIEW SUBMISSION</span><h3>Your feedback</h3><div className="form-row"><label>Your name<input required placeholder="Full name" /></label><label>Company<input placeholder="Company name" /></label></div><label>Rating<select required defaultValue=""><option value="" disabled>Select a rating</option><option>5 - Excellent</option><option>4 - Very good</option><option>3 - Good</option><option>2 - Fair</option><option>1 - Poor</option></select></label><label>Your review<textarea required rows={4} placeholder="Share your experience with AIRCON" /></label><label className="radio-option"><input type="checkbox" required /> AIRCON may contact me to verify this review.</label><button className="button button--dark">Submit for review <ArrowUpRight size={16} /></button><small className="form-disclaimer">No review is published automatically.</small></form>}</div></Container></section>
  </>
}

function Contact({ navigate }: { navigate: (to: string) => void }) {
  const [sent, setSent] = useState(false)
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true) }
  return <><PageHero eyebrow="Contact AIRCON" title={<>Let’s talk about<br /><em>what you’re building.</em></>} description="Tell us about your industrial requirement and we’ll help direct your enquiry to the right team." />
    <section className="contact-section section-pad"><Container className="contact-grid"><div className="contact-info"><Eyebrow>Start a conversation</Eyebrow><h2>Good engineering<br />starts with a question.</h2><p>Share your application or requirement using the form. Company telephone, email and complete address details are pending the source profile.</p><div className="contact-detail"><span>Manufacturing facility</span><strong>Manesar, Haryana, India</strong><small>45,000 sq. ft. as stated in company profile</small></div><div className="contact-detail"><span>Email & telephone</span><strong>To be confirmed</strong><small>Please provide approved contact details</small></div><PhotoPanel label="AIRCON Manesar facility" compact className="contact-map" /></div>
      <div className="form-card">{sent ? <div className="success-state"><span><Check size={22} /></span><Eyebrow>Enquiry noted</Eyebrow><h2>Thank you for reaching out.</h2><p>This is a frontend demonstration. Your enquiry has not been transmitted. Contact details and backend submission will be connected after approval.</p><button className="text-link" onClick={() => setSent(false)}>Send another enquiry <ArrowRight size={15} /></button></div> : <form onSubmit={submit}><span className="form-card__eyebrow">CONTACT FORM</span><h3>How can we help?</h3><div className="form-row"><label>Your name<input required name="name" placeholder="Full name" /></label><label>Work email<input required type="email" name="email" placeholder="name@company.com" /></label></div><div className="form-row"><label>Company<input name="company" placeholder="Company name" /></label><label>Telephone<input type="tel" name="telephone" placeholder="Phone number" /></label></div><label>Area of interest<select defaultValue=""><option value="" disabled>Select a division</option>{divisions.map(d => <option key={d.slug}>{d.short}</option>)}</select></label><label>Tell us about your requirement<textarea required rows={4} placeholder="A few details about your application or requirement" /></label><button className="button button--dark" type="submit">Send enquiry <ArrowUpRight size={16} /></button><small className="form-disclaimer">Demonstration form only. No data is sent or stored.</small></form>}</div>
    </Container></section><section className="map-placeholder"><Container><div><Eyebrow>Find our facility</Eyebrow><h2>Manesar, Haryana</h2><p>Map location and complete street address require confirmation.</p></div><div className="map-placeholder__art"><span>28°21′ N</span><Factory size={30} /><span>MANESAR / INDIA</span></div></Container></section>
  </>
}

function Quote({ path }: { path: string }) {
  const params = new URLSearchParams(path.split('?')[1] || '')
  const initialProduct = params.get('product') || ''
  const [sent, setSent] = useState(false)
  const [file, setFile] = useState('')
  const submit = (e: FormEvent) => { e.preventDefault(); setSent(true) }
  return <><PageHero eyebrow="Request a quote" title={<>Bring us the<br /><em>technical details.</em></>} description="Tell us about the product, process or system you need. Our team can review the application and follow up." />
    <section className="section-pad form-page"><Container className="form-page__grid"><div className="form-page__intro"><Eyebrow>Engineering enquiry</Eyebrow><h2>A clear brief helps us find the right direction.</h2><p>Quote requests are useful for custom machinery, assemblies and products requiring application review. This frontend demo does not transmit enquiries.</p><div className="form-side-note"><FileText size={18} /><span>Drawings, specifications or reference documents may be attached.</span></div></div>
      <div className="form-card">{sent ? <div className="success-state"><span><Check size={22} /></span><Eyebrow>Request prepared</Eyebrow><h2>Thank you. Your details are ready for review.</h2><p>This is frontend-only. No quote request or attachment has been uploaded.</p></div> : <form onSubmit={submit}><span className="form-card__eyebrow">PROJECT DETAILS</span><h3>Tell us what you need</h3>
        <label>Product or division<select required defaultValue={initialProduct || params.get('division') || ''}><option value="" disabled>Select an area</option>{divisions.map(d => <option value={d.slug} key={d.slug}>{d.short}</option>)}{products.map(p => <option value={p.slug} key={p.slug}>{p.name}</option>)}</select></label>
        <div className="form-row"><label>Quantity<input type="number" min="1" placeholder="Estimated quantity" /></label><label>Application<input placeholder="Industry or application" /></label></div>
        <label>Technical requirements<textarea rows={4} placeholder="Dimensions, operating conditions, standards or other requirements" /></label>
        <label className="upload-label">Attach a drawing or specification<span className="upload-control"><FileText size={18} /><span>{file || 'Choose a file (PDF, image or document)'}</span><input type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx" onChange={e => setFile(e.target.files?.[0]?.name || '')} /></span></label>
        <div className="form-row"><label>Your name<input required placeholder="Full name" /></label><label>Work email<input required type="email" placeholder="name@company.com" /></label></div>
        <div className="form-row"><label>Company<input placeholder="Company name" /></label><label>Telephone<input type="tel" placeholder="Phone number" /></label></div>
        <button className="button button--dark" type="submit">Prepare quote request <ArrowUpRight size={16} /></button><small className="form-disclaimer">Frontend demonstration only. Files are not uploaded or stored.</small>
      </form>}</div></Container></section>
  </>
}

function Cart({ cart, setCart, navigate }: { cart: CartLine[]; setCart: (c: CartLine[]) => void; navigate: (to: string) => void }) {
  const lines = cart.map(line => ({ ...line, product: products.find(p => p.slug === line.slug) })).filter(line => line.product)
  const update = (slug: string, quantity: number) => setCart(quantity < 1 ? cart.filter(l => l.slug !== slug) : cart.map(l => l.slug === slug ? { ...l, quantity } : l))
  return <><PageHero eyebrow="Your cart" title={<>A closer look at<br /><em>your selection.</em></>} description="Review quantities and continue to a frontend checkout demonstration." />
    <section className="section-pad"><Container className="cart-layout">{lines.length ? <><div className="cart-lines"><div className="cart-heading"><span>Product</span><span>Quantity</span><span>Price</span></div>{lines.map(({ product, quantity }) => product && <div className="cart-line" key={product.slug}><PhotoPanel label={product.category} compact /><div className="cart-line__name"><Link to={`/products/${product.slug}`}><strong>{product.name}</strong></Link><span>{product.category}</span><button className="remove-link" onClick={() => update(product.slug, 0)}>Remove</button></div><div className="quantity-control"><button aria-label="Decrease quantity" onClick={() => update(product.slug, quantity - 1)}><Minus size={14} /></button><span>{quantity}</span><button aria-label="Increase quantity" onClick={() => update(product.slug, quantity + 1)}><Plus size={14} /></button></div><span className="cart-line__price">On enquiry</span></div>)}</div>
      <aside className="order-summary"><h3>Order summary</h3><div><span>Items</span><span>{lines.reduce((sum, l) => sum + l.quantity, 0)}</span></div><div><span>Subtotal</span><span>Confirmed at enquiry</span></div><div className="summary-total"><span>Estimated total</span><strong>Request pricing</strong></div><p>Pricing and availability are confirmed by AIRCON. No payment is collected in this demo.</p><button className="button button--dark" onClick={() => navigate('/checkout')}>Proceed to checkout <ArrowRight size={16} /></button><Link to="/products" className="text-link">Continue browsing <ArrowLeft size={15} /></Link></aside></> : <div className="empty-cart"><ShoppingBag size={30} strokeWidth={1.3} /><Eyebrow>Your cart</Eyebrow><h2>Nothing here just yet.</h2><p>Browse the catalogue and add standard products to your selection.</p><ButtonLink to="/products" dark>Explore products</ButtonLink></div>}</Container></section></>
}

function Checkout({ cart }: { cart: CartLine[] }) {
  const [placed, setPlaced] = useState(false)
  const submit = (e: FormEvent) => { e.preventDefault(); setPlaced(true) }
  const cartProducts = cart.map(l => products.find(p => p.slug === l.slug)).filter(Boolean)
  return <><div className="breadcrumb container"><Link to="/cart">Cart</Link><ChevronRight size={14} /><span>Checkout</span></div><PageHero eyebrow="Checkout" title={<>Order details,<br /><em>step by step.</em></>} description="Frontend checkout preview. No payment, order or backend processing is connected." />
    <section className="section-pad"><Container className="checkout-layout">{placed ? <div className="form-card success-state"><span><Check size={22} /></span><Eyebrow>Preview complete</Eyebrow><h2>Checkout details captured in this session.</h2><p>No order was submitted and no payment was taken. Backend order processing will be scoped after design approval.</p></div> : <form className="form-card checkout-form" onSubmit={submit}><span className="form-card__eyebrow">CONTACT & DELIVERY</span><h3>Who should we contact?</h3><div className="form-row"><label>Full name<input required placeholder="Full name" /></label><label>Work email<input required type="email" placeholder="name@company.com" /></label></div><div className="form-row"><label>Company name<input required placeholder="Registered company" /></label><label>Telephone<input type="tel" placeholder="Phone number" /></label></div><label>Billing address<textarea rows={3} required placeholder="Address, city, state, PIN code" /></label><label><input className="inline-check" type="checkbox" /> Delivery address is same as billing address</label><label>Delivery address<textarea rows={3} placeholder="Address, city, state, PIN code" /></label><div className="form-row"><label>GSTIN<input placeholder="GST identification number" /></label><label>Purchase order reference<input placeholder="Optional reference" /></label></div><fieldset><legend>Payment method preference</legend><label className="radio-option"><input type="radio" name="payment" defaultChecked /> Confirm payment terms with AIRCON</label><label className="radio-option"><input type="radio" name="payment" /> Purchase order / bank transfer</label></fieldset><button className="button button--dark">Continue (demo only) <ArrowRight size={16} /></button></form>}
      <aside className="order-summary"><h3>Order summary</h3>{cartProducts.length ? cartProducts.map((p, i) => p && <div className="checkout-product" key={p.slug}><span>0{i + 1}</span><strong>{p.name}</strong><small>Price on enquiry</small></div>) : <p>No cart items selected. Product pricing can be confirmed with an AIRCON representative.</p>}<div className="summary-total"><span>Subtotal</span><strong>Confirmed on enquiry</strong></div><p>This page is a frontend prototype; no payment details are requested.</p></aside>
    </Container></section></>
}

function NotFound() {
  return <section className="not-found"><Container><Eyebrow>Page not found</Eyebrow><h1>Let’s find the<br /><em>right direction.</em></h1><p>The page you’re looking for may have moved.</p><ButtonLink to="/" dark>Return home</ButtonLink></Container></section>
}

export default function App() {
  const { path, navigate } = useRoute()
  const [cart, setCartState] = useState<CartLine[]>(() => {
    try { return JSON.parse(localStorage.getItem('aircon-cart') || '[]') as CartLine[] } catch { return [] }
  })
  const setCart = (value: CartLine[]) => { setCartState(value); localStorage.setItem('aircon-cart', JSON.stringify(value)) }
  const addToCart = (slug: string, quantity = 1) => {
    const existing = cart.find(item => item.slug === slug)
    setCart(existing ? cart.map(item => item.slug === slug ? { ...item, quantity: item.quantity + quantity } : item) : [...cart, { slug, quantity }])
  }
  const [pathname] = path.split('?')
  const segments = pathname.split('/').filter(Boolean)
  let page: React.ReactNode
  if (pathname === '/') page = <Home addToCart={addToCart} />
  else if (pathname === '/about') page = <About />
  else if (pathname === '/divisions') page = <Divisions navigate={navigate} />
  else if (segments[0] === 'divisions' && segments[1]) page = <DivisionDetail slug={segments[1]} />
  else if (pathname === '/products') page = <ProductListing path={path} addToCart={addToCart} />
  else if (segments[0] === 'products' && segments[1]) page = <ProductDetail slug={segments[1]} addToCart={addToCart} navigate={navigate} />
  else if (pathname === '/projects') page = <Projects navigate={navigate} />
  else if (segments[0] === 'projects' && segments[1]) page = <ProjectDetail slug={segments[1]} />
  else if (pathname === '/reviews') page = <Reviews />
  else if (pathname === '/contact') page = <Contact navigate={navigate} />
  else if (pathname === '/quote') page = <Quote path={path} />
  else if (pathname === '/cart') page = <Cart cart={cart} setCart={setCart} navigate={navigate} />
  else if (pathname === '/checkout') page = <Checkout cart={cart} />
  else page = <NotFound />
  useEffect(() => {
    const pageName = pathname === '/' ? 'Home' : pathname.split('/').filter(Boolean).at(-1)?.replaceAll('-', ' ')
    document.title = `${pageName ? pageName.charAt(0).toUpperCase() + pageName.slice(1) : 'AIRCON'} | AIRCON Automation India`
    const descriptions: Record<string, string> = {
      '/': 'AIRCON Automation India delivers railway systems, industrial automation and engineered product solutions.',
      '/about': 'Learn about AIRCON Automation India, its manufacturing base, capabilities and quality commitment.',
      '/divisions': 'Explore AIRCON railway systems, manufacturing and automation, industrial distribution and hose assembly.',
      '/products': 'Browse AIRCON industrial products and engineered systems. Confirm specifications and pricing on enquiry.',
      '/projects': 'Explore AIRCON application areas across railway, manufacturing automation and industrial products.',
      '/reviews': 'Read approved AIRCON customer reviews or submit feedback for verification.',
      '/contact': 'Contact AIRCON Automation India about an industrial, railway or manufacturing requirement.',
      '/quote': 'Request a quotation from AIRCON for industrial products, hose assemblies or engineered systems.',
      '/cart': 'Review selected AIRCON catalogue products before checkout.',
      '/checkout': 'Review contact, company, delivery and payment preference details for your AIRCON enquiry.',
    }
    const description = descriptions[pathname] || (pathname.startsWith('/divisions/') ? 'Explore AIRCON division capabilities and product offerings.' : pathname.startsWith('/products/') ? 'Review product information and request pricing from AIRCON Automation India.' : 'AIRCON Automation India industrial engineering capabilities.')
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [pathname])
  useEffect(() => {
    let observer: IntersectionObserver | undefined
    const frame = requestAnimationFrame(() => {
      const nodes = document.querySelectorAll<HTMLElement>('.reveal-on-view')
      if (!('IntersectionObserver' in window)) {
        nodes.forEach(node => node.classList.add('is-visible'))
        return
      }
      const activeObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            activeObserver.unobserve(entry.target)
          }
        })
      }, { threshold: .12 })
      observer = activeObserver
      nodes.forEach(node => activeObserver.observe(node))
    })
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [path])
  return <><Header path={path} navigate={navigate} cartCount={cart.reduce((sum, line) => sum + line.quantity, 0)} /><main key={path}>{page}</main><Footer /><button className="back-to-top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ArrowUpRight size={18} /></button></>
}
