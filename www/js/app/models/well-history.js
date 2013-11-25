define(['jquery', 'knockout', 'app/datacontext', 'bootstrap-modal', 'app/app-helper', 'app/models/well-history-file', 'app/models/wfm-image'],
    function ($, ko, datacontext, bootstrapModal, appHelper) {
        'use strict';

        // convert data objects into array
        function importWellHistoryFiles(data) { return $.map(data || [], function (item) { return datacontext.createWellHistoryFile(item); }); }

        function importWfmImagesDto(data) { return $.map(data || [], function (item) { return datacontext.createWfmImage(item); }); }

        function WellHistory(data, well) {
            var self = this;
            data = data || {};

            self.getWell = function () {
                return well;
            };

            // Properties
            self.id = data.Id;
            self.historyText = ko.observable(data.HistoryText);
            self.startUnixTime = ko.observable(data.StartUnixTime);
            self.endUnixTime = ko.observable(data.EndUnixTime);
            self.jobTypeId = data.JobTypeId ? ko.observable(data.JobTypeId) : ko.observable();
            self.wellId = data.WellId;

            self.WfmImages = ko.observableArray();
            self.WellHistoryFiles = ko.observableArray(importWellHistoryFiles(data.WellHistoryFiles));
            // Load job type id
            // Extract from root.companyJobTypeList by id
            // Computed
            self.jobType = ko.computed({
                read: function () {
                    var tmpJobTypeId = ko.unwrap(self.jobTypeId);
                    if (tmpJobTypeId) {
                        var companyJobTypeList = ko.unwrap(self.getWell().getAppViewModel().jobTypeList);
                        return appHelper.getElementByPropertyValue(companyJobTypeList, 'id', tmpJobTypeId);
                    }
                },
                deferEvaluation: true
            });

            self.isVisibleEndUnixTime = ko.computed({
                read: function () {
                    return ko.unwrap(self.startUnixTime) !== ko.unwrap(self.endUnixTime);
                },
                deferEvaluation: true
            });

            self.putWellHistory = function () {
                var wellHistoryData = {
                    id: ko.unwrap(self.id),
                    startUnixTime: ko.unwrap(self.startUnixTime),
                    endUnixTime: ko.unwrap(self.endUnixTime),
                    wellId: ko.unwrap(self.wellId),
                    historyText: ko.unwrap(self.historyText),
                    jobTypeId: ko.unwrap(self.jobTypeId)
                };

                datacontext.putWellHistory(wellHistoryData);
            };

            self.startUnixTime.subscribe(self.putWellHistory);
            self.endUnixTime.subscribe(self.putWellHistory);
            self.jobTypeId.subscribe(self.putWellHistory);

            self.deleteWfmImage = function (itemForDelete) {
                if (confirm('Are you sure you want to delete "' + itemForDelete.Name + '"?')) {
                    datacontext.deleteWfmImage(itemForDelete).done(function () {
                        self.WfmImages.remove(itemForDelete);
                    });
                }
            };

            self.deleteWellHistoryFile = function (itemForDelete) {
                if (confirm('Are you sure you want to delete this file?')) {
                    datacontext.deleteWellHistoryFile(itemForDelete).done(function () {
                        self.WellHistoryFiles.remove(itemForDelete);
                    });
                }
            };

            self.chooseWellHistoryFile = function () {
                var existingFileNames = $.map(self.WellHistoryFiles(), function (whValue) {
                    var partUrlArray = whValue.CloudFileUrl.split('/');
                    return partUrlArray[partUrlArray.length - 1];
                });

                self.getWell().selectedFmgSectionId('history');

                function callbackFunction(checkedWellFileList) {
                    $.each(checkedWellFileList, function (elemIndex, elemValue) {
                        // if the selected file has not been added earlier, then add to well history files
                        if ($.inArray(elemValue.Name(), existingFileNames) === -1) {
                            var itemForAdd = datacontext.createWellHistoryFile({
                                WellHistoryId: self.id,
                                Comment: '',
                                CloudFileUrl: self.wellId + '/history/work/' + elemValue.Name()
                            });

                            datacontext.postWellHistoryFile(itemForAdd).done(function (response) {
                                self.WellHistoryFiles.push(datacontext.createWellHistoryFile(response));
                            });
                        }
                    });

                    bootstrapModal.closeModalFileManager();
                }

                self.getWell().showFmg(callbackFunction);
            };

            self.chooseWfmImage = function () {
                self.getWell().selectedFmgSectionId('history');
                function callbackFunction(checkedWellFileList) {
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
                        well_id: self.wellId,
                        purpose: 'history',
                        status: 'work',
                        file_name: checkedFile.Name()
                    };

                    // history image src
                    var path = datacontext.getWellFileUrl(urlQueryParams);
                    var innerDiv = document.createElement('div');
                    var historyImgElem = document.createElement('img');
                    innerDiv.appendChild(historyImgElem);
                    // load image before open window and set JCrop
                    historyImgElem.onload = function () {
                        // load need libraries for cropping
                        require(['jquery.jcrop'], function () {

                            var coords = [0, 0, 0, 0];

                            function jcropSaveCoords(c) {
                                coords = [c.x, c.y, c.x2, c.y2];
                            }

                            // The variable jcrop_api will hold a reference to the Jcrop API once Jcrop is instantiated
                            $(historyImgElem).Jcrop({
                                onChange: jcropSaveCoords,
                                onSelect: jcropSaveCoords,
                                bgOpacity: 0.6
                            });

                            // submitted by OK button
                            bootstrapModal.openModalWideWindow(innerDiv, function () {
                                ////var url = path + '&crop=(' + coords[0] + ',' + coords[1] + ',' + coords[2] + ',' + coords[3] + ')';
                                // check not null comments = if user can't choose whole images
                                // create wfmimage
                                var wfmImageReady = datacontext.createWfmImage({
                                    X1: coords[0],
                                    X2: coords[2],
                                    Y1: coords[1],
                                    Y2: coords[3],
                                    // full name (well_id + purpose + status + sdf
                                    // 71/history/work/fid20130211042811196_WellHistory.png
                                    Name: [urlQueryParams.well_id, urlQueryParams.purpose, urlQueryParams.status, urlQueryParams.file_name].join('/')
                                });

                                // send coords to database = save in wfmimage
                                datacontext.saveNewWfmImage({ wellhistory_id: self.id }, wfmImageReady).done(function (saveResult) {
                                    // add images to dom with src
                                    self.WfmImages.push(datacontext.createWfmImage(saveResult));
                                    // push to wellhistory wfmimages
                                });

                                bootstrapModal.closeModalFileManager();
                            });
                            // end of require
                        });
                    };

                    // start load image
                    historyImgElem.src = path;
                }

                self.getWell().showFmg(callbackFunction);
            };

            if (data.WfmImagesDto) {
                self.WfmImages(importWfmImagesDto(data.WfmImagesDto));
            }

            // No needs. Extracted from root.jobTypeList
            ////if (data.JobTypeDto) {
            ////    self.jobType(new JobType(data.JobTypeDto));
            ////}
        }

        datacontext.createWellHistory = function (item, wellParent) {
            return new WellHistory(item, wellParent);
        };
    });