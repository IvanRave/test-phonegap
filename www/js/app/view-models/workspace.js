define([
    'jquery',
    'knockout',
    'app/datacontext',
    'bootstrap-modal',
    'app/app-helper',
    'app/models/job-type',
    'knockout-lazy',
    'app/models/well-region'
], function ($, ko, datacontext, bootstrapModal, appHelper, JobType) {
    'use strict';

    function WorkspaceViewModel(companyId, isEditable, choosedObj) {
        // Test company Id with Guid format (this checks retry server check in WorkSpace view of Home controller
        if (!appHelper.isGuidValid(companyId)) {
            var errValidMsg = 'Company id is not valid GUID';
            alert(errValidMsg);
            throw new TypeError(errValidMsg);
        }

        var self = this;

        // Manage or view: hide all editable blocks
        self.isEditable = isEditable;
        // Left tree menu with well regions, groups, fields, wells
        self.isVisibleMenu = ko.observable(true);
        self.wellRegionList = ko.observableArray();
        self.viewModelError = ko.observable();
        self.selectedWellRegion = ko.observable();
        self.curUserProfile = ko.observable();
        self.isStructureLoaded = ko.observable(false);
        self.currentCompanyId = companyId;
        self.windowHeight = ko.observable($(window).height());
        self.windowWidth = ko.observable($(window).width());

        // Left tree menu with well regions, groups, fields, wells
        self.toggleIsVisibleMenu = function () {
            self.isVisibleMenu(!ko.unwrap(self.isVisibleMenu));
        };

        self.sidebarWrapCss = ko.computed({
            read: function () {
                return ko.unwrap(self.isVisibleMenu) ? 'sidebar-wrap-visible' : 'hidden';
            },
            deferEvaluation: true
        });

        self.workAreaCss = ko.computed({
            read: function () {
                return ko.unwrap(self.isVisibleMenu) ? 'work-area' : '';
            },
            deferEvaluation: true
        });

        self.sidebarToggleCss = ko.computed({
            read: function () {
                return ko.unwrap(self.isVisibleMenu) ? 'sidebar-toggle-visible' : 'sidebar-toggle-hidden';
            },
            deferEvaluation: true
        });

        // =====================================Wfm parameters begin==========================================================
        self.wfmParamSquadList = ko.lazyObservableArray(function () {
            datacontext.getWfmParamSquadList({ is_inclusive: true }).done(function (r) {
                require(['app/models/wfm-param-squad'], function () {
                    // WfmParamSquadList (convert data objects into array)
                    function importWfmParamSquadList(data) {
                        return $.map(data || [], function (item) { return datacontext.createWfmParamSquad(item); });
                    }

                    self.wfmParamSquadList(importWfmParamSquadList(r));
                });
            });
        }, self);

        self.jobTypeList = ko.lazyObservableArray(function () {
            datacontext.getJobTypeList(companyId).done(function (r) {
                function importJobTypeList(data) {
                    return $.map(data || [], function (item) { return new JobType(item); });
                }

                self.jobTypeList(importJobTypeList(r));
            });
        }, self);

        self.goToPostingJobType = function () {
            var jobTypeNewName = window.prompt('Add job type to list');
            if (jobTypeNewName) {
                datacontext.postCompanyJobType(companyId, {
                    name: jobTypeNewName,
                    description: '',
                    companyId: companyId
                }).done(function (jobTypeCreated) {
                    self.jobTypeList.push(new JobType(jobTypeCreated));
                });
            }
        };

        // Get all parameters from all groups as one dimensional array
        self.wfmParameterList = ko.computed({
            read: function () {
                return $.map(ko.unwrap(self.wfmParamSquadList), function (sqdElem) {
                    return $.map(ko.unwrap(sqdElem.wfmParameterList), function (prmElem) {
                        return prmElem;
                    });
                });
            },
            deferEvaluation: true
        });
        // =====================================Wfm parameters end==========================================================

        self.addWellRegion = function () {
            ////var self = this;

            var inputName = document.createElement('input');
            inputName.type = 'text';
            $(inputName).prop({ 'required': true }).addClass('form-control');

            var innerDiv = document.createElement('div');
            $(innerDiv).addClass('form-horizontal').append(
                bootstrapModal.gnrtDom('Name', inputName)
            );

            bootstrapModal.openModalWindow('Well region', innerDiv, function () {
                var wellRegionItem = datacontext.createWellRegion({
                    Name: $(inputName).val(),
                    CompanyId: companyId
                }, self);

                datacontext.saveNewWellRegion(wellRegionItem).done(function (result) {
                    self.wellRegionList.push(datacontext.createWellRegion(result, self));
                });

                bootstrapModal.closeModalWindow();
            });
        };

        self.deleteWellRegion = function (wellRegionForDelete) {
            if (wellRegionForDelete.WellFields().length > 0) {
                alert('Need to remove all well fields from this region.');
                return;
            }

            if (confirm('Are you sure you want to delete "' + wellRegionForDelete.Name() + '"?')) {
                datacontext.deleteWellRegion(wellRegionForDelete).done(function () {
                    self.wellRegionList.remove(wellRegionForDelete);
                });
            }
        };

        // TODO: back after repair getUserProfile();    
        // TODO: move selectItem() logic to parent objects:
        // well.selectWell() => wellGroup.selectWell()

        // load list of well region, well field...
        function loadStructure() {
            function getSucceeded(data) {
                var mappedStructure = $.map(data, function (list) {
                    return new datacontext.createWellRegion(list, self);
                });

                self.wellRegionList(mappedStructure);

                // route region/id/field/id/group/id/well/id
                ////var choosedObj = getChoosedIdFromHash();
                console.log(choosedObj);
                var tmpRegion = appHelper.getElementByPropertyValue(self.wellRegionList(), 'Id', choosedObj.regionId);
                if (tmpRegion) {
                    self.selectedWellRegion(tmpRegion);
                    tmpRegion.isOpenItem(true);
                    var tmpField = appHelper.getElementByPropertyValue(self.selectedWellRegion().WellFields(), 'Id', choosedObj.fieldId);
                    if (tmpField) {
                        self.selectedWellRegion().selectedWellField(tmpField);
                        tmpField.isOpenItem(true);
                        var tmpGroup = appHelper.getElementByPropertyValue(self.selectedWellRegion().selectedWellField().WellGroups(), 'Id', choosedObj.groupId);
                        if (tmpGroup) {
                            self.selectedWellRegion().selectedWellField().selectedWellGroup(tmpGroup);
                            tmpGroup.isOpenItem(true);
                            var tmpWell = appHelper.getElementByPropertyValue(self.selectedWellRegion().selectedWellField().selectedWellGroup().Wells(), 'Id', choosedObj.wellId);
                            if (tmpWell) {
                                self.selectedWellRegion().selectedWellField().selectedWellGroup().selectedWell(tmpWell);
                                tmpWell.isOpenItem(true);
                                // todo: change logic - when change selected id - need to execute additional logic
                                if (choosedObj.sectionId) {
                                    tmpWell.selectedSectionId(choosedObj.sectionId);
                                }
                                // Apchive: previously - set summary as a default page
                                ////else {
                                ////    tmpWell.selectedSectionId(tmpWell.sectionList[0].id);
                                ////}

                                // this set selected well
                                ////console.log(self.selectedWellRegion().selectedWellField().selectedWellGroup().selectedWell());
                            }
                        }
                    }
                }

                self.isStructureLoaded(true);
            }

            datacontext.getWellRegionList({
                company_id: companyId,
                is_inclusive: true
            }).done(getSucceeded).fail(function () {
                self.viewModelError('Error retrieving lists.');
            });
        }

        loadStructure();
    }

    return WorkspaceViewModel;
});