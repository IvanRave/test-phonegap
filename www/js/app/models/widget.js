define(['jquery', 'knockout',
    'app/datacontext',
    'app/models/widgets/widget-perfomance',
    'app/models/widgets/widget-summary',
    'app/models/widgets/widget-sketch',
    'app/models/widgets/widget-history'
], function ($, ko, appDatacontext, WidgetPerfomance, WidgetSummary, WidgetSketch, WidgetHistory) {
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
        };

        self.processWidget = function () {
            console.log('process widget');
        };

        var optsObj = JSON.parse(data.Opts);
        
        switch (self.sectionId) {
            case 'perfomance':
                WidgetPerfomance.call(self, optsObj, self.getWidgock());
                break;
            case 'summary':
                WidgetSummary.call(self, optsObj, ko.unwrap(self.getWidgock().getWidgout().getParent().wellPropertyList));
                break;
            case 'sketch':
                WidgetSketch.call(self, optsObj);
                break;
            case 'history':
                WidgetHistory.call(self, optsObj, self.getWidgock().getWidgout().getParent().historyList);
                break;
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