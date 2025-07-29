import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext.jsx';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, userData, setUserData } = useContext(AppContext);

  const logout = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/auth/logout',
        {},
        { withCredentials: true }
      );
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        toast.success('Logged out successfully');
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/auth/verify-otp',
        {},
        { withCredentials: true }
      );

      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 z-50'>
      <img
        src={assets.logo}
        alt='Logo'
        className='w-28 sm:w-32 cursor-pointer'
        onClick={() => navigate('/')}
      />

      {userData ? (
        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-gray-800 text-white relative group cursor-pointer'>
          {userData.name[0].toUpperCase()}
          <div className='absolute hidden group-hover:block top-0 right-0 z-10 rounded text-black pt-10'>
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm shadow-md rounded-md w-40'>
              {!userData.isAccountVerified && (
                <li
                  className='py-2 px-4 hover:bg-gray-200 cursor-pointer'
                  onClick={sendVerificationOtp}
                >
                  Verify Email
                </li>
              )}
              <li
                className='py-2 px-4 hover:bg-gray-200 cursor-pointer'
                onClick={logout}
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'
        >
          Login <img src={assets.arrow_icon} alt='Arrow Icon' />
        </button>
      )}
    </div>
  );
};

export default Navbar;
