import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Derives a key from the master key using PBKDF2
 */
function deriveKey(masterKey, salt) {
  return crypto.pbkdf2Sync(
    Buffer.from(masterKey, 'hex'),
    salt,
    100000,
    KEY_LENGTH,
    'sha512'
  );
}

/**
 * Encrypts a private key
 * @param {string} privateKey - The private key to encrypt
 * @returns {string} - Encrypted data in format: salt:iv:encrypted:tag
 */
export function encryptPrivateKey(privateKey) {
  const masterKey = process.env.ENCRYPTION_KEY;
  
  // Generate random salt and IV
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  
  // Derive key from master key
  const key = deriveKey(masterKey, salt);
  
  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  // Encrypt
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Get authentication tag
  const tag = cipher.getAuthTag();
  
  // Return format: salt:iv:encrypted:tag
  return [
    salt.toString('hex'),
    iv.toString('hex'),
    encrypted,
    tag.toString('hex')
  ].join(':');
}

/**
 * Decrypts a private key
 * @param {string} encryptedData - Encrypted data in format: salt:iv:encrypted:tag
 * @returns {string} - Decrypted private key
 */
export function decryptPrivateKey(encryptedData) {
  const masterKey = process.env.ENCRYPTION_KEY;
  
  // Split the encrypted data
  const [saltHex, ivHex, encrypted, tagHex] = encryptedData.split(':');
  
  const salt = Buffer.from(saltHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  
  // Derive key
  const key = deriveKey(masterKey, salt);
  
  // Create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);
  
  // Decrypt
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}