const http = require('http');

// Create a simple server that responds with "Hello, World!" for any request
const requestHandler = (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!');
};

// Create two separate servers
const server1 = http.createServer(requestHandler);
const server2 = http.createServer(requestHandler);

// Listen on port 5500
server1.listen(5500, '172.31.176.1', () => {
  console.log('Server is running on http://10.0.0.157:5500');
});

// Listen on port 3000
server2.listen(3000, '10.0.0.157', () => {
  console.log('Server is running on http://10.0.0.157:3000');
});
