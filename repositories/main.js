/**
 * Created by alex on 30.05.17.
 */

let Repository = function(){

};

Repository.prototype.add = function(data, callback){
    let model = this.model;
    let newitem = new model(data);
    newitem.save(callback);
};

Repository.prototype.update = function(id, body, callback){
    let query = this.model.update({_id:id}, body);
    query.exec(callback);
};

Repository.prototype.delete = function(id, callback){
    let model = this.model;
    let query = model.remove({_id:id});
    query.exec(callback);
};

Repository.prototype.getAll = function(callback){
    let model = this.model;
    let query = model.find();
    query.exec(callback);
};

Repository.prototype.get = function(params, callback){
    if (params.filter === undefined){
        params.filter = {};
    }
    if (params.sort === undefined){
        params.sort = null;
    }
    if (params.limit === undefined){
        params.limit = null;
    }
    if (params.offset === undefined){
        params.offset = null;
    }
    let model = this.model;
    let query = model.find(params.filter).sort(params.sort).limit(params.limit).skip(params.offset);
    query.exec(callback);
};

Repository.prototype.getById = function(id, callback){
    let model = this.model;
    let query = model.findOne({_id:id});
    query.exec(callback);
};

module.exports = Repository;