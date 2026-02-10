const User = require('../models/User');

async function getProfile(req, res) {
  try {
    const id = req.params.id || req.query.id;
    if (!id) return res.status(400).json({ message: 'Missing user id' });

    const user = await User.findById(id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    delete user.password;
    return res.json(user);
  } catch (err) {
    console.error('getProfile error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function updateProfile(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: 'Missing user id' });

    const updates = (({ name, skills, bio, location }) => ({ name, skills, bio, location }))(req.body);

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    delete user.password;
    return res.json(user);
  } catch (err) {
    console.error('updateProfile error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getProfile, updateProfile };
