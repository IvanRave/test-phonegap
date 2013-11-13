// Services for cabinet page
// requirejs: app/cabinet-services
// angular: ang-cabinet-services

define(['angular'], function (angular) {
    'use strict';

    angular.module('ang-cabinet-services', []).service('SharedService', [function () {
        // private variable
        var sharedObject = {
            accessLevelDict: {
                "CanManageAll": { "AccessCode": 1, "Description": "Can manage" },
                "CanEditAll": { "AccessCode": 2, "Description": "Can edit" },
                "CanViewAll": { "AccessCode": 4, "Description": "Can view" }
            }
        };

        return {
            // public methods
            getSharedObject: function () {
                return sharedObject;
            },
            getOwnerAccessCode: function () {
                return sharedObject.accessLevelDict.CanManageAll.AccessCode;
            }
        };
    }]);
});