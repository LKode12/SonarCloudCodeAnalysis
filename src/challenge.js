const express = require('express');
const app = express();
const PORT = 3000;

// Hide version information
app.disable('x-powered-by');

// Mock database and exec function for demonstration purposes
const db = {
  query: (query, callback) => {
    // Dummy implementation for demonstration
    // Replace this with your actual database query function
    callback(null, [{ id: 1, username: 'user1' }]);
  }
};

const { exec } = require('child_process');

// Mitigated SQL Injection Vulnerability
app.get('/user', (req, res) => {
  const userId = parseInt(req.query.id); // Parse the input to ensure it's a number
  if (isNaN(userId)) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }
  const query = `SELECT * FROM users WHERE id = ?`; // Use parameterized query
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(result);
  });
});

// Mitigated Cross-Site Scripting (XSS) Vulnerability
app.get('/search', (req, res) => {
  const searchTerm = req.query.term;
  const sanitizedSearchTerm = searchTerm ? searchTerm.replace(/[<>&]/g, '') : ''; // Sanitize input
  res.send(`<p>You searched for: ${sanitizedSearchTerm}</p>`);
});

// Mitigated Command Injection Vulnerability
app.get('/execute', (req, res) => {
  const command = req.query.cmd;
  // Sanitize input by not directly executing it
  res.send(`Direct command execution is disabled. Avoiding security risks.`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
