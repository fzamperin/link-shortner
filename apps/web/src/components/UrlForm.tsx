import { useState, FormEvent } from 'react';
import { shortenUrl } from '../services/api';

export const UrlForm = ({ onSuccess }: { onSuccess: (url: any) => void }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateUrl(originalUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    try {
      // Replace with actual API call
      const data = await shortenUrl({url: originalUrl, slug: customSlug});

      onSuccess(data);
      setOriginalUrl('');
      setCustomSlug('');
    } catch (err) {
      setError('Failed to shorten URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="box" style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
      <form onSubmit={handleSubmit} className="form-container">
        {error && (
          <div className="notification is-danger is-light mb-5">
            {error}
          </div>
        )}
  
        <div className="field mb-5">
          <label className="label has-text-weight-semibold">Long URL</label>
          <div className="control">
            <input
              className="input is-medium"
              type="url"
              placeholder="https://example.com"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              style={{ borderRadius: '8px' }}
            />
          </div>
        </div>
  
        <div className="field mb-6">
          <label className="label has-text-weight-semibold">Custom Slug (optional)</label>
          <div className="control">
            <input
              className="input is-medium"
              type="text"
              placeholder="my custom slug"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              pattern="[A-Za-z0-9_-]{1,}"
              style={{ borderRadius: '8px' }}
            />
          </div>
        </div>
  
        <div className="field">
          <div className="control has-text-centered">
            <button
              className={`button is-primary is-medium ${
                isLoading ? 'is-loading' : ''
              }`}
              type="submit"
              disabled={isLoading}
              style={{
                borderRadius: '8px',
                paddingLeft: '2.5rem',
                paddingRight: '2.5rem',
                fontSize: '1.1rem'
              }}
            >
              Shorten URL
            </button>
          </div>
        </div>
      </form>
  
      <style>{`
        .form-container {
          margin: 0 auto;
          width: 90%;
        }
        .label {
          margin-bottom: 0.75rem;
        }
        .box {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-radius: 12px;
        }
        @media (max-width: 768px) {
          .box {
            margin: 1rem;
            width: auto;
          }
        }
      `}</style>
    </div>
  );
};