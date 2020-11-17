const http = require('http');
const fs = require('fs');
const users = {};

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    console.log(method, url);
    switch (method) {
        case 'GET':
            if (url === '/') {
                return fs.readFile('./public/home.html', (err, data) => {
                    if (err) throw err;
                    return res.end(data);
                });
            } else if (url === '/about') {
                return fs.readFile('./public/about.html', (err, data) => {
                    if (err) throw err;
                    return res.end(data);
                });
            } else if (url === '/users') {
                return res.end(JSON.stringify(users));
            }
            fs.readFile(`./public${url}`, (err, data) => {
                if (err) console.error('favicon');
                return res.end(data);
            });
            break;
        case 'POST':
            if (url === '/users') {
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk;
                });
                return req.on('end', () => {
                    const userObj = JSON.parse(body);
                    console.log(`${userObj.username}을 등록합니다`);
                    const userId = +Date.now();
                    users[userId] = userObj.username;
                    res.writeHead(201);
                    return res.end();
                });
            }
            break;
        case 'PUT':
            if (url.startsWith('/users/')) {
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk;
                });
                return req.on('end', () => {
                    const userObj = JSON.parse(body);
                    const key = url.split('/')[2];
                    console.log(`${userObj.username}을 수정합니다.`);
                    users[key]= userObj.username;
                    console.log(users);
                    res.writeHead(200);
                    return res.end();
                });
            }
            break;
        case 'DELETE':
            if (url.startsWith('/users/')) {
                const key = url.split('/')[2];
                console.log(`${key} 유저를 삭제합니다.`);
                delete users[key];
                res.writeHead(200);
                return res.end();
            }
            break;
        default:
            res.writeHead(404, 'NOT FOUND');
            res.end();
    }
});

server.listen(8080, () => {
    console.log('8080 port listening');
});
