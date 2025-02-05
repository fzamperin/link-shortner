import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginUser } from '../services/api';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login,} = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {
      email: '',
      password: '',
      general: ''
    };

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = 'Please enter a valid email address';
    }

    if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { accessToken } = await loginUser({ email, password });
      login(accessToken);
      navigate('/dashboard');
    } catch (error) {
      setFormErrors(prev => ({
        ...prev,
        general: 'Invalid credentials. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="box">
      {formErrors.general && (
        <div className="notification is-danger is-light">
          {formErrors.general}
        </div>
      )}

      <div className="field">
        <label className="label">Email</label>
        <div className="control has-icons-left">
          <input
            className={`input ${formErrors.email ? 'is-danger' : ''}`}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-envelope" />
          </span>
        </div>
        {formErrors.email && (
          <p className="help is-danger">{formErrors.email}</p>
        )}
      </div>

      <div className="field">
        <label className="label">Password</label>
        <div className="control has-icons-left">
          <input
            className={`input ${formErrors.password ? 'is-danger' : ''}`}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-lock" />
          </span>
        </div>
        {formErrors.password && (
          <p className="help is-danger">{formErrors.password}</p>
        )}
      </div>

      <div className="field">
        <div className="control">
          <button
            type="submit"
            className={`button is-primary is-fullwidth ${
              isSubmitting ? 'is-loading' : ''
            }`}
            disabled={isSubmitting}
          >
            Sign In
          </button>
        </div>
      </div>
    </form>
  );
};