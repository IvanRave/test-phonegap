define(['jquery', 'knockout',
    'app/datacontext',
    'app/models/widgets/widget-perfomance',
    'app/models/widgets/widget-summary',
    'app/models/widgets/widget-sketch'
], function ($, ko, appDatacontext, WidgetPerfomance, WidgetSummary, WidgetSketch) {
    'use strict';

    // Supertype
    function Widget(data, widgockItem) {
        var self = this;
        data = data || {};

        self.getWidgock = function () {
            return widgockItem;
        };

        // Properties
        self.id = data.Id;
        self.name = ko.observable(data.Name);
        self.sectionId = data.SectionId;
        self.widgockId = data.WidgockId;
        self.orderNumber = ko.observable(data.OrderNumber);

        self.widgetTpl = self.sectionId + '-widget-tpl';

        self.isVisSettingPanel = ko.observable(false);

        self.showVisSettingPanel = function () {
            self.isVisSettingPanel(true);
        };

        self.putWidget = function () {
            appDatacontext.putWidget(self.widgockId, self.id, self.toPlainJson()).done(function () {
                self.isVisSettingPanel(false);
            });

            console.log('saved');
        };

        self.processWidget = function () {
            console.log('process widget');
        };

        var optsObj = JSON.parse(data.Opts);
        ////self.optsObj = ko.observable({});

        ////$.each(JSON.parse(data.Opts), function (elemKey, elemValue) {
        ////    ko.unwrap(self.optsObj)[elemKey] = ko.observable(elemValue);
        ////});

        if (self.sectionId === 'perfomance') {
            WidgetPerfomance.call(self, optsObj, self.getWidgock());
        }
        else if (self.sectionId === 'summary') {
            WidgetSummary.call(self, optsObj);
        }
        else if (self.sectionId === 'sketch') {
            WidgetSketch.call(self, optsObj);
        }

        self.toPlainJson = function () {           
            return {
                id: ko.unwrap(self.id),
                name: ko.unwrap(self.name),
                sectionId: ko.unwrap(self.sectionId),
                widgockId: ko.unwrap(self.widgockId),
                orderNumber: ko.unwrap(self.orderNumber),
                opts: JSON.stringify(self.toPlainOpts())
            };
        };
    }

    return Widget;
});