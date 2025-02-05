import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { UrlForm } from './components/UrlForm';
import { UrlTable } from './components/UrlTable';
import { getUserUrls } from './services/api';
import { ShortUrl } from './types';

const Dashboard = () => {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, logout } = useAuth();

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const data = await getUserUrls();
        setUrls(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load URLs');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchUrls();
  }, [token, logout]);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="container">
      <h1 className="title">Dashboard</h1>
      {error && <div className="notification is-danger">{error}</div>}
      <UrlForm onSuccess={(newUrl) => setUrls([newUrl, ...urls])} />
      <div className="control has-text-centered">
      <button
        className={'button is-info is-medium is-centralized'}
        onClick={logout}
        type="button"
        style={{
          borderRadius: '8px',
          paddingLeft: '2.5rem',
          paddingRight: '2.5rem',
          fontSize: '1.1rem'
        }}
      >
        Logout
      </button>
      </div>
      <UrlTable urls={urls} />
    </div>
  );
};

export default Dashboard;