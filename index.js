const express = require("express");
const bodyparser = require("body-parser");
var mongoose = require("mongoose")
const app = express();
app.use(bodyparser.json());

const dotenv = require('dotenv');
dotenv.config();

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DB_connect, {
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

    if (!title || !isbn || !pageCount || !publishedDate || !thumbnailUrl || !shortDescription || !longDescription || !status || !authors || !categories) {
        return res.status(422).json({ error: "Please filled out the property" })
    }

    db.collection('customers').findOne({ isbn: isbn })
        .then((isbnExist) => {
            if (isbnExist) {
                return res.status(422).json({ error: "isbn already Exist" })
            }
            db.collection('customers').insertOne(book, (err, collection) => {

                if (err) {
                    throw ((err) => res.status(500).json({ error: "Failed to registered" }));
                }
                res.status(201).json({ message: "Record Inserted Successfully" });

            })

        }).catch(err => { console.log(err); });

});

// replace 3000 with (process.env.PORT)
const PORT = process.env.PORT;
app.listen(PORT, function () {
    console.log(`Server is listening on ${PORT}`)
});