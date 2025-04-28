import dbConnect from '../utils/dbConnect.js'; // Adjust path if needed
import User from '../models/user.model.js';     // Adjust path if needed
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
        return res.status(400).json({ message: 'Password is required' });
    }

    await dbConnect();

    const userInfo = await User.findOne({ email });
    if (!userInfo || userInfo.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = jwt.sign(
        { user: userInfo },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '36000m' }
    );
    const refreshToken = jwt.sign(
        { user: userInfo },
        process.env.REFRESH_TOKEN_SECRET
    );

    return res.json({
        error: false,
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: {
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
            isReady: userInfo.isReady
        }
    });
}
