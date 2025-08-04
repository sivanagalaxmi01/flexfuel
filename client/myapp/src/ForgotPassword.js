import { useSignIn } from '@clerk/clerk-react';
import { useState } from 'react';
import {Mail , UserLock} from 'lucide-react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const { signIn } = useSignIn();
  const [email, setEmail] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleRequestCode = async () => {
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email,
      });
      setCodeSent(true);
      alert('Verification code sent to your email.');
    } catch (err) {
      alert('Error sending code: ' + err.errors?.[0]?.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: newPassword,
      });
      alert('Password reset successful. Please sign in again.');
    } catch (err) {
      alert('Error resetting password: ' + err.errors?.[0]?.message);
    }
  };

  return (
    <div>
      {!codeSent ? (
        <>
        <div className='forgotpass-container'>
             <UserLock color='orange' className='user-lock' size={100}/>
          <h3 className='forgot-pass'>Forgot your Password?</h3>
          <p className='f-p-txt'>Enter the email address associated with your account.</p>
          <Mail color='grey' style={{position:"relative",left:35,top:33}}/>
          <input
            type="email"
            placeholder="john@gmail.com"
            className='email-field'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button onClick={handleRequestCode}className='reset-code'>Send Reset Code</button>
          <p className='b-to-signin'>Back to Signin</p>
        </div>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter the code"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Reset Password</button>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
