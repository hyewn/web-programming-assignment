const crypto = require('crypto');
const ITER = 120000, KEYLEN = 64, DIGEST = 'sha512';

exports.hash = (password, salt = crypto.randomBytes(16)) => new Promise((resolve, reject) => {
  crypto.pbkdf2(password, salt, ITER, KEYLEN, DIGEST, (err, key) => {
    if (err) return reject(err);
    resolve({ hash: key, salt, iter: ITER });
  });
});

exports.verify = (password, salt, iter, hash) => new Promise((resolve, reject) => {
  crypto.pbkdf2(password, salt, iter, hash.length, DIGEST, (err, key) => {
    if (err) return reject(err);
    resolve(crypto.timingSafeEqual(key, hash));
  });
});
