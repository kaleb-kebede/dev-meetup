import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  // Check if the request headers contain an Authorization header, and if it starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from header (e.g., "Bearer eyJhbGciOiJI...")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token using our JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get the user from the database using the id from the token
      // We attach the user object to the request (`req.user`) so that
      // all subsequent protected routes will have access to the logged-in user's data.
      // We exclude the password field for security.
      req.user = await User.findById(decoded.id).select('-password');

      // 4. Call next() to move on to the next piece of middleware or the route handler
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };
