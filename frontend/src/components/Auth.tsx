import  { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

 const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      
      const response = await axios.post('https://backend2.vaibhavpal9935.workers.dev/api/v1/user/signin', {
        username,
        password,
      });
      localStorage.clear();

      const jwt = response.data;
      console.log("Token before setting in localStorage:", jwt);
      localStorage.setItem("token", jwt);
   
      

      // Handle success
      console.log(response.data);
      navigate("/upload");
     
    } catch (err) {
      // Handle error
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        {error && <p>{error}</p>}
        <div>
          <label htmlFor="username">username</label>
          <input
            type="text"
            id="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Auth;
