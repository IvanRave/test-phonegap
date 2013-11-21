define(['jquery', 'knockout', 'app/datacontext'], function ($, ko, appDatacontext) {
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

        self.putWellWidgout = function () {
            // Get well id as parent
            appDatacontext.putWellWidgout(self.getParent().Id, self.id, {
                id: self.id,
                name: ko.unwrap(self.name)
            });
        };

        self.name.subscribe(self.putWellWidgout);

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