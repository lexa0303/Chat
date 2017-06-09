/**
 * Created by alex on 30.05.17.
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let historySchema = new Schema({
    globalId: Schema.Types.ObjectId,
    message: String,
    author: String,
    date: Date,
    photo: String
});

module.exports = mongoose.model("History", historySchema);