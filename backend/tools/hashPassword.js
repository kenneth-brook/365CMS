const bcrypt = require('bcryptjs');

const passwordToHash = 'Seabreeze#1';

bcrypt.hash(passwordToHash, 10, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
    } else {
        console.log('Hashed Password:', hash);
    }
});