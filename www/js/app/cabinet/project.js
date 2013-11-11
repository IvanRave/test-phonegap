// Project for cabinet page
// require: app/cabinet/project
// angular: ang-cabinet-project

define(['angular', 'angular-route', 'app/cabinet/controllers'], function (angular) {
    'use strict';

    var tplFolder = 'wfm-template/';

    return angular.module('ang-cabinet-project', ['ngRoute', 'ang-cabinet-controllers'])
        .config(['$routeProvider', '$httpProvider', '$interpolateProvider', function (rpr, angHttpProvider, angInterpolateProvider) {
            rpr.when('/account/logon', { controller: 'AccountLogonCtrl', templateUrl: tplFolder + 'account/logon.html' })
                .when('/account/logoff', { controller: 'AccountLogoffCtrl', templateUrl: tplFolder + 'account/logoff.html' })
                .when('/account/register', { controller: 'AccountRegisterCtrl', templateUrl: tplFolder + 'account/register.html' })
                .when('/account/register/confirmation', { controller: 'AccountRegisterConfirmationCtrl', templateUrl: tplFolder + 'account/register/confirmation.html' })
                .when('/companies', { controller: 'CompanyUserCtrl', templateUrl: tplFolder + 'cabinet/company-list.html' })
                .when('/companies/create', { controller: 'CompanyCreateCtrl', templateUrl: tplFolder + 'cabinet/company-create.html' })
                .when('/companies/:companyId/manage-info', { controller: 'CompanyManageInfoCtrl', templateUrl: tplFolder + 'cabinet/manage-info.html' })
                .when('/companies/:companyId/manage-users', { controller: 'CompanyManageUserCtrl', templateUrl: tplFolder + 'cabinet/manage-user.html' })
                .when('/companies/:companyId/view', { controller: 'WorkspaceCtrl', templateUrl: tplFolder + 'workspace.html', reloadOnSearch: false })
                .when('/companies/:companyId/manage', { controller: 'WorkspaceCtrl', templateUrl: tplFolder + 'workspace.html', reloadOnSearch: false })
                .otherwise({ redirectTo: '/companies' });

            // Turn in CORS cookie support
            angHttpProvider.defaults.withCredentials = true;

            // Change standard curly braces tempate engine to {[{value}]}
            angInterpolateProvider.startSymbol('{[{').endSymbol('}]}');
        }])
        .run(['$rootScope', function (angRootScope) {
            angRootScope.isLogged = true;
        }]);

    // Configuration blocks - get executed during the provider registrations and configuration phase. 
    // Only providers and constants can be injected into configuration blocks. 
    // This is to prevent accidental instantiation of services before they have been fully configured.

    // Run blocks - get executed after the injector is created and are used to kickstart the application. 
    // Only instances and constants can be injected into run blocks. 
    // This is to prevent further system configuration during application run time.
});
