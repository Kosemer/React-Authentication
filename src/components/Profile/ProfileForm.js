import { useContext, useRef } from 'react';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext)

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=AIzaSyBKk_eJ_13TicWZ44iEDGBlh73PodxyV3Y', {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: enteredNewPassword,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application.json'
      }
    })
  }
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input ref={newPasswordInputRef} type='password' minLength='6' id='new-password' /> {/* A 'minLength' tulajdonsággal vigyázni kell, mert ki lehet kapcsolni a Dev Tools-ból!!! */}
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
