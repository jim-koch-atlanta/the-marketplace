import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';

const app = express();
const port = 3001;

// Create and setup the SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run('CREATE TABLE users (id INT, name TEXT)');
  db.run('INSERT INTO users (id, name) VALUES (1, "John Doe")');
});

// API route to get users
app.get('/users', (req: Request, res: Response) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// API route to add a user
app.post('/users', (req: Request, res: Response) => {
  const { id, name } = req.body;
  if (id === undefined || name === undefined) {
    res.status(400).json({ error: 'Please provide an id and name' });
    return;
  }
  db.run('INSERT INTO users (id, name) VALUES (?, ?)', [id, name], (err: Error | null) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ message: 'User added' });
  });
});

// API route to delete a user
app.delete('/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.run('DELETE FROM users WHERE id = ?', [id], function(err: Error | null) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json({ message: 'User deleted' });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
