'use strict';

var mongoose = require('mongoose');
var model = require('../model/task.model');
var Task = mongoose.model('Tasks');

module.exports = {
    getTasks: getTasks,
    createTask: createTask
};


function getTasks(req, res) {
    Task.find({}, function(err, data) {
        if(err)
            res.send(err);
        res.json(data);
    });
}

function createTask(req, res) {
    var t = new Task(req.body);
    t.save(function(err, task) {
        if(err)
            res.send(err);
        res.json(task);
    });
}
