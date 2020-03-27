import React, { useState, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { AuthContext } from '../Store/AuthContext'

function Register() {

    const { dispatch } = useContext(AuthContext)

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
        <div>
            <h1>Register</h1>
            <p>username</p>
            <input id='username' value={registerInput.username} onChange={inputChangeHandler}/>
            <p>email</p>
            <input id='email' value={registerInput.email} onChange={inputChangeHandler}/>
            <p>password</p>
            <input id='password' value={registerInput.password} onChange={inputChangeHandler}/>
            <p>confirm password</p>
            <input id='confirmPassword' value={registerInput.confirmPassword} onChange={inputChangeHandler}/>
            <button onClick={registerUser}>Register</button>
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