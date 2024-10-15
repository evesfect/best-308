// backend/routes/auth.ts

import { Router } from 'express';
const router = Router();

// Dummy login route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Replace this with actual authentication logic (e.g., check against database)
  if (email === 'admin@example.com' && password === 'password') {
    return res.status(200).json({ message: 'Login successful' });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

export default router;
