const express = require('express')
const mongoose = require('mongoose');
const Rooms = require('./dbRooms');
const Messages = require('./dbMessages');
const cors = require('cors');//cross orgin resource sharing
const Pusher = require("pusher");

const app = express();

app.use(express.json());

const pusher = new Pusher({
    appId: "1539357",
    key: "05e1e20b1da3e5893693",
    secret: "0621fd156e4110366962",
    cluster: "ap2",
    useTLS: true
});

app.use(cors());

const dbUrl = "mongodb+srv://Raghul:Raghul@hostingandfunctions.5sdnbwu.mongodb.net/messengerclone?retryWrites=true&w=majority";

mongoose.connect(dbUrl);

const db = mongoose.connection;

db.once("open", () => {
    console.log("Db connected-----------");

    const roomCollection = db.collection("rooms")
    const changeStream = roomCollection.watch();

    changeStream.on("change", (change) => {
        // console.log(change);
        if (change.operationType === "insert") {
            const messageDetails = change.fullDocument;
            pusher.trigger("room", "inserted", messageDetails);
        }
        else if (change.operationType === 'delete') {

            pusher.trigger("room", 'deleted', change.documentKey._id);
        }
        else {
            console.log("not exectevent im room");
        }
    })

    const msgCollection = db.collection("messages")
    const changeStream1 = msgCollection.watch();

    changeStream1.on("change", (change) => {
        if (change.operationType === "insert") {
            const messageDetails = change.fullDocument;
            pusher.trigger("messages", "inserted", messageDetails);
        } else {
            console.log("not exectevent im message");
        }
    })
})

app.get('/', (req, res) => {
    res.send('Hi bros im from server')
})

app.post('/group/create', (req, res) => {
    const name = req.body.groupName;
    Rooms.create({ name: name }, (err, data) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            return res.status(201).send(data)
        }
    })

})

app.post("/messages/new", (req, res) => {
    const dbMessage = req.body;
    Messages.create(dbMessage, (err, data) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            return res.status(201).send(data)
        }
    })
})

app.get("/all/rooms", (req, res) => {
    Rooms.find({}, (err, data) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            return res.status(200).send(data)
        }
    })
})

app.get('/room/:id', (req, res) => {
    Rooms.find({ _id: req.params.id }, (err, data) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            return res.status(200).send(data[0])

        }
    })
})

app.get("/messages/:id", (req, res) => {
    Messages.find({ roomId: req.params.id }, (err, data) => {
        if (err) {
            return res.status(500).send(err)
        } else {
            return res.status(200).send(data)
        }
    })
})

app.delete("/delete/:id", (req, res) => {

    Rooms.deleteOne({ _id: req.params.id }, (err, data) => {
        if (err) {
            return res.status(500).send(err);
        } else {
            return res.status(200).send(data);
        }
    })
})

app.listen(5000, () => {
    console.log("Server started sucessfully------------");
})


// http://localhost:5000/group/create


// {
//     "name": "String,",
//     "message": "String",
//     "timestamp": "String",
//     "uid": "Stringjhgjghj",
//     "roomId": "63c7b44911dfee4931666b7d"
// }