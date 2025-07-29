import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useState, useRef, useContext } from 'react';
import axios from 'axios';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const inputRef = useRef([]);
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length > 0 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1].focus();
    } else if (
      value === '' &&
      index > 0 &&
      e.nativeEvent.inputType === 'deleteContentBackward'
    ) {
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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-otp', { email });
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtp = (e) => {
  e.preventDefault();
  const otpArray = inputRef.current.filter(el => el !== null).map(el => el.value);
  if (otpArray.length < 6 || otpArray.some(val => val.trim() === '')) {
    toast.error("Please enter all 6 digits");
    return;
  }
  const joinedOtp = otpArray.join('');
  setOtp(joinedOtp);
  setIsOtpSubmitted(true);
};

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {
        email,
        otp,
        newPassword,
      });
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) navigate('/login');
    } catch (error) {
      toast.error(error.message);
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

      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className='bg-slate-900 p-8 rounded-lg shadow-lg w-full max-w-md text-sm'
        >
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your registered email</p>

          <div className='flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] mb-6'>
            <img src={assets.mail_icon} alt='Mail Icon' className='w-4 h-4' />
            <input
              type='email'
              placeholder='Email ID'
              className='bg-transparent outline-none text-white w-full'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type='submit'
            className='w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'
          >
            Send OTP
          </button>
        </form>
      )}

      {isEmailSent && !isOtpSubmitted && (
        <form
          onSubmit={onSubmitOtp}
          className='bg-slate-900 p-8 rounded-lg shadow-lg w-full max-w-md text-sm'
        >
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter 6-digit code sent to your Email ID</p>

          <div className='flex justify-center gap-2 mb-8' onPaste={handlePaste}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={`otp-${index}`}
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
      )}

      {isEmailSent && isOtpSubmitted && (
        <form
          onSubmit={onSubmitNewPassword}
          className='bg-slate-900 p-8 rounded-lg shadow-lg w-full max-w-md text-sm'
        >
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Set New Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your new password</p>

          <div className='flex items-center mb-8 gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt='Lock Icon' />
            <input
              type='password'
              className='bg-transparent outline-none w-full text-white'
              placeholder='New Password'
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              required
            />
          </div>

          <button
            type='submit'
            className='w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
