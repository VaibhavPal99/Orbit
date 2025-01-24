
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom'
import {Auth} from './pages/Auth';
import { Home } from './pages/Home';
import { UserPage } from './pages/UserPage';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';
import Header from './component/Header';
import { PostPage } from './pages/PostPage';
import FollowerAndFollowingPage from './pages/FollowerAndFollowingPage';
import { useEffect } from 'react';
import './index.css'; // or the appropriate path to your CSS file




const App = () => {
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/auth');  // Redirect to login page if no token
    }
  }, [navigate]);

  return (
    <div>
       
        <Header></Header>
      <Routes>
            <Route path="/auth" element={<Auth></Auth>}> </Route>
            <Route path="/" element={<Home></Home>}></Route>
            <Route path="/:username" element= { user ? 
                (
                  <>
                    <UserPage />
                  </>
                ) : (
                  <Navigate to={"/auth"} />
                )
              }
            />
            <Route
              path="/:username/post/:pid"
              element={user ? <PostPage /> : <Navigate to={"/auth"} />}
            />
            <Route
              path={`/:username/followings`}
              element={
                user ? <FollowerAndFollowingPage /> : <Navigate to="/auth" />
              }
            />
            <Route
              path={`/:username/followers`}
              element={
                user ? <FollowerAndFollowingPage /> : <Navigate to="/auth" />
              }
            />
      </Routes>
        
    </div>
  )
}

export default App;