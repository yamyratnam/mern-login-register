const User = require('../models/user')
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken');

const test = (req, res) => {
    res.json('test is working')
}


// register endpoint
const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        //check if name is entered
        if(!name) {
            return res.json({
                error: 'name is required'
            })
        };
        //check is password is good
        if(!password || password.length < 6){
            return res.json({
                error: 'password is required and should be at least 6 characters long'
            })
        };
        //check email
        const exist = await User.findOne({email});
        if(exist) {
            return res.json({
                error: 'email is already taken'
            })
        }

        const hashedPassword = await hashPassword(password)
        //create user in db
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        })

        return res.json(user)
    } catch (error) {
        console.log(error)
    }
};

// login endpoint 
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ error: 'No user found' });
        }

        const match = await comparePassword(password, user.password);
        if (match) {
            jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('token', token);
                res.json(user);
            });
        } else {
            res.json({ error: 'Passwords do not match' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getProfile = (req, res) => {
    const {token} = req.cookies
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if(err) throw err;
            res.json(user)
        })
    }else{
        res.json(null)
    }
}


// Logout endpoint
const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
}

// secret answer endpoint
const updateSecretAnswer = async (req, res) => {
    try {
        const { name, secretAnswer } = req.body;

        const updatedUser = await User.findOneAndUpdate({ name }, { secretAnswer }, { new: true });

        if (!updatedUser) {
            return res.json({ error: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating secret answer:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//Forgot password endpoint
const forgotPassword = async (req, res) => {
    try {
        const { email, secretAnswer } = req.body;

        const user = await User.findOne({ email });
        if(!user){
            return res.json({
                error: 'User not found'
            });
        }
        if(user.secretAnswer !== secretAnswer) {
            return res.json({
                error: 'Incorrect secret answer'
            });
        }

        const resetToken = jwt.sign({ email }, process.env.RESET_SECRET, {expiresIn: '1h'});

        res.json({resetToken});
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

//reset password endpoint
const resetPassword = async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        // Verify the reset token
        jwt.verify(resetToken, process.env.RESET_SECRET, async (err, decoded) => {
            if (err) {
                return res.json({ error: 'Invalid or expired reset token' });
            }

            // Update the password
            const hashedPassword = await hashPassword(newPassword);
            await User.findOneAndUpdate({ email }, { password: hashedPassword });

            res.json({ success: 'Password reset successful. You can now log in with your new password.' });
        });
    } catch (error) {
        console.error('Error in Reset Password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


module.exports = {
    test,
    registerUser,
    loginUser,
    getProfile,
    logoutUser,
    forgotPassword,
    resetPassword,
    updateSecretAnswer
};