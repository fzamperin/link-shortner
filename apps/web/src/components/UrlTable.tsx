import { useState } from 'react';
import { updateSlug } from '../services/api';
import { ShortUrl } from '../types';
import { AxiosError } from 'axios';

interface UrlTableProps {
  urls: ShortUrl[];
}

export const UrlTable = ({ urls }: UrlTableProps) => {
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
                  `${process.env.REACT_APP_API_URL}/${url.slug}`
                )}
              </td>
              <td>{new Date(url.createdAt).toLocaleString()}</td>
              <td>
                {editingId === url.id ? (
                  <button 
                    className="button is-small is-text"
                    onClick={() => {
                      setEditingId(null);
                      setNewSlug('');
                    }}
                  >
                    Cancel
                  </button>
                ) : (
                  <button
                    className="button is-small"
                    onClick={() => {
                      setEditingId(url.id);
                      setNewSlug(url.slug);
                    }}
                  >
                    Edit
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