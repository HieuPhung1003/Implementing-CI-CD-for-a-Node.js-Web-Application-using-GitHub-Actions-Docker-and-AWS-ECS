// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.get('/', (req, res) => res.send('Hello World from CI/CD pipeline!'));

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// app.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// web mới
app.get('/', (req, res) => {
  res.send(`
    <h1>Website mới đã được triển khai tự động!</h1>
    <p>Triển khai CI/CD với Docker + AWS ECS thành công 🎉</p>
  `);
});

// thêm route phụ
app.get('/about', (req, res) => {
  res.send('Đây là trang About của web mới.');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
