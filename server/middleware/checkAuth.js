exports.isLoggedIn = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.redirect('/signin');
    }
}