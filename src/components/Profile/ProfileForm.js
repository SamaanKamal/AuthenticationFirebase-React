import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';
import { useRef,useContext } from 'react';
import {useHistory} from 'react-router-dom';

const ProfileForm = () => {
  const authConext = useContext(AuthContext);
  const idToken = authConext.token;
  const newPasswordRef = useRef();
  const history = useHistory();

  const ChangePasswordHandler =async(event)=>{
    event.preventDefault();

    let errorMesaage = 'Invalid Password';
    const enteredNewPassword = newPasswordRef.current.value;
    if(!enteredNewPassword && enteredNewPassword.length < 6)
    {
      errorMesaage ='please Enter A vaild password > 6 charcters';
    }
    const url ='https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAOuvOuwKwoTNjdQ6TgaW0Q6GdfcXJ-RZg';
    try{
      const response = await fetch(url,{
        method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body: JSON.stringify({
            idToken:idToken,
            password:enteredNewPassword,
            returnSecureToken:false
        })
      });
      if(response.ok){
        history.replace('/');
      }
      else{
        throw new Error(errorMesaage);
      }

    }
    catch(error){
      alert(error.message);
    }

  }
  return (
    <form className={classes.form}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password'  ref={newPasswordRef}/>
      </div>
      <div className={classes.action}>
        <button onClick={ChangePasswordHandler}>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
