// controllers/productController.js
const ProductModel = require('../models/productModel');
const TransactionModel = require('../models/transactionModel');

// Hiển thị trang chủ với Dashboard Stats
exports.getHome = (req, res) => {
    // If user is guest, show generic welcome. If logged in, show stats.
    if (!req.session.userId) {
        return res.render('home.hbs', {
            pageTitle: 'Trang chủ',
            welcomeMessage: 'Chào mừng đến với Hệ thống Quản lý Kho hàng'
        });
    }

    const { username } = req.session;
 

    const stats = ProductModel.getStats(username);
    const products = ProductModel.getAll(username);

    const productChart = {};
    products.forEach(p => {
        productChart[p.name] = p.quantity;
    });

    let productInventory = {};
    
    if (products && products.length > 0) {
        productInventory = products.reduce((acc, product) => {
            if (product.category && product.quantity !== undefined) {
                acc[product.category] = (acc[product.category] || 0) + product.quantity;
            } else {
                console.warn(`[getHome] Product missing category or quantity:`, product);
            }
            return acc;
        }, {});
    } else {
        console.warn('[getHome] No products found, chart will be empty');
    }

 

    res.render('home.hbs', {
                stats,
                products,
                productChartJSON: JSON.stringify(productChart),
                user: username
});
};

// Hiển thị danh sách hàng hóa (có tìm kiếm)
exports.showInventory = (req, res) => {
    const { username } = req.session;
    const query = req.query.q;
    const products = ProductModel.search(username, query);

    // Map msg code to text
    const messages = {
        'added': 'Thêm sản phẩm thành công!',
        'updated': 'Cập nhật sản phẩm thành công!',
        'deleted': 'Xóa sản phẩm thành công!'
    };
    const message = messages[req.query.msg];

    res.render('inventory.hbs', {
        pageTitle: 'Danh sách hàng hóa',
        products: products,
        hasProducts: products.length > 0,
        searchQuery: query,
        message: message
    });
};

// Hiển thị form thêm mới
exports.showAddForm = (req, res) => {
    res.render('add-product.hbs', {
        pageTitle: 'Thêm sản phẩm mới'
    });
};

// Xử lý thêm mới
exports.addProduct = (req, res) => {
    const { username } = req.session;
    ProductModel.add(username, req.body);

    // Log transaction
    TransactionModel.add(username, {
        action: 'IMPORT',
        productId: 'NEW', // Or get the ID if synchronous
        productName: req.body.name,
        quantityChange: parseInt(req.body.quantity),
        note: 'Nhập hàng mới'
    });

    res.redirect('/inventory?msg=added');
};

// Hiển thị form sửa
exports.showEditForm = (req, res) => {
    const { username } = req.session;
    const product = ProductModel.getById(username, req.params.id);
    res.render('edit-product.hbs', {
        pageTitle: 'Sửa sản phẩm',
        product: product
    });
};

// Xử lý cập nhật
exports.updateProduct = (req, res) => {
    const { username } = req.session;
    ProductModel.update(username, req.params.id, req.body);
    res.redirect('/inventory?msg=updated');
};

// Xử lý xóa hàng
exports.deleteProduct = (req, res) => {
    const { username } = req.session;
    // Log transaction before delete
    const product = ProductModel.getById(username, req.params.id);
    if (product) {
        TransactionModel.add(username, {
            action: 'DELETE',
            productId: product.id,
            productName: product.name,
            quantityChange: -product.quantity,
            note: 'Xóa sản phẩm'
        });
    }
    ProductModel.delete(username, req.params.id);
    res.redirect('/inventory?msg=deleted');
};

// Xử lý Thay đổi kho nhanh (Stock In/Out)
exports.updateStock = (req, res) => {
    const { id } = req.params;
    const { action } = req.body; // 'in' or 'out'
    const change = action === 'in' ? 1 : -1;
    const { username } = req.session;

    const product = ProductModel.updateStock(username, id, change);

    if (product) {
        TransactionModel.add(username, {
            action: action === 'in' ? 'IMPORT' : 'EXPORT',
            productId: product.id,
            productName: product.name,
            quantityChange: change,
            note: action === 'in' ? 'Nhập nhanh' : 'Xuất nhanh'
        });
        res.redirect('/inventory?msg=updated');
    } else {
        res.redirect('/inventory?error=notfound');
    }
};

// Xem lịch sử giao dịch
exports.getHistory = (req, res) => {
    const { username } = req.session;

    const transactions = TransactionModel.getAll(username); // 👈 THIẾU DÒNG NÀY

    console.log("📜 History transactions:", transactions.length);

    res.render('history.hbs', {
        pageTitle: 'Lịch sử Kho hàng',
        transactions: transactions   // 👈 PHẢI TRÙNG TÊN với {{#each transactions}}
    });
};

// Xuất dữ liệu CSV
exports.exportData = (req, res) => {
    const { username } = req.session;
    const products = ProductModel.getAll(username);
    let csv = "ID,Name,Category,Quantity,Price,Supplier\n";

    products.forEach(p => {
        csv += `${p.id},"${p.name}","${p.category}",${p.quantity},${p.price},"${p.supplier}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="inventory.csv"');
    res.send(csv);
};