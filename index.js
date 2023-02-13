const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const db = new sqlite3.Database('warehouse.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the warehouse SQlite database.');
});

app.get('/', (req, res) => {
    res.send(`
    <form method="post">
    <h2>Warehouse Database</h2>
      <input type="text" name="partnumber" placeholder="Please enter part number..." style="width:30%"/>
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post('/', (req, res) => {
    const partnumber = req.body.partnumber;
    console.log(partnumber);

    db.get(`SELECT Shelf.ShelfLocation, Bin.BinID, COUNT(PartNumber.PartNumberID) FROM PartNumber JOIN Bin ON PartNumber.BinID = Bin.BinID JOIN Shelf ON Bin.ShelfID = Shelf.ShelfID WHERE PartNumber.PartNumber = ?`,
        [partnumber],
        function (err, row) {
            if (err) {
                return console.error(err.message);
            }
            console.log(row)
            res.send(`
            <style>
                table, th, td {
                    border:1px solid black;
                    padding: 10px;
                }
            </style>
            <h2>Warehouse Database</h2>
            <table style="width:100%">
                <tr>
                    <th>Shelf Number</th>
                    <th>Bin Number</th>
                    <th>PartNumber Count</th>
                </tr>
                <tr>
                    <td>${row.ShelfLocation}</td>
                    <td>${row.BinID}</td>
                    <td>${row['COUNT(PartNumber.PartNumberID)']}</td>
                </tr>
            </table>
                `)
        });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
