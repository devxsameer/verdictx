import crypto from 'node:crypto';

export const CryptoUtil = {
  hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  },

  generateToken() {
    return crypto.randomBytes(64).toString('hex');
  },

  generateFamilyId() {
    return crypto.randomUUID();
  },
};
