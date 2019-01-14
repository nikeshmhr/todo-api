'use strict';

var c = require('./constants');

module.exports = {
    prepareSuccessResponse: prepareSuccessResponse,
    prepareErrorResponse: prepareErrorResponse,
    prepareJsonResponse: prepareJsonResponse,
    isEmpty: isEmpty,
    decorateResponse: decorateResponse
};


function prepareSuccessResponse(message, data) {
    return prepareJsonResponse(c.RESPONSE_TYPES.SUCCESS, message, data);
}

function prepareErrorResponse(errData) {
    return prepareJsonResponse(c.RESPONSE_TYPES.ERROR, errData.message);
}

function isEmpty(obj) {
    return obj === undefined || obj === null || (typeof obj === 'string' && obj.trim() === '');
}

/**
 * Constructs an object using provided parameters
 * @param errorType
 * @param message   Optional
 * @param data      Optional
 * @returns {c.RESPONSE_MESSAGE_FORMAT}
 */
function prepareJsonResponse(errorType, message, data) {
    var response = Object.create(c.RESPONSE_MESSAGE_FORMAT);

    response.status = errorType;
    if(isEmpty(message)) {
        delete response.message;
    } else {
        response.message = message;
    }
    if(isEmpty(data)) {
        delete response.data;
    } else {
        response.data = data;
    }

    return response;
}

/**
 * Decorates given response with the additional properties. The function updates existing object.
 * @param response
 * @param decorators Object that will be used to decorate existing response
 */
function decorateResponse(response, decorators) {
    if(isEmpty(response) || isEmpty(decorators)) {
        console.error('Invalid response or decorators object');
        return response;
    }
    Object.assign(response, decorators);

    return response;
}