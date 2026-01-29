// controllers/authController.js
const UserModel = require('../models/userModel');

// --- Middleware ---

exports.requireAuth = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

// --- View Rendering ---

exports.getLogin = (req, res) => {
    res.render('login.hbs', {
        pageTitle: 'Đăng nhập',
        error: req.query.error === 'invalid' ? 'Sai tên đăng nhập hoặc mật khẩu.' : null
    });
};

exports.getRegister = (req, res) => {
    res.render('register.hbs', {
        pageTitle: 'Đăng ký',
        error: req.query.error === 'exists' ? 'Tên đăng nhập đã tồn tại.' : null
    });
};

// --- Form Handling ---

exports.postLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render('login.hbs', { error: 'Vui lòng nhập đầy đủ thông tin.' });
    }

    const user = UserModel.findByUsername(username);

    if (!user) {
        return res.redirect('/login?error=invalid');
    }

    const isMatch = await UserModel.validatePassword(user, password);

    if (!isMatch) {
        return res.redirect('/login?error=invalid');
    }

    // Success
    req.session.userId = user.id;
    req.session.username = user.username;
    res.redirect('/');
};

exports.postRegister = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.render('register.hbs', { error: 'Vui lòng nhập đầy đủ thông tin.' });
    }

    const existingUser = UserModel.findByUsername(username);

    if (existingUser) {
        return res.redirect('/register?error=exists');
    }

    await UserModel.create(username, password);

    // Auto login after register? Or redirect to login? Let's redirect to login for clarity.
    res.redirect('/login?msg=registered');
};

exports.logout = (req, res) => {
    req.session = null;
    res.redirect('/login');
};
