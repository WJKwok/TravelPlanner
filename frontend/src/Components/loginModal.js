import React, {useState, useContext} from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../Store/AuthContext';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function LoginModal({loginOpen, handleClose}) {

    const { authState, dispatch } = useContext(AuthContext)

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const [loginUser] = useMutation(LOGIN_MUTATION, {
        update(_, result){
            console.log("login success: ", result.data.login);
            dispatch({ type: 'LOGIN', payload: result.data.login});
            handleClose();
            //setLoginInput(initialLoginInputState);
        },
        onError(err){
            console.log(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: {
            username,
            password
        }
    })

    return (
        <Dialog open={loginOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Login</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To subscribe to this website, please enter your email address here. We will send updates
                    occasionally.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id='username'
                    label="Username"
                    fullWidth
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    id='password' 
                    fullWidth
                    value={password} 
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button 
                    id='login-button'
                    onClick={loginUser}
                    color="primary"
                >
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    );
}

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

export default LoginModal