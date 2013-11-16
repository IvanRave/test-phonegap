define(['knockout'], function (ko) {
    'use strict';

    // Widget for summary well info
    function WidgetSummary(opts) {
        var self = this;
        opts = opts || {};

        self.isVisName = ko.observable(opts.IsVisName);
        self.isVisDescription = ko.observable(opts.IsVisDescription);
        self.isVisProductionHistory = ko.observable(opts.IsVisProductionHistory);

        self.toPlainOpts = function () {
            return {
                'IsVisName': ko.unwrap(self.isVisName),
                'IsVisDescription': ko.unwrap(self.isVisDescription),
                'IsVisProductionHistory': ko.unwrap(self.isVisProductionHistory)
            };
        };
    }

    return WidgetSummary;
});