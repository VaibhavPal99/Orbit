
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Signin } from './pages/Signin'
import FileUpload from './pages/Upload'




function App(){


    return <div>
        <BrowserRouter>
        <Routes>
            <Route path='/signin' element={<Signin></Signin>}></Route>
            <Route path='/upload' element={<FileUpload></FileUpload>}></Route>
        </Routes>
        </BrowserRouter>
    </div>
}

export default App