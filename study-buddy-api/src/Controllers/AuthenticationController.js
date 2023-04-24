'use strict';

import { success, clientError } from '../Constants/HttpCodeConstants.js';
import validateLogin  from '../Validators/LoginValidator.js';
import validateRegistration  from '../Validators/RegistrationValidator.js';
import operationOutcome from '../Constants/OperationOutcomeConstants.js';


export const isLoggedIn = (req, res, next) => {
    req.session.authorized 
        ? res.redirect('/dummy')
        : res.status(success.OK)
            .json({ 
                message: 'Hi there scholar, let\'s see those credentials!', 
                isLoggedIn: false
            });
}

export const login = async (req, res, next) => {
    try {
        const user = await validateLogin(req);
        if (!user) {
            throw Error('message: Login Attempt Failed');
        }

        res.status(success.ACCEPTED)
            .json({
                message: 'Login successful!',
                user: user
            });
    } catch (error) {
        console.error('%s \n code: %d', error, clientError.UNAUTHORIZED);

        res.status(clientError.BAD_REQUEST)
            .json({message: 'Login Attempt Failed!'});
    }

    next();
}

export const logout = (req, res) => {
    req.session.destroy();
    res.redirect('login');
}

export const register = async (req, res, next) => {
    try {
        const status = await validateRegistration(req);
        if (status !== operationOutcome.SUCCESS) {
            throw Error('message: Registration Attempt Failed');
        }

        res.status(success.ACCEPTED)
            .json({message: 'Registration successful!'});
    } catch (error) {
        console.error('%s \n code: %d', error, clientError.UNAUTHORIZED);

        res.status(clientError.BAD_REQUEST)
            .json({message: 'Registration Attempt Failed!'});
    }

    next();
}
