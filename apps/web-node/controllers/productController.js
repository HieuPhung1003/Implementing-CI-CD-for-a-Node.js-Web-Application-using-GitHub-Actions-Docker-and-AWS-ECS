// controllers/productController.js
const ProductModel = require('../models/productModel');

// Hiển thị danh sách kho
exports.showInventory = (req, res) => {
    const products = ProductModel.getAll();
    res.render('inventory.hbs', {
        pageTitle: 'Quản lý Kho hàng',
        products: products,
        hasProducts: products.length > 0
    });
};

// Hiển thị form nhập hàng
exports.showAddForm = (req, res) => {
    res.render('add-product.hbs', {
        pageTitle: 'Nhập hàng mới'
    });
};

// Xử lý thêm hàng mới
exports.addProduct = (req, res) => {
    ProductModel.add(req.body);
    res.redirect('/inventory');
};

// Hiển thị form sửa hàng
exports.showEditForm = (req, res) => {
    const product = ProductModel.getById(req.params.id);
    if (!product) {
        return res.redirect('/inventory');
    }
    res.render('edit-product.hbs', {
        pageTitle: 'Chỉnh sửa sản phẩm',
        product: product
    });
};

// Xử lý cập nhật hàng
exports.updateProduct = (req, res) => {
    ProductModel.update(req.params.id, req.body);
    res.redirect('/inventory');
};

// Xử lý xóa hàng
exports.deleteProduct = (req, res) => {
    ProductModel.delete(req.params.id);
    res.redirect('/inventory');
};