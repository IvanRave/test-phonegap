define(['jquery', 'knockout'], function ($, ko) {
    'use strict';

    // Well history view for history section, report section and history widgets
    function HistoryView(opts, koHistoryList) {
        var vw = this;

        // UTC unix time (in seconds)
        vw.startDate = ko.observable(opts['StartDate']);
        vw.endDate = ko.observable(opts['EndDate']);

        vw.sortByDateOrder = ko.observable(opts['SortByDateOrder'] || -1);

        vw.sortByDateCss = ko.computed({
            read: function () {
                return ko.unwrap(vw.sortByDateOrder) === 1 ? 'glyphicon-arrow-down' : 'glyphicon-arrow-up';
            },
            deferEvaluation: true
        });

        vw.sortedHistoryList = ko.computed(function () {
            var sortFilterArr = ko.unwrap(koHistoryList);

            // In unix time
            var tmpStartDate = ko.unwrap(vw.startDate),
                tmpEndDate = ko.unwrap(vw.endDate);

            if (tmpStartDate || tmpEndDate) {
                sortFilterArr = $.grep(sortFilterArr, function (elemValue) {
                    var tmpElemStartDate = ko.unwrap(elemValue.StartDate);
                    if (tmpStartDate && (new Date(tmpStartDate * 1000) > new Date(tmpElemStartDate))) {
                        return false;
                    }

                    var tmpElemEndDate = ko.unwrap(elemValue.EndDate);

                    if (tmpEndDate && (new Date(tmpEndDate * 1000) < new Date(tmpElemEndDate))) {
                        return false;
                    }

                    return true;
                });
            }

            var tmpOrder = parseInt(ko.unwrap(vw.sortByDateOrder), 10);

            return sortFilterArr.sort(function (left, right) {
                return left.StartDate() === right.StartDate() ? 0 : (left.StartDate() > right.StartDate() ? tmpOrder : -tmpOrder);
            });
        });

        vw.changeSortByDateOrder = function () {
            vw.sortByDateOrder(-parseInt(ko.unwrap(vw.sortByDateOrder), 10));
        };
    }

    return HistoryView;
});