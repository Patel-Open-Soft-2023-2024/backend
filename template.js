const redis = require('redis');

// Connect to your Redis instance
function publishMessage(channel, message) {
    const client = redis.createClient({
        socket: {
            host: 'redis-18643.c305.ap-south-1-1.ec2.cloud.redislabs.com',
            port: 18643,
        },
        password: 'UDq73xvXWqT1Oz2v9PMw0EJ3JWDIMOiw',
    });

    const func = async () => await client.connect();
    func();

    client.on('connect', () => {
        console.log('Connected to Redis');
    });

    client.on('error', (err) => {
        console.error('Redis error:', err);
    });

    // Publisher
    client.publish(channel, message);
}

// Example usage
const channel = 'channel1';

// Publish a message
publishMessage(channel, 'Hello, Redis!');


// Subscriber
// function subscribeToChannel(channel) {
//     const subscriber = redis.createClient({
//         socket:{host: 'redis-18643.c305.ap-south-1-1.ec2.cloud.redislabs.com',
//         port: 18643,},
//         password: 'UDq73xvXWqT1Oz2v9PMw0EJ3JWDIMOiw',
//     });

//     const func = async () => await subscriber.connect();
//     func();
//     subscriber.on('connect', () => {
//         console.log('Subscriber connected to Redis');
//         subscriber.subscribe(channel);
//     });

//     subscriber.on('message', (channel, message) => {
//         console.log(`Received message on channel ${channel}: ${message}`);
//     });

//     subscriber.on('error', (err) => {
//         console.error('Subscriber error:', err);
//     });
// }

// subscribeToChannel()
