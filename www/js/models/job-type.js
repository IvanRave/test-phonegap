/** 
* Job type module
* @module
*/
define(['knockout'], function (ko) {
    'use strict';

    /** 
    * Job type module
    * @constructor
    * @param {object} data - Job type data
    */
    var JobType = function (data) {
        data = data || {};

        /**
        * Job type id
        * @type {number}
        */
        this.id = data.Id;

        /** Job type name */
        this.name = ko.observable(data.Name);

        /** Job type description */
        this.description = ko.observable(data.Description);

        /** Job type company id */
        this.companyId = data.CompanyId;
    };

    return JobType;
});