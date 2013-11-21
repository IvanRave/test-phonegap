// Well widget perfomance
define(['knockout'], function (ko) {
    'use strict';

    // Subtype from Widget
    function WidgetPerfomance(opts, widgockItem) {
        var self = this;
        opts = opts || {};

        self.perfomanceView = widgockItem.getWidgout().getParent().perfomancePartial.createPerfomanceView({
            isVisibleForecastData: opts['IsVisibleForecastData'],
            selectedAttrGroupId: opts['SelectedAttrGroupId'],
            endYear: opts['EndYear'],
            startYear: opts['StartYear'],
            endMonth: opts['EndMonth'],
            startMonth: opts['StartMonth']
        });

        self.toPlainOpts = function () {
            return {
                'SelectedAttrGroupId': ko.unwrap(self.perfomanceView['selectedAttrGroupId']),
                'IsVisibleForecastData': ko.unwrap(self.perfomanceView['isVisibleForecastData']),
                'EndYear': ko.unwrap(self.perfomanceView['WPDDateEndYear']),
                'StartYear': ko.unwrap(self.perfomanceView['WPDDateStartYear']),
                'EndMonth': ko.unwrap(self.perfomanceView['WPDDateEndMonth']),
                'StartMonth': ko.unwrap(self.perfomanceView['WPDDateStartMonth'])
            };
        };
    }

    return WidgetPerfomance;
});