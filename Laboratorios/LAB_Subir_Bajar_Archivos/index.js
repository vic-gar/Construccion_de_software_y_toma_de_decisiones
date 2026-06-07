const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;
const controller = require("./index.controller");
const log = console.log;

fs.mkdirSync('./private', { recursive: true });
fs.mkdirSync('./uploads', { recursive: true });

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload_file', controller.upload_file);
app.post('/upload_file_private', controller.upload_file_private);
app.post('/update_file', controller.update_file);
app.get('/get_private_file/:file', controller.get_private_file);

app.listen(port, () => {
    log(`Now listening on port ${port}`);
});