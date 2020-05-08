require('dotenv').config()

const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//const { SECRET_KEY } = require('../../config')
const User = require('../../models/User');
const { validateRegisterInput, validateLoginInput} = require('../../utils/validators');

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
    );
}

module.exports = {
    Query: {
        async getUsers() {
            try {
                const users = await User.find();
                return users
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutataion: {
        //parent, args, context, info
        async register(
            _, 
            {registerInput: {username, email, password, confirmPassword}}
        ){
            //1. Validate user data
            //2. Make sure user doesn't already exist
            //3. Hash password and create auth token

            const {errors, valid} = validateRegisterInput(username, email, password, confirmPassword)
            if (!valid){
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({username});
            if (user) {
                throw new UserInputError('Username is taken', {
                    errros: {
                        username: 'This username is taken'
                    }
                })
            }

            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            })

            const res = await newUser.save();
            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        },

        async login (_, {username, password}){
            
            const {errors, valid} = validateLoginInput(username, password);
            if (!valid){
                throw new UserInputError('Errors', {errors});
            }
            
            // await keyword is v important
            // would cause error "Illegal arguments: string, undefined"
            const user = await User.findOne({ username });
            if (!user){
                errors.general = 'User not found';
                throw new UserInputError('User not found', {errors});
            }
            
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch){
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', {errors});
            }
            
            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id,
                token
            };
        }
    }
}