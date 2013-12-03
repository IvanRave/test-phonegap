define(['jquery', 'knockout', 'services/datacontext', 'models/widget', 'helpers/app-helper'], function ($, ko, appDatacontext, Widget, appHelper) {
    'use strict';

    // Well widget layout list
    function importWidgetList(data, widgockItem) {
        return $.map(data || [], function (item) { return new Widget(item, widgockItem); });
    }

    // Widget block of widget layout
    // Widget layout divides to widget blocks
    // Widget block divibed to widgets
    function Widgock(data, widgoutItem) {
        var self = this;
        data = data || {};

        self.getWidgout = function () {
            return widgoutItem;
        };

        self.id = data.Id;
        self.orderNumber = ko.observable(data.OrderNumber);
        self.columnCount = ko.observable(data.ColumnCount);

        self.columnStyle = ko.computed({
            read: function () {
                return 'col-md-' + ko.unwrap(self.columnCount);
            },
            deferEvaluation: true
        });

        self.widgetList = ko.observableArray();

        self.sectionIdList = ['perfomance', 'summary', 'sketch', 'history'];

        self.selectedSectionId = ko.observable();

        self.addWidget = function () {
            var sectionId = ko.unwrap(self.selectedSectionId);
            if (sectionId) {
                var tmpWidgetList = ko.unwrap(self.widgetList);
                // Get order number of last widget
                var lastOrderNumber;

                if (tmpWidgetList.length > 0) {
                    lastOrderNumber = ko.unwrap(tmpWidgetList[tmpWidgetList.length - 1].orderNumber);
                }
                else {
                    lastOrderNumber = 0;
                }

                appDatacontext.postWidget(self.id, {
                    Name: appHelper.capitalizeFirst(sectionId),
                    SectionId: sectionId,
                    OrderNumber: lastOrderNumber + 1,
                    Opts: '{}',
                    WidgockId: self.id
                }).done(function (createdWidget) {
                    var widgetNew = new Widget(createdWidget, self);
                    self.widgetList.push(widgetNew);
                    widgetNew.showVisSettingPanel();
                });
            }
        };

        self.deleteWidget = function (widgetToDelete) {
            if (confirm('Are you sure you want to delete "' + ko.unwrap(widgetToDelete.name) + '"?')) {
                appDatacontext.deleteWidget(widgetToDelete.widgockId, widgetToDelete.id).done(function () {
                    self.widgetList.remove(widgetToDelete);
                });
            }
        };

        self.widgetList(importWidgetList(data.WidgetDtoList, self));
    }

    return Widgock;
});