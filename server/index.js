const net = require('node:net');

const server = new net.Server();

const config = require('./config.json');

server.on('connection', async (sock) => {
    sock.authed = false;
    process.stdout.write(`Connection received from ${sock.remoteAddress}\n`);
    sock.once('data', async (chunk) => {
        // ES6 syntax, Buffer -> Array
        const chk = [...chunk]
        if (chk === config.expectMagicPacket && chunk.length === 1) {
            sock.authed = true;
            sock.write(Buffer.from(config.magicPacket));
            process.stdout.write(`${sock.remoteAddress}: Valid handshake\n`);
            const sock2 = net.createConnection({
                port: config.remoteListenPort,
                host: config.remoteHost
            });
            sock2.pipe(sock);
            sock.pipe(sock2);
            sock.on('close', async () => {
                process.stderr.write(`${sock.remoteAddress} => ${sock2.remoteAddress}: Client-side error\n`);
                if (!sock2.destroyed) sock.destroy();
            });
            sock2.on('close', async () => {
                process.stderr.write(`${sock.remoteAddress} => ${sock2.remoteAddress}: Server-side error\n`);
                if (!sock.destroyed) sock.destroy();
            });
            sock.on('error', async () => {
                process.stderr.write(`${sock.remoteAddress} => ${socket2.remoteAddress}: NodeApp-side Error (from Client Handling)\n`);
                if (!sock2.destroyed) sock2.destroy();
                if (!sock.destroyed) sock.destroy();
            });
            sock2.on('error', async () => {
                process.stderr.write(`${sock.remoteAddress} => ${socket2.remoteAddress}: NodeApp-side Error (from Server Handling)\n`);
                if (!sock.destroyed) sock.destroy();
                if (!sock2.destroyed) sock2.destroy();
            });
        } else {
            process.stderr.write(`${sock.remoteAddress}: Invalid handshake received, destroying socket...\n`);
            sock.destroy();
        };
        // Timeout if not authorised
        setTimeout(() => {
            if (!sock.authed) {
                process.stderr.write(`${sock.remoteAddres}: Timed out (No response)\n`);
                sock.destroy();
            };
        }, 10000);
    });
});

server.listen(22);
