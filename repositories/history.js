/**
 * Created by alex on 30.05.17.
 */

let Repository = require('./main');
let History = require('../schemas/history');

function HistoryRepository() {
    Repository.prototype.constructor.call(this);
    this.model = History;
}

HistoryRepository.prototype = new Repository();

module.exports = new HistoryRepository();