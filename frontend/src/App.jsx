import {BrowserRouter,Route,Routes} from 'react-router-dom'
import './App.css'

import Signin from './pages/Signin'
import Signup from './pages/Signup'
import LandingPage from './pages/LandingPage'
// import Sheet from './pages/Sheet'
import Test from './pages/Test'
import ProtectedRoute from './components/ProtectedRoute'
import {v4 as uuid} from 'uuid'

function App() {

  const sheetId = uuid()

  return (
    <>
      <BrowserRouter>
        <Routes>
        <Route path='/' element={<LandingPage />}/>
        {/* <Route path="/sheet" element={<Sheet />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route
            path="/testing/:sheetId"
            element={
              <ProtectedRoute>
                <Test />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
