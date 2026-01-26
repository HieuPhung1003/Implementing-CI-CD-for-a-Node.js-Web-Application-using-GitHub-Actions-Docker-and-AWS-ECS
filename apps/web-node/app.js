const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

let posts = [
  { id: 1, title: "Welcome to My Blog", content: "This is your first post!" }
];

// Trang chủ
app.get('/', (req, res) => {
  res.render('index', { posts });
});

// Trang tạo bài viết
app.get('/new', (req, res) => {
  res.render('new');
});

// Xử lý form tạo bài viết
app.post('/new', (req, res) => {
  const { title, content } = req.body;
  const id = posts.length + 1;
  posts.push({ id, title, content });
  res.redirect('/');
});

// Xem bài viết
app.get('/post/:id', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).send('Post not found');
  res.render('post', { post });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
