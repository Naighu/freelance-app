
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    try {
        
        const { name, email, password, user_type } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });
        
        const user = await User.create({ name, email, password,user_type });
       return res.status(201).json({ id: user.id, name: user.name, email: user.email, user_type: user.user_type, token: generateToken(user.id) });
    } catch (error) {
        console.log(error.message);

        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
      
        
        const user = await User.findOne({ email: email });
        
        if (user && (await bcrypt.compare(password, user.password))) {
            res.status(200).json({ id: user.id, name: user.name, email: user.email,user_type: user.user_type, token: generateToken(user.id) });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        user_type: user.user_type
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, password } = req.body;
        user.name = name || user.name;
        if(password){
            const salt = await bcrypt.genSalt(10);
            const saltedPassword = await bcrypt.hash(password, salt);
             user.password =saltedPassword;
        }

        const updatedUser = await user.save();
        res.json({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };
