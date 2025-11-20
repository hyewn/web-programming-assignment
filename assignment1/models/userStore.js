const users = [];
let lastLoggedInId = null;

exports.addUser = (id, pw) => users.push({ id, pw });
exports.existsId = (id) => users.some(u => u.id === id);
exports.matchUser = (id, pw) => users.find(u => u.id === id && u.pw === pw);
exports.setLastLogin = (id) => { lastLoggedInId = id; };
exports.getLastLogin = () => lastLoggedInId;