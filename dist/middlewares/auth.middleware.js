import jwt from "jsonwebtoken";
export const verifyToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Access denied. Token not provided"
        });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "The token format is invalid."
        });
    }
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET environment variable is not defined");
        }
        const decoded = jwt.verify(token, secret);
        if (!decoded.id) {
            return res.status(403).json({
                success: false,
                message: "The token doesn't have a valid user ID."
            });
        }
        req.userId = decoded.id.toString();
        req.token = token;
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired."
            });
        }
        return res.status(403).json({
            success: false,
            message: "Token invalid."
        });
    }
};
//# sourceMappingURL=auth.middleware.js.map