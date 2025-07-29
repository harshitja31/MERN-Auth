import { Route, Routes } from 'react-router-dom'
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import { ToastContainer } from 'react-toastify'
import axios from 'axios';

axios.defaults.withCredentials = true;


const App = () => {
  return (
    <div className=''>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
      </Routes>
    </div>
  )
}

export default App
