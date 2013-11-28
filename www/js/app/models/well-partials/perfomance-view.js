define(['jquery',
    'knockout',
    'd3'
], function ($, ko, d3) {
    'use strict';

    function PerfomanceView(optns, prfPartial) {
        var vw = this;

        vw.prfPartial = prfPartial;

        vw.isVisibleForecastData = ko.observable(optns.isVisibleForecastData);

        vw.selectedPrfTableYear = ko.observable();
        vw.selectPrfTableYear = function (selectedPrfTableYearItem) {
            vw.selectedPrfTableYear(selectedPrfTableYearItem);
        };

        vw.monthList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

        vw.WPDDateStartYear = ko.observable(optns.startYear);
        vw.WPDDateEndYear = ko.observable(optns.endYear);
        vw.WPDDateStartMonth = ko.observable(optns.startMonth);
        vw.WPDDateEndMonth = ko.observable(optns.endMonth);

        function updateSelectedPrfTableYear() {
            var tmpWpdDateStartYear = ko.unwrap(vw.WPDDateStartYear),
                tmpWpdDateEndYear = ko.unwrap(vw.WPDDateEndYear),
                tmpSelectedPrfTableYear = ko.unwrap(vw.selectedPrfTableYear);

            if (tmpWpdDateStartYear && tmpWpdDateEndYear) {
                if (!tmpSelectedPrfTableYear || tmpSelectedPrfTableYear < tmpWpdDateStartYear || tmpSelectedPrfTableYear > tmpWpdDateEndYear) {
                    vw.selectedPrfTableYear(tmpWpdDateStartYear);
                }
            }
        }

        vw.WPDDateStartYear.subscribe(updateSelectedPrfTableYear);
        vw.WPDDateEndYear.subscribe(updateSelectedPrfTableYear);

        // Id of group (squad) of wfm parameters
        // Can be set through options (optns) or using any html view
        vw.selectedAttrGroupId = ko.observable(optns.selectedAttrGroupId);

        vw.selectedAttrGroup = ko.computed({
            read: function () {
                var tmpWfmParamSquadList = ko.unwrap(prfPartial.getWellObj().getWellGroup().getWellField().getWellRegion().getParentViewModel().wfmParamSquadList);

                var tmpAttrGroup = $.grep(tmpWfmParamSquadList, function (elemValue) {
                    return elemValue.id === ko.unwrap(vw.selectedAttrGroupId);
                });

                if (tmpAttrGroup.length > 0) {
                    return tmpAttrGroup[0];
                }
            },
            deferEvaluation: true
        });

        vw.selectAttrGroupId = function (attrGroupId) {
            vw.selectedAttrGroupId(attrGroupId);
        };

        // Well group parameters for selected squad
        vw.selectedWellGroupWfmParameterList = ko.computed({
            read: function () {
                var resultArr = [];
                var tmpSelectedAttrGroup = ko.unwrap(vw.selectedAttrGroup);
                if (tmpSelectedAttrGroup) {
                    // list of wg parameters for this well group
                    var tmpWellGroupWfmParameterList = ko.unwrap(prfPartial.getWellObj().getWellGroup().wellGroupWfmParameterList);

                    // list of parameter for selected squad
                    var tmpSelectedWfmParameterList = ko.unwrap(tmpSelectedAttrGroup.wfmParameterList);

                    // Select only parameter ids
                    var tmpSelectedWfmParameterIdList = $.map(tmpSelectedWfmParameterList, function (ssgElem) {
                        return ssgElem.id;
                    });

                    // return only well group wfm parameters in selected squad
                    resultArr = $.grep(tmpWellGroupWfmParameterList, function (wgpElem) {
                        return $.inArray(wgpElem.wfmParameterId, tmpSelectedWfmParameterIdList) >= 0;
                    });
                }

                return resultArr;
            },
            deferEvaluation: true
        });

        vw.filteredByDateProductionDataSet = ko.computed({
            read: function () {
                ////if (!ko.unwrap(vw.WPDDateStartYear)) {

                ////}
                var resultArr = [];

                var tmpHstProductionDataSet = ko.unwrap(prfPartial.hstProductionDataSet),
                    tmpHistYearList = ko.unwrap(prfPartial.histYearList);

                if (tmpHstProductionDataSet.length > 0 && tmpHistYearList.length > 0) {
                    // Forecast tmp
                    var tmpDcaProductionDataSet = ko.unwrap(prfPartial.dcaProductionDataSet),
                        tmpIsVisibleForecastData = ko.unwrap(vw.isVisibleForecastData) ? true : false;

                    var prdArray;
                    if (tmpIsVisibleForecastData) {
                        prdArray = tmpDcaProductionDataSet.concat(tmpHstProductionDataSet);
                    }
                    else {
                        prdArray = tmpHstProductionDataSet;
                    }

                    // Set bound dates if undefined
                    if (!ko.unwrap(vw.WPDDateStartYear)) {
                        vw.WPDDateStartYear(tmpHistYearList[0]);
                    }

                    if (!ko.unwrap(vw.WPDDateEndYear)) {
                        vw.WPDDateEndYear(tmpHistYearList[0]);
                    }

                    if (!ko.unwrap(vw.WPDDateStartMonth)) {
                        vw.WPDDateStartMonth(1);
                    }

                    if (!ko.unwrap(vw.WPDDateEndMonth)) {
                        vw.WPDDateEndMonth(12);
                    }
                    // ----
                    // TODO: change WPDDate to right names
                    var tmpStartYear = ko.unwrap(vw.WPDDateStartYear),
                        tmpEndYear = ko.unwrap(vw.WPDDateEndYear),
                        tmpStartMonth = ko.unwrap(vw.WPDDateStartMonth),
                        tmpEndMonth = ko.unwrap(vw.WPDDateEndMonth);

                    // Seconds from Unix Epoch
                    var startUnixTime = new Date(Date.UTC(tmpStartYear, tmpStartMonth - 1, 1)).getTime() / 1000;
                    var endUnixTime = new Date(Date.UTC(tmpEndYear, tmpEndMonth - 1, 1)).getTime() / 1000;

                    resultArr = ko.utils.arrayFilter(prdArray, function (r) {
                        return ((r.unixTime >= startUnixTime) && (r.unixTime <= endUnixTime));
                    });
                }

                return resultArr;
            },
            deferEvaluation: true
        });

        // Real time border: min and max values in unix time format
        // This time border other than WPDDateStartYear, EndYear (ant other selectable values)
        vw.filteredByDateProductionDataSetTimeBorder = ko.computed({
            read: function () {
                var arr = ko.unwrap(vw.filteredByDateProductionDataSet);
                if (arr.length === 0) { return []; }

                return [arr[arr.length - 1].unixTime, arr[0].unixTime];
            },
            deferEvaluation: true
        });

        // Real value border: min and max values of data in selected squad
        vw.filteredByDateProductionDataSetValueBorder = ko.computed({
            read: function () {
                // get max and min value to find coef for graph
                var minValue, maxValue;

                $.each(ko.unwrap(vw.filteredByDateProductionDataSet), function (prfIndex, prfElem) {
                    $.each(ko.unwrap(vw.selectedWellGroupWfmParameterList), function (clmIndex, clmElem) {
                        if (ko.unwrap(clmElem.isVisible)) {
                            if ($.isNumeric(ko.unwrap(prfElem[clmElem.wfmParameterId]))) {
                                var tmpValue = ko.unwrap(prfElem[clmElem.wfmParameterId]) * ko.unwrap(clmElem.wfmParameter().uomCoef);
                                // init first values
                                if (typeof minValue === 'undefined' || typeof maxValue === 'undefined') {
                                    minValue = maxValue = tmpValue;
                                }
                                else {
                                    if (tmpValue > maxValue) { maxValue = tmpValue; }
                                    else if (tmpValue < minValue) { minValue = tmpValue; }
                                }
                            }
                        }
                    });
                });

                // Plus (top and bottom) margin 5% - monotone function can be overdrawen out of graph wrap border
                if (typeof (minValue) !== 'undefined') {
                    minValue -= minValue / 20;
                    maxValue += maxValue / 20;
                }

                // Still can be undefined
                return [minValue, maxValue];
            },
            deferEvaluation: true
        });

        // =============================== Perfomance graph ================================
        vw.prfGraph = {
            // Width -> Height
            ratio: 1 / 3,
            // size, depended of svg viewbox: 1200/400 minus all margins
            viewBox: {
                width: 1110,
                height: 370,
                // divide by 80 or 20 (where scale)
                margin: {
                    top: 10,
                    right: 30,
                    bottom: 20,
                    left: 60
                },
            },
            axisSize: 10
        };

        // actual width of graph and x-axis
        // real size of svg
        vw.prfGraph.width = ko.observable();

        // actual height of graph and y-axis
        vw.prfGraph.height = ko.computed({
            read: function () {
                var tmpWidth = ko.unwrap(vw.prfGraph.width);
                if (tmpWidth && $.isNumeric(tmpWidth)) {
                    return tmpWidth * vw.prfGraph.ratio;
                }
            },
            deferEvaluation: true
        });

        vw.prfGraph.axis = {
            x: d3.svg.axis().tickSize(-vw.prfGraph.viewBox.height),
            y: d3.svg.axis().orient('left').tickSize(-vw.prfGraph.viewBox.width)
        };

        // Min and max zoom coeficient - 1 by default - without zoom
        ////vw.prfGraph.scaleBorder = [0.0001, 10000];

        vw.prfGraph.zoom = d3.behavior.zoom().scaleExtent([0.0001, 10000]);

        function getSvgPath(paramList, timeBorder, valueBorder) {
            var resultJson = {};

            // Check parameter and data existence
            // dataSet.length > 0 &&
            if (paramList.length > 0 &&
                $.isNumeric(timeBorder[0]) &&
                $.isNumeric(timeBorder[1]) &&
                $.isNumeric(valueBorder[0]) &&
                $.isNumeric(valueBorder[1])) {

                var x = d3.time.scale()
                    .range([0, vw.prfGraph.viewBox.width])
                    .domain([new Date(timeBorder[0] * 1000), new Date(timeBorder[1] * 1000)]);

                var y = d3.scale.linear()
                    .range([vw.prfGraph.viewBox.height, 0])
                    .domain(valueBorder);

                vw.prfGraph.axis.x.scale(x);
                vw.prfGraph.axis.y.scale(y);

                vw.prfGraph.zoom.x(x).y(y);

                // tmp for axis ====================================
                ////var altX = d3.time.scale()
                ////        .domain([t1, t2])
                ////        .range([t1, t2].map(d3.time.scale()
                ////        .domain([t1, t2])
                ////        .range([0, vw.prfGraph.viewBox.width])));
                // end tmp =================================

                $.each(paramList, function (paramIndex, paramElem) {
                    var line = d3.svg.line()
                            .interpolate('monotone') ////monotone //linear
                            .x(function (d) { return x(new Date(d.unixTime * 1000)); })
                            .y(function (d) {
                                return y(
                                    $.isNumeric(ko.unwrap(d[paramElem.wfmParameterId])) ? (ko.unwrap(d[paramElem.wfmParameterId]) * ko.unwrap(ko.unwrap(paramElem.wfmParameter).uomCoef)) : null
                                );
                            });

                    resultJson[paramElem.wfmParameterId] = line;
                    ////resultJson[paramElem.wfmParameterId] = line(dataSet);
                    ////if (ko.unwrap(paramElem.isVisible) === true) {
                    //}
                });
            }

            return resultJson;
        }

        // Update perfomance graph data: graph path for selected regions (d3 line objects in one json object)
        ///<return>{'WaterRate': d3Line, ...}</return>
        vw.productionDataSetSvgPath = ko.computed(function () {
            return getSvgPath(
                    ko.unwrap(vw.selectedWellGroupWfmParameterList),
                    ko.unwrap(vw.filteredByDateProductionDataSetTimeBorder),
                    ko.unwrap(vw.filteredByDateProductionDataSetValueBorder));
        });

        vw.joinedYearList = ko.computed({
            read: function () {
                if (ko.unwrap(vw.isVisibleForecastData)) {
                    return ko.unwrap(prfPartial.forecastYearList).concat(ko.unwrap(prfPartial.histYearList));
                }
                else {
                    return ko.unwrap(prfPartial.histYearList);
                }
            },
            deferEvaluation: true
        });

        return vw;
    }

    return {
        init: function (optns, prfPartialItem) {
            return new PerfomanceView(optns, prfPartialItem);
        }
    };
});