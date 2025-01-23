
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import {Auth} from './pages/Auth';
import { Home } from './pages/Home';
import { UserPage } from './pages/UserPage';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';
import Header from './component/Header';
import { PostPage } from './pages/PostPage';


const App = () => {
  const user = useRecoilValue(userAtom);

  return (
    <div>
        <BrowserRouter>
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
      </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App;