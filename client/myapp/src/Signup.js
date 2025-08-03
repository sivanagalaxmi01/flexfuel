import {
  useSignUp,
  useSignIn,
} from '@clerk/clerk-react';
import { useState } from 'react';
import Turnstile from 'react-turnstile';
import './Signup.css';
import { Mail, Lock, User, CircleCheck } from 'lucide-react';
import OtpVerification from './otpVerification.js';

const Signup = () => {
  const { signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();
  const [showOtp, setShowOtp] = useState(false);


  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
  });

  const [focusedField, setFocusedField] = useState('');
  const [verifiedTurnstile, setVerifiedTurnstile] = useState(false);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValid = () =>
    form.email.includes('@') &&
    form.password.length >= 6 &&
    form.username &&
    verifiedTurnstile;
const handleSignUp = async () => {
  try {
    await signUp.create({
      emailAddress: form.email,
      username: form.username,
      password: form.password,
    });

    await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
    alert('OTP sent to your mail');
    setShowOtp(true);
  } catch (err) {
    console.error(err.errors || err);
  }
};

  const handleGoogleSignIn = async () => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/dashboard',
      });
    } catch (err) {
      console.error('Google sign-in failed', err);
    }
  };

  const getHint = (field) => {
    if (focusedField !== field) return null;

    const hints = {
      email: {
        valid: form.email.includes('@gmail.com') ,
        text: 'Must be a valid email address',
      },
      username: {
        valid: form.username.trim().length >= 3,
        text: 'Username must be atleast 3 characters(No spaces)',
      },
      password: {
        valid: form.password.length >= 6,
        text: 'Password must be at least 6 characters',
      },
    };

    const { valid, text } = hints[field];
    return (
      <div className="hint-message">
        {valid ? (
          <span className="valid-msg" style={{color:"green"}}>
            <CircleCheck size={16} color='#111' style={{fill:"green",position:"relative",top:2}} /> Valid {field}
          </span>
        ) : (
          <span>{text}</span>
        )}
      </div>
    );
  };

  return showOtp ? (
  <OtpVerification email={form.email} username={form.username} />
) : (
  <div className="signup-form">
       <p style={{color:"#ff8c00",textAlign:"center",fontWeight:"bold",fontSize:25,marginBottom:0}}>FLEXFUEL</p>
      <p style={{color:"gray",textAlign:"center",display:"inline",marginTop:0,marginBottom:0,fontSize:12}}>Track your Fitness Journey</p>
      <Mail className="icons" size={20} />
      <input
        name="email"
        placeholder="john@gmail.com"
        value={form.email}
        onChange={handleInput}
        onFocus={() => setFocusedField('email')}
        onBlur={() => setFocusedField('')}
        className="signup-field"
      />
      {<p className='hint'>{getHint('email')}</p>}
      <User className="icons" size={20} />
      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleInput}
        onFocus={() => setFocusedField('username')}
        onBlur={() => setFocusedField('')}
        className="signup-field"
      />
      {<p className='hint'>{getHint('username')}</p>}

      <Lock className="icons" size={20} />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleInput}
        onFocus={() => setFocusedField('password')}
        onBlur={() => setFocusedField('')}
        className="signup-field"
      />
      {<p className='hint'>{getHint('password')}</p>}

      <Turnstile
        className="turnstile"
        sitekey="0x4AAAAAABn5gp7FeaPheKyn"
        onSuccess={() => setVerifiedTurnstile(true)}
          style={{ transform: 'scaleX(1.15)', transformOrigin: '0 0' }}

      />
         

      <button
        onClick={handleSignUp}
        disabled={!isValid()}
        className="signup-btn"
      >
        Create Account
      </button>
      <p style={{color:"grey",marginTop:3,fontSize:14}}>Already have an account?<span className='signin-text'style={{color:'#ff8c00',marginLeft:2}}>Signin</span></p>

      <div className="or-separator">
        <hr />
        <span>OR</span>
        <hr />
      </div>

      <button onClick={handleGoogleSignIn} className="google-button">
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="google-icon"
        />
        Continue with Google
      </button>
  </div>
);


  
};

export default Signup;