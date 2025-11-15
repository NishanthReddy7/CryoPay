import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { ethers } from 'ethers';
import User from '../models/User.js';
import { encryptPrivateKey } from '../utils/encryption.js';
import { sendOtpEmail } from '../utils/email.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * Generate JWT token
 */
const generateToken = (userId, expiresIn = '7d') => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
};

/**
 * POST /api/auth/signup-custodial
 * Create a new custodial user account
 */
router.post('/signup-custodial', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Generate Ethereum wallet
    const wallet = ethers.Wallet.createRandom();
    const walletAddress = wallet.address;
    const privateKey = wallet.privateKey;

    // Encrypt private key
    const encryptedPrivateKey = encryptPrivateKey(privateKey);

    // Create user
    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      passwordHash,
      walletAddress,
      encryptedPrivateKey,
      accountType: 'custodial'
    });

    await user.save();

    // Generate initial token (not final - user needs to setup 2FA)
    const token = generateToken(user._id, '1h'); // Short-lived token for setup

    res.status(201).json({
      message: 'Account created successfully',
      walletAddress,
      privateKey, // ONLY sent once during signup
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

/**
 * POST /api/auth/login-custodial
 * Login with email and password
 */
router.post('/login-custodial', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if 2FA is enabled
    if (user.isTwoFactorEnabled) {
      return res.status(200).json({
        message: '2FA required',
        requires2FA: true,
        email: user.email
      });
    }

    // Generate token (if 2FA not enabled - should be rare)
    const token = generateToken(user._id);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

/**
 * POST /api/auth/generate-2fa
 * Generate 2FA secret and QR code
 */
router.post('/generate-2fa', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate 2FA secret
    const secret = speakeasy.generateSecret({
      name: `CryoPay (${user.email})`,
      issuer: 'CryoPay'
    });

    // Store temporary secret (will be confirmed after verification)
    user.twoFactorSecret = secret.base32;
    await user.save();

    // Generate QR code URL
    const otpauthUrl = secret.otpauth_url;

    res.status(200).json({
      message: '2FA secret generated',
      otpauth_url: otpauthUrl
    });
  } catch (error) {
    console.error('Generate 2FA error:', error);
    res.status(500).json({ message: 'Server error generating 2FA' });
  }
});

/**
 * POST /api/auth/verify-2fa
 * Verify 2FA token and enable 2FA
 */
router.post('/verify-2fa', async (req, res) => {
  try {
    const { email, token: userToken } = req.body;

    if (!email || !userToken) {
      return res.status(400).json({ message: 'Email and token are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA not set up. Generate secret first.' });
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: userToken,
      window: 2 // Allow 2 time steps before/after for clock skew
    });

    if (!verified) {
      return res.status(401).json({ message: 'Invalid 2FA token' });
    }

    // Enable 2FA
    user.isTwoFactorEnabled = true;
    await user.save();

    // Generate final token
    const token = generateToken(user._id);

    res.status(200).json({
      message: '2FA enabled successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    console.error('Verify 2FA error:', error);
    res.status(500).json({ message: 'Server error verifying 2FA' });
  }
});

/**
 * POST /api/auth/send-email-otp
 * Send OTP via email
 */
router.post('/send-email-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    // Store hash and expiry (10 minutes)
    user.emailOtpHash = otpHash;
    user.emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send email
    await sendOtpEmail(email, otp);

    res.status(200).json({
      message: 'OTP sent to email'
    });
  } catch (error) {
    console.error('Send email OTP error:', error);
    res.status(500).json({ message: 'Server error sending OTP' });
  }
});

/**
 * POST /api/auth/verify-email-otp
 * Verify email OTP and enable 2FA
 */
router.post('/verify-email-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP exists and not expired
    if (!user.emailOtpHash || !user.emailOtpExpiry) {
      return res.status(400).json({ message: 'No OTP found. Request a new one.' });
    }

    if (user.emailOtpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Request a new one.' });
    }

    // Verify OTP
    const isValid = await bcrypt.compare(otp, user.emailOtpHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Enable 2FA and clear OTP
    user.isTwoFactorEnabled = true;
    user.emailOtpHash = null;
    user.emailOtpExpiry = null;
    await user.save();

    // Generate final token
    const token = generateToken(user._id);

    res.status(200).json({
      message: '2FA enabled successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    console.error('Verify email OTP error:', error);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
});

/**
 * GET /api/auth/profile
 * Get user profile (protected route)
 */
router.get('/profile', verifyToken, async (req, res) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        walletAddress: req.user.walletAddress,
        accountType: req.user.accountType,
        isTwoFactorEnabled: req.user.isTwoFactorEnabled
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

export default router;