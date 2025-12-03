// Login.tsx
import React, { useState } from 'react';
import "./Login.css";
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { saveUserToLocal } from '../../utils/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // handle login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const result = await authService.login({ email, password });
      // 1. save user to local
      saveUserToLocal(result);

      // 2. update redux state
      dispatch(setUser({
        id: result.id,
        email: result.email,
        displayName: result.displayName,
        roles: result.roles,
        token: result.token
      }));

      // redirect to home
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className='login-wrapper'>
      <form onSubmit={handleLogin} className='login-form'>
        <div className="input-field">
          <label>Email</label>
          <input
            name='email'
            type="text"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-field">
          <label>Password</label>
          <input
            name='password'
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p style={{ color: 'red', margin: '10px 0', textAlign: 'center' }}>{error}</p>}

        <button className='login-button' type='submit'>Login</button>
      </form>

      <p className='bottom'>Don't have an account? <Link to='/signup'>Signup</Link></p>
    </div>
  )
}

export default Login;
