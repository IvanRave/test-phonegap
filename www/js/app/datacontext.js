define(['jquery', 'app/ajax-request'], function ($, ajaxRequest) {
    'use strict';

    function wellRegionUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/wellregion/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function wellFieldUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/wellfield/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function wellGroupUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/wellgroup/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function wellUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/well/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function wellFileUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/wellfile/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function columnAttributeUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/columnattribute/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function wellHistoryUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/wellhistory/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function wfmImageUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/wfmimage/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function wellFieldMapUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/wellfieldmap/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function wellFieldMapAreaUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/wellfieldmaparea/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function wellInWellFieldMapUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/wellinwellfieldmap/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function wellHistoryFileUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/wellhistoryfile/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function userProfileUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/userprofile/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function productionDataUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/productiondata/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function testScopeUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/testscope/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function testDataUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/testdata/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function wellGroupWfmParameterUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/wellgroupwfmparameter/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function wfmParamSquadUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/wfmparamsquad/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function forecastEvolutionUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/forecastevolution/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function companyUserUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/companyuser/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function companyUrl(uqp) {
        return 'http://wfm-client.azurewebsites.net/api/company/' + (uqp ? ('?' + $.param(uqp)) : '');
    }
    function wellWidgoutUrl(wellId, widgoutId) {
        return 'http://wfm-client.azurewebsites.net/api/wells/' + wellId + '/widgouts' + (widgoutId ? ('/' + widgoutId) : '');
    }
    function widgetUrl(widgockId, widgetId) {
        return 'http://wfm-client.azurewebsites.net/api/widgocks/' + widgockId + '/widgets' + (widgetId ? ('/' + widgetId) : '');
    }
    function jobTypeUrl(companyId, jobTypeId) {
        return 'http://wfm-client.azurewebsites.net/api/companies/' + companyId + '/job-types' + (jobTypeId ? ('/' + jobTypeId) : '');
    }

    // DataContext operations
    // 1. WellRegion
    function getWellRegionList(uqp) {
        return ajaxRequest('GET', wellRegionUrl(uqp));
    }

    function saveNewWellRegion(item) {
        return ajaxRequest('POST', wellRegionUrl(), item);
    }

    function deleteWellRegion(item) {
        return ajaxRequest('DELETE', wellRegionUrl({ id: item.Id }));
    }

    function saveChangedWellRegion(item) {
        return ajaxRequest('PUT', wellRegionUrl({ id: item.Id }), item);
    }

    // 2. WellField
    function saveNewWellField(item) {
        return ajaxRequest('POST', wellFieldUrl(), item);
    }

    function deleteWellField(id) {
        return ajaxRequest('DELETE', wellFieldUrl({ id: id }));
    }

    function saveChangedWellField(item) {
        return ajaxRequest('PUT', wellFieldUrl({ id: item.Id }), item);
    }

    // 3. WellGroup
    function saveNewWellGroup(item) {
        return ajaxRequest('POST', wellGroupUrl(), item);
    }

    function deleteWellGroup(item) {
        return ajaxRequest('DELETE', wellGroupUrl({ id: item.Id }));
    }

    function saveChangedWellGroup(item) {
        return ajaxRequest('PUT', wellGroupUrl({ id: item.Id }), item);
    }

    function saveNewWell(item) {
        return ajaxRequest('POST', wellUrl(), item);
    }

    function deleteWell(item) {
        return ajaxRequest('DELETE', wellUrl({ id: item.Id }));
    }

    function saveChangedWell(item) {
        return ajaxRequest('PUT', wellUrl({ id: item.Id }), item);
    }

    // get list
    function getWellFiles(urlQueryParams) {
        return ajaxRequest('GET', wellFileUrl(urlQueryParams));
    }

    function getWellFileUrl(urlQueryParams) {
        return wellFileUrl(urlQueryParams);
    }

    function deleteWellFile(data) {
        var urlQueryParams = {
            well_id: data.WellId,
            purpose: data.Purpose,
            status: data.Status,
            file_name: data.Name()
        };

        return ajaxRequest('DELETE', wellFileUrl(urlQueryParams));
    }

    function postWellFile(urlQueryParams, data) {
        return ajaxRequest('POST', wellFileUrl(urlQueryParams), data);
    }

    function importWellFileToPD(urlQueryParams, columnAttrList) {
        // public void Get(int well_id, string purpose, string status, string file_name, string headers_match)
        return ajaxRequest('POST', wellFileUrl(urlQueryParams), columnAttrList);
    }

    // 6. Production data
    function getProductionData(urlQueryParams) {
        return ajaxRequest('GET', productionDataUrl(urlQueryParams));
    }

    function deleteWellProductionData(wellId) {
        return ajaxRequest('DELETE', productionDataUrl({ "well_id": wellId }));
    }

    // 7. Column attribute
    function getColumnAttributes(urlQueryParams) {
        return ajaxRequest('GET', columnAttributeUrl(urlQueryParams));
    }

    function getWfmParamSquadList(uqp) {
        return ajaxRequest('GET', wfmParamSquadUrl(uqp));

        ////return ['rate', 'cumulative', 'watercut', 'gor'];
    }

    function getColumnAttributesLocal() {
        // scf - standart cubic feet
        // Mcf - Mega cubic feet
        // gph (US) - gallon per hour
        // gpd (UK) - gallon per day (imperial gallon - imp gal)
        // 1 gal (UK) = 4,54609 L
        // 1 gal (US) = 3,785411784 L = 231 in3
        // bbl - Oil barrel
        var volumeArr = ['bbl', 'Mbbl', 'MMbbl', 'scf', 'Mcf', 'MMcf', 'in3', 'm3', 'L', 'galUS', 'galUK'];
        var timeArr = ['d', 'hr', 'min', 'sec'];

        var arr = [
            { Id: 0, Name: 'WaterCut', Format: '%', Group: 'watercut', IsVisible: true, IsCalc: false, AssId: null, NumeratorList: ['%'], CurveColor: [121, 160, 193] },
            { Id: 1, Name: 'OilRate', Format: 'bbl/d', Group: 'rate', IsVisible: true, IsCalc: false, AssId: null, NumeratorList: volumeArr, DenominatorList: timeArr, CurveColor: [255, 204, 0] },
            { Id: 2, Name: 'WaterRate', Format: 'bbl/d', Group: 'rate', IsVisible: true, IsCalc: false, AssId: 10, NumeratorList: volumeArr, DenominatorList: timeArr, CurveColor: [20, 67, 106] },
            { Id: 3, Name: 'GasRate', Format: 'scf/d', Group: 'rate', IsVisible: true, IsCalc: false, AssId: null, NumeratorList: volumeArr, DenominatorList: timeArr, CurveColor: [131, 43, 51] },
            { Id: 4, Name: 'LiquidRate', Format: 'bbl/d', Group: 'rate', IsVisible: true, IsCalc: false, AssId: 11, NumeratorList: volumeArr, DenominatorList: timeArr, CurveColor: [3, 146, 0] },
            { Id: 5, Name: 'OilCum', Format: 'bbl', Group: 'cumulative', IsVisible: true, IsCalc: false, AssId: 13, NumeratorList: volumeArr, CurveColor: [255, 136, 0] },
            { Id: 6, Name: 'GasCum', Format: 'scf', Group: 'cumulative', IsVisible: true, IsCalc: false, AssId: 15, NumeratorList: volumeArr, CurveColor: [220, 20, 60] },
            { Id: 7, Name: 'WaterCum', Format: 'bbl', Group: 'cumulative', IsVisible: true, IsCalc: false, AssId: 14, NumeratorList: volumeArr, CurveColor: [64, 108, 145] },
            { Id: 8, Name: 'GOR', Format: 'scf/bbl', Group: 'gor', IsVisible: true, IsCalc: false, AssId: 12, NumeratorList: volumeArr, DenominatorList: volumeArr, CurveColor: [146, 0, 10] },
            { Id: 9, Name: 'LiquidCum', Format: 'bbl', Group: 'cumulative', IsVisible: true, IsCalc: false, AssId: 16, NumeratorList: volumeArr, CurveColor: [36, 101, 35] },

            { Id: 10, Name: 'CalcWaterRate', Format: 'bbl/d', Title: '= LiquidRate * WaterCut(%)', Group: 'rate', IsVisible: false, IsCalc: true, NumeratorList: volumeArr, DenominatorList: timeArr, CurveColor: [20, 67, 106] },
            { Id: 11, Name: 'CalcLiquidRate', Format: 'bbl/d', Title: '= WaterRate + OilRate', Group: 'rate', IsVisible: false, IsCalc: true, NumeratorList: volumeArr, DenominatorList: timeArr, CurveColor: [3, 146, 0] },
            { Id: 12, Name: 'CalcGOR', Format: 'scf/bbl', Title: '= (GasRate * 1000) / OilRate', Group: 'gor', IsVisible: false, IsCalc: true, NumeratorList: volumeArr, DenominatorList: volumeArr, CurveColor: [146, 0, 10] },
            { Id: 13, Name: 'CalcOilCum', Format: 'bbl', Title: '= OilRate * ProdDays + PREVIOUS(CalcOilCum)', Group: 'cumulative', IsVisible: false, IsCalc: true, NumeratorList: volumeArr, CurveColor: [255, 136, 0] },
            { Id: 14, Name: 'CalcWaterCum', Format: 'bbl', Title: '= WaterRate * ProdDays + PREVIOUS(CalcWaterCum)', Group: 'cumulative', IsVisible: false, IsCalc: true, NumeratorList: volumeArr, CurveColor: [64, 108, 145] },
            { Id: 15, Name: 'CalcGasCum', Format: 'scf', Title: '= GasRate * ProdDays + PREVIOUS(CalcGasCum)', Group: 'cumulative', IsVisible: false, IsCalc: true, NumeratorList: volumeArr, CurveColor: [220, 20, 60] },
            { Id: 16, Name: 'CalcLiquidCum', Format: 'bbl', Title: '= CalcLiquidRate * ProdDays + PREVIOUS(CalcLiquidRate)', Group: 'cumulative', IsVisible: false, IsCalc: true, NumeratorList: volumeArr, CurveColor: [36, 101, 35] }
        ];

        return arr;
    }

    var imageMimeTypes = ["image/jpeg", "image/png", "image/tiff"];

    function getSectionList() {
        return [
        { id: 'summary', name: 'Summary', formatList: ['*'] }, // any file type (main well files)
        { id: 'sketch', name: 'Sketch', formatList: ['image/jpeg', 'image/png'] },
        { id: 'volume', name: 'Volume', formatList: ['image/jpeg', 'image/png'] },
        { id: 'history', name: 'History', formatList: ['*'] }, // any file type
        { id: 'map', name: 'Map', formatList: [] }, // file loading forbidden
        { id: 'log', name: 'Log', formatList: [''] }, // las files has empty mime type
        { id: 'pd', name: 'Perfomance', formatList: ['text/plain', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'] },
        { id: 'test', name: 'Test', formatList: [] }, // file loading forbidden
        { id: 'integrity', name: 'Integrity', formatList: ['image/jpeg', 'image/png', 'application/pdf'] },
        { id: 'nodalanalysis', name: 'Nodal analysis', formatList: ['image/jpeg', 'image/png'] },
        { id: 'report', name: 'Report', formatList: ['application/pdf'] }
        ];
    }

    // 8. WellHistory
    function getWellHistoryList(urlQueryParams) {
        return ajaxRequest('GET', wellHistoryUrl(urlQueryParams));
    }

    function postWellHistory(item) {
        return ajaxRequest('POST', wellHistoryUrl(), item);
    }

    function putWellHistory(wellHistoryData) {
        return ajaxRequest('PUT', wellHistoryUrl({ id: wellHistoryData.id }), wellHistoryData);
    }

    function deleteWellHistory(wellHistoryId) {
        return ajaxRequest('DELETE', wellHistoryUrl({ id: wellHistoryId }));
    }

    // 9. WfmImage
    function saveNewWfmImage(urlQueryParams, item) {
        return ajaxRequest('POST', wfmImageUrl(urlQueryParams), item);
    }

    function deleteWfmImage(item) {
        return ajaxRequest('DELETE', wfmImageUrl({ id: item.Id }));
    }

    // 10. WellFieldMap
    function getWellFieldMapUrl(urlQueryParams) {
        return wellFieldMapUrl(urlQueryParams);
    }

    function getWellFieldMaps(urlQueryParams) {
        return ajaxRequest('GET', wellFieldMapUrl(urlQueryParams));
    }

    ////function saveNewWellFieldMap(item) {
    ////    return ajaxRequest('POST', wellFieldMapUrl(), item);
    ////}

    function saveChangedWellFieldMap(item) {
        return ajaxRequest('PUT', wellFieldMapUrl({ 'id': item.Id }), item);
    }

    function deleteWellFieldMap(item) {
        return ajaxRequest('DELETE', wellFieldMapUrl({ 'id': item.Id }));
    }

    // 11. WellFieldMapArea
    function getWellFieldMapAreas(urlQueryParams) {
        return ajaxRequest('GET', wellFieldMapAreaUrl(urlQueryParams));
    }

    function saveNewWellFieldMapArea(item) {
        return ajaxRequest('POST', wellFieldMapAreaUrl(), item);
    }

    function saveChangedWellFieldMapArea(item) {
        return ajaxRequest('PUT', wellFieldMapAreaUrl({ 'id': item.Id }), item);
    }

    function deleteWellFieldMapArea(item) {
        return ajaxRequest('DELETE', wellFieldMapAreaUrl({ 'id': item.Id }));
    }

    // 12. WellInWellFieldMap
    function getWellInWellFieldMaps(urlQueryParams) {
        return ajaxRequest('GET', wellInWellFieldMapUrl(urlQueryParams));
    }

    function saveNewWellInWellFieldMap(item) {
        return ajaxRequest('POST', wellInWellFieldMapUrl(), item);
    }

    function saveChangedWellInWellFieldMap(item) {
        return ajaxRequest('PUT', wellInWellFieldMapUrl(), item);
    }

    function deleteWellInWellFieldMap(urlQueryParams) {
        return ajaxRequest('DELETE', wellInWellFieldMapUrl(urlQueryParams));
    }

    function postWellHistoryFile(item) {
        return ajaxRequest('POST', wellHistoryFileUrl(), item);
    }

    function deleteWellHistoryFile(item) {
        return ajaxRequest('DELETE', wellHistoryFileUrl({
            'cloudfile_id': item.CloudFileId,
            'wellhistory_id': item.WellHistoryId
        }));
    }

    // user profile
    function createUserProfile(data) {
        return new datacontext.userProfile(data); // from cabinet.model.js
    }

    function getUserProfile() {
        return ajaxRequest('GET', userProfileUrl());
    }

    function putUserProfile(data) {
        return ajaxRequest('PUT', userProfileUrl({ 'id': data.userId }), data);
    }

    function saveNewTestScope(testScopeItem) {
        return ajaxRequest('POST', testScopeUrl(), testScopeItem);
    }

    function saveChangedTestScope(testScopeItem) {
        return ajaxRequest('PUT', testScopeUrl({ id: testScopeItem.id }), testScopeItem);
    }

    function getTestScope(uqp) {
        return ajaxRequest('GET', testScopeUrl(uqp));
    }

    function saveNewTestData(testDataItem) {
        return ajaxRequest('POST', testDataUrl(), testDataItem);
    }

    function saveChangedTestData(testDataItem) {
        return ajaxRequest('PUT', testDataUrl({
            testscope_id: testDataItem.testScopeId,
            hournumber: testDataItem.hourNumber
        }), testDataItem);
    }

    function deleteTestData(testDataItem) {
        return ajaxRequest('DELETE', testDataUrl({
            testscope_id: testDataItem.testScopeId,
            hournumber: testDataItem.hourNumber
        }));
    }

    // get wellGroup wfmParameter list
    function getWellGroupWfmParameterList(uqp) {
        return ajaxRequest('GET', wellGroupWfmParameterUrl(uqp));
        /// return [{
        /// WellGroupId: 123,
        /// WfmParameterId: 'GasRate',
        /// Color: ...
        /// }]       
    }

    // if user create new parameter - before sending need to create wfmParameter in database and get its Id
    // if user choose from library - we know its Id and we know WellGroupId from well
    function postWellGroupWfmParameter(wellGroupWfmParameterItem) {
        return ajaxRequest('POST', wellGroupWfmParameterUrl(), wellGroupWfmParameterItem);
    }

    // user wants to change color of parameter (in someone wellGroup)
    function putWellGroupWfmParameter(wellGroupWfmParameterItem) {
        return ajaxRequest('PUT', wellGroupWfmParameterUrl({
            wellGroupId: wellGroupWfmParameterItem.wellGroupId,
            wfmParameterId: wellGroupWfmParameterItem.WfmParameterId
        }), wellGroupWfmParameterItem);
    }

    // delete parameter from wellgroup
    // need to clean all data from TestData (and ProductionData)
    // if no one used this parameter (no more references to this table) and if parameter is not in the library 
    // then delete from wfmParameter table
    function deleteWellGroupWfmParameter(wellGroupWfmParameterItem) {
        return ajaxRequest('DELETE', wellGroupWfmParameterUrl({
            wellGroupId: wellGroupWfmParameterItem.wellGroupId,
            wfmParameterId: wellGroupWfmParameterItem.WfmParameterId
        }));
    }

    // ================== forecast evolution
    function getForecastEvolution(wellId) {
        return ajaxRequest('GET', forecastEvolutionUrl({ well_id: wellId }));
    }

    function postForecastEvolution(forecastEvolution) {
        return ajaxRequest('POST', forecastEvolutionUrl(), forecastEvolution);
    }

    var datacontext = {
        // create objects
        getWellRegionList: getWellRegionList,
        // save objects in db 
        saveNewWellRegion: saveNewWellRegion,
        saveNewWellField: saveNewWellField,
        saveNewWellGroup: saveNewWellGroup,
        saveNewWell: saveNewWell,
        // delete objects from db
        deleteWellRegion: deleteWellRegion,
        deleteWellField: deleteWellField,
        deleteWellGroup: deleteWellGroup,
        deleteWell: deleteWell,
        // save changed objects in db
        saveChangedWellRegion: saveChangedWellRegion,
        saveChangedWellField: saveChangedWellField,
        saveChangedWellGroup: saveChangedWellGroup,
        saveChangedWell: saveChangedWell,
        // WellFile
        getWellFiles: getWellFiles,
        getWellFileUrl: getWellFileUrl,
        deleteWellFile: deleteWellFile,
        importWellFileToPD: importWellFileToPD,
        postWellFile: postWellFile,
        // ProductionData
        getProductionData: getProductionData,
        deleteWellProductionData: deleteWellProductionData,
        // ColumnAttribute
        getColumnAttributes: getColumnAttributes,
        getColumnAttributesLocal: getColumnAttributesLocal,
        // WellHistory
        getWellHistoryList: getWellHistoryList,
        postWellHistory: postWellHistory,
        putWellHistory: putWellHistory,
        deleteWellHistory: deleteWellHistory,
        // WfmImage
        saveNewWfmImage: saveNewWfmImage,
        deleteWfmImage: deleteWfmImage,
        // WellFieldMap
        getWellFieldMapUrl: getWellFieldMapUrl,
        getWellFieldMaps: getWellFieldMaps,
        //// saveNewWellFieldMap: saveNewWellFieldMap,
        saveChangedWellFieldMap: saveChangedWellFieldMap,
        deleteWellFieldMap: deleteWellFieldMap,
        // WellFieldMapArea
        getWellFieldMapAreas: getWellFieldMapAreas,
        saveNewWellFieldMapArea: saveNewWellFieldMapArea,
        saveChangedWellFieldMapArea: saveChangedWellFieldMapArea,
        deleteWellFieldMapArea: deleteWellFieldMapArea,
        // WellInWellFieldMap
        getWellInWellFieldMaps: getWellInWellFieldMaps,
        saveNewWellInWellFieldMap: saveNewWellInWellFieldMap,
        saveChangedWellInWellFieldMap: saveChangedWellInWellFieldMap,
        deleteWellInWellFieldMap: deleteWellInWellFieldMap,
        // WellHistoryFile
        postWellHistoryFile: postWellHistoryFile,
        deleteWellHistoryFile: deleteWellHistoryFile,
        // section list
        getSectionList: getSectionList,
        imageMimeTypes: imageMimeTypes,
        // user profile
        createUserProfile: createUserProfile,
        getUserProfile: getUserProfile,
        putUserProfile: putUserProfile,
        // test scope
        saveNewTestScope: saveNewTestScope,
        saveChangedTestScope: saveChangedTestScope,
        getTestScope: getTestScope,
        // ... todo:
        // test data
        saveNewTestData: saveNewTestData,
        saveChangedTestData: saveChangedTestData,
        deleteTestData: deleteTestData,
        // well group wfm parameter
        getWellGroupWfmParameterList: getWellGroupWfmParameterList,
        postWellGroupWfmParameter: postWellGroupWfmParameter,
        putWellGroupWfmParameter: putWellGroupWfmParameter,
        deleteWellGroupWfmParameter: deleteWellGroupWfmParameter,
        getWfmParamSquadList: getWfmParamSquadList,
        getForecastEvolution: getForecastEvolution,
        postForecastEvolution: postForecastEvolution
    };

    // api/company/
    datacontext.postCompany = function (uqp, data) {
        return ajaxRequest('POST', companyUrl(uqp), data);
    };

    datacontext.getCompany = function (uqp) {
        return ajaxRequest('GET', companyUrl(uqp));
    };

    datacontext.putCompany = function (uqp, data) {
        return ajaxRequest('PUT', companyUrl(uqp), data);
    };

    // api/companyuser/
    datacontext.getCompanyUserList = function (uqp) {
        return ajaxRequest('GET', companyUserUrl(uqp));
    };

    // Widget layouts for well=================================================================
    datacontext.getWellWidgoutList = function (wellId) {
        return ajaxRequest('GET', wellWidgoutUrl(wellId));
    };

    // Widget layout for well
    datacontext.getWellWidgout = function (wellId, widgoutId) {
        return ajaxRequest('GET', wellWidgoutUrl(wellId, widgoutId));
    };

    datacontext.postWellWidgout = function (wellId, widgoutData) {
        return ajaxRequest('POST', wellWidgoutUrl(wellId), widgoutData);
    };

    datacontext.putWellWidgout = function (wellId, id, widgoutData) {
        return ajaxRequest('PUT', wellWidgoutUrl(wellId, id), widgoutData);
    };

    datacontext.deleteWellWidgout = function (wellId, widgoutId) {
        return ajaxRequest('DELETE', wellWidgoutUrl(wellId, widgoutId));
    };

    // Widget (well widget or well group widget etc.)==========================================
    datacontext.postWidget = function (widgockId, widgetData) {
        return ajaxRequest('POST', widgetUrl(widgockId), widgetData);
    };

    // Save changed widget
    datacontext.putWidget = function (widgockId, widgetId, widgetData) {
        return ajaxRequest('PUT', widgetUrl(widgockId, widgetId), widgetData);
    };

    datacontext.deleteWidget = function (widgockId, widgetId) {
        return ajaxRequest('DELETE', widgetUrl(widgockId, widgetId));
    };
    
    datacontext.getJobTypeList = function (companyId) {
        return ajaxRequest('GET', jobTypeUrl(companyId));
    };

    datacontext.getPossibleWidgoutList = function () {
        return [{
            name: '1 (one column)',
            widgockDtoList: [{
                orderNumber: 1,
                columnCount: 12
            }]
        },
       {
           name: '1-1 (two columns)',
           widgockDtoList: [{
               orderNumber: 1,
               columnCount: 6
           },
           {
               orderNumber: 1,
               columnCount: 6
           }]
       },
       {
           name: '1-1-1 (three columns)',
           widgockDtoList: [{
               orderNumber: 1,
               columnCount: 4
           },
           {
               orderNumber: 2,
               columnCount: 4
           },
           {
               orderNumber: 3,
               columnCount: 4
           }]
       },
       {
           name: '1-2 (two columns)',
           widgockDtoList: [{
               orderNumber: 1,
               columnCount: 4
           },
           {
               orderNumber: 2,
               columnCount: 8
           }]
       },
       {
           name: '2-1 (two columns)',
           widgockDtoList: [{
               orderNumber: 1,
               columnCount: 8
           },
           {
               orderNumber: 2,
               columnCount: 4
           }]
       },
       {
           name: '1-1-1-1 (four columns)',
           widgockDtoList: [{
               orderNumber: 1,
               columnCount: 3
           },
           {
               orderNumber: 2,
               columnCount: 3
           },
           {
               orderNumber: 3,
               columnCount: 3
           },
           {
               orderNumber: 4,
               columnCount: 3
           }]
       },
       {
           name: '1-1-2 (three columns)',
           widgockDtoList: [{
               orderNumber: 1,
               columnCount: 3
           },
           {
               orderNumber: 2,
               columnCount: 3
           },
           {
               orderNumber: 3,
               columnCount: 6
           }]
       },
       {
           name: '1-2-1 (three columns)',
           widgockDtoList: [{
               orderNumber: 1,
               columnCount: 3
           },
           {
               orderNumber: 2,
               columnCount: 6
           },
           {
               orderNumber: 3,
               columnCount: 3
           }]
       },
       {
           name: '2-1-1 (three columns)',
           widgockDtoList: [{
               orderNumber: 1,
               columnCount: 6
           },
           {
               orderNumber: 2,
               columnCount: 3
           },
           {
               orderNumber: 3,
               columnCount: 3
           }]
       },
       {
           name: '3-1 (two columns)',
           widgockDtoList: [{
               orderNumber: 1,
               columnCount: 9
           },
           {
               orderNumber: 2,
               columnCount: 3
           }]
       },
       {
           name: '1-3 (two columns)',
           widgockDtoList: [{
               orderNumber: 1,
               columnCount: 3
           },
           {
               orderNumber: 2,
               columnCount: 9
           }]
       }];
    };

    return datacontext;
});