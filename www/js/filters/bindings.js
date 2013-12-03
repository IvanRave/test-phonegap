define(['jquery', 'knockout', 'moment', 'helpers/modal-helper', 'jquery.slimscroll', 'jquery.bootstrap', 'picker.date'], function ($, ko, appMoment, bootstrapModal) {
    'use strict';

    // Controls whether or not the text in a textbox is selected based on a model property
    ko.bindingHandlers.selected = {
        init: function (elem, valueAccessor) {
            $(elem).blur(function () {
                var boundProperty = valueAccessor();
                if (ko.isWriteableObservable(boundProperty)) {
                    boundProperty(false);
                }
            });
        },
        update: function (elem, valueAccessor) {
            var shouldBeSelected = ko.utils.unwrapObservable(valueAccessor());
            if (shouldBeSelected) {
                $(elem).select();
            }
        }
    };

    ko.bindingHandlers.placeholder = {
        init: function (elem, valueAccessor) {
            var placeholderText = ko.utils.unwrapObservable(valueAccessor()),
                input = $(elem);

            input.attr('placeholder', placeholderText);
        }
    };

    ko.bindingHandlers.date = {
        update: function (element, valueAccessor) {
            if (ko.unwrap(valueAccessor())) {
                element.innerHTML = appMoment(new Date(ko.unwrap(valueAccessor()))).format('YYYY-MM-DD');
            }
        }
    };

    ko.bindingHandlers.unix = {
        update: function (element, valueAccessor) {
            if (ko.unwrap(valueAccessor())) {
                element.innerHTML = appMoment(ko.unwrap(valueAccessor()) * 1000).format('YYYY-MM-DD');
            }
        }
    };

    ko.bindingHandlers.prec = {
        update: function (element, valueAccessor) {
            var p = ko.unwrap(valueAccessor().value);

            if ($.isNumeric(p) === false) {
                element.innerHTML = "";
                return;
            }

            p = p * valueAccessor().coef();

            if (p === 0) {
                element.innerHTML = 0;
            }
            else if (p < 1) {
                var i = 0;
                while (p < 1) {
                    i -= 1;
                    p *= 10;
                }

                element.innerHTML = String(Math.round(p * 100) / 100) + 'x10<sup>' + i + '</sup>';
            }
            else {
                element.innerHTML = String(Math.round(p * 100) / 100);
            }
        }
    };

    ko.bindingHandlers.hidden = {
        update: function (element, valueAccessor) {
            ko.bindingHandlers.visible.update(element, function () {
                return !ko.utils.unwrapObservable(valueAccessor());
            });
        }
    };

    ko.bindingHandlers.scroller = {
        init: function (element) {
            $(element).slimScroll({
                railVisible: true,
                alwaysVisible: true,
                color: '#fcfcfc',
                //distance: '0',
                position: 'right',
                ////width: 210,
                // move page scroll with this scroll
                allowPageScroll: true
            });

            var jqrWindow = $(window);

            function redrawBlock() {
                var curHeight = jqrWindow.height(),
                    curWidth = jqrWindow.width();

                if ($.isNumeric(curHeight)) {
                    // Convert to numbers (if not)
                    curHeight = +curHeight;
                    curWidth = +curWidth;

                    // 992px - small size in bootstrap - min width for div with scroll
                    var minWidth = 992,
                        topMargin = 32,
                        bottomMargin = 50,
                        defaultMenuWidth = 210;

                    var needHeight,
                        needWidth;
                    if (curWidth >= minWidth) {
                        needHeight = curHeight - topMargin - bottomMargin;
                        needWidth = defaultMenuWidth;
                    }
                    else {
                        needHeight = 'auto'; // by content
                        needWidth = curWidth; // full width
                    }

                    $(element).parent().height(needHeight);
                    $(element).height(needHeight);

                    $(element).parent().width(needWidth);
                    $(element).width(needWidth);
                }

                ////$(element).slimScroll({
                ////    railVisible: true,
                ////    alwaysVisible: true
                ////});
            }

            jqrWindow.resize(redrawBlock);

            redrawBlock();
        }
    };

    ko.bindingHandlers.datepicker = {
        init: function (element, valueAccessor, allBindings) {
            // Initialize datepicker with some optional options
            var curValue = valueAccessor();

            if (ko.isObservable(curValue)) {
                var options = allBindings.get('datepickerOptions') || {};

                var $input = $(element).pickadate(options);
                var picker = $input.pickadate('picker');

                var initialValue = ko.unwrap(curValue);

                if (initialValue) {
                    // convert to ms
                    initialValue = initialValue * 1000;
                    // convert to local time to show in input
                    var startUtcOffset = new Date(initialValue).getTimezoneOffset() * 60 * 1000;
                    initialValue -= startUtcOffset;
                    ////console.log('set as a start value in input: with utc', new Date(initialValue).toISOString());
                    picker.set('select', initialValue);
                }

                picker.on({
                    set: function (event) {
                        ////console.log('on Set call with event: ', event);

                        ////var selectedObj = picker.get('select');
                        ////console.log('slcObj', selectedObj);
                        // select - UTC unix time
                        ////console.log(event);
                        if (event.hasOwnProperty('select')) {
                            var unixTimeMs = event.select;
                            if (unixTimeMs) {
                                // offset in seconds
                                var utcOffset = new Date(unixTimeMs).getTimezoneOffset() * 60;
                                ////console.log('withoututc', unixTimeMs / 1000 - utcOffset);
                                // Save as UTC unix time (seconds)
                                curValue(unixTimeMs / 1000 - utcOffset);
                            }
                        }
                        else if (event.hasOwnProperty('clear')) {
                            ////console.log('clear setting');
                            // Set to null by clear event
                            // Do not set to null because of pickadate set undefined when choose year or month from select
                            curValue(null);
                        }
                    }
                });

                ////options.onSet = function (event) {

                ////};

                ////options.max = new Date();

                ////$(element).pickadate(options);
            }
        },
        update: function (element, valueAccessor) {
            var curValue = valueAccessor();

            if (ko.isObservable(curValue)) {
                var initialValue = ko.unwrap(curValue);
                //var setArchFunction = picker.on();
                ////console.log('pickerOn', picker);

                if (!initialValue) {
                    var picker = $(element).pickadate('picker');
                    // TODO: turn off onSet 
                    // then set any value
                    // then turn on previous onSet
                    picker.set('clear');
                }
            }
            ////    var picker = $(element).pickadate('picker');

            ////    var curVal = ko.unwrap(valueAccessor());

            ////    console.log('picker', picker);
            ////    console.log(curVal);

            ////    ////if (curVal) {
            ////    ////    // Convert to unit time miliseconds
            ////    ////    curVal = curVal * 1000;
            ////    ////    console.log('curval', new Date(curVal).toISOString());
            ////    ////    // Get utc offset

            ////    ////    //var utcOffset = new Date(curVal).getTimezoneOffset() * 60;
            ////    ////    // Diff UTC
            ////    ////    //curVal = curVal - utcOffset;

            ////    ////    picker.set('select', curVal);
            ////    ////}
        }
    };

    // for bootstrap dropdown (wich not loaded correctly by data-toggle in external page)
    ko.bindingHandlers.drpdwn = {
        init: function (element) {
            $(element).dropdown();
        }
    };

    // for canvas log section
    ko.bindingHandlers.drawCnvsLog = {
        init: function (drawCnvs) {
            var startX = 0,
            startY = 0,
            lastX = 0,
            lastY = 0,
            isPainting = false;

            var drawCntx = drawCnvs.getContext('2d');
            drawCntx.strokeStyle = '#000';
            drawCntx.lineWidth = 0.5;

            $(drawCnvs).on('mousedown', function (e) {
                startX = e.pageX - $(this).offset().left;
                startY = e.pageY - $(this).offset().top;
                isPainting = true;
            }).on('mouseup', function (e) {
                // when mouseleave than 
                if (isPainting === true) {
                    lastX = e.pageX - $(this).offset().left;
                    lastY = e.pageY - $(this).offset().top;
                    drawCntx.clearRect(0, 0, drawCnvs.width, drawCnvs.height);
                    isPainting = false;
                    ////drawLineCntx(startX + $(this).offset().left, startY + $(this).offset().top, lastX + $(this).offset().left, lastY + $(this).offset().top);

                    require(['helpers/log-helper'], function (logHelper) {
                        logHelper.drawLineCntx(startX, startY, lastX, lastY);
                    });
                }
            }).on('mouseleave', function () {
                // cancel painting
                if (isPainting === true) {
                    drawCntx.clearRect(0, 0, drawCnvs.width, drawCnvs.height);
                    isPainting = false;
                }
            }).on('mousemove', function (e) {
                if (isPainting === true) {
                    lastX = e.pageX - $(this).offset().left;
                    lastY = e.pageY - $(this).offset().top;
                    drawCntx.clearRect(0, 0, drawCnvs.width, drawCnvs.height);
                    require(['helpers/log-helper'], function (logHelper) {
                        logHelper.drawLineCntxPart(drawCntx, startX, startY, lastX, lastY);
                    });
                }
            });
        }
    };

    // svg graph (like perfomance)
    ko.bindingHandlers.svgResponsive = {
        init: function (element, valueAccessor) {
            function updateWidth() {
                valueAccessor().tmpPrfGraphWidth($(element).parent().width());
            }

            // When change window size - update graph size
            $(window).resize(updateWidth);

            // When toggle left menu - update graph size
            valueAccessor().tmpIsVisibleMenu.subscribe(updateWidth);

            // Update initial
            updateWidth();
            // svg viewbox size need to init before creating of this element
        }
    };

    ko.bindingHandlers.panzoomImg = {
        init: function (element, valueAccessor) {
            var imgSrc = ko.unwrap(valueAccessor().src);
            $(element).on('click', function (e) {
                e.preventDefault();
                bootstrapModal.openModalPanzoomWindow(imgSrc);
            });
        }
    };

    ko.bindingHandlers.svgZoomGraph = {
        update: function (element, valueAccessor) {
            var dataSet = ko.unwrap(valueAccessor().filteredByDateProductionDataSet);
            if (dataSet.length === 0) { return; }

            var graph = {
                axis: ko.unwrap(valueAccessor().prfGraphAxis),
                zoom: ko.unwrap(valueAccessor().prfGraphZoom),
                viewBox: ko.unwrap(valueAccessor().prfGraphViewBox),
                svgPath: ko.unwrap(valueAccessor().productionDataSetSvgPath)
            };

            // Zoom coefficient for plus/minus buttons
            var scaleCoef = 1.1;
            var diffX = (graph.viewBox.width / 2) * (scaleCoef - 1),
                diffY = (graph.viewBox.height / 2) * (scaleCoef - 1);

            require(['d3'], function (d3) {

                var graphWrap = d3.select(element);

                function redrawGraph() {
                    // Redraw each curve (JSON obj)
                    $.each(graph.svgPath, function (elemKey, elemVal) {
                        graphWrap.select('.svg-prf-graph-g').select('#grp-' + elemKey).attr('d', elemVal(dataSet));
                    });

                    // Redraw x axis
                    graphWrap.select('.axis.x').call(graph.axis.x);

                    // Redraw y axis
                    graphWrap.select('.axis.y').call(graph.axis.y);
                }

                // When zooming redraw graph
                graph.zoom.on('zoom', redrawGraph);

                // Apply zoom to whole graph (axis + lines)
                graphWrap.select('.graph-zoom-rect').call(graph.zoom);

                graphWrap.select('.zoom-in').on('click', function () {
                    graph.zoom.scale(graph.zoom.scale() * scaleCoef);

                    var tmpTr = graph.zoom.translate();
                    tmpTr[0] -= diffX;
                    tmpTr[1] -= diffY;
                    graph.zoom.translate(tmpTr);

                    redrawGraph();

                    // Previous graph state - before click
                    ////var prevGraph = {
                    ////    // by default = 1
                    ////    scale: graph.zoom.scale(),
                    ////    // by default = [0,0]
                    ////    translate: graph.zoom.translate()
                    ////};

                    ////// Previous width of graph = Initial width * previous zoom
                    ////prevGraph.width = graph.viewBox.width / prevGraph.scale;
                    ////prevGraph.height = graph.viewBox.height / prevGraph.scale;

                    ////// 1 -> 2 -> 4 -> 8 -> 16
                    ////// Current graph state - after click
                    ////var curGraph = {
                    ////    scale: prevGraph.scale + scaleCoef,
                    ////    translate: []
                    ////};

                    ////graph.zoom.scale(curGraph.scale);

                    ////curGraph.width = prevGraph.width / curGraph.scale;
                    ////curGraph.height = prevGraph.height / curGraph.scale;

                    ////curGraph.translate[0] = prevGraph.translate[0] - ((prevGraph.width - curGraph.width) / 2);
                    ////curGraph.translate[1] = prevGraph.translate[1] - ((prevGraph.height - curGraph.height) / 2);

                    ////graph.zoom.translate(curGraph.translate);
                    //////    // dx = (x * cf - x)/2

                    //////    tmpTranslate[0] -= (prfGraphViewBox.width * tmpZoom - prfGraphViewBox.width) / 2;
                    //////    tmpTranslate[1] -= (prfGraphViewBox.height * tmpZoom - prfGraphViewBox.height) / 2;
                    //////    prfGraphZoom.translate(tmpTranslate);

                });

                graphWrap.select('.zoom-out').on('click', function () {
                    ////if (tmpSc > 1) {
                    graph.zoom.scale(graph.zoom.scale() / scaleCoef);

                    var tmpTr = graph.zoom.translate();
                    tmpTr[0] += diffX;
                    tmpTr[1] += diffY;
                    graph.zoom.translate(tmpTr);

                    redrawGraph();
                    ////}
                    ////var tmpZoom = prfGraphZoom.scale();
                    ////// 1 -> 1/2 -> 1/4 -> 1/8 -> 1/16
                    ////if ($.isNumeric(tmpZoom)) {
                    ////    tmpZoom = tmpZoom / zoomCoef;
                    ////    prfGraphZoom.scale(tmpZoom);

                    ////    var tmpTranslate = prfGraphZoom.translate();
                    ////    tmpTranslate[0] += (1110 * (zoomCoef - 1)) / 2;
                    ////    tmpTranslate[1] += (370 * (zoomCoef - 1)) / 2;

                    ////    prfGraphZoom.translate(tmpTranslate);

                    ////    redrawGraph();
                    ////    console.log(tmpZoom);
                    ////}
                });

                // Redraw graph once like initial zoom event
                redrawGraph();
            });
        }
    };
});