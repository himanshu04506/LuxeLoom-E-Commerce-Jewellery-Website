const bcrypt = require('bcryptjs');

// Pre-hashed passwords for default demo accounts
const DEFAULT_USER_HASH = bcrypt.hashSync('user123', 10);
const DEFAULT_ADMIN_HASH = bcrypt.hashSync('admin123', 10);

const FALLBACK_USERS = [
  {
    _id: 'mock_user_id_002',
    name: 'Ananya Sharma',
    email: 'user@luxeloom.com',
    phone: '+91 9123456789',
    password: DEFAULT_USER_HASH,
    role: 'USER',
    isActive: true,
    createdAt: new Date(),
  },
  {
    _id: 'mock_admin_id_001',
    name: 'LuxeLoom Admin',
    email: 'admin@luxeloom.com',
    phone: '+91 9876543210',
    password: DEFAULT_ADMIN_HASH,
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date(),
  },
];

const findUserByEmailOrPhone = (identifier) => {
  if (!identifier) return null;
  const lower = identifier.toLowerCase().trim();
  return FALLBACK_USERS.find(
    (u) => u.email.toLowerCase() === lower || u.phone === identifier.trim()
  );
};

const findUserById = (id) => {
  if (!id) return null;
  return FALLBACK_USERS.find((u) => u._id === id || String(u._id) === String(id));
};

const createFallbackUser = async ({ name, email, phone, password, role = 'USER' }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    _id: `mock_user_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    password: hashedPassword,
    role,
    isActive: true,
    createdAt: new Date(),
  };
  FALLBACK_USERS.push(newUser);
  return newUser;
};

const compareUserPassword = async (enteredPassword, storedPassword) => {
  if (!storedPassword || !enteredPassword) return false;
  if (enteredPassword === storedPassword) return true;
  try {
    return await bcrypt.compare(enteredPassword, storedPassword);
  } catch (err) {
    return false;
  }
};

module.exports = {
  FALLBACK_USERS,
  findUserByEmailOrPhone,
  findUserById,
  createFallbackUser,
  compareUserPassword,
};
