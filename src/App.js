import "./App.css";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Shelves from "./components/Shelves";
import { getAll, update, search } from './BooksAPI';
import Book from "./components/Book";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [searchBooks, setSearchBooks] = useState([]);
  const [mergBooks, setMergBooks] = useState([]);
  const [mapOfIdToBooks, setMapOfIdToBooks] = useState(new Map());

  const createMapOfBooks = (books) => {
    const map = new Map();
    books.map(book => map.set(book.id, book));
    return map;
  };

  const updateBookShelf = (book, whereTo) => {
    const updateBooks = books.map(b => {
      if (book.id === b.id) {
        
        book.shelf = whereTo;
        return book;
      }
      return b;
    });
    if (!mapOfIdToBooks.has(book.id)) {
      book.shelf = whereTo
      updateBooks.push(book)
    }
    setBooks(updateBooks);
    update(book, whereTo);
  };

  // Get All Books
  useEffect(() => {
    const getAllBooks = getAll().then(data => {
      setBooks(data);
      setMapOfIdToBooks(createMapOfBooks(data));
    });
  }, []);

  // Search Books
  useEffect(() => {
    let isActive = true;

    if (query) {
      search(query).then(data => {
        if (data.error) {
        } else {
          if (isActive) {
            setSearchBooks(data)
          }
        }
      })
    }

    return () => {
      isActive = false
      setSearchBooks([]);
    }
  }, [query]);

  useEffect(() => {
    const combined = searchBooks.map(book => {
      if (mapOfIdToBooks.has(book.id)) {
        return mapOfIdToBooks.get(book.id)
      } else {
        return book;
      }
    });
    setMergBooks(combined);
  }, [searchBooks, mapOfIdToBooks]);


  return (
    <div className="app">
      <Router>
        <Switch>
          <Route path='/search'>
            <div className="search-books">
              <div className="search-books-bar">
                <Link to="/"
                  className="close-search"
                >
                  Close
                </Link>
                <div className="search-books-input-wrapper">
                  <input
                    type="text"
                    placeholder="Search by title, author, or ISBN"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="search-books-results">
                <ol className="books-grid">
                  {mergBooks.map(b => (
                    <li key={b.id}>
                      <Book book={b} changeBookShelf={updateBookShelf} />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Route>


          <Route path='/'>
            <div className="list-books">
              <Header />
              <div className="list-books-content">
                {books.length > 0 &&
                  <Shelves books={books} updateBookShelf={updateBookShelf} />
                }
              </div>
              <div className="open-search">
                <Link to='/search'>Add a book</Link>
                {/* <button>Add a book</button> */}
                {/* <a href="/" onClick={() => setShowSearchpage(!showSearchPage)}>Add a book</a> */}
              </div>
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
