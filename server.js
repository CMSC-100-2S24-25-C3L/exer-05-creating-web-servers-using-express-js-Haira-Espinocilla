//imports
import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//to add books
app.post('/add-book', (req, res) => {
    const { bookName, isbn, author, yearPublished } = req.body;

    //to validate
    if (!bookName || !isbn || !author || !yearPublished) {
        return res.json({ success: false, message: "error: missing info" });
    }

    //format of newBook entry
    const newBook = `${bookName}, ${isbn}, ${author}, ${yearPublished}\n`;
    try {
        fs.appendFileSync("books.txt", newBook, 'utf8');  //to append new book
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message }); //if there's error
    }
});

//to find book by isbn and author
app.get('/find-by-isbn-author', (req, res) => {
    const { isbn, author } = req.query;
    try {
        const data = fs.readFileSync("books.txt", 'utf8'); // to read file
        //pang-filter (to find books that match isbn and author)
        const books = data.split('\n').filter(line => {
            const [name, bookIsbn, bookAuthor, year] = line.split(',').map(x => x.trim()); //splits each with delimiter + trim whitespace
            return bookIsbn === isbn && bookAuthor.toLowerCase() === author.toLowerCase();
        });
        res.json({ books });
    } catch (error) {
        res.json({ books: [], error: error.message }); //if there's error
    }
});

//to find books by author
app.get('/find-by-author', (req, res) => {
    try {
        const queryAuthor = req.query.author?.toLowerCase(); //extract and validate
        if (!queryAuthor) {
            return res.status(400).json({ books: [], error: "no author" });
        }

        const data = fs.readFileSync("books.txt", 'utf8'); //to read file

        //pang-filter (to find books that match the author)
        const allBooks = data.split('\n').filter(line => {
            const [name, bookIsbn, bookAuthor, year] = line.split(',').map(x => x.trim());
            return bookAuthor?.toLowerCase() === queryAuthor;
        });
        res.json({ books: allBooks });
    } catch (error) {
        res.status(500).json({ books: [], error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server started at port 3000');
});
