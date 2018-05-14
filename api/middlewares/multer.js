const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/temp');
  },
  filename: function (req, file, cb) {
    file.type = file.mimetype.split('/')[1];
    cb(null, `${file.fieldname} - ${Date.now()}.${file.type}`);
  }
})

function fileFilter(req, file, cb) {
  const allowTypes = ['image/png', 'image/jpg', 'image/jpeg'];

  if (allowTypes.indexOf(file.mimetype) < 0) {
    return cb(new Error('Type is not allowed'));
  }
  cb(null, true);
}

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    files: 1,
    fileSize: 1024 * 1024
  }
});
