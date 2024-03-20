const redis = require('redis');

// Subscriber
function subscribeToChannel(channel) {
    const subscriber = redis.createClient({
        socket: {
            host: 'redis-18643.c305.ap-south-1-1.ec2.cloud.redislabs.com',
            port: 18643,
        },
        password: 'UDq73xvXWqT1Oz2v9PMw0EJ3JWDIMOiw',
    });

    const funcn = async () => await subscriber.connect();
    funcn();
    subscriber.on('connect', () => {
        console.log('Subscriber connected to Redis');
        subscriber.subscribe(channel);
    });

    subscriber.on('message', (channel, message) => {
        console.log(`Received message on channel ${channel}: ${message}`);
    });

    subscriber.on('error', (err) => {
        console.error('Subscriber error:', err);
    });
}

const channel = 'channel1';
// Subscribe to channel
subscribeToChannel(channel);