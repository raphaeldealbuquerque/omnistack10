const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors")
const routes = require("./routes");
const http = require('http');
const { setupWebsocket } = require('./websocket')

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-qct5i.mongodb.net/week10?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(3333);


