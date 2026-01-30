const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const productController = require('./controllers/productController');
const authController = require('./controllers/authController');

const app = express();

// --- CONFIGURATION ---
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Session Configuration
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'], // Secret keys for signing cookies
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// Middleware to pass User info to all views
app.use((req, res, next) => {
    res.locals.user = req.session.userId ? { username: req.session.username } : null;
    next();
});

// --- HELPERS ---
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => text.toUpperCase());
hbs.registerHelper('quantity_gt_zero', (quantity) => quantity > 0);
hbs.registerHelper('json', (context) => JSON.stringify(context)); // Helper to dump JSON

// --- ROUTES (ĐƯỜNG DẪN) ---

// 1. PUBLIC ROUTES
app.get('/', productController.getHome);
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'Giới thiệu',
        year: new Date().getFullYear()
    });
});

// Auth Routes
app.get('/login', authController.getLogin);
app.post('/login', authController.postLogin);
app.get('/register', authController.getRegister);
app.post('/register', authController.postRegister);
app.get('/logout', authController.logout);

// 2. PROTECTED ROUTES (Inventory Management)
// Apply middleware to all inventory and history routes
app.use('/inventory', authController.requireAuth);
app.use('/history', authController.requireAuth);

// Xem danh sách và tìm kiếm
app.get('/inventory', productController.showInventory);

// Xuất dữ liệu CSV
app.get('/inventory/export', productController.exportData);

// Nhập hàng (Hiển thị form & Xử lý form)
app.get('/inventory/add', productController.showAddForm);
app.post('/inventory/add', productController.addProduct);

// Cập nhật kho nhanh (Stock In/Out)
app.post('/inventory/stock/:id', productController.updateStock);

// Sửa hàng (Hiển thị form & Xử lý form)
app.get('/inventory/edit/:id', productController.showEditForm);
app.post('/inventory/edit/:id', productController.updateProduct);

// Xóa hàng
app.get('/inventory/delete/:id', productController.deleteProduct);

// Xem lịch sử
app.get('/history', productController.getHistory);

// Khởi chạy server
const port = 3000;
app.listen(port, () => {
    console.log(`Server đang chạy tại: http://localhost:${port}`);
});