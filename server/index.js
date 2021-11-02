/**
 * Main application file
 */

'use strict';
const fs = require("fs");
const express = require('express');
const logger = require('./logs');
const data = require("./data.json");
const { v4: uuidv4 } = require('uuid');
const eventNames = {
    RECEIVE_ORDER: 'receiveOrders',
    PLACE_ORDER: 'orders',
    SERVER_STATUS: 'status',
    ADMIN_LOGIN: 'adminLogin',
    ITEMS: 'item'
};
const port = 8000;
// Setup server
const app = express();
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:4200",
        credentials: false
    }
});
const message = { status: 'Connected', timestamp: new Date() };
let isAdminLoggedIn = false;
let kitchenJson;
/** on connect to socket */
io.on('connection', async function (socket) {
    try {
        const jsonString = await fs.readFileSync("./data.json");
        kitchenJson = JSON.parse(jsonString);
        logger.info('Read data.json file | ' + jsonString);

    } catch (err) {
        console.log(err);
        return;
    }
    logger.info('/** New socket connection  | ' + socket.id + ' **/');
    console.info('/** New socket connection | ' + socket.id + ' **/');
    let orders = [];
    setInterval(() => {
        socket.emit(eventNames.SERVER_STATUS, message);
        logger.info('Server Status - ', message);
    }, 5000);
    // listen for admin login 
    socket.on(eventNames.ADMIN_LOGIN, async () => {
        isAdminLoggedIn = true;
        socket.emit(eventNames.ITEMS, kitchenJson);
    });
    // listen for orders 
    socket.on(eventNames.PLACE_ORDER, async (data) => {
        console.log('received order ', data);

        const uniqueId = uuidv4();
        const orderDetails = {
            id: uniqueId,
            orderDetails: data
        };
        orders.push(orderDetails);
        logger.info('socket ID - ' + socket.id + ' | Order details ', orderDetails)
        // logger.info('socket ID ' + socket.id);
        // emit the event 
        socket.broadcast.emit(eventNames.RECEIVE_ORDER, orderDetails);
    });

    // listen for client 
    // socket.on('reply', (data) => {
    //     logger.info('<<<<' + JSON.stringify(data) + ' | socket ID ' + socket.id);
    // });
    // listen for slave disconnet event
    socket.once('disconnect', () => {
        logger.info('/** Boom 💥 | ' + socket.id + ' is disconnected **/');
        console.info('/** Boom 💥 | ' + socket.id + ' is disconnected **/')
    });
});

// Start the Server
server.listen(port, function () {
    logger.info(`Server listening on %d, in %s mode 🚀`, port, app.get('env'));
    console.info('Server listening on %d, in %s mode 🚀', port, app.get('env'));
});

/** on close server in windows */
if (process.platform === "win32") {
    require("readline")
        .createInterface({
            input: process.stdin,
            output: process.stdout
        })
        .on("SIGINT", function () {
            process.emit("SIGINT");
        });
}
/** close the process */
process.on("SIGINT", function () {
    logger.info('/** Server is down! 💥 **/');
    process.exit();
});

// Expose app
exports = module.exports = app;