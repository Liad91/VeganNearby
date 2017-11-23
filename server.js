const mongoose = require('./config/mongoose');
const express = require('./config/express');

const app = express(mongoose());
const port = process.env.PORT || 3000;

/** Start server */
app.listen(port, () => console.log(`Server started on port ${port}`));
