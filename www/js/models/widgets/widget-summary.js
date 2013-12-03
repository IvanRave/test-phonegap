define(['jquery', 'knockout'], function ($, ko) {
    'use strict';

    // Widget for summary well info
    function WidgetSummary(opts, wellPropertyList) {
        var self = this;
        opts = opts || {};

        $.each(wellPropertyList, function (wellPropIndex, wellProp) {
            self['isVis' + wellProp.id] = ko.observable(opts['IsVis' + wellProp.id]);
        });

        self.toPlainOpts = function () {
            var obj = {};
            $.each(wellPropertyList, function (wellPropIndex, wellProp) {
                obj['IsVis' + wellProp.id] = ko.unwrap(self['isVis' + wellProp.id]);
            });

            return obj;
        };
    }

    return WidgetSummary;
});