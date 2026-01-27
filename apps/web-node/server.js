const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const bodyParser = require('body-parser');

// Import Controller
const productController = require('./controllers/productController');

const port = process.env.PORT || 3000;
var app = express();

// --- CẤU HÌNH ---
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// Middleware ghi log (giữ lại từ code cũ của bạn)
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) console.log('Unable to append to server log.');
    });
    next();
});

app.use(express.static(__dirname + '/public'));
// Middleware để đọc dữ liệu từ form POST
app.use(bodyParser.urlencoded({ extended: false }));

// Helper HBS
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => text.toUpperCase());


// --- ROUTES (ĐƯỜNG DẪN) ---

// 1. Trang chủ
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Trang chủ',
        welcomeMessage: 'Chào mừng đến với Hệ thống Quản lý Kho hàng'
    });
});

// 2. Trang giới thiệu (Giữ lại code cũ)
app.get('/about', (req, res) => {
    res.render('about.hbs', { pageTitle: 'Giới thiệu' });
});

// 3. CÁC ROUTE QUẢN LÝ KHO (Inventory)

// Xem danh sách
app.get('/inventory', productController.showInventory);

// Nhập hàng (Hiển thị form & Xử lý form)
app.get('/inventory/add', productController.showAddForm);
app.post('/inventory/add', productController.addProduct);

// Sửa hàng (Hiển thị form & Xử lý form)
app.get('/inventory/edit/:id', productController.showEditForm);
app.post('/inventory/edit/:id', productController.updateProduct);

// Xóa hàng
app.get('/inventory/delete/:id', productController.deleteProduct);

// Khởi chạy server
app.listen(port, () => {
    console.log(`Server đang chạy tại: http://localhost:${port}`);
});