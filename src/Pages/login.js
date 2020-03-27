import React, {useState, useContext} from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../Store/AuthContext';

function Login() {

    const { authState, dispatch } = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    const initialLoginInputState = {
        username: "",
        password: ""
    }
    const [loginInput, setLoginInput] = useState(initialLoginInputState)

    const [loginUser] = useMutation(LOGIN_MUTATION, {
        update(_, result){
            console.log("login success: ", result.data.login);
            dispatch({ type: 'LOGIN', payload: result.data.login});
            setLoginInput(initialLoginInputState);
        },
        onError(err){
            console.log(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: loginInput
    })

    console.log('authState: ', authState);

    return (
        <div>
            <h1>Login</h1>
            <p>Username</p>
            <input id='username' value={loginInput.username} 
            onChange={(e) => setLoginInput({...loginInput, [e.target.id]: e.target.value})}/>
            <p>Password</p>
            <input id='password' value={loginInput.password} 
            onChange={(e) => setLoginInput({...loginInput, [e.target.id]: e.target.value})}/>
            <button onClick={loginUser}>Login</button>
            <button onClick={() => dispatch({type:"LOGOUT"})}>Logout</button>
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