const fs = require('fs');
const path = require('path');

// ===== GET DATA FILE PATH =====
const getDataFile = (username) => {
    const filePath = path.join(__dirname, `../data/products_${username}.json`);
    
    return filePath;
};

// ===== LOAD DATA =====
const loadData = (username) => {
    try {
        

        const filePath = getDataFile(username);

        if (fs.existsSync(filePath)) {
            

            const rawData = fs.readFileSync(filePath, 'utf8');
            

            const parsed = JSON.parse(rawData);
            
            return parsed;
        } else {
            console.warn(' File NOT FOUND ❌');
            return [];
        }
    } catch (err) {
        console.error(' LOAD ERROR ❌:', err);
        return [];
    }
};

// ===== SAVE DATA =====
const saveData = (username, products) => {
    try {
        

        const filePath = getDataFile(username);

        fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

        console.log(' Save success ✅');
    } catch (err) {
        console.error(' SAVE ERROR ❌:', err);
    }
};

// ===== EXPORT METHODS =====
module.exports = {

    // GET ALL
    getAll: (username) => {
        return loadData(username);
    },

    // GET BY ID
    getById: (username, id) => {
        

        const products = loadData(username);

        const found = products.find(p => p.id === parseInt(id));

        

        return found;
    },

    // ADD PRODUCT
    add: (username, product) => {
        

        const products = loadData(username);

        const newId =
            products.length > 0
                ? Math.max(...products.map(p => p.id)) + 1
                : 1;


        const newProduct = {
            id: newId,
            name: product.name,
            category: product.category,
            quantity: parseInt(product.quantity),
            price: parseInt(product.price),
            supplier: product.supplier || "N/A",
            minStock: parseInt(product.minStock) || 5
        };


        products.push(newProduct);

        saveData(username, products);
    },

    // UPDATE PRODUCT
    update: (username, id, updatedData) => {
        

        const products = loadData(username);

        const index = products.findIndex(p => p.id === parseInt(id));
        console.log(' found index:', index);

        if (index !== -1) {
            products[index] = {
                ...products[index],
                name: updatedData.name,
                category: updatedData.category,
                quantity: parseInt(updatedData.quantity),
                price: parseInt(updatedData.price),
                supplier: updatedData.supplier || products[index].supplier,
                minStock: parseInt(updatedData.minStock) || products[index].minStock
            };


            saveData(username, products);
        }
    },

    // UPDATE STOCK
    updateStock: (username, id, change) => {
        

        const products = loadData(username);

        const product = products.find(p => p.id === parseInt(id));

        if (product) {

            product.quantity += parseInt(change);


            saveData(username, products);

            return product;
        }

        return null;
    },

    // DELETE PRODUCT
    delete: (username, id) => {
        console.log('\n[DELETE PRODUCT]');
        console.log(' id:', id);

        let products = loadData(username);

        const before = products.length;

        products = products.filter(p => p.id !== parseInt(id));

        ;

        saveData(username, products);
    },

    // SEARCH
    search: (username, query) => {
        

        const products = loadData(username);

        if (!query) return products;

        const lowerQuery = query.toLowerCase();

        const result = products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery) ||
            (p.supplier && p.supplier.toLowerCase().includes(lowerQuery))
        );

        console.log(' search result:', result);

        return result;
    },

    // GET STATS
    getStats: (username) => {

        const products = loadData(username);
        const stats = {
            totalProducts: products.length,
            totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
            lowStockCount: products.filter(p => p.quantity < (p.minStock || 5)).length
        };


        return stats;
    }
};
