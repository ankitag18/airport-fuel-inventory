module.exports = function (req, res, next) {
    const sessionData = req.session;
    if (sessionData.email) {
        return next();
    }

    return res.redirect('/');
}