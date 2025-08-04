import { useEffect, useRef, useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';
import { api } from './api.js';
import axios from 'axios';
import './otpVerification.css';
import { MailCheck } from 'lucide-react';

const OtpVerification = ({ email, username }) => {
  const { signUp, setActive } = useSignUp();
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [status, setStatus] = useState('');
  const inputs = useRef([]);
 useEffect(()=>
{
  inputs.current[0].focus();
},[]);
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };
const handleKeyDown = (index, e) => {
  if (e.key === 'Backspace') {
    if (otp[index] === '') {
      if (index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputs.current[index - 1].focus();
      }
    } else {

      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  }
};


  const handleVerify = async () => {
    const otpCode = otp.join('');

    if (otp.some((digit) => digit === '')) {
      alert('Please fill all OTP fields.');
      return;
    }

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: otpCode });
      setStatus('Sign up successful!');
      alert('Sign up successful!');
      await setActive({ session: result.createdSessionId });

      const userId = signUp.user.id;

      await axios.post(`${api}/signup`, {
        email,
        username,
        clerkId: userId,
      });

    } catch (err) {
      setStatus('Incorrect OTP. Please try again.');
      alert('Incorrect OTP');
      setOtp(Array(6).fill(''));
      inputs.current[0].focus();
    }
  };

  const resendOtp = async () => {
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      alert('OTP sent to your mail');
    } catch (err) {
      console.error('Resend error', err);
    }
  };

  useEffect(() => {
    resendOtp();
  }, []);

  return (
    <div className="otp-container">
      <MailCheck color='orange' size={100} style={{marginTop:125,marginLeft:710,marginBottom:0}}/>
      <h3 style={{color:"orange",textAlign:'center',fontSize:30,marginTop:0}}>OTP Verification</h3>
      <p className='otp-msg'>One Time Password(OTP) has been sent via email to<br/><span style={{color:"orange",textAlign:"center",fontWeight:"bold",marginTop:6}}>somepallisivanagalakshmi@gmail.com</span></p>
      <div className="otp-inputs">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            ref={(el) => (inputs.current[idx] = el)}
            className="otp-box"
            type="text"
          />
        ))}
      </div>
      <p onClick={resendOtp} className="resend-otp">
        Didn't receive the OTP? <span className="resend">Resend OTP</span>
      </p>
      <button onClick={handleVerify} className='verify-btn'>Verify OTP</button>
      <p className="status-text">{status}</p>
    </div>
  );
};

export default OtpVerification;
