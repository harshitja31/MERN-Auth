import { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/auth/register', {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
           getUserData();
          navigate('/');
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 relative'>
      <img
        src={assets.logo}
        alt='Logo'
        onClick={() => navigate('/')}
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>
        <p className='text-center mb-6 text-sm'>
          {state === 'Sign Up' ? 'Create Your Account!' : 'Login to your Account!'}
        </p>

        <form className='flex flex-col gap-4' onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className='flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt='Person Icon' />
              <input
                type='text'
                className='bg-transparent outline-none w-full'
                placeholder='Full Name'
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
          )}

          <div className='flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt='Mail Icon' />
            <input
              type='email'
              className='bg-transparent outline-none w-full'
              placeholder='Email ID'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>

          <div className='flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt='Lock Icon' />
            <input
              type='password'
              className='bg-transparent outline-none w-full'
              placeholder='Password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
          </div>

          <p
            onClick={() => navigate('/reset-password')}
            className='text-right text-indigo-400 cursor-pointer hover:underline'
          >
            Forgot Password?
          </p>

          <button
            type='submit'
            className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'
          >
            {state}
          </button>

          <p className='text-center mt-4 text-gray-400'>
            {state === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}{' '}
            <span
              className='text-indigo-400 cursor-pointer hover:underline'
              onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
            >
              {state === 'Sign Up' ? 'Login' : 'Sign Up'}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
