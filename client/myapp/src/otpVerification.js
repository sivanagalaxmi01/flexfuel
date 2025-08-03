
import { useEffect, useRef, useState } from 'react';
import { useSignUp } from '@clerk/clerk-react';


const OtpVerification = ({ email, username }) => {
  const { signUp, setActive } = useSignUp();
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [status, setStatus] = useState('');
  const inputs = useRef([]);


  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }

 
    if (newOtp.every((digit) => digit !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleVerify = async (otpCode) => {
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: otpCode });
      setStatus('Sign up successful!');
      alert('Sign up successful!');

      await setActive({ session: result.createdSessionId });

  
      const userId = signUp.user.id;
      await fetch('/api/sendUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, clerkId: userId }),
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
      <h3>Enter OTP</h3>
      <div className="otp-inputs">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            ref={(el) => (inputs.current[idx] = el)}
            className="otp-box"
            type="text"
          />
        ))}
      </div>
      <button onClick={resendOtp} className="resend-otp">Resend OTP</button>
      <p className="status-text">{status}</p>
    </div>
  );
};

export default OtpVerification;
