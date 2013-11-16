define(['jquery', 'knockout'], function ($, ko) {
    'use strict';

    // Widget layout
    function Widgout(data, parent) {
        var self = this;
        data = data || {};

        self.getParent = function () {
            return parent;
        };

        self.id = data.Id;
        self.name = ko.observable(data.Name);

        // Well widget block list
        self.widgockList = ko.observableArray();

        // Load widget block list
        require(['app/models/widgock'], function (Widgock) {
            function importWidgockList(data, widgoutItem) {
                return $.map(data || [], function (item) { return new Widgock(item, widgoutItem); });
            }

            self.widgockList(importWidgockList(data.WidgockDtoList, self));
        });
    }

    return Widgout;
});