const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;
const Path = path.join(__dirname, 'public');


// Setting up static files
app.use(express.static(Path))

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});