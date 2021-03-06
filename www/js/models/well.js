/**
* A module representing a well.
* @module
* @param {Object} $ - Jquery lib.
*/
define([
    'jquery',
    'knockout',
    'services/datacontext',
    'helpers/file-helper',
    'helpers/modal-helper',
    'helpers/app-helper',
    'moment',
    'models/well-partials/perfomance-partial',
    'models/well-partials/history-view',
    'models/well-file',
    'models/column-attribute',
    'models/well-history',
    'models/test-scope'
], function ($, ko, datacontext, fileHelper, bootstrapModal, appHelper, appMoment, wellPerfomancePartial, HistoryView) {
    'use strict';

    /** WellFiles (convert data objects into array) */
    function importWellFilesDto(data, parent) { return $.map(data || [], function (item) { return datacontext.createWellFile(item, parent); }); }

    /** ColumnAttributes (convert data objects into array) */
    function importColumnAttributesDto(data) { return $.map(data || [], function (item) { return datacontext.createColumnAttribute(item); }); }

    /** WellHistory (convert data objects into array) */
    function importWellHistoryDto(data, parent) { return $.map(data || [], function (item) { return datacontext.createWellHistory(item, parent); }); }

    /** Test scope */
    function importTestScopeDtoList(data, wellItem) { return $.map(data || [], function (item) { return datacontext.createTestScope(item, wellItem); }); }

    /** Well property list */
    var wellPropertyList = [
        { id: 'Name', ttl: 'Name', tpe: 'SingleLine' },
        { id: 'Description', ttl: 'Description', tpe: 'MultiLine' },
        { id: 'DrillingDate', ttl: 'Drilling date', tpe: 'DateLine' },
        { id: 'ProductionHistory', ttl: 'Production history', tpe: 'MultiLine' },
        { id: 'CompletionType', ttl: 'Completion type', tpe: 'MultiLine' },
        { id: 'FormationCompleteState', ttl: 'Formation complete state', tpe: 'MultiLine' },
        { id: 'IntegrityStatus', ttl: 'Integrity status', tpe: 'MultiLine' },
        { id: 'LastInterventionType', ttl: 'Last intervention type', tpe: 'MultiLine' },
        { id: 'LastInterventionDate', ttl: 'Last intervention date', tpe: 'DateLine' },
        { id: 'PerforationDepth', ttl: 'Perforation depth', tpe: 'MultiLine' },
        { id: 'PressureData', ttl: 'Pressure data', tpe: 'MultiLine' },
        { id: 'Pvt', ttl: 'PVT', tpe: 'MultiLine' },
        { id: 'ReservoirData', ttl: 'Reservoir data', tpe: 'MultiLine' },
    ];

    /**
     * Well model.
     * @param {Object} data - Well data.
     * @param {Object} wellGroup - Well group.
     * @constructor
     */
    function Well(data, wellGroup) {
        var self = this;
        data = data || {};

        self.getWellGroup = function () {
            return wellGroup;
        };

        self.getAppViewModel = function () {
            return self.getWellGroup().getWellField().getWellRegion().getParentViewModel();
        };

        /**
         * Well id
         * @type {number}
         */
        self.Id = data.Id;

        /**
        * Well type
        * @type {string}
        */
        self.WellType = ko.observable(data.WellType);

        /**
        * Flow type
        * @type {string}
        */
        self.FlowType = ko.observable(data.FlowType);

        self.wellPropertyList = wellPropertyList;

        $.each(self.wellPropertyList, function (arrIndex, arrElem) {
            self[arrElem.id] = ko.observable(data[arrElem.id]);
            self['ttl' + arrElem.id] = arrElem.ttl;
        });

        // additional (non-standard) parameters for every well
        self.SketchDesc = ko.observable(data.SketchDesc);
        self.Comment = ko.observable(data.Comment);

        // Foreign key
        self.WellGroupId = data.WellGroupId;

        self.WellFiles = ko.observableArray(); // empty array: []

        self.sectionWellFiles = ko.computed({
            read: function () {
                if (ko.unwrap(self.selectedSectionId)) {
                    return $.grep(ko.unwrap(self.WellFiles), function (wellFile) {
                        return ko.unwrap(wellFile.Purpose) === ko.unwrap(self.selectedSectionId);
                    });
                }
            },
            deferEvaluation: true
        });

        self.isExistsSectionWellFiles = ko.computed({
            read: function () {
                if (ko.unwrap(self.sectionWellFiles)) {
                    return ko.unwrap(self.sectionWellFiles).length > 0;
                }
            },
            deferEvaluation: true
        });

        self.getHashPath = function () {
            var prntGroup = self.getWellGroup();
            var prntField = prntGroup.getWellField();
            var prntRegion = prntField.getWellRegion();
            return '#region/' + prntRegion.Id + '/field/' + prntField.Id + '/group/' + prntGroup.Id + '/well/' + self.Id;
        };

        self.isOpenItem = ko.observable(false);

        self.toggleItem = function () {
            self.isOpenItem(!self.isOpenItem());
        };

        self.isSelectedItem = ko.computed(function () {
            return self === self.getWellGroup().selectedWell();
        });

        self.selectItem = function () {
            window.location.hash = window.location.hash.split('?')[0] + '?' + $.param({
                region: self.getWellGroup().getWellField().getWellRegion().Id,
                field: self.getWellGroup().getWellField().Id,
                group: self.getWellGroup().Id,
                well: self.Id
            });

            // By default - no template - show widget page
            // Previous - by default - summary self.sectionList[0].id;
            var previousSelectedSectionId;

            var prevSlcWellRegion = ko.unwrap(self.getAppViewModel().selectedWellRegion);

            // get previous selected section (if exists)
            if (prevSlcWellRegion) {
                var prevSlcWellField = ko.unwrap(prevSlcWellRegion.selectedWellField);
                if (prevSlcWellField) {
                    var prevSlcWellGroup = ko.unwrap(prevSlcWellField.selectedWellGroup);
                    if (prevSlcWellGroup) {
                        // previous selected well
                        var prevSlcWell = ko.unwrap(prevSlcWellGroup.selectedWell);
                        if (prevSlcWell) {
                            previousSelectedSectionId = ko.unwrap(prevSlcWell.selectedSectionId);

                            // If selected perfomance section
                            var tmpSelectedAttrGroupId = ko.unwrap(prevSlcWell.mainPerfomanceView.selectedAttrGroupId);
                            if (tmpSelectedAttrGroupId) {
                                self.mainPerfomanceView.selectedAttrGroupId(tmpSelectedAttrGroupId);
                            }
                        }
                    }
                }
            }

            // set new selected data (plus region in the end)
            var slcWell = self;
            var slcWellGroup = slcWell.getWellGroup();
            var slcWellField = slcWellGroup.getWellField();
            var slcWellRegion = slcWellField.getWellRegion();

            slcWellRegion.clearSetSelectedWellRegion();

            // set selected items in DESC order (can be redraw each time if ASC order)
            // set selected well
            slcWellGroup.selectedWell(slcWell);

            // set selected well group
            slcWellField.selectedWellGroup(slcWellGroup);

            // set selected well field
            slcWellRegion.selectedWellField(slcWellField);

            console.log(previousSelectedSectionId);
            // if null - then select Dashboard
            self.selectedSectionId(previousSelectedSectionId || null);
        };

        // ======================= file manager section ======================
        // file manager section: like above section but in file manager view
        self.selectedFmgSectionId = ko.observable(null);

        self.selectFmgSection = function (item) {
            self.selectedFmgSectionId(item.id);
        };

        // ========================= view section ===========================
        // section, which user select on the well view
        self.selectedSectionId = ko.observable();

        ///<param>attrGroup - when select PD section need to point attrGroup</param>
        self.selectSection = function (sectionId) {
            window.location.hash = window.location.hash.split('?')[0] + '?' + $.param({
                region: self.getWellGroup().getWellField().getWellRegion().Id,
                field: self.getWellGroup().getWellField().Id,
                group: self.getWellGroup().Id,
                well: self.Id,
                section: sectionId
            });

            self.selectedSectionId(sectionId);
        };

        self.unselectSection = function () {
            window.location.hash = window.location.hash.split('?')[0] + '?' + $.param({
                region: self.getWellGroup().getWellField().getWellRegion().Id,
                field: self.getWellGroup().getWellField().Id,
                group: self.getWellGroup().Id,
                well: self.Id
            });

            self.selectedSectionId(null);
        };

        self.filteredWellFileList = ko.computed(function () {
            if (!self.selectedFmgSectionId()) {
                return self.WellFiles();
            }

            return $.grep(self.WellFiles(), function (elemValue) {
                return elemValue.Purpose === self.selectedFmgSectionId();
            });
        });

        self.logImageList = ko.computed(function () {
            return $.grep(self.WellFiles(), function (elemValue) {
                return ((elemValue.Purpose === 'log') && (elemValue.getExt() === 'png'));
            });
        });

        self.getWellFileList = function (callback, purpose, status) {
            var uqp = { well_id: self.Id };

            if (purpose) {
                uqp.purpose = purpose;
            }

            if (status) {
                uqp.status = status;
            }

            datacontext.getWellFiles(uqp).done(function (response) {
                self.WellFiles(importWellFilesDto(response, self));
                if ($.isFunction(callback) === true) {
                    callback();
                }
            });
        };

        // ==================================================================Well test begin================================================================

        self.testScopeList = ko.observableArray();

        self.sortedTestScopeList = ko.computed(function () {
            return self.testScopeList().sort(function (left, right) {
                return left.startUnixTime() === right.startUnixTime() ? 0 : (left.startUnixTime() < right.startUnixTime() ? 1 : -1);
            });
        });

        self.lastTestScope = ko.observable();

        self.getTestScopeList = function () {
            datacontext.getTestScope({ well_id: self.Id }).done(function (response) {
                self.testScopeList(importTestScopeDtoList(response, self));
            });
        };

        /** Unix time data for creating new test scope */
        self.testScopeNewStartUnixTime = {
            unixDate: ko.observable(),
            hour: ko.observable(0),
            minute: ko.observable(0)
        };

        self.isEnabledPostTestScope = ko.computed({
            read: function () {
                if (ko.unwrap(self.testScopeNewStartUnixTime.unixDate)) {
                    if (ko.unwrap(self.testScopeNewStartUnixTime.hour) >= 0) {
                        if (ko.unwrap(self.testScopeNewStartUnixTime.minute) >= 0) {
                            return true;
                        }
                    }
                }

                return false;
            },
            deferEvaluation: true
        });

        /** Post test scope to server */
        self.postTestScope = function () {
            if (self.isEnabledPostTestScope) {
                // Date in UTC second
                var unixTime = ko.unwrap(self.testScopeNewStartUnixTime.unixDate);

                // Remove UTC offset
                // in seconds
                unixTime += new Date(unixTime * 1000).getTimezoneOffset() * 60;

                // Add hours
                unixTime += ko.unwrap(self.testScopeNewStartUnixTime.hour) * 3600;
                // Add minutes
                unixTime += ko.unwrap(self.testScopeNewStartUnixTime.minute) * 60;

                datacontext.saveNewTestScope({
                    WellId: self.Id,
                    StartUnixTime: unixTime,
                    IsApproved: null,
                    ConductedBy: '',
                    CertifiedBy: ''
                }).done(function (response) {
                    self.testScopeList.unshift(datacontext.createTestScope(response, self));
                });
            }
        };

        self.selectedTestScope = ko.observable();

        self.chooseTestScope = function (testScopeItem) {
            if (testScopeItem === self.selectedTestScope()) {
                self.selectedTestScope(null);
            }
            else {
                self.selectedTestScope(testScopeItem);
            }
        };

        // ==================================================================Well test end================================================================

        self.WellInWellFieldMaps = ko.observableArray();

        // ================================================= Well history section start =======================================

        self.historyList = ko.observableArray();

        self.isLoadedHistoryList = ko.observable(false);

        self.getWellHistoryList = function () {
            if (ko.unwrap(self.isLoadedHistoryList) === false) {
                datacontext.getWellHistoryList({ well_id: self.Id }).done(function (response) {
                    self.historyList(importWellHistoryDto(response, self));
                    self.isLoadedHistoryList(true);
                });
            }
        };

        self.wellHistoryNew = {
            startUnixTime: ko.observable(),
            endUnixTime: ko.observable(),
            wellId: self.Id,
            historyText: ''
        };

        self.isEnabledPostWellHistory = ko.computed({
            read: function () {
                if (ko.unwrap(self.wellHistoryNew.startUnixTime)) {
                    return true;
                }
                else {
                    return false;
                }
            },
            deferEvaluation: true
        });

        self.postWellHistory = function () {
            if (ko.unwrap(self.isEnabledPostWellHistory)) {
                var wellHistoryNewData = ko.toJS(self.wellHistoryNew);

                if (wellHistoryNewData.startUnixTime) {
                    if (!wellHistoryNewData.endUnixTime) {
                        wellHistoryNewData.endUnixTime = wellHistoryNewData.startUnixTime;
                    }

                    datacontext.postWellHistory(wellHistoryNewData).done(function (result) {
                        self.historyList.push(datacontext.createWellHistory(result, self));
                        // Set to null for psblty creating new well history
                        self.wellHistoryNew.startUnixTime(null);
                        self.wellHistoryNew.endUnixTime(null);
                    });
                }
            }
        };

        self.deleteWellHistory = function (itemForDelete) {
            var tmpStartUnixTime = ko.unwrap(itemForDelete.startUnixTime);
            if (confirm('Are you sure you want to delete "' + appMoment(tmpStartUnixTime * 1000).format('YYYY-MM-DD') + '" record?')) {
                datacontext.deleteWellHistory(itemForDelete.id).done(function () {
                    self.historyList.remove(itemForDelete);
                });
            }
        };

        self.historyView = new HistoryView({}, self.historyList);

        // ============================================================= Well history end ===============================================

        self.sectionList = datacontext.getSectionList();

        // =============================================================Well report begin=========================================================

        // by default - checked summary tab
        self.reportSectionIdList = ko.observableArray(['summary']);

        self.checkReportSection = function (checkedReportSection) {
            switch (checkedReportSection.id) {
                case 'map': self.getWellGroup().getWellField().getWellFieldMaps(); break;
                case 'history': self.getWellHistoryList(); break;
                case 'log': self.getWellFileList('log', 'work'); break;
                case 'pd': self.perfomancePartial.getHstProductionDataSet(); break;
            }
        };

        self.selectedReportMap = ko.observable();
        self.selectedReportLog = ko.observable();

        self.isCompanyLogoInReport = ko.observable(false);

        // TODO: make create report
        ////self.createReport = function () {
        ////    // checking checkboxes
        ////    if (self.reportSectionIdList().length === 0) {
        ////        alert('No selected sections for the report');
        ////        return;
        ////    }

        ////    // existing selected map when map section is checked
        ////    if ($.inArray('map', self.reportSectionIdList()) >= 0) {
        ////        if (typeof self.selectedReportMap() === 'undefined') {
        ////            alert('No selected map in the map section');
        ////            return;
        ////        }
        ////    }

        ////    if ($.inArray('log', self.reportSectionIdList()) >= 0) {
        ////        if (typeof self.selectedReportLog() === 'undefined') {
        ////            alert('No selected log in the log section');
        ////            return;
        ////        }
        ////    }

        ////    if (self.isCompanyLogoInReport() === true) {
        ////        // get user profile
        ////        if (!self.getAppViewModel().curUserProfile().companyLogo()) {
        ////            alert('No company logo. Please upload company logo in Cabinet');
        ////            return;
        ////        }
        ////    }

        ////    // todo: make check for begin date existence (or end date or together)
        ////    ////if ($.inArray('history', self.reportSectionIdList()) >= 0) {
        ////    ////    if (typeof self.reportHistoryBeginDate === 'undefined') {
        ////    ////        alert('No selected maps in the map section');
        ////    ////        return;
        ////    ////    }
        ////    ////}
        ////    // get all unknown data for pdf report and creating

        ////    var logoUrl = null;
        ////    if (self.isCompanyLogoInReport() === true) {
        ////        var companyLogoByte64String = self.getAppViewModel().curUserProfile().companyLogo();
        ////        if (companyLogoByte64String) {
        ////            logoUrl = companyLogoByte64String;
        ////        }
        ////    }

        ////    require(['helpers/pdf-helper'], function (pdfHelper) {

        ////        pdfHelper.getImageFromUrl(logoUrl, function (logoBase64) {
        ////            var sketchUrl = $.inArray('sketch', self.reportSectionIdList()) >= 0 ? self.MainSketchUrl() : null;
        ////            pdfHelper.getImageFromUrl(sketchUrl, function (sketchBase64) {
        ////                // coord to nill - load full image (without crop)
        ////                var mapUrl = ($.inArray('map', self.reportSectionIdList()) >= 0) ? (self.selectedReportMap().fullImgUrl + '&x1=0&y1=0&x2=0&y2=0') : null;
        ////                pdfHelper.getImageFromUrl(mapUrl, function (mapBase64) {
        ////                    var logUrl = ($.inArray('log', self.reportSectionIdList()) >= 0) ? (self.selectedReportLog().Url()) : null;
        ////                    pdfHelper.getImageFromUrl(logUrl, function (logBase64) {
        ////                        var doc = pdfHelper.createPdf();
        ////                        // start string position
        ////                        var strPos = 0;
        ////                        strPos = pdfHelper.writeFileHeader(doc, strPos, "Well report");
        ////                        var nowDateString = appMoment().format("YYYY-MM-DD");
        ////                        strPos = pdfHelper.writeHeaderDate(doc, strPos, nowDateString);

        ////                        if (logoBase64.length > 0) {
        ////                            strPos = pdfHelper.writeLogoImage(doc, strPos, logoBase64[0]);
        ////                        }

        ////                        strPos = pdfHelper.writeWellName(doc, strPos, self.Name());

        ////                        // other summary fields
        ////                        if ($.inArray('summary', self.reportSectionIdList()) >= 0) {
        ////                            strPos = pdfHelper.addSummaryFieldToPdf(doc, self.ttlDescription, self.Description(), strPos);
        ////                            strPos = pdfHelper.addSummaryFieldToPdf(doc, self.ttlProductionHistory, self.ProductionHistory(), strPos);
        ////                            strPos = pdfHelper.addSummaryFieldToPdf(doc, self.ttlCompletionType, self.CompletionType(), strPos);
        ////                            strPos = pdfHelper.addSummaryFieldToPdf(doc, self.ttlFormationCompleteState, self.FormationCompleteState(), strPos);
        ////                            strPos = pdfHelper.addSummaryFieldToPdf(doc, self.ttlDrillingDate, self.DrillingDate() ? appMoment(self.DrillingDate()).format('YYYY-MM-DD') : '', strPos);
        ////                            strPos = pdfHelper.addSummaryFieldToPdf(doc, self.ttlIntegrityStatus, self.IntegrityStatus(), strPos);
        ////                            strPos = pdfHelper.addSummaryFieldToPdf(doc, self.ttlLastInterventionType, self.LastInterventionType(), strPos);
        ////                            strPos = pdfHelper.addSummaryFieldToPdf(doc, self.ttlLastInterventionDate, self.LastInterventionDate() ? appMoment(self.LastInterventionDate()).format('YYYY-MM-DD') : '', strPos);
        ////                            strPos = pdfHelper.addSummaryFieldToPdf(doc, self.ttlPerforationDepth, self.PerforationDepth(), strPos);
        ////                            strPos = pdfHelper.addSummaryFieldToPdf(doc, self.ttlPressureData, self.PressureData(), strPos);
        ////                            strPos = pdfHelper.addSummaryFieldToPdf(doc, self.ttlPvt, self.Pvt(), strPos);
        ////                            strPos = pdfHelper.addSummaryFieldToPdf(doc, self.ttlReservoirData, self.ReservoirData(), strPos);
        ////                        }

        ////                        // sketch
        ////                        if ($.inArray('sketch', self.reportSectionIdList()) >= 0) {
        ////                            // no string position (new page)
        ////                            pdfHelper.writeSketchImg(doc, sketchBase64, 'Sketch');

        ////                            if (self.SketchDesc()) {
        ////                                pdfHelper.writeSketchDesc(doc, self.SketchDesc(), 'Sketch description');
        ////                            }
        ////                        }

        ////                        if (mapBase64.length > 0) {
        ////                            pdfHelper.writeMap(doc, mapBase64, 'Map', self.selectedReportMap().WellInWellFieldMaps(), self.selectedReportMap().WellFieldMapAreas());
        ////                        }

        ////                        if ($.inArray('history', self.reportSectionIdList()) >= 0) {
        ////                            pdfHelper.writeHistory(doc, 'History', self.sortedHistoryList());
        ////                        }

        ////                        if (logBase64.length > 0) {
        ////                            pdfHelper.writeLog(doc, logBase64, 'Log');
        ////                        }

        ////                        if ($.inArray('pd', self.reportSectionIdList()) >= 0) {
        ////                            var arrPd = ko.unwrap(self.perfomancePartial.filteredByDateProductionDataSet);
        ////                            $.each(ko.unwrap(self.selectedWfmParamSquadList), function (elemIndex, elemValue) {
        ////                                var headerList = $.grep(ko.unwrap(self.perfomancePartial.prdColumnAttributeList), function (pdElem) {
        ////                                    return pdElem.Group === elemValue;
        ////                                });

        ////                                pdfHelper.writePd(doc, elemValue, arrPd, headerList);

        ////                                pdfHelper.addHeaderToPdfDoc(doc, 'Perfomance: ' + elemValue + ' graph');
        ////                                pdfHelper.drawGraphLabelInPdf(doc, headerList);

        ////                                // Graph data is not generated by array
        ////                                ////var graphData = getGraphData(arrPd, headerList);
        ////                                ////pdfHelper.drawGraphDataInPdf(doc, graphData, headerList);
        ////                            });
        ////                        }

        ////                        pdfHelper.savePdf(doc, 'Report ' + self.Name() + ' ' + nowDateString);
        ////                    });
        ////                });
        ////            });
        ////        });
        ////    });
        ////};

        // =============================================================Well report end=================================================

        // nodal files ======================================
        self.selectedWellFileNodal = ko.observable();

        self.selectWellFileNodal = function (wellFile) {
            self.selectedWellFileNodal(wellFile);
        };

        self.isLoadedNodal = ko.observable(false);

        // integrity files =======================================
        self.selectedWellFileIntegrity = ko.observable();

        self.selectWellFileIntegrity = function (wellFile) {
            self.selectedWellFileIntegrity(wellFile);
        };

        self.isLoadedIntegrity = ko.observable(false);

        // file manager
        // function(selectedItemFromKnockout, ...)
        self.showFmg = function (callbackFunction) {
            var jqrModalFileManager = $('#modal-file-manager');

            $.each(self.sectionList, function (elemIndex, elemValue) {
                if (elemValue.formatList.length > 0) {
                    var elemFileUpload = jqrModalFileManager.find('#' + elemValue.id + '_file_upload').get(0);

                    fileHelper.initFileUpload(elemFileUpload, datacontext.getWellFileUrl({
                        well_id: self.Id,
                        purpose: elemValue.id,
                        status: 'work'
                    }), elemValue.formatList, function () {
                        self.getWellFileList();
                    });
                }
            });

            self.getWellFileList();

            function hideModal() {
                jqrModalFileManager.modal('hide');
            }

            function submitFunction() {
                // get checked (selected) files
                var checkedWellFiles = $.map(ko.unwrap(self.WellFiles), function (elemValue) {
                    if (ko.unwrap(elemValue.isChecked) === true) {
                        return elemValue;
                    }
                });

                if (typeof (callbackFunction) !== 'undefined' && $.isFunction(callbackFunction)) {
                    callbackFunction(checkedWellFiles);
                }
                else {
                    hideModal();
                }
            }

            jqrModalFileManager.find('.modal-ok').off('click').on('click', submitFunction);
            jqrModalFileManager.find('.modal-close').off('click').on('click', hideModal);

            jqrModalFileManager.modal('show');

            ////var innerDiv = document.createElement('div');

            ////$(innerDiv).load(datacontext.getFileManagerUrl(), function () {
            ////    ko.applyBindings(self, $(innerDiv).get(0));

            ////    $.each(self.sectionList, function (elemIndex, elemValue) {
            ////        if (elemValue.formatList.length > 0) {
            ////            var elemFileUpload = $(innerDiv).find('#' + elemValue.id + '_file_upload').get(0);

            ////            fileHelper.initFileUpload(elemFileUpload, datacontext.getWellFileUrl({
            ////                well_id: self.Id,
            ////                purpose: elemValue.id,
            ////                status: 'work'
            ////            }), elemValue.formatList, function () {
            ////                self.getWellFileList();
            ////            });
            ////        }
            ////    });

            ////    self.getWellFileList();
            ////    var submitFunction = function () {
            ////        // get checked (selected) files
            ////        var checkedWellFiles = $.map(self.WellFiles(), function (elemValue) {
            ////            if (elemValue.isChecked() === true) {
            ////                return elemValue;
            ////            }
            ////        });

            ////        if (typeof (callbackFunction) !== 'undefined' && $.isFunction(callbackFunction)) {
            ////            callbackFunction(checkedWellFiles);
            ////        }
            ////        else {
            ////            bootstrapModal.closeModalWideWindow();
            ////        }
            ////    };

            ////    bootstrapModal.openModalWideWindow(innerDiv, submitFunction);
            ////});
        };

        self.sketchHashString = ko.observable(new Date().getTime());

        self.volumeHashString = ko.observable(new Date().getTime());

        self.putWell = function () {
            datacontext.saveChangedWell(self);
        };

        self.chooseMainFile = function (purpose) {
            self.selectedFmgSectionId(purpose);
            var callbackFunction = function (checkedWellFileList) {
                if (checkedWellFileList.length !== 1) {
                    alert('Need to select one image');
                    return;
                }

                var checkedFile = checkedWellFileList[0];
                if ($.inArray(checkedFile.ContentType, datacontext.imageMimeTypes) === -1) {
                    alert('Need to select image file: ' + datacontext.imageMimeTypes.join(', '));
                    return;
                }

                bootstrapModal.closeModalFileManager();

                var urlQueryParams = {
                    well_id: self.Id,
                    purpose: checkedFile.Purpose,
                    status: checkedFile.Status(),
                    file_name: checkedFile.Name(),
                    dest_well_id: self.Id,
                    dest_purpose: checkedFile.Purpose,
                    dest_status: checkedFile.Status(),
                    dest_file_name: 'main.' + purpose
                };

                datacontext.getWellFiles(urlQueryParams).done(function () {
                    self[purpose + 'HashString'](new Date().getTime());
                });
            };

            self.showFmg(callbackFunction);
        };

        self.editField = function (wellProp) {
            ////console.log(wellProp);
            var fieldName = wellProp.id,
                fieldTitle = wellProp.ttl,
                inputType = wellProp.tpe;

            ////fieldName, inputType
            // draw window with this field
            var inputField;

            var tmpFieldValue = ko.unwrap(self[fieldName]);

            if (inputType === 'SingleLine') {
                inputField = document.createElement('input');
                inputField.type = 'text';
                $(inputField).prop({
                    'placeholder': fieldTitle
                }).val(tmpFieldValue).addClass('form-control');
            }
            else if (inputType === 'MultiLine') {
                inputField = document.createElement('textarea');
                $(inputField).prop({ "rows": 5, 'placeholder': fieldTitle }).val(tmpFieldValue).addClass('form-control');
            }

            var innerDiv = document.createElement('div');
            $(innerDiv).addClass('form-horizontal').append(
                bootstrapModal.gnrtDom(fieldTitle, inputField)
            );

            function submitFunction() {
                self[fieldName]($(inputField).val());
                self.putWell();
                bootstrapModal.closeModalWindow();
            }

            bootstrapModal.openModalWindow('Edit', innerDiv, submitFunction);
        };

        self.MainSketchUrl = ko.computed({
            read: function () {
                return datacontext.getWellFileUrl({
                    well_id: self.Id,
                    purpose: 'sketch',
                    status: 'work',
                    file_name: 'main.sketch'
                }) + '&hashstring=' + self.sketchHashString();
            },
            deferEvaluation: true
        });

        self.MainVolumeUrl = ko.computed({
            read: function () {
                return datacontext.getWellFileUrl({
                    well_id: self.Id,
                    purpose: 'volume',
                    status: 'work',
                    file_name: 'main.volume'
                }) + '&hashstring=' + self.volumeHashString();
            },
            deferEvaluation: true
        });

        self.IsEditSketchDesc = ko.observable(false);

        self.turnEditSketchDesc = function () {
            self.IsEditSketchDesc(!self.IsEditSketchDesc());
        };

        self.saveSketchDesc = function () {
            self.SketchDesc($('#sketch_desc').val());
            datacontext.saveChangedWell(self).done(function (result) {
                self.SketchDesc(result.SketchDesc);
            });
            self.IsEditSketchDesc(false);
        };

        self.editWell = function () {
            var inputName = document.createElement('input');
            inputName.type = 'text';
            $(inputName).val(self.Name()).prop({ 'required': true });

            var inputDescription = document.createElement('input');
            inputDescription.type = 'text';
            $(inputDescription).val(self.Description());

            var inputProductionHistory = document.createElement('textarea');
            $(inputProductionHistory).val(self.ProductionHistory()).prop("rows", 5);

            var innerDiv = document.createElement('div');
            $(innerDiv).addClass('form-horizontal').append(
                bootstrapModal.gnrtDom('Name', inputName),
                bootstrapModal.gnrtDom('Description', inputDescription),
                bootstrapModal.gnrtDom('Production history', inputProductionHistory)
            );

            function submitFunction() {
                self.Name($(inputName).val());
                self.Description($(inputDescription).val());
                self.ProductionHistory($(inputProductionHistory).val());
                datacontext.saveChangedWell(self).done(function (result) {
                    self.Name(result.Name);
                    self.Description(result.Description);
                    self.ProductionHistory(result.ProductionHistory);
                });
                bootstrapModal.closeModalWindow();
            }

            bootstrapModal.openModalWindow("Well", innerDiv, submitFunction);
        };

        self.deleteWellFile = function () {
            var wellFileForDelete = this;
            if (confirm('Are you sure you want to delete "' + wellFileForDelete.Name() + '"?')) {
                datacontext.deleteWellFile(wellFileForDelete).done(function () {
                    self.WellFiles.remove(wellFileForDelete);
                });
            }
        };

        // without archive
        ////self.invertWellFileStatus = function () {
        ////    var invertWellFile = this;
        ////    var urlQueryParams = {
        ////        well_id: self.Id,
        ////        purpose: invertWellFile.Purpose,
        ////        status: invertWellFile.Status(),
        ////        file_name: invertWellFile.Name(),
        ////        need_action: 'invertstatus' // deprecated
        ////    };

        ////    datacontext.getWellFiles(urlQueryParams).done(function () {
        ////        ////if (invertWellFile.Purpose === 'sketch') {
        ////        ////    alert('File: "' + invertWellFile.Name() + '" successfully set as the main well sketch');
        ////        ////}
        ////        ////else
        ////        if (invertWellFile.Purpose === 'pd') {
        ////            // delete old file
        ////            datacontext.deleteWellFile(invertWellFile).done(function () {
        ////                // update list
        ////                self.getWellFileList();
        ////            });
        ////        }
        ////    });
        ////};

        self.wellMapList = ko.computed(function () {
            var wellFieldItem = self.getWellGroup().getWellField();
            return $.map(wellFieldItem.WellFieldMaps(), function (elemValue) {
                var wellIdList = $.map(elemValue.WellInWellFieldMaps(), function (wfmElem) {
                    return wfmElem.WellId;
                });

                if ($.inArray(self.Id, wellIdList) >= 0) {
                    return elemValue;
                }
            });
        });

        // ================================================================= Well log section begin ==============================================
        self.wellLogSelectedFile = ko.observable();

        // TODO: change to computed from wellLogSelectedFile
        self.WellLogImageUrl = ko.observable();

        self.IsLogImageEditable = ko.observable(false);

        self.checkedLogTool = ko.observable('tool-hand');

        self.checkedLogTool.subscribe(function (newValue) {

            var $drawCnvsLog = $('#draw_cnvs_log');
            $drawCnvsLog.hide();
            $('#text_cnvs_log').hide();

            // get coords from main canvas layer
            var cnvsTop = $('#log_cnvs').css('top');

            switch (newValue) {
                case 'tool-line':
                    require(['helpers/log-helper'], function (logHelper) {
                        logHelper.isArrowXorLine = false;
                    });
                    $drawCnvsLog.css({ 'top': cnvsTop }).show();
                    break;
                case 'tool-arrow':
                    require(['helpers/log-helper'], function (logHelper) {
                        logHelper.isArrowXorLine = true;
                    });

                    $drawCnvsLog.css({ 'top': cnvsTop }).show();
                    break;
                case 'tool-text':
                    $('#text_cnvs_log').css({ 'top': cnvsTop }).show();
                    break;
            }
        });

        self.drawLogText = function (currentWellItem, event) {
            var drawTextBlock = event.currentTarget;
            ////drawTextBlock.style.filter = 'alpha(opacity=50)';
            // coord accordingly drawTextBlock
            var posX = parseFloat(event.pageX - $(drawTextBlock).offset().left);
            var posY = parseFloat(event.pageY - $(drawTextBlock).offset().top);
            require(['helpers/log-helper'], function (logHelper) {
                logHelper.drawText(posX, posY, drawTextBlock);
            });
        };

        self.startLogImageEdit = function () {
            self.IsLogImageEditable(!self.IsLogImageEditable());
            var cnvs = document.getElementById('log_cnvs');
            var cntx = cnvs.getContext('2d');
            cntx.clearRect(0, 0, cnvs.width, cnvs.height);
            self.checkedLogTool('tool-hand');

            var maxCanvasHeight = 480;

            var logImg = document.getElementById('log_img');
            var drawCnvsLog = document.getElementById('draw_cnvs_log');
            var textCnvsLog = document.getElementById('text_cnvs_log');

            $(logImg).parent().off('scroll').on('scroll', function () { });

            // height
            if (logImg.clientHeight < maxCanvasHeight) {
                cnvs.height = logImg.clientHeight;
                drawCnvsLog.height = logImg.clientHeight;
                $(textCnvsLog).css({ 'height': logImg.clientHeight });
                //$(cnvs).css({ 'top': 0 });
            }
            else {
                cnvs.height = maxCanvasHeight;
                drawCnvsLog.height = maxCanvasHeight;
                $(textCnvsLog).css({ 'height': maxCanvasHeight });
                // coords of button "Edit"
                //$(cnvs).css({ 'top': $(event.currentTarget).offset().top });
            }

            ////// width - const = 624
            ////cnvs.width = logImg.clientWidth;
            ////drawCnvsLog.width = logImg.clientWidth;
            ////$(textCnvsLog).css({ 'width': logImg.clientWidth });
        };

        self.cancelLogImageEdit = function () {
            self.IsLogImageEditable(false);
        };

        self.saveWellLogSelectedFileImagePart = function () {
            //public HttpResponseMessage Post([FromUri] int well_id, [FromUri] string purpose, [FromUri] string status, [FromUri] string file_name, [FromBody] ByteImagePart byteImagePart)
            var selectedFile = self.wellLogSelectedFile();

            // need select before save
            if (!selectedFile) { return; }

            var urlQueryParams = {
                well_id: selectedFile.WellId,
                purpose: selectedFile.Purpose,
                status: selectedFile.Status,
                file_name: selectedFile.Name
            };

            var cnvs = document.getElementById('log_cnvs');

            require(['models/byte-image-part'], function () {
                var createdByteImagePart = datacontext.createByteImagePart({
                    Base64String: cnvs.toDataURL('image/png').replace('data:image/png;base64,', ''),
                    StartY: Math.abs($('#log_img').position().top)
                    ////StartY: $(cnvs).position().top
                });

                datacontext.postWellFile(urlQueryParams, createdByteImagePart).done(function (response, statusText, request) {
                    self.IsLogImageEditable(false);
                    self.WellLogImageUrl(request.getResponseHeader('Location') + '#' + appMoment().format('mmss'));
                });
            });
        };

        // ==================================================================== Well log section end ========================================
        // ==================================================================== Well perfomance begin ========================================

        self.perfomancePartial = wellPerfomancePartial.init(self);

        // Load column attributes - all loading logic in this file (not separated - not in perfomance-partial file)
        self.perfomancePartial.prdColumnAttributeList(importColumnAttributesDto(datacontext.getColumnAttributesLocal()));

        self.mainPerfomanceView = self.perfomancePartial.createPerfomanceView({
            isVisibleForecastData: false
        });

        // Well widget layouts
        // Well widget layout -> widget block -> widget
        self.wellWidgoutList = ko.observableArray();

        self.possibleWidgoutList = datacontext.getPossibleWidgoutList();

        // Selected possible widget layout for adding to widget layout list
        self.slcPossibleWidgout = ko.observable();

        self.postWellWidgout = function () {
            var wellWidgoutData = ko.unwrap(self.slcPossibleWidgout);
            if (wellWidgoutData) {
                datacontext.postWellWidgout(self.Id, wellWidgoutData).done(function (createdWellWidgoutData) {
                    require(['models/widgout'], function (Widgout) {
                        var widgoutNew = new Widgout(createdWellWidgoutData, self);
                        self.wellWidgoutList.push(widgoutNew);
                        self.selectedWellWidgout(widgoutNew);
                        self.slcPossibleWidgout(null);
                    });
                });
            }
        };

        self.deleteWellWidgout = function () {
            var wellWidgoutToDelete = ko.unwrap(self.selectedWellWidgout);
            if (wellWidgoutToDelete) {
                if (confirm('Are you sure you want to delete "' + ko.unwrap(wellWidgoutToDelete.name) + '"?')) {
                    datacontext.deleteWellWidgout(self.Id, wellWidgoutToDelete.id).done(function () {
                        self.wellWidgoutList.remove(wellWidgoutToDelete);
                    });
                }
            }
        };

        self.selectedWellWidgout = ko.observable();

        self.isLoadedWellWidgoutList = ko.observable(false);

        self.getWellWidgoutList = function () {
            if (!ko.unwrap(self.isLoadedWellWidgoutList)) {
                datacontext.getWellWidgoutList(self.Id).done(function (response) {
                    require(['models/widgout'], function (Widgout) {
                        // Well widget layout list
                        function importWidgoutList(data, parentItem) {
                            return $.map(data || [], function (item) { return new Widgout(item, parentItem); });
                        }

                        self.wellWidgoutList(importWidgoutList(response, self));
                        self.isLoadedWellWidgoutList(true);
                    });
                });
            }
        };

        // ============================================================ Change tab section =========================================================
        self.selectedSectionId.subscribe(function (sectionId) {
            switch (sectionId) {
                // Dashboard: from undefined to null
                case null: {
                    // Get all widgouts for well
                    self.getWellWidgoutList();
                    // TODO: load data only if there is one or more perfomance widgets (only once) for entire well
                    self.getWellGroup().getWellGroupWfmParameterList();
                    self.perfomancePartial.forecastEvolution.getDict();
                    self.perfomancePartial.getHstProductionDataSet();
                    self.getWellHistoryList();
                    break;
                }
                case 'history': {
                    self.getWellHistoryList();
                    break;
                }
                case 'pd': {
                    self.getWellGroup().getWellGroupWfmParameterList();
                    self.perfomancePartial.forecastEvolution.getDict();
                    self.perfomancePartial.getHstProductionDataSet();
                    break;
                }
                case 'nodalanalysis': {
                    self.isLoadedNodal(false);

                    self.getWellFileList(function () {
                        var mainWellFile = null;
                        if (self.WellFiles().length > 0) {
                            mainWellFile = self.WellFiles()[0];
                        }

                        self.selectedWellFileNodal(mainWellFile);
                        self.isLoadedNodal(true);
                    }, 'nodalanalysis', 'work');

                    break;
                }
                case 'integrity': {
                    self.isLoadedIntegrity(false);

                    self.getWellFileList(function () {
                        var mainWellFile = null;
                        if (self.WellFiles().length > 0) {
                            mainWellFile = self.WellFiles()[0];
                        }

                        self.selectedWellFileIntegrity(mainWellFile);
                        self.isLoadedIntegrity(true);
                    }, 'integrity', 'work');

                    break;
                }
                case 'log': {
                    self.wellLogSelectedFile(null);

                    self.getWellFileList(function () {
                        if (self.logImageList().length > 0) { self.logImageList()[0].showLogImage(); }
                    }, 'log', 'work');

                    break;
                }
                case 'test': {
                    self.getTestScopeList();
                    self.getWellGroup().getWellGroupWfmParameterList();
                    break;
                }
                case 'map': {
                    // find wellfield_id 
                    var wellFieldItem = self.getWellGroup().getWellField();

                    wellFieldItem.getWellFieldMaps(function () {
                        var arr = wellFieldItem.WellFieldMaps();
                        // TODO:???
                        ////arr = $.grep(arr, function (arrElem, arrIndex) {
                        ////    var cnt = 0;
                        ////    $.each(arrElem.WellInWellFieldMaps(), function(wwfIndex, wwfElem){
                        ////        if (wwfElem.Id === self.Id) {
                        ////            cnt++;
                        ////        }
                        ////    });

                        ////    return cnt > 0;
                        ////});

                        if (arr.length > 0) {
                            arr[0].showWellFieldMap();
                        }
                    });

                    break;
                    // no well in new map
                    ////wellFieldParent.initMapFileUpload();
                    // find wellfieldmap from wellfield where id = 
                    // get all WellInWellFieldMap where wellid = self.wellId
                    // get all maps
                    // get only maps where well_id == self.Id
                    // get all maps
                    // in WellInWellFieldMaps
                }
            }
        });

        // ==================================================================== Well perfomance section end ========================================

        self.toPlainJson = function () {
            // add other props
            ////public int Id { get; set; }
            ////public int WellGroupId { get; set; }
            ////public string SketchDesc { get; set; }
            ////public string WellType { get; set; }
            ////public string FlowType { get; set; }
            ////public string Comment { get; set; }
            // Join two property arrays
            var tmpPropList = ['Id', 'WellGroupId', 'SketchDesc', 'WellType', 'FlowType', 'Comment'];
            $.each(wellPropertyList, function (propIndex, propValue) {
                tmpPropList.push(propValue.id);
            });

            var objReady = {};
            $.each(tmpPropList, function (propIndex, propValue) {
                // null can be sended to ovveride current value to null
                if (typeof ko.unwrap(self[propValue]) !== 'undefined') {
                    objReady[propValue] = ko.unwrap(self[propValue]);
                }
            });

            return objReady;
        };
    }

    datacontext.createWell = function (data, parent) {
        return new Well(data, parent);
    };
});