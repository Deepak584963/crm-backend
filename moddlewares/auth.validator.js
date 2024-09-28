const authService = require("../services/auth.service");
const userService = require("../services/user.service");

const isUserAuthenticated = async (req, res, next) => {
    const token = req.headers['x-access-token'];

    // If no token is provided, return an error and stop further execution
    if (!token) {
        return res.status(401).send({
            message: "JWT token is not provided"
        });
    }

    // Verify the provided token
    const isVerifiedToken = authService.verfiyJwtToken(token);

    // If the token is invalid, return an error
    if (!isVerifiedToken || isVerifiedToken === "invalid signature") {
        return res.status(401).send({
            message: "JWT token is invalid"
        });
    }

    // If token is valid, try to get user info
    try {
        const userInfo = await userService.getUserByEmail({ email: isVerifiedToken.email });
        if (!userInfo) {
            return res.status(401).send({
                message: "Email is invalid"
            });
        }

        // Attach user info to the request object
        req.user = userInfo;
        next();  // Proceed to the next middleware
    } catch (err) {
        return res.status(401).send({
            message: "User data is invalid"
        });
    }
};

const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({
            message: "User is invalid"
        });
    }

    if (req.user.userType !== "admin") {
        return res.status(401).send({
            message: "User doesn't have required permissions"
        });
    }

    // User is admin
    next();
};

const isAdminOrUserSelf = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({
            message: "User is invalid"
        });
    }

    if (req.user.userType !== "admin" && !req.user._id.equals(req.body.updates._id)) {
        return res.status(401).send({
            message: "User doesn't have required permissions"
        });
    }

    // User is either admin or it's their own data
    next();
};

const isAdminOrEngineer = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({
            message: "User is invalid"
        });
    }

    if (req.user.userType !== "admin" && req.user.userType !== "engineer") {
        return res.status(401).send({
            message: "User doesn't have required permissions"
        });
    }

    // User is either admin or engineer
    next();
};

module.exports = { isUserAuthenticated, isAdmin, isAdminOrEngineer, isAdminOrUserSelf };
