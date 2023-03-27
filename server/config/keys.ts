import * as crypto from 'crypto';
const key = crypto.randomBytes(64).toString('hex').toString();

module.exports = {
  jwt: key,
};
