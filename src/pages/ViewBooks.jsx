import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewBook.css'; // Make sure to create and import the CSS file

function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8888/api/books')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        setError('Error fetching books');
      });
  }, []);

  const handleDelete = (title) => {
    axios.delete('http://localhost:8888/api/books/delete', {
      data: { title: title }
    })
      .then(response => {
        if (response.data.error) {
          setError(response.data.error);
        } else {
          setBooks(books.filter(book => book.title !== title));
          alert('Book deleted successfully');
        }
      })
      .catch(error => {
        setError('Error deleting book');
      });
  };

  return (
    <div className="view-books-container">
      <h1>View Books</h1>
      {error && <p className="error-message">{error}</p>}
      <table className="books-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>
                <button onClick={() => handleDelete(book.title)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewBooks;
