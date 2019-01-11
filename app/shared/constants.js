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
    }
});

module.exports = constants;
