import React, {useState, useContext} from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../Store/AuthContext';
import { SnackBarContext } from '../Store/SnackBarContext'

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

function RegisterModal({registerOpen, setRegisterOpen}) {

    const { dispatch } = useContext(AuthContext)
    const { setSnackMessage } = useContext(SnackBarContext)

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [loginBoolean, setLoginBoolean] = useState(true)

    const [registerUser] = useMutation(REGISTER_USER,{
        update(_, result){
            console.log(result.data.register);
            dispatch({type:"LOGIN", payload:result.data.register});
            setRegisterOpen(false);
            setSnackMessage({text:'Registration Success!', code: 'Confirm'})
        },
        onError(err){
            console.log(err);
        },
        variables: {
            username,
            email,
            password,
            confirmPassword
        }
    })

    const [loginUser] = useMutation(LOGIN_MUTATION, {
        update(_, result){
            console.log("login success: ", result.data.login);
            dispatch({ type: 'LOGIN', payload: result.data.login});
            setRegisterOpen(false);
            setSnackMessage({text:'Login Success!', code: 'Confirm'})
        },
        onError(err){
            console.log(err.graphQLErrors[0].message);
        },
        variables: {
            username,
            password
        }
    })

    const handleLoginOrRegister = () => {
        loginBoolean ? loginUser() : registerUser()
    }

    return (
        <Dialog 
            maxWidth='xs' 
            open={registerOpen} 
            onClose={()=> setRegisterOpen(false)} 
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{loginBoolean ? 'Login' : 'Register'}</DialogTitle>
            <DialogContent>
                {/* <DialogContentText>
                    To subscribe to this website, please enter your email address here. We will send updates
                    occasionally.
                </DialogContentText> */}
                <TextField
                    autoFocus
                    margin="dense"
                    id='username'
                    label="Username"
                    fullWidth
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                />
                {loginBoolean ? null: <TextField
                    fullWidth
                    margin="dense"
                    id='email' 
                    label="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                />}
                <TextField
                    id='password' 
                    fullWidth
                    margin="dense"
                    value={password} 
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                {loginBoolean ? null: <TextField
                    fullWidth
                    margin="dense"
                    id='confirmPassword' 
                    label="Confirm Password"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />}
            </DialogContent>
            <DialogActions>
                <Button
                    color='primary'
                    onClick={handleLoginOrRegister}
                >
                    {loginBoolean ? 'Login' : 'Register'}
                </Button>
                <Button
                    color='primary'
                    onClick={() => setLoginBoolean(!loginBoolean)}
                >
                    {loginBoolean ? 'Switch to Register >' : 'Switch to Login >'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ){
        register(
            registerInput:{
            username: $username
            email: $email
            password: $password
            confirmPassword: $confirmPassword
            }
        ){
            id
            email
            token
            username
            createdAt
        }
    }
`;

const LOGIN_MUTATION = gql`
    mutation login(
        $username: String!
        $password: String!
    ){
        login(
            username: $username
            password: $password
        ){
            id
            email
            username
            createdAt
            token
        }
    }
`

export default RegisterModal