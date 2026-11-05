import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API_URL = 'https://api-colombia.com/api/v1';

const REGIONS = [
  { id: 0, name: 'Todas' },
  { id: 1, name: 'Caribe' },
  { id: 2, name: 'Pacífico' },
  { id: 3, name: 'Orinoquía' },
  { id: 4, name: 'Amazonía' },
  { id: 5, name: 'Andina' },
  { id: 6, name: 'Insular' },
  { id: 7, name: 'Sierra Nevada' },
];

const REGION_ACCENTS = {
  1: 'coral',
  2: 'blue',
  3: 'gold',
  4: 'green',
  5: 'violet',
  6: 'aqua',
  7: 'indigo',
};

const formatNumber = (value) =>
  typeof value === 'number' ? new Intl.NumberFormat('es-CO').format(value) : '—';

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

function ThemeIcon({ isDark }) {
  return isDark ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />
    </svg>
  );
}

function DepartmentCard({ department, onSelect, index }) {
  const region = REGIONS.find((item) => item.id === department.regionId)?.name ?? 'Colombia';
  const accent = REGION_ACCENTS[department.regionId] ?? 'green';

  return (
    <button
      className={`department-card accent-${accent}`}
      onClick={() => onSelect(department)}
      style={{ '--card-index': index }}
      type="button"
    >
      <span className="card-topline">
        <span className="region-label">
          <span className="region-dot" />
          {region}
        </span>
        <span className="card-arrow">
          <ArrowIcon />
        </span>
      </span>
      <span className="department-name">{department.name}</span>
      <span className="department-capital">
        <span className="capital-icon" aria-hidden="true">⌖</span>
        {department.cityCapital?.name ?? 'Capital por consultar'}
      </span>
      <span className="card-divider" />
      <span className="card-stats">
        <span>
          <strong>{formatNumber(department.municipalities)}</strong>
          <small>municipios</small>
        </span>
        <span>
          <strong>{formatNumber(department.population)}</strong>
          <small>habitantes</small>
        </span>
      </span>
    </button>
  );
}

function DepartmentModal({ department, onClose }) {
  const [cities, setCities] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const region = REGIONS.find((item) => item.id === department.regionId)?.name ?? 'Colombia';

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    setError('');

    fetch(`${API_URL}/Department/${department.id}/cities`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('No fue posible cargar los municipios.');
        return response.json();
      })
      .then((data) => {
        setCities(Array.isArray(data) ? data : []);
        setStatus('ready');
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Ocurrió un error al consultar la API.');
          setStatus('error');
        }
      });

    return () => controller.abort();
  }, [department.id]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('modal-open');
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section
        aria-labelledby="modal-title"
        aria-modal="true"
        className="detail-modal"
        role="dialog"
      >
        <div className={`modal-banner accent-${REGION_ACCENTS[department.regionId] ?? 'green'}`}>
          <button aria-label="Cerrar detalle" className="modal-close" onClick={onClose} type="button">
            <CloseIcon />
          </button>
          <span className="modal-region">{region} · Colombia</span>
          <h2 id="modal-title">{department.name}</h2>
          <p>{department.cityCapital?.name ?? 'Capital de departamento'}</p>
          <span className="banner-sun" aria-hidden="true" />
          <span className="banner-hill banner-hill-back" aria-hidden="true" />
          <span className="banner-hill banner-hill-front" aria-hidden="true" />
        </div>
        <div className="modal-content">
          <div className="detail-stats">
            <div className="detail-stat">
              <span className="detail-stat-icon">⌖</span>
              <div><small>Capital</small><strong>{department.cityCapital?.name ?? '—'}</strong></div>
            </div>
            <div className="detail-stat">
              <span className="detail-stat-icon">♙</span>
              <div><small>Población</small><strong>{formatNumber(department.population)}</strong></div>
            </div>
            <div className="detail-stat">
              <span className="detail-stat-icon">↗</span>
              <div><small>Superficie</small><strong>{formatNumber(department.surface)} km²</strong></div>
            </div>
            <div className="detail-stat">
              <span className="detail-stat-icon">⌂</span>
              <div><small>Municipios</small><strong>{formatNumber(department.municipalities)}</strong></div>
            </div>
          </div>
          <div className="department-description">
            <span className="section-eyebrow">UN LUGAR PARA DESCUBRIR</span>
            <p>{department.description || 'Descubre todo lo que este departamento tiene para ofrecer.'}</p>
          </div>
          <div className="cities-heading">
            <div>
              <span className="section-eyebrow">TERRITORIO</span>
              <h3>Sus municipios <span>{formatNumber(department.municipalities)}</span></h3>
            </div>
            {department.phonePrefix && <span className="phone-prefix">Indicativo · {department.phonePrefix}</span>}
          </div>
          {status === 'loading' && (
            <div className="cities-message" role="status"><span className="loader" /> Cargando municipios…</div>
          )}
          {status === 'error' && <p className="error-message" role="alert">{error}</p>}
          {status === 'ready' && cities.length === 0 && (
            <p className="cities-message">La API no tiene municipios registrados para este departamento.</p>
          )}
          {status === 'ready' && cities.length > 0 && (
            <ul className="cities-list">
              {cities.map((city) => (
                <li key={city.id}>
                  <span className="city-pin">·</span>
                  <span className="city-name">{city.name}</span>
                  {city.id === department.cityCapitalId && <span className="capital-tag">Capital</span>}
                  {city.population && <span className="city-population">{formatNumber(city.population)} hab.</span>}
                </li>
              ))}
            </ul>
          )}
          <p className="modal-source">Datos proporcionados por <a href="https://api-colombia.com/" target="_blank" rel="noreferrer">API Colombia</a></p>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState(() => window.localStorage.getItem('explora-theme') ?? 'light');
  const [departments, setDepartments] = useState([]);
  const [query, setQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState(0);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      'content',
      theme === 'dark' ? '#171e19' : '#f8f7f2',
    );
    window.localStorage.setItem('explora-theme', theme);
  }, [theme]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/Department`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`La API respondió con el estado ${response.status}.`);
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('La API devolvió un formato de datos inesperado.');
        setDepartments(data);
        setStatus('ready');
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'No pudimos conectar con API Colombia.');
          setStatus('error');
        }
      });

    return () => controller.abort();
  }, []);

  const normalizedQuery = query.trim().toLocaleLowerCase('es');
  const filteredDepartments = useMemo(() => departments.filter((department) => {
    const matchesRegion = activeRegion === 0 || department.regionId === activeRegion;
    const searchable = [
      department.name,
      department.cityCapital?.name,
      department.description,
      REGIONS.find((region) => region.id === department.regionId)?.name,
    ].filter(Boolean).join(' ').toLocaleLowerCase('es');
    return matchesRegion && searchable.includes(normalizedQuery);
  }), [activeRegion, departments, normalizedQuery]);

  const closeModal = () => setSelectedDepartment(null);

  return (
    <div className="app-shell">
      <header className="site-header">
        <a aria-label="Explora Colombia, inicio" className="brand" href="#">
          <span className="brand-mark"><span /><span /><span /></span>
          <span>explora<span className="brand-highlight">.</span></span>
        </a>
        <nav aria-label="Navegación principal" className="header-nav">
          <a className="nav-active" href="#departamentos">Departamentos</a>
          <a href="#sobre-colombia">Sobre Colombia</a>
        </nav>
        <button
          aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          aria-pressed={theme === 'dark'}
          className="theme-toggle"
          onClick={() => setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light')}
          title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
          type="button"
        >
          <ThemeIcon isDark={theme === 'dark'} />
          <span>{theme === 'light' ? 'Modo oscuro' : 'Modo claro'}</span>
        </button>
        <a className="header-note" href="#departamentos">
          <span className="live-dot" /> 32 departamentos
        </a>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-line" /> UNA TIERRA, MUCHAS FORMAS DE SENTIR</span>
            <h1>Colombia se<br />descubre <em>paso a paso.</em></h1>
            <p className="hero-description">
              De las montañas andinas a la selva amazónica. Encuentra ese lugar que todavía no sabías que estabas buscando.
            </p>
            <a className="hero-cta" href="#departamentos">
              Explorar departamentos <span><ArrowIcon /></span>
            </a>
          </div>
          <div aria-label="Ilustración de las montañas colombianas" className="hero-art" role="img">
            <span className="art-sun" />
            <span className="art-cloud art-cloud-one" />
            <span className="art-cloud art-cloud-two" />
            <span className="mountain mountain-far" />
            <span className="mountain mountain-mid" />
            <span className="mountain mountain-near" />
            <span className="art-label"><span className="live-dot" /> 6 regiones naturales</span>
            <span className="art-caption">04° 34′ N · 74° 04′ O</span>
          </div>
          <div className="hero-bottom">
            <span>UN PAÍS PARA SENTIRLO TODO</span>
            <span className="scroll-cue">DESLIZA PARA EXPLORAR <span>↓</span></span>
          </div>
        </section>

        <section aria-labelledby="about-title" className="about-section" id="sobre-colombia">
          <div className="about-heading">
            <span className="section-eyebrow">MÁS QUE UN DESTINO</span>
            <h2 id="about-title">Un país que lo tiene todo.</h2>
            <p>
              Entre dos océanos, tres cordilleras y una biodiversidad extraordinaria,
              Colombia reúne mundos distintos en un solo lugar. Cada departamento
              tiene su propio paisaje, acento y manera de recibirte.
            </p>
          </div>
          <div className="about-highlights">
            <article className="about-highlight">
              <span className="about-highlight-number">01</span>
              <h3>Seis regiones, infinitos paisajes</h3>
              <p>Caribe, Pacífico, Andes, Orinoquía, Amazonía e Insular: cada región te invita a vivir el país de una forma diferente.</p>
            </article>
            <article className="about-highlight">
              <span className="about-highlight-number">02</span>
              <h3>La diversidad está en los detalles</h3>
              <p>Recorre las ciudades y municipios para conocer mejor la cultura, la geografía y las historias de cada departamento.</p>
            </article>
            <article className="about-highlight">
              <span className="about-highlight-number">03</span>
              <h3>Tu próxima historia empieza aquí</h3>
              <p>Busca un lugar que te llame la atención y déjate sorprender por todo lo que tiene para descubrir.</p>
            </article>
          </div>
          <a className="about-cta" href="#departamentos">
            Encuentra tu próximo destino <span><ArrowIcon /></span>
          </a>
        </section>

        <section className="explorer-section" id="departamentos">
          <div className="explorer-heading">
            <div>
              <span className="section-eyebrow">EL MAPA EMPIEZA AQUÍ</span>
              <h2>¿A dónde vamos?</h2>
            </div>
            <p>Cada rincón tiene una historia.<br />La próxima puede ser la tuya.</p>
          </div>

          <div className="explorer-controls">
            <label className="search-field">
              <SearchIcon />
              <input
                aria-label="Buscar departamento o capital"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Busca un departamento o capital..."
                type="search"
                value={query}
              />
              <kbd>⌘ K</kbd>
            </label>
            <div aria-label="Filtrar por región" className="region-filters" role="group">
              {REGIONS.map((region) => (
                <button
                  aria-pressed={activeRegion === region.id}
                  className={activeRegion === region.id ? 'region-filter selected' : 'region-filter'}
                  key={region.id}
                  onClick={() => setActiveRegion(region.id)}
                  type="button"
                >
                  {region.name}
                </button>
              ))}
            </div>
          </div>

          <div aria-live="polite" className="results-summary">
            <span>{status === 'ready' ? <><strong>{filteredDepartments.length}</strong> {filteredDepartments.length === 1 ? 'departamento' : 'departamentos'} para explorar</> : 'Descubriendo Colombia…'}</span>
            {query && <button className="clear-search" onClick={() => setQuery('')} type="button">Limpiar búsqueda ×</button>}
          </div>

          {status === 'loading' && (
            <div className="loading-grid" role="status" aria-label="Cargando departamentos">
              {Array.from({ length: 6 }, (_, index) => <div className="skeleton-card" key={index} />)}
            </div>
          )}
          {status === 'error' && (
            <div className="error-panel" role="alert">
              <span className="error-symbol">!</span>
              <div><strong>No pudimos cargar los departamentos</strong><p>{error} Comprueba tu conexión e inténtalo de nuevo.</p></div>
              <button onClick={() => window.location.reload()} type="button">Volver a intentar</button>
            </div>
          )}
          {status === 'ready' && filteredDepartments.length > 0 && (
            <div className="department-grid">
              {filteredDepartments.map((department, index) => (
                <DepartmentCard
                  department={department}
                  index={index}
                  key={department.id}
                  onSelect={setSelectedDepartment}
                />
              ))}
            </div>
          )}
          {status === 'ready' && filteredDepartments.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">⌕</span>
              <h3>No encontramos ese destino</h3>
              <p>Prueba con otro nombre o explora una región diferente.</p>
              <button onClick={() => { setQuery(''); setActiveRegion(0); }} type="button">Ver todos los departamentos</button>
            </div>
          )}
          <p className="api-credit">Información actualizada desde <a href="https://api-colombia.com/" target="_blank" rel="noreferrer">API Colombia</a></p>
        </section>

        <footer className="site-footer">
          <a aria-label="Explora Colombia, inicio" className="brand footer-brand" href="#">
            <span className="brand-mark"><span /><span /><span /></span>
            <span>explora<span className="brand-highlight">.</span></span>
          </a>
          <span>Hecho para perderse un poquito y encontrarse mucho.</span>
          <span>&copy; 2024 Explora Colombia. Hecho por Luis Rendcn para el curso de frontend 😁.</span>
        </footer>
      </main>
      {selectedDepartment && <DepartmentModal department={selectedDepartment} onClose={closeModal} />}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
