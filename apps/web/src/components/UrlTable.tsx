import { useState } from 'react';
import { updateSlug } from '../services/api';
import { ShortUrl } from '../types';
import { AxiosError } from 'axios';

interface UrlTableProps {
  urls: ShortUrl[];
}

export const UrlTable = ({ urls }: UrlTableProps) => {
  const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSlug, setNewSlug] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (id: string) => {
    if (!newSlug) {
      setError('Slug cannot be empty');
      return;
    }

    try {
      await updateSlug(id, newSlug);
      urls.find((url) => url.id === id)!.slug = newSlug;
      setEditingId(null);
      setNewSlug('');
      setError('');
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(`${err.response?.data.message}: ${newSlug}`);
      }
    }
  };

  return (
    <div className="table-container">
      {showCopiedFeedback && (
    <div className="notification is-info is-light has-text-weight-medium px-3 py-2" 
         style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 100 }}>
      ✅ Copied to clipboard!
    </div>
  )}
      {error && <div className="notification is-danger">{error}</div>}
      
      <table className="table is-fullwidth is-striped is-hoverable">
        <thead>
          <tr>
            <th>Original URL</th>
            <th>Short URL</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url.id}>
              <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {url.url}
              </td>
              <td>
                {editingId === url.id ? (
                  <div className="field has-addons">
                    <div className="control">
                      <input
                        className="input is-small"
                        value={newSlug}
                        onChange={(e) => setNewSlug(e.target.value)}
                      />
                    </div>
                    <div className="control">
                      <button
                        className="button is-small is-success"
                        onClick={() => handleUpdate(url.id)}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="is-flex is-align-items-center has-gap-1">
                    <span className="is-clipped has-text-weight-semibold">
                      {process.env.REACT_APP_API_URL}/{url.slug}
                    </span>
                    <button
                      style={{ marginLeft: '10px' }}
                      className="button is-small is-info is-light"
                      title="Copy to clipboard"
                      aria-label="Copy short URL"
                      onClick={() => {
                        navigator.clipboard.writeText(`${process.env.REACT_APP_API_URL}/${url.slug}`);
                        setShowCopiedFeedback(true);
                        setTimeout(() => setShowCopiedFeedback(false), 4000);
                      }}
                    >
                      <span className="icon">
                        <i className="far fa-copy" />
                      </span>
                    </button>
                  </div>
                )}
              </td>
              <td>{new Date(url.createdAt).toLocaleString()}</td>
              <td>
                {editingId === url.id ? (
                  <button 
                    className="button is-small is-text has-text-danger"
                    onClick={() => {
                      setEditingId(null);
                      setNewSlug('');
                    }}
                  >
                    <span className="icon">
                      <i className="fas fa-times" />
                    </span>
                    <span>Cancel</span>
                  </button>
                ) : (
                  <button
                    className="button is-small is-primary is-light"
                    onClick={() => {
                      setEditingId(url.id);
                      setNewSlug(url.slug);
                    }}
                  >
                    <span className="icon">
                      <i className="fas fa-pencil-alt" />
                    </span>
                    <span>Edit</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};