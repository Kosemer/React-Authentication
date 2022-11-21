import { useContext, useRef, useState } from 'react';
import AuthContext from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false)
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState('');

  const authCtx = useContext(AuthContext)

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true)
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;

    if(enteredEmail.value === '' || enteredPassword.trim().length < 6){
      setIsLoading(false)
      setError({
        title: "Invalid input",
        message: "Please enter a valid password (At least 6 characters).",
      });
      return;
       };
       
    let url;

    if(isLogin){
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBKk_eJ_13TicWZ44iEDGBlh73PodxyV3Y'
    }else{
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBKk_eJ_13TicWZ44iEDGBlh73PodxyV3Y'
    }

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json();
    authCtx.loginHandler(data.idToken)
    /*if(data.error.message === 'EMAIL_NOT_FOUND'){
      setError({
        title: "EMAIL_NOT_FOUND",
        message: "This email address is not registered.",
      });
      setIsLoading(false);
      return;
    }
    if(data.error.message === 'EMAIL_EXISTS'){
      setError({
        title: "EMAIL_EXISTS",
        message: "This e-mail is already registered.",
      });
      setIsLoading(false);
      return;
    }
    if(data.error.message === 'INVALID_PASSWORD'){
      setError({
        title: "INVALID_PASSWORD",
        message: "Invalid e-mail address or password!",
      });
      setIsLoading(false);
      return;
    }
    else{
    console.log(data.error.message)
    console.log(data);
    setIsLoading(false);
    setError('');
  }*/
  console.log(data);
  setIsLoading(false);
  setError('');
}

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input ref={emailRef} type='email' id='email' required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input ref={passwordRef} type='password' id='password' required />
          <div className={classes.error}>
          {error.message}
          </div>
        </div>
        {!isLoading &&<div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button> 
        </div>}
        {isLoading && <p>Loading...</p>}
      </form>
    </section>
  );
};

export default AuthForm;
