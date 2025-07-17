const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    text: String,
    hashtag: [String],
    likes: [ { type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    date: Date
});

const Tweet = mongoose.model('tweets',userSchema);
module.exports = Tweet;
