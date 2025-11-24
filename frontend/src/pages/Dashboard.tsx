import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import {
  Presentation,
  Plus,
  LogOut,
  FileText,
  Calendar,
  TrendingUp,
  Settings,
} from 'lucide-react';
import './Dashboard.css';

interface Pitch {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPitchTitle, setNewPitchTitle] = useState('');
  const [newPitchDescription, setNewPitchDescription] = useState('');

  useEffect(() => {
    fetchPitches();
  }, []);

  const fetchPitches = async () => {
    try {
      const response = await axios.get('/api/pitches');
      setPitches(response.data.data || []);
    } catch (error) {
      console.error('Error al obtener pitches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePitch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/pitches', {
        title: newPitchTitle,
        description: newPitchDescription,
      });
      setNewPitchTitle('');
      setNewPitchDescription('');
      setShowCreateModal(false);
      fetchPitches();
    } catch (error) {
      console.error('Error al crear pitch:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <Presentation size={28} />
            <span>Corporate Pitch</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <FileText size={20} />
            <span>Mis Pitches</span>
          </a>
          <a href="#" className="nav-item">
            <Calendar size={20} />
            <span>Calendario</span>
          </a>
          <a href="#" className="nav-item">
            <TrendingUp size={20} />
            <span>Analytics</span>
          </a>
          <a href="#" className="nav-item">
            <Settings size={20} />
            <span>Configuración</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            {user?.picture && (
              <img src={user.picture} alt={user.name} className="user-avatar" />
            )}
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-email">{user?.email}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <div>
            <h1>Mis Presentaciones</h1>
            <p>Gestiona y crea tus pitches corporativos</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={20} />
            Nueva Presentación
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#4285f4' }}>
              <FileText size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{pitches.length}</div>
              <div className="stat-label">Total Pitches</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#34a853' }}>
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">
                {pitches.filter((p) => p.status === 'draft').length}
              </div>
              <div className="stat-label">En Borrador</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fbbc04' }}>
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">0</div>
              <div className="stat-label">Presentaciones programadas</div>
            </div>
          </div>
        </div>

        {/* Pitches List */}
        <div className="pitches-section">
          <h2>Tus Presentaciones</h2>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando presentaciones...</p>
            </div>
          ) : pitches.length === 0 ? (
            <div className="empty-state">
              <Presentation size={64} />
              <h3>No tienes presentaciones aún</h3>
              <p>Comienza creando tu primera presentación de pitch</p>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={20} />
                Crear Primera Presentación
              </button>
            </div>
          ) : (
            <div className="pitches-grid">
              {pitches.map((pitch) => (
                <div key={pitch.id} className="pitch-card card">
                  <div className="pitch-card-header">
                    <h3>{pitch.title}</h3>
                    <span className={`status-badge status-${pitch.status}`}>
                      {pitch.status === 'draft' ? 'Borrador' : pitch.status}
                    </span>
                  </div>
                  <p className="pitch-description">
                    {pitch.description || 'Sin descripción'}
                  </p>
                  <div className="pitch-card-footer">
                    <span className="pitch-date">
                      <Calendar size={14} />
                      {formatDate(pitch.created_at)}
                    </span>
                    <button className="btn btn-outline btn-small">
                      Abrir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nueva Presentación</h2>
              <button
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreatePitch}>
              <div className="form-group">
                <label>Título de la Presentación *</label>
                <input
                  type="text"
                  value={newPitchTitle}
                  onChange={(e) => setNewPitchTitle(e.target.value)}
                  placeholder="Ej: Pitch de Inversión Q1 2024"
                  required
                />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={newPitchDescription}
                  onChange={(e) => setNewPitchDescription(e.target.value)}
                  placeholder="Describe brevemente tu presentación..."
                  rows={4}
                ></textarea>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear Presentación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

