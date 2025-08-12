;
  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.status(401).json({ error: "Unauthorized: No active user session" });
    }
};
module.exports = isAuthenticated
