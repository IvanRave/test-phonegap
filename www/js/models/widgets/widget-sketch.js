define(['knockout'], function (ko) {
    'use strict';

    // Widget for sketch (image plus desc)
    function WidgetSketch(opts) {
        var self = this;
        opts = opts || {};

        self.isVisImg = ko.observable(opts.IsVisImg);
        self.isVisDescription = ko.observable(opts.IsVisDescription);

        self.toPlainOpts = function () {
            return {
                'IsVisImg': ko.unwrap(self.isVisImg),
                'IsVisDescription': ko.unwrap(self.isVisDescription)
            };
        };
    }

    return WidgetSketch;
});