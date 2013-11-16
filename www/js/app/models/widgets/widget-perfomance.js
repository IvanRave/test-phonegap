// Well widget perfomance
define(['knockout'], function (ko) {
    'use strict';

    // Subtype from Widget
    function WidgetPerfomance(opts, widgockItem) {
        var self = this;
        opts = opts || {};

        self.perfomanceView = widgockItem.getWidgout().getParent().perfomancePartial.createPerfomanceView({
            isVisibleForecastData: false,
            selectedAttrGroupId: opts.SelectedAttrGroupId
            ////endYear: 2010,
            ////startYear: 2007
        });

        self.toPlainOpts = function () {
            return {
                'SelectedAttrGroupId': ko.unwrap(self.perfomanceView.selectedAttrGroupId)
            };
        };
    }

    return WidgetPerfomance;
});