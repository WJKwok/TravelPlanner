import React, { useState, useContext, useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import { GoogleLogin } from 'react-google-login';

import { AuthContext } from '../Store/AuthContext';
import { SnackBarContext } from '../Store/SnackBarContext';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

function AuthModal({ registerOpen, setRegisterOpen, navgiateTo }) {
	const { authState, dispatch } = useContext(AuthContext);
	const { setSnackMessage } = useContext(SnackBarContext);

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const [loginBoolean, setLoginBoolean] = useState(true);

	const clearFields = () => {
		setUsername('');
		setEmail('');
		setPassword('');
		setConfirmPassword('');
	};

	const [googleAuthUser] = useMutation(GOOGLE_AUTH, {
		onCompleted({ authGoogle }) {
			console.log(authGoogle);
			dispatch({ type: 'LOGIN', payload: authGoogle });
			clearFields();
			setRegisterOpen(false);
			setSnackMessage({ text: 'Login Success!', code: 'Confirm' });
			navgiateTo();
		},
		onError(err) {
			console.log(err.graphQLErrors);
		},
	});

	const [registerUser] = useMutation(REGISTER_USER, {
		onCompleted({ register }) {
			console.log(register);
			dispatch({ type: 'LOGIN', payload: register });
			clearFields();
			setRegisterOpen(false);
			setSnackMessage({ text: 'Registration Success!', code: 'Confirm' });
			navgiateTo();
		},
		onError(err) {
			console.log(err.graphQLErrors);
		},
		variables: {
			username,
			email,
			password,
			confirmPassword,
		},
	});

	const [loginUser] = useMutation(LOGIN_MUTATION, {
		onCompleted({ login }) {
			console.log('login success: ', login);
			dispatch({ type: 'LOGIN', payload: login });
			clearFields();
			setRegisterOpen(false);
			setSnackMessage({ text: 'Login Success!', code: 'Confirm' });
			navgiateTo();
		},
		onError(err) {
			console.log(err);
		},
		variables: {
			username,
			password,
		},
	});

	const handleLoginOrRegister = () => {
		loginBoolean ? loginUser() : registerUser();
	};

	const responseGoogle = (response) => {
		googleAuthUser({ variables: { idToken: response.tokenId } });
	};

	return (
		<Dialog
			data-testid="auth-modal"
			maxWidth="xs"
			open={registerOpen}
			onClose={() => setRegisterOpen(false)}
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle id="form-dialog-title">
				{loginBoolean ? 'Login' : 'Register'}
			</DialogTitle>
			<GoogleLogin
				clientId="1086730577702-datk765t1m7g2u26p2egevn7fj9ngic1.apps.googleusercontent.com"
				buttonText={loginBoolean ? 'Login' : 'Register'}
				onSuccess={responseGoogle}
				onFailure={responseGoogle}
				cookiePolicy={'single_host_origin'}
			/>
			<DialogContent>
				{/* <DialogContentText>
                    To subscribe to this website, please enter your email address here. We will send updates
                    occasionally.
                </DialogContentText> */}
				<TextField
					autoFocus
					margin="dense"
					id="username"
					label="Username"
					fullWidth
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				{loginBoolean ? null : (
					<TextField
						fullWidth
						margin="dense"
						id="email"
						label="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				)}
				<TextField
					id="password"
					fullWidth
					margin="dense"
					value={password}
					label="Password"
					onChange={(e) => setPassword(e.target.value)}
				/>
				{loginBoolean ? null : (
					<TextField
						fullWidth
						margin="dense"
						id="confirmPassword"
						label="Confirm Password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				)}
			</DialogContent>
			<DialogActions>
				<Button id="enterUser" color="primary" onClick={handleLoginOrRegister}>
					{loginBoolean ? 'Login' : 'Register'}
				</Button>
				<Button color="primary" onClick={() => setLoginBoolean(!loginBoolean)}>
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
	) {
		register(
			registerInput: {
				username: $username
				email: $email
				password: $password
				confirmPassword: $confirmPassword
			}
		) {
			id
			email
			accessToken
			refreshToken
			username
			createdAt
		}
	}
`;

const LOGIN_MUTATION = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			id
			email
			username
			createdAt
			accessToken
			refreshToken
		}
	}
`;

const GOOGLE_AUTH = gql`
	mutation authGoogle($idToken: String!) {
		authGoogle(input: { idToken: $idToken }) {
			id
			email
			username
			createdAt
			accessToken
			refreshToken
		}
	}
`;

export default AuthModal;
