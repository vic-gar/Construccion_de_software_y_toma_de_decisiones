const log = console.log;
const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        log("File Destination:", './public/');
        callback(null, './public/');
    },
    filename: function (req, file, callback) {
        const nombre = new Date().toISOString() + '-' + file.originalname;
        log("Uploaded File:", nombre);
        callback(null, nombre);
    }
});

const upload = multer({ storage: storage, fileFilter: fileFilter }).array('file', 1);

const storage2 = multer.diskStorage({
    destination: function (req, file, callback) {
        log("File Destination:", './private/');
        callback(null, './private/');
    },
    filename: function (req, file, callback) {
        const nombre = new Date().toISOString() + '-' + file.originalname;
        log("Uploaded File:", nombre);
        callback(null, nombre);
    }
});

const upload2 = multer({ storage: storage2, fileFilter: fileFilter }).array('file', 1);

module.exports.upload_file = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ code: 500, msg: "Error uploading file" });
        }

        log("Upload Successful:", req.files);
        res.status(200).json({ code: 200, msg: "Ok" });
    });
};

module.exports.upload_file_private = (req, res) => {
    upload2(req, res, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ code: 500, msg: "Error uploading file" });
        }

        log("Upload Successful:", req.files);
        res.status(200).json({ code: 200, msg: "Ok" });
    });
};

module.exports.get_private_file = async (req, res) => {
    const fileName = path.basename(req.params.file);
    const filePath = path.join(__dirname, './private', fileName);

    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("sendFile error:", err.message);
            res.status(404).json({ code: 404, msg: "Archivo no encontrado" });
        }
    });
};

module.exports.update_file = (req, res) => {
    upload(req, res, function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ code: 500, msg: "Error uploading file" });
        }

        let rutaArchivo = req.body.ruta_anterior;
        if (req.files && req.files.length > 0) {
            rutaArchivo = req.files[0].path;
        }

        log("Ruta final del archivo:", rutaArchivo);
        res.status(200).json({ code: 200, msg: "Ok", ruta: rutaArchivo });
    });
};