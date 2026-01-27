// models/productModel.js

// Dữ liệu mẫu ban đầu
let products = [
    { id: 1, name: "Laptop Dell XPS", category: "Máy tính", quantity: 5, price: 25000000 },
    { id: 2, name: "Chuột Logitech", category: "Phụ kiện", quantity: 50, price: 300000 },
    { id: 3, name: "Bàn phím cơ", category: "Phụ kiện", quantity: 15, price: 1200000 }
];

module.exports = {
    getAll: () => products,
    
    getById: (id) => products.find(p => p.id === parseInt(id)),
    
    add: (product) => {
        const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        const newProduct = {
            id: newId,
            name: product.name,
            category: product.category,
            quantity: parseInt(product.quantity),
            price: parseInt(product.price)
        };
        products.push(newProduct);
    },
    
    update: (id, updatedData) => {
        const index = products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            products[index] = {
                id: parseInt(id),
                name: updatedData.name,
                category: updatedData.category,
                quantity: parseInt(updatedData.quantity),
                price: parseInt(updatedData.price)
            };
        }
    },
    
    delete: (id) => {
        products = products.filter(p => p.id !== parseInt(id));
    }
};