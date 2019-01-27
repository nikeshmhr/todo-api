"use strict";

const Util = require("./utility");

module.exports = {
	orderComparator: orderComparator,
	groupByStatus: groupByStatus,
	groupByPriority: groupByPriority,
	setOrderableProperty: setOrderableProperty
};

/**
 * Used to sort list in ascending order using 'order' property
 */
function orderComparator(a, b) {
	return a.order < b.order ? -1 : a.order > b.order ? 1 : 0;
}

/**
 * Groups list or records by status.
 * @param {list of items} list
 * @returns - new object containing status value as properties of list (which holds list of elements that belong to that particular group)
 */
function groupByStatus(list) {
	var result = {
		pending: [],
		ongoing: [],
		completed: []
	};

	list.forEach(function(element) {
		var status = element.status;
		result[status].push(element);

		// Order list
		result[status].sort(orderComparator);
	});

	return result;
}

/**
 * Function that groups the given list of records by 'priority' (HIGH, MEDIUM, LOW)
 * @param {list of item} list
 * @returns - new object containing priority value as properties of list (which holds list of elements that belong to that particular group)
 */
function groupByPriority(list) {
	var result = {
		high: [],
		medium: [],
		low: []
	};

	list.forEach(function(element) {
		var priority = element.priority;
		result[priority].push(element);

		// Order list
		result[priority].sort(orderComparator);
	});

	return result;
}

/**
 * Sets the 'orderable' property for each task
 * 'orderable': {
 * 	'up': true,	// means order of this task can be increased and moved up in the list
 * 	'down': true	// means order of this task can be increased and moved down in the list
 * }
 * @param {the response either grouped or raw} response 
 */
function setOrderableProperty(response) {
	// Determine if its raw response or filtered(grouped) response
	// Crieteria to determine raw vs filtered
	// Raw: is a list/array
	// Filtered: is object containing properties whose values are list/array
	if(Array.isArray(response)) {	// means its raw response
		// Set orderable property for each item in the list
		response.forEach(function(item, index){
			item.orderable = {
				up: index == 0 ? false : true,
				down: (index == response.length - 1) ? false : true
			};
		});
	} else {
		// Enumerate properties of object
		var props = Object.getOwnPropertyNames(response);
		var propsValues = [];
		props.forEach(function(prop) {
			propsValues.push(response[prop]);
		});
		// Verify if every props' value is a list/array
		// If not we have a problem here, either our response is invalid or broken
		if(!propsValues.every(Util.hasArrayValues)) {
			throw new Error('Invalid response, an object\'s children must hold array data, found object');
		} else {	// If all good then we'll use recursion to set our required property
			props.forEach(function(prop) {
				setOrderableProperty(response[prop]);
			});
		}
	}
}