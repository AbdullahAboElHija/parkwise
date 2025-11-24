const http = require('http');

const data = JSON.stringify({
    _id: "u123456789",
    name: "Abdullah",
    lastName: "Abo ElHija",
    email: "abdullah@example.com",
    password: "MyStrongPass123",
    passwordConfirm: "MyStrongPass123"
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/v1/users/signup',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Body:', body);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
