'use strict';

const c = require('../shared/constants'),
    tasksController = require('../controller/tasks.controller');

module.exports = function (app) {

    app.route(c.ENDPOINTS.TASKS)
        .get(tasksController.getTasks)
        .post(tasksController.createTask);

    app.route(c.ENDPOINTS.TASK_BY_ID)
        .get(tasksController.getTaskById)
        .delete(tasksController.deleteTask)
        .put(tasksController.updateTask);
};
