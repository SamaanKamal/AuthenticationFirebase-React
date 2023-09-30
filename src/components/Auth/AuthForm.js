import { useState,useRef,useContext } from 'react';
import {useHistory} from 'react-router-dom';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../../firebase-config';

import classes from './AuthForm.module.css';
import AuthContext from '../../store/auth-context';

const AuthForm = () => {
  const authContext = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading,setIsLoading] = useState(false);
  const history = useHistory();

  const emailRef = useRef();
  const passwordRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const onSubmitHandler = async(event) =>{
    event.preventDefault();

    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;

    let url;
    setIsLoading(true);
    if(isLogin)
    {
      url ='https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAOuvOuwKwoTNjdQ6TgaW0Q6GdfcXJ-RZg';
    }
    else
    {
      url ='https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAOuvOuwKwoTNjdQ6TgaW0Q6GdfcXJ-RZg';
      // try{
      //   const user = await createUserWithEmailAndPassword(auth,enteredEmail,enteredPassword)
      // } catch(error){
      //   console.log(error.message)
      // }
    };
    try
    {
      const response =await fetch(url,
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({
          email:enteredEmail,
          password:enteredPassword,
          returnSecureToken:true
        }) 
      })
      setIsLoading(false);
      if(!response.ok)
      {
        const data = await response.json();
        let errorMessage ='Authentication Failed!'
        if(data && data.error && data.error.message)
        {
          errorMessage=data.error.message;
        }
        console.log(data);
        throw new Error(errorMessage);
      }
      const data = await response.json();
      console.log(data);
      authContext.login(data.idToken);
      history.replace('/');
    }
    catch(error)
    {
      alert(error.message);
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={onSubmitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordRef}/>
        </div>
        <div className={classes.actions}>
          {!isLoading &&<button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Loading...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
