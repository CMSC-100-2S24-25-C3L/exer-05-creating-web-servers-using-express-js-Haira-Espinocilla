//import
import needle from 'needle';

const books = [
    { bookName: 'Harry Potter and the Philosopher\'s Stone', isbn: '978-0-7475-3269-9', author: 'J.K Rowling', yearPublished: '1997' },
    { bookName: 'Harry Potter and the Chamber of Secrets', isbn: '0-7475-3849-2', author: 'J.K Rowling', yearPublished: '1998' },
    { bookName: 'The Little Prince', isbn: '978-0156012195', author: 'Antoine Saint-Exupery', yearPublished: '1943' }
];

//to iterate over each book bcoz there are many books
books.forEach(book => {
    needle.post('http://localhost:3000/add-book', book, (err, res) => {
        if (err) { //if request fails
            console.error(`Error adding ${book.bookName}:`, err);
        } else { //if book is successfully added
            console.log(`Added ${book.bookName}:`, res.body);
        }
    });
});

//search books by author
needle.get('http://localhost:3000/find-by-author?author=J.K+Rowling', (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log('GET /find-by-author response:', res.body);
    }
});

//search books by isbn and author
needle.get('http://localhost:3000/find-by-isbn-author?isbn=978-0-7475-3269-9&author=J.K+Rowling', (err, res) => {
    if (err) {
        console.error(err);
    } else {
        console.log('GET /find-by-isbn-author response:', res.body);
    }
});
