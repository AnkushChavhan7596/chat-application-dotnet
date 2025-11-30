// Signup.tsx
import React, { useState } from 'react';
import "./Signup.css";
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please enter all the details");
      return;
    }

    try {
      const result = await authService.register({ displayName: name, email, password });
      console.log(result.message);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className='signup-wrapper'>
      <form onSubmit={handleSignup} className='signup-form'>
        <div className="input-field">
          <label>Full Name</label>
          <input name='name' type="text" placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="input-field">
          <label>Email</label>
          <input name='email' type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="input-field">
          <label>Password</label>
          <input name='password' type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && <p style={{ color: 'red', margin: '10px 0', textAlign: 'center' }}>{error}</p>}
        <button className='signup-button' type='submit'>Signup</button>
      </form>

      <p className='bottom'>Already have an account? <Link to='/login'>Login</Link></p>
    </div>
  );
};

export default Signup;
