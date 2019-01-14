'use strict';

const constants = Object.freeze({
    DB_PROPS: {
        HOST: 'localhost',
        DB_NAME: 'mytodo',
        getConnectionString: function () {
            return 'mongodb://' + this.HOST + '/' + this.DB_NAME;
        }
    },
    ENDPOINTS: {
        TASKS: '/tasks',
        TASK_BY_ID: '/tasks/:taskId',
        TASK_SEARCH: '/tasks/search'    // ?date='', status='', priority=''
    },
    RESPONSE_MESSAGE_FORMAT: {  // Will be used as template for every response
        status: '',
        message: '',
        data: ''
    },
    RESPONSE_TYPES: {
        ERROR: 'error',
        SUCCESS: 'success'
    },
    TASKS: {
        ADDED_SUCCESSFULLY: 'Tasks added successfully.',
        DELETED_SUCCESSFULLY: 'Task for task id #taskId deleted successfully.',
        UPDATED_SUCCESSFULLY: 'Task for task id #taskId updated successfully.'
    }
});

module.exports = constants;
