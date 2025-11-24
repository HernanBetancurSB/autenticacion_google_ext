import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  Presentation, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  Globe 
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <Presentation size={32} />,
      title: 'Presentaciones Profesionales',
      description: 'Crea pitches corporativos con plantillas diseñadas por expertos',
    },
    {
      icon: <Users size={32} />,
      title: 'Colaboración en Tiempo Real',
      description: 'Trabaja en equipo y comparte ideas con tu organización',
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Analytics Avanzados',
      description: 'Mide el impacto de tus presentaciones con métricas detalladas',
    },
    {
      icon: <Shield size={32} />,
      title: 'Seguridad Empresarial',
      description: 'Autenticación segura con Google OAuth y encriptación de datos',
    },
    {
      icon: <Zap size={32} />,
      title: 'Rápido y Eficiente',
      description: 'Plataforma optimizada para máximo rendimiento',
    },
    {
      icon: <Globe size={32} />,
      title: 'Cloud-Agnostic',
      description: 'Desplegable en cualquier proveedor de nube (AWS, GCP, Azure)',
    },
  ];

  return (
    <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <div className="logo">
              <Presentation size={28} />
              <span>Corporate Pitch</span>
            </div>
            <div className="nav-actions">
              {user ? (
                <>
                  <span className="user-name">Hola, {user.name}</span>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/dashboard')}
                  >
                    Ir al Dashboard
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="btn btn-outline"
                    onClick={() => navigate('/login')}
                  >
                    Iniciar Sesión
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate('/login')}
                  >
                    Comenzar Gratis
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Crea Presentaciones de Pitch
              <span className="highlight"> Corporativas Excepcionales</span>
            </h1>
            <p className="hero-description">
              Plataforma profesional para diseñar, gestionar y presentar pitches de negocio
              que impactan. Potencia tus ideas con herramientas de clase empresarial.
            </p>
            <div className="hero-actions">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => navigate('/login')}
              >
                <Zap size={20} />
                Comenzar Ahora
              </button>
              <button className="btn btn-outline btn-large">
                Ver Demo
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Presentaciones creadas</div>
              </div>
              <div className="stat">
                <div className="stat-number">500+</div>
                <div className="stat-label">Empresas confían en nosotros</div>
              </div>
              <div className="stat">
                <div className="stat-number">95%</div>
                <div className="stat-label">Satisfacción del cliente</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2>Funcionalidades Empresariales</h2>
            <p>Todo lo que necesitas para crear presentaciones de impacto</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para transformar tus presentaciones?</h2>
            <p>Únete a cientos de empresas que ya confían en Corporate Pitch</p>
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/login')}
            >
              Comenzar Gratis
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <Presentation size={24} />
                <span>Corporate Pitch</span>
              </div>
              <p>Plataforma profesional para presentaciones corporativas</p>
            </div>
            <div className="footer-section">
              <h4>Producto</h4>
              <ul>
                <li><a href="#">Funcionalidades</a></li>
                <li><a href="#">Precios</a></li>
                <li><a href="#">Plantillas</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Empresa</h4>
              <ul>
                <li><a href="#">Sobre Nosotros</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Contacto</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacidad</a></li>
                <li><a href="#">Términos</a></li>
                <li><a href="#">Seguridad</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Corporate Pitch. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

