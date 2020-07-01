import React, {useState, useContext} from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../Store/AuthContext';

import { makeStyles } from '@material-ui/core/styles';
import {TextField, Button} from '@material-ui/core/';

const useStyles = makeStyles({
    root:{
        margin: "auto",
        width: "50%",
        paddingTop: 100,
    },
    textField: {
        marginBottom: 13,
    },
    submitButton: {
        float: "right",
    },
})

function Login() {

    const { authState, dispatch } = useContext(AuthContext)
    // const [errors, setErrors] = useState({})
    const classes = useStyles();

    const initialLoginInputState = {
        username: "",
        password: ""
    }
    const [loginInput, setLoginInput] = useState(initialLoginInputState)

    const [loginUser] = useMutation(LOGIN_MUTATION, {
        update(_, result){
            console.log("login success: ", result.data.login);
            dispatch({ type: 'LOGIN', payload: result.data.login});
            //setLoginInput(initialLoginInputState);
        },
        onError(err){
            console.log(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: loginInput
    })

    console.log('authState: ', authState);

    return (
        <div className={classes.root}>
            <div>
                <TextField
                    className={classes.textField}
                    id='username'
                    label="Username"
                    fullWidth
                    value={loginInput.username} 
                    onChange={(e) => setLoginInput({...loginInput, [e.target.id]: e.target.value})}
                    variant="outlined"
                />
            </div>
            <div>
                <TextField 
                    className={classes.textField}
                    id='password' 
                    fullWidth
                    value={loginInput.password} 
                    label="Password" 
                    variant="outlined" 
                    onChange={(e) => setLoginInput({...loginInput, [e.target.id]: e.target.value})}
                />
            </div>
            <Button 
                id='login-button'
                variant="outlined" 
                className={classes.submitButton}
                onClick={loginUser}
                size="large"
            >
                Login
            </Button>
        </div>
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

export default Login;