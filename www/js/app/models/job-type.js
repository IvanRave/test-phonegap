define(['knockout'], function (ko) {
    'use strict';

    function JobType(data) {
        var self = this;
        data = data || {};

        self.id = data.Id;
        self.name = ko.observable(data.Name);
        self.description = ko.observable(data.Description);
        self.companyId = data.CompanyId;
    }

    return JobType;
});