const express = require('express');
const app = express();
const PORT = 3000;

// SQL Injection Vulnerability
app.get('/user', (req, res) => {
  const userId = req.query.id;
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Cross-Site Scripting (XSS) Vulnerability
app.get('/search', (req, res) => {
  const searchTerm = req.query.term;
  res.send(`<p>You searched for: ${searchTerm}</p>`);
});

// Command Injection Vulnerability
app.get('/execute', (req, res) => {
  const command = req.query.cmd;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      res.send(`Error: ${error.message}`);
      return;
    }
    res.send(`Output: ${stdout}`);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
