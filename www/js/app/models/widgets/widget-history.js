define(['knockout', 'app/models/well-partials/history-view'], function (ko, HistoryView) {
    'use strict';

    // History widget with date filter, asc or desc
    function WidgetHistory(opts, koHistoryList) {
        var self = this;
        opts = opts || {};
        
        self.historyView = new HistoryView(opts, koHistoryList);

        self.toPlainOpts = function () {
            return {
                'StartDate': ko.unwrap(self.historyView['startDate']),
                'EndDate': ko.unwrap(self.historyView['endDate']),
                'SortByDateOrder': ko.unwrap(self.historyView['sortByDateOrder'])
            };
        };
    }

    return WidgetHistory;
});