const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema ({
    title: {
        type: String,
    },
    body: {
        type: String,
    }
});

const Token = mongoose.model('Spotify-token', tokenSchema);
module.exports = Token;