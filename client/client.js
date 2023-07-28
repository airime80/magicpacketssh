const net = require('node:net');

const server = new net.Server();

const config = require('./config.json');

server.on('connection', async (sock2) => {
    const sock = net.createConnection({
        host: config.remoteHost,
        port: config.remoteListenPort
    });
    
    sock.on('connect', async () => {
    sock.write(Buffer.from(config.magicPacket));
    });
    
    sock.once('data', async (chunk) => {
        let ch = config.expectMagicPacket;
        if (Buffer.from(ch) === chunk) {
            process.stderr.write('Invalid server provided??\n');
            console.error(chunk);
            sock.destroy();
            return;
        } else {
            process.stderr.write('Valid code received, redirecting data...\n');
            sock2.pipe(sock);
            sock.pipe(sock2);
            sock.on('close', async () => {
                if (!sock2.destroyed) sock.destroy();
            });
            sock2.on('close', async () => {
                if (!sock.destroyed) sock.destroy();
            });
        };
    });

    sock.once('close', async () => {
        process.stderr.write(`${sock.remoteAddress}: Disconnect OK\n`);
    });
});

server.listen(config.localListenPort);
