// Signup.tsx
import React, { useState } from 'react';
import "./Signup.css";
import { Link, Navigate, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignupWithEmailAndPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please enter all the details");
      return;
    }
  };

  return (
    <div className='signup-wrapper'>
      <form onSubmit={handleSignupWithEmailAndPassword} className='signup-form'>
        <div className="input-field">
          <label>Name</label>
          <input name='name' type="text" placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="input-field">
          <label>Email</label>
          <input name='email' type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="input-field">
          <label>Password</label>
          <input name='password' type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {/* <div className="input-field">
          <label>Profile Picture</label>
          <input name='profilePic' type="file" onChange={handleProfilePicChange} />
          {uploadProgress !== null && (
            <p style={{ textAlign: 'center', marginTop: '5px' }}>{`Upload Progress: ${uploadProgress.toFixed(2)}%`}</p>
          )}
        </div> */}

        {error && <p style={{ color: 'red', margin: '10px 0', textAlign: 'center' }}>{error}</p>}
        <button className='signup-button' type='submit'>Signup</button>
      </form>

      {/* <h2 className='or'>OR</h2>

      <button className='sign-in-with-google' onClick={handleGoogleSignIn}>Sign up with Google <img className='google-logo' src="/src/assets/google.png" alt="google-logo" /></button> */}

      <p className='bottom'>Already have an account? <Link to='/login'>Login</Link></p>
    </div>
  );
};

export default Signup;