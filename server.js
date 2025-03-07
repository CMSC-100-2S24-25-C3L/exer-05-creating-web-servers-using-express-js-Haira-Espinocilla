//imports
import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/add-book', (req, res) => {
    const { bookName, isbn, author, yearPublished } = req.body;
    if (!bookName || !isbn || !author || !yearPublished) {
        return res.json({ success: false, message: "error: missings info" });
    }

    const entry = `${bookName}, ${isbn}, ${author}, ${yearPublished}\n`;
    try {
        fs.appendFileSync("books.txt", entry, 'utf8'); 
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.get('/find-by-isbn-author', (req, res) => {
    const { isbn, author } = req.query;
    try {
        const data = fs.readFileSync("books.txt", 'utf8'); 
        const books = data.split('\n').filter(line => {
            const [name, bookIsbn, bookAuthor, year] = line.split(',').map(x => x.trim());
            return bookIsbn === isbn && bookAuthor.toLowerCase() === author.toLowerCase();
        });
        res.json({ books });
    } catch (error) {
        res.json({ books: [], error: error.message });
    }
});

app.get('/find-by-author', (req, res) => {
    try {
        const authorQuery = req.query.author?.toLowerCase();
        if (!authorQuery) {
            return res.status(400).json({ books: [], error: "no author" });
        }

        const data = fs.readFileSync("books.txt", 'utf8');
        const allBooks = data.split('\n').filter(line => {
            const [name, bookIsbn, bookAuthor, year] = line.split(',').map(x => x.trim());
            return bookAuthor?.toLowerCase() === authorQuery;
        });

        res.json({ books: allBooks });
    } catch (error) {
        res.status(500).json({ books: [], error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server started at port 3000');
});
