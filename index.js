const express = require('express');
const app = express();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const upload = multer({
    dest: "file/"
});
const port = process.env.PORT || 8000;

app.use(express.urlencoded());
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.send('verification server');
});

app.post("/import", upload.single("file"), (req, res, next) => {
    backURL = req.header('Referer') || '/';
    if (req.file) {
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, `./file/cert.json`);
        fs.rename(tempPath, targetPath, err => {
            if (err) throw err;
            res.send(JSON.stringify({status: 'success'}));
        });
    } else if (req.body.url) {
        res.send(JSON.stringify({status: 'success url', url: req.body.url}));
    } else {
        res.send(JSON.stringify({status: 'fail'}));
    }
});

app.get("/cert", (req, res) => {
    res.sendFile(__dirname + "/file/cert.json");
});

app.listen(port, () => {
    console.log(`server starting on port ${port}`);
});