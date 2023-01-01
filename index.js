const express = require("express");
const bodyparser = require("body-parser");
var mongoose = require("mongoose")
const app = express();
app.use(bodyparser.json());

const dotenv = require('dotenv');
dotenv.config();

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_connect,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"))

app.post("/books", (req, res) => {

    const {
        title,
        isbn,
        pageCount,
        publishedDate,
        thumbnailUrl,
        shortDescription,
        longDescription,
        status,
        authors,
        categories
    } = req.body;

    // const bookExist = booksDirectory.find(b => b.isbn === isbn);
    // if (bookExist) return res.send('Book already exist');

    const book = {
        title,
        isbn,
        pageCount,
        publishedDate,
        thumbnailUrl,
        shortDescription,
        longDescription,
        status,
        authors,
        categories
    };

    db.collection('customers').insertOne(book, (err, collection) => {
        if (err) {
            throw err;
        }
        const bookExist = db.collection('customers').find(b => b.isbn === isbn);
        if (bookExist) return res.send('Book already exist');
        else{
            console.log("Record Inserted Successfully");
            res.send(book);
        }
        // console.log("Record Inserted Successfully");
        // res.send(book);
    });

});

// replace 3000 with (process.env.PORT)
const PORT = process.env.PORT;
app.listen(PORT, function () {
    console.log(`Server is listening on ${PORT}`)
});