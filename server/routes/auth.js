const express = require('express');
const router = express.Router();

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const user = require("../models/user");

passport.use(new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (_email, password, done) => {
        try {
            const myUser = await user.findOne({ email: _email });
            if (!myUser)
                return done(null, false, { message: 'Incorrect email address.' });

            const isPasswordMatch = await myUser.comparePassword(password);
            if (isPasswordMatch)
                return done(null, myUser);
            else
                return done(null, false, { message: 'Incorrect password.' })
        } catch (error) {
            return done(error);
        }
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});


passport.deserializeUser(async (id, done) => {
    try {
        const myUser = await user.findById(id);
        done(null, myUser);
    } catch (err) {
        done(err, null);
    }
});

router.get('/signup', async (req, res) => {
    try {
        res.render('signup');
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const myUser = await user.findOne({ email: data.email});
        if (myUser){
            res.render('signup', {
                message: `User Alerady Exists`
            });
        }
        const newUser = new user(data);
        const savedUser = await newUser.save();
        res.render('signin', {
            message: `Hi ${data.firstName} ${data.lastName}, your account is created. Please login`
        });
    } catch (err) {
        console.log('Error Ocurred while saving user data');
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/signin', async (req, res) => {
    try {
        res.render('signin');
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/signin', passport.authenticate('local', { sesson: false, failureRedirect: '/login-failure' }), function (req, res) {
    try {
        res.redirect('/dashboard')
    } catch (err) {
        console.log('Error Ocurred while logging in');
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/login-failure', async (req, res) => {
    try {
        res.render('signin', {
            message: `Incorrect Credentials`
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error);
            res.send('Error loggin out');
        } else {
            res.redirect('/')
        }
    })
});



module.exports = router;
