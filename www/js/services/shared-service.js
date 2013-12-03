// Services for cabinet page
// requirejs: cabinet-services
// angular: ang-shared-service

define(['angular'], function (angular) {
    'use strict';

    angular.module('ang-shared-service', []).service('SharedService', [function () {
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