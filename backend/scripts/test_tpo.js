const http = require('http');

// Make a login request first to get a token
const loginData = JSON.stringify({
    email: 'tpo@college.edu', // Replace with an actual TPO email if known, or we'll need to find one
    password: 'password123'
});

const loginOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
    }
};

const loginReq = http.request(loginOptions, res => {
    console.log(`Login statusCode: ${res.statusCode}`);
    let cookieHeader = res.headers['set-cookie'];
    let token = null;

    if (cookieHeader) {
        const jwtCookie = cookieHeader.find(c => c.startsWith('jwt='));
        if (jwtCookie) {
            token = jwtCookie.split(';')[0].split('=')[1];
        }
    }

    res.on('data', d => {
        process.stdout.write('Login Response: ' + d + '\n');
    });

    res.on('end', () => {
        if (token) {
            console.log('Successfully extracted token, making TPO request...');
            makeTpoRequest(token);
        } else {
            console.log('Failed to get token from login. Need a valid TPO email/password.');
        }
    });
});

loginReq.on('error', error => {
    console.error(error);
});

loginReq.write(loginData);
loginReq.end();

function makeTpoRequest(token) {
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/tpo/analytics',
        method: 'GET',
        headers: {
            'Cookie': `jwt=${token}`
        }
    };

    const req = http.request(options, res => {
        console.log(`TPO Analytics statusCode: ${res.statusCode}`);

        res.on('data', d => {
            process.stdout.write(d);
        });
    });

    req.on('error', error => {
        console.error(error);
    });

    req.end();
}
