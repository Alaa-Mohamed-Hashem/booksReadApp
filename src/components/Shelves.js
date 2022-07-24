import React from 'react'
import Shelf from './Shelf';

const Shelves = ({ books, updateBookShelf }) => {
   const currentlyReading = books.filter(book => book.shelf === 'currentlyReading');
   const wantToRead = books.filter(book => book.shelf === 'wantToRead');
   const read = books.filter(book => book.shelf === 'read');

   return (
      <>
         <Shelf title="Currently Reading" books={currentlyReading} updateBookShelf={updateBookShelf} />
         <Shelf title="want To Read" books={wantToRead} updateBookShelf={updateBookShelf} />
         <Shelf title="read" books={read} updateBookShelf={updateBookShelf} />
      </>
   )
}

export default Shelves