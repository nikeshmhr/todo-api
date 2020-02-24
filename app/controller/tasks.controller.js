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
	getTasksByStatus: getTasksByStatus,
    orderTask: orderTask,
    getTaskCount: getTaskCount
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
    console.log('req', req.user.email);
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

function orderTask(req, res) {
	if(!Utility.isEmpty(req.body.order)) {
		var orderValue = req.body.order.trim().toLowerCase();
		if(C.TASK_ORDER.indexOf(orderValue) === -1) {
			res.json(Utility.prepareErrorResponse(new Error(`Invalid value for order property. Must be from [up, down] but got ${orderValue}`)));
		} else {
			(orderValue === C.TASK_ORDER[0]) ? orderUp(req, res) : orderDown(req, res);
		}
	} else {
		res.json(Utility.prepareErrorResponse(new Error('Order property value is required.')));
	}
}

/**
 * Orders the given task higher than current value in the list. (Up)=> comes first
 */
function orderUp(req, res) {
	Task.findOne({_id: req.params.taskId}, function(err, data) {
		if(err) return res.json(Utility.prepareErrorResponse(`Error 'orderUp' ${err}`));

		req.body = {order: --data.order || 1};

		console.log(`Ordering up task with data ${JSON.stringify(req.body)}`);

		updateTask(req, res);
	});
}

/**
 * Orders the given task lower than current value in the list. (Down)=> comes later
 */
function orderDown(req, res) {
	Task.findOne({_id: req.params.taskId}, function(err, data) {
		if(err) return res.json(Utility.prepareErrorResponse(`Error 'orderDown' ${err}`));

		req.body = {order: ++data.order};

		console.log(`Ordering down task with data ${JSON.stringify(req.body)}`);

		updateTask(req, res);
	});
}

/**
 * Returns the number of records in each category (pending, ongoing, completed)
 */
function getTaskCount(req, res) {
    var taskCount= {
        pending: 0,
        ongoing: 0,
        completed: 0
    };
    var query = Task.find({status: ['pending']});
    query.lean().exec(function(err, data) {
        if(err)
            res.json(Utility.prepareErrorResponse(err));

        taskCount.pending = data.length;
        Task.find({status: ['ongoing']}).lean().exec(function(err, data) {
            if(err)
                res.json(Utility.prepareErrorResponse(err));
            
            taskCount.ongoing = data.length;
            Task.find({status: ['completed']}).lean().exec(function(err, data) {
                if(err)
                    res.json(Utility.prepareErrorResponse(err));
                
                taskCount.completed = data.length;
                res.json(Utility.prepareSuccessResponse('', taskCount));
            });
        });
    });
}