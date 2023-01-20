import React from 'react';
import { Button } from "@mui/material";
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useStateValue } from '../ContextApi/StateProvider'
import { actionTypes } from '../ContextApi/reducer'
import '../styles/Login.css';

const Login = () => {

    const [state, dispatch] = useStateValue();
    console.log(state);

    const signIn = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                dispatch({
                    type: actionTypes.SET_USER,
                    user: result.user,
                })
            })
            .catch((err) => {
                alert(err.message)
            })
    }

    return (
        <div className="login">
            <div className="login__container">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Facebook_Messenger_logo_2020.svg/2048px-Facebook_Messenger_logo_2020.svg.png"
                    alt="Messenger Logo"
                />
                <div className="login__text">
                    <h1>Sign in to Messenger</h1>
                </div>
                <Button
                    onClick={signIn}
                >
                    Sign in with Google
                </Button>
            </div>
        </div>
    )
}

export default Login