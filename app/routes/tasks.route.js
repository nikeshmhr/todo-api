'use strict';

const c = require('../shared/constants'),
    tasksController = require('../controller/tasks.controller');

module.exports = function (app, checkJwt) {

    app.route(c.ENDPOINTS.TASKS)
        .get(tasksController.getTasks)
        .post(checkJwt, tasksController.createTask);

    app.route(c.ENDPOINTS.TASK_BY_ID)
        .get(tasksController.getTaskById)
        .delete(tasksController.deleteTask)
        .put(checkJwt, tasksController.updateTask);

    app.route(c.ENDPOINTS.TASKS_BY_STATUS)
        .get(tasksController.getTasksByStatus);

    app.route(c.ENDPOINTS.TASK_ORDER)
        .post(tasksController.orderTask);

    app.route(c.ENDPOINTS.TASK_COUNT)
        .get(tasksController.getTaskCount);
};
