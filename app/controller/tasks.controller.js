'use strict';

var Task = require('../model/task.model');

module.exports = {
    getTasks: getTasks,
    createTask: createTask
};


/**
 ** Todays task sorted using order property
 */
function getTasks(req, res) {
    var query = Task.find({})
        .sort({order: 'asc'});
    query.exec(function (err, data) {
        if (err)
            res.send(err);
        res.json(data);
    });
}

function createTask(req, res) {
    var t = new Task(req.body);
    t.save(function (err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
}
