const User = require('../models/User');
const bcrypt = require('bcryptjs');

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

    const updates = (({ name, skills, bio, location, address }) => ({ name, skills, bio, location, address }))(req.body);

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    delete user.password;
    return res.json(user);
  } catch (err) {
    console.error('updateProfile error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

async function changePassword(req, res) {
  try {
    const id = req.params.id;
    const { currentPassword, newPassword } = req.body;

    if (!id) return res.status(400).json({ message: 'Missing user id' });
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Missing password fields' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('changePassword error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getProfile, updateProfile, changePassword };
