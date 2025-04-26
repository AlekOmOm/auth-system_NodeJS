export function isAuthenticated(req, res, next) {
    if (!res.session || !req.session.userId) {
        return res.status(401).json({ message: "Authentication required" });
    }

    next()
}

export function hasRole(role) {
    return (req, res, next) => {
        isAuthenticated(req, res, next);

        if (req.session.role !== role && req.session.role !== 'admin') {
            return res.status(401).json({ message: "Insufficient permissions" });
        }

        next();
    };
}


// ---- export ----

const auth = {
    hasRole,
    isAuthenticated,
};

export default auth;
