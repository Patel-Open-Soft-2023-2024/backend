// This is how you create the client
const redis = require('redis');

const client = redis.createClient({
    socket: {
        host: 'redis-18643.c305.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 18643,
    },
    password: 'UDq73xvXWqT1Oz2v9PMw0EJ3JWDIMOiw',
});

// This is the subscriber part
const subscriber = client.duplicate();
const func = async () => await subscriber.connect();
func();
const f = async() => {
    await subscriber.subscribe('channel', (message) => {
  console.log(message); // 'message'
})};

const publisher = client;
const func2 = async () => await publisher.connect();
func2();

// This is an example of how to publish a message to the same channel
const fc = async()=>await publisher.publish('channel', 'message');
fc();