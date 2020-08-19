import React, {useState, useContext} from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useSnackbar } from 'notistack'

import { AuthContext } from '../Store/AuthContext';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function RegisterModal({registerOpen, setRegisterOpen}) {


    const { dispatch } = useContext(AuthContext)

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
 
    const { enqueueSnackbar } = useSnackbar();

    const [registerUser] = useMutation(REGISTER_USER,{
        update(_, result){
            console.log(result.data.register);
            dispatch({type:"LOGIN", payload:result.data.register});
            setRegisterOpen(false);
            enqueueSnackbar("Registration Success", {variant: 'success'})
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

    return (
        <Dialog open={registerOpen} onClose={()=> setRegisterOpen(false)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Register</DialogTitle>
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
                    fullWidth
                    margin="dense"
                    id='email' 
                    label="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    id='password' 
                    fullWidth
                    margin="dense"
                    value={password} 
                    label="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    id='confirmPassword' 
                    label="Confirm Password"
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    color='primary'
                    onClick={registerUser}
                >
                    Register
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

export default RegisterModal