const jwt = require('jsonwebtoken');
const userService = require('../services/user.service');
require('dotenv').config();

exports.signup = async (req, res) => {
    try {
        console.log("==============in auth controller===========");
        console.log(req.body);
        
        const result = await userService.createUser(req.body);

        let statusCode;
        let response;
        
        if (result.error) {
            statusCode = 403;
            response = result.error;
        } else {
            statusCode = 201;
            response = result.user;
        }

        // Send the response and return to avoid multiple responses
        return res.status(statusCode).send(response);

    } catch (err) {
        console.log(err);
        // Ensure return after sending error response
        return res.status(500).send({ error: err.message });
    }
}

exports.signin = async (req, res) => {
    try {
        const result = await userService.verifyUser(req.body);

        let statusCode;
        let response;

        if (result.error) {
            statusCode = 401;
            response = result.error;
        } else {
            statusCode = 200;  // Use 200 for successful sign-in (201 is for resource creation)
            console.log(req.body, process.env.JWT_SECRET_KEY);

            // Ensure the JWT_SECRET_KEY is set properly
            if (!process.env.JWT_SECRET_KEY) {
                throw new Error('JWT secret key not set');
            }

            // Generate the token
            const token = jwt.sign(
                { email: req.body.email },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1h' } // Optionally set token expiration
            );

            response = {
                message: "User validated",
                token: token,
                userData: result.userData
            };
        }

        // Send the response and return to avoid multiple responses
        return res.status(statusCode).send(response);

    } catch (err) {
        console.log(err);
        // Ensure return after sending error response
        return res.status(500).send({ error: err.message });
    }
}
