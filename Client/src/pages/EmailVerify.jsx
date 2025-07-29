import React, { useRef } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useContext,useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

function EmailVerify() {
  const navigate = useNavigate();
  const inputRef = useRef([]);

  const { userData, getUserData, backendUrl, isLoggedIn } = useContext(AppContext);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    } else if (value === '' && index > 0 && e.nativeEvent.inputType === 'deleteContentBackward') {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.trim().slice(0, 6).split('');
    pasteArray.forEach((char, index) => {
      if (inputRef.current[index]) {
        inputRef.current[index].value = char;
        if (index < inputRef.current.length - 1) {
          inputRef.current[index + 1].focus();
        }
      }
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const otp = inputRef.current.map(input => input.value).join('');

    try {
      const { data } = await axios.post(
        backendUrl + '/api/auth/verify-account',
        { otp },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) {
      navigate('/');
    }
  }, [isLoggedIn, userData, navigate]);
  

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 relative'>
      <img
        src={assets.logo}
        alt='Logo'
        onClick={() => navigate('/')}
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
      />

      <form
        className='bg-slate-900 p-8 rounded-lg shadow-lg w-full max-w-md text-sm'
        onSubmit={onSubmitHandler}
      >
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter 6-digit code sent to your Email ID</p>

        <div className='flex justify-center gap-2 mb-8' onPaste={handlePaste}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                key={index}
                type='text'
                maxLength='1'
                ref={(el) => (inputRef.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                className='w-10 sm:w-12 h-12 bg-[#333A5C] text-white text-xl text-center rounded-md outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition-transform hover:scale-105'
                required
              />
            ))}
        </div>

        <button
          type='submit'
          className='w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'
        >
          Verify Email
        </button>
      </form>
    </div>
  );
}

export default EmailVerify;
