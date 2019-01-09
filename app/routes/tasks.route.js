'use strict';

const c = require('../shared/constants'),
    tasksController = require('../controller/tasks.controller');

module.exports = function(app) {

    app.route(c.ENDPOINTS.TASKS)
        .get(tasksController.getTasks)
        .post(tasksController.createTask);
};
