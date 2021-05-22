

const multer = require('multer');
const DataURI = require('datauri/parser');
const datauri = new DataURI();
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('imagesrc');
let path = require('path');





const dataUri = req => {
    let urlString = path.extname(req.file.originalname).toString();
   return datauri.format(urlString, req.file.buffer);
}
 
module.exports = { multerUploads, dataUri };