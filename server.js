const express = require('express');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY created_at DESC');
    res.render('index', { books: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong loading books.');
  }
});

app.post('/add', async (req, res) => {
  const { title, author } = req.body;
  try {
    await pool.query('INSERT INTO books (title, author) VALUES ($1, $2)', [title, author]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong adding the book.');
  }
});

app.post('/toggle/:id', async (req, res) => {
  try {
    await pool.query('UPDATE books SET is_read = NOT is_read WHERE id = $1', [req.params.id]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong updating the book.');
  }
});

app.post('/delete/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM books WHERE id = $1', [req.params.id]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong deleting the book.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
