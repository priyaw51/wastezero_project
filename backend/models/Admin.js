const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // store hashed password (hashing handled at registration/login layer)
  password: { type: String, required: true },
  role: { type: String, enum: ['admin'], default: 'admin' },
  // optional list of permissions/flags
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// omit password from JSON responses
AdminSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('Admin', AdminSchema);
