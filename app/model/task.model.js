'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    description: {
        type: String,
        required: 'Please enter task description.'
    },
    task_for_date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: [{
            type: String,
            enum: ['pending', 'ongoing', 'completed']
        }],
        default: ['pending']
    },
    priority: {
        type: [{
            type: String,
            enum: ['high', 'medium', 'low']
        }],
        default: ['medium']
    }
});

module.exports = mongoose.model('Tasks', TaskSchema);
