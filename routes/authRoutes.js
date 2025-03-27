const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;

router.post('/login', async (req, res) => {
    try {
      console.log("Login request received:", req.body); // ✅ Log incoming data
  
      const user = await User.findOne({ email: req.body.email });
      console.log("User found:", user); // ✅ Log user found
  
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
  
      // Validate password (assuming bcrypt)
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      console.log("Password match:", isMatch); // ✅ Log password check
  
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
  
      // Generate token (assuming JWT)
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      console.log("Generated Token:", token); // ✅ Log token
  
      res.json({ token });
  
    } catch (error) {
      console.error("Login Error:", error.message);
      res.status(500).json({ error: "Login failed" });
    }
  });