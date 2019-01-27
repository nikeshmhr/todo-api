'use strict';

var Task = require('../model/task.model');
var Utility = require('../shared/utility');
var C = require('../shared/constants');
var TaskUtil = require('../shared/task-utility');

module.exports = {
    getTasks: getTasks,
    createTask: createTask,
    deleteTask: deleteTask,
	updateTask: updateTask,
    getTaskById: getTaskById,
    getTasksByStatus: getTasksByStatus
};


/**
 ** Tasks grouped by status and sorted using order property
 */
function getTasks(req, res) {
    var query = Task.find({});
    query.lean().exec(function(err, data) {
        if(err)
            res.json(Utility.prepareErrorResponse(err));

        var dataCount = data.length;
        // Group results by status
        var groupedByStatus = TaskUtil.groupByStatus(data);

        try {
            TaskUtil.setOrderableProperty(groupedByStatus);
        } catch(err) {
            console.log(err);
        }

        res.json(Utility.decorateResponse(Utility.prepareSuccessResponse('', groupedByStatus), {count: dataCount}));
    });
}

function createTask(req, res) {
    var t = new Task(req.body);
    t.save(function(err, task) {
        if(err)
            res.json(Utility.prepareErrorResponse(err));
        res.json(Utility.prepareSuccessResponse(C.TASKS.ADDED_SUCCESSFULLY, task));
    });
}

function deleteTask(req, res) {
    Task.deleteOne({_id: req.params.taskId}, function(err, success) {
        if(err) return res.json(Utility.prepareErrorResponse(err));

        if(!Utility.isEmpty(success) && success.n === 1) {    // Success only if no. of deleted doc is 1
            res.json(Utility.prepareSuccessResponse(C.TASKS.DELETED_SUCCESSFULLY.replace('#taskId', req.params.taskId), success));
        } else {
            res.json(Utility.prepareErrorResponse({message: `Failed to delete task.`}));
        }
    });
}

function updateTask(req, res) {
    Task.findOneAndUpdate({_id: req.params.taskId}, req.body, {new: true, runValidators: true}, function(err, data) {
        if(err) return res.json(Utility.prepareErrorResponse(err));

        res.json(Utility.prepareSuccessResponse(C.TASKS.UPDATED_SUCCESSFULLY.replace('#taskId', req.params.taskId), data));
    });
}

function getTaskById(req, res) {
	Task.findOne({_id: req.params.taskId}, function(err, data) {
		if(err) return res.json(Utility.prepareErrorResponse(err));

		res.json(Utility.prepareSuccessResponse('', data));
	});
}

function getTasksByStatus(req, res) {
    var query = Task.find({status: [req.params.status]});
    query.lean().exec(function(err, data) {
        if(err)
            res.json(Utility.prepareErrorResponse(err));

        // Group results by priority
        var groupByPriority = TaskUtil.groupByPriority(data);
        try{
            TaskUtil.setOrderableProperty(groupByPriority);
        } catch(err) {
            console.log(err);
        }
        res.json(Utility.decorateResponse(Utility.prepareSuccessResponse('', groupByPriority), {count: data.length}));
    });
}