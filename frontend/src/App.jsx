import {BrowserRouter,Route,Routes} from 'react-router-dom'
import './App.css'

import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Appbar from './components/Appbar'


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path='/' element={<Appbar/>}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
