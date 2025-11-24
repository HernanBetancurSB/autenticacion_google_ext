import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Presentation, Shield, Zap } from 'lucide-react';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleLogin = () => {
    // Redirigir al backend para iniciar OAuth
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/google`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Columna izquierda - Información */}
        <div className="login-info">
          <div className="login-info-content">
            <div className="logo-large">
              <Presentation size={48} />
              <h1>Corporate Pitch</h1>
            </div>
            <h2>Crea presentaciones que impactan</h2>
            <p>
              La plataforma profesional para diseñar, gestionar y presentar pitches
              corporativos de clase mundial.
            </p>
            
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <Shield size={20} />
                </div>
                <div>
                  <h4>Seguridad Empresarial</h4>
                  <p>Autenticación segura con Google OAuth 2.0</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <Zap size={20} />
                </div>
                <div>
                  <h4>Rápido y Eficiente</h4>
                  <p>Accede a tus presentaciones en segundos</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">
                  <Presentation size={20} />
                </div>
                <div>
                  <h4>Herramientas Profesionales</h4>
                  <p>Todo lo que necesitas en un solo lugar</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha - Login */}
        <div className="login-form-container">
          <div className="login-form-content">
            <div className="login-header">
              <h2>Bienvenido</h2>
              <p>Inicia sesión para acceder a tu cuenta</p>
            </div>

            <button 
              className="google-login-btn"
              onClick={handleGoogleLogin}
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </button>

            <div className="login-divider">
              <span>Autenticación segura</span>
            </div>

            <div className="login-footer">
              <p>
                Al continuar, aceptas nuestros{' '}
                <a href="#">Términos de Servicio</a> y{' '}
                <a href="#">Política de Privacidad</a>
              </p>
            </div>

            <button 
              className="back-btn"
              onClick={() => navigate('/')}
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

