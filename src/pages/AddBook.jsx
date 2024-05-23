import React, { useState } from 'react';
import axios from 'axios';
import './AddBook.css'; // Import the CSS file

function AddBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8888/api/books/add', { title, author })
      .then(response => {
        if (response.data.error) {
          setError(response.data.error);
        } else {
          alert('Book added successfully');
          setTitle('');
          setAuthor('');
          setError('');
        }
      })
      .catch(error => {
        setError('Error adding book');
      });
  };

  return (
    <div>
      <h1 align= "centre"> Add a New Book</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="add-book-container">
        <form className="add-book-form" onSubmit={handleSubmit}>
        
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Author:</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </div>
        <button type="submit">Add Book</button>
      </form>
    </div>
    </div>
  );
}

export default AddBook;
