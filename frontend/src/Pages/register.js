import React, { useState, useContext } from 'react';
import { useMutation, gql} from '@apollo/client';

import { AuthContext } from '../Store/AuthContext'

import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        margin: "auto",
        width: "50%",
        paddingTop: 100,
    },
    textField: {
        marginBottom: 13,
    },
    submitButton:{
        float: "right",
    }
})

function Register() {

    const { dispatch } = useContext(AuthContext)
    const classes = useStyles()

    const initialRegisterInput = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    const [registerInput, setRegisterInput] = useState(initialRegisterInput);
    const [registerUser] = useMutation(REGISTER_USER,{
        update(_, result){
            console.log(result.data.register);
            dispatch({type:"LOGIN", payload:result.data.register});
        },
        onError(err){
            console.log(err);
        },
        variables: registerInput
    })

    const inputChangeHandler = (e) => {
        setRegisterInput({
            ...registerInput,
            [e.target.id]: e.target.value
        })
    }
    
    return (
        <div className={classes.root}>
            <TextField
                fullWidth
                className={classes.textField}
                variant="outlined" 
                id='username'
                label="Username"  
                value={registerInput.username} 
                onChange={inputChangeHandler}
            />
            <TextField
                fullWidth
                className={classes.textField}
                variant="outlined" 
                id='email' 
                label="Email" 
                value={registerInput.email} 
                onChange={inputChangeHandler}
            />
            <TextField
                fullWidth
                className={classes.textField}
                variant="outlined" 
                id='password' 
                label="Password"
                value={registerInput.password} 
                onChange={inputChangeHandler}
            />
            <TextField
                fullWidth
                className={classes.textField}
                variant="outlined" 
                id='confirmPassword' 
                label="Confirm Password"
                value={registerInput.confirmPassword} 
                onChange={inputChangeHandler}
            />
            <Button
                size="large"
                variant="outlined" 
                className={classes.submitButton}
                onClick={registerUser}
            >
                Register
            </Button>
        </div>
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

export default Register;