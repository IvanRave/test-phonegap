require(['require-config'], function () {
    'use strict';

    require(['jquery', 'angular', 'app/controllers/company', 'app/controllers/auth', 'app/controllers/register',
        'angular-route', 'jquery.bootstrap', 'jquery.panzoom',
        'console-shim', 'es5-shim'], function ($, angular) {
            var PRJ_MODULE_NAME = 'ang-cabinet-project';

            angular.module(PRJ_MODULE_NAME, ['ngRoute', 'ang-company-controllers', 'ang-auth-controllers', 'ang-register-controllers'])
            .config(['$routeProvider', '$httpProvider', '$interpolateProvider', function (rpr, angHttpProvider, angInterpolateProvider) {
                rpr.when('/account/logon', { controller: 'AccountLogonCtrl', templateUrl: './tpl/account/logon.html' })
                    .when('/account/logoff', { controller: 'AccountLogoffCtrl', templateUrl: './tpl/account/logoff.html' })
                    .when('/account/register', { controller: 'AccountRegisterCtrl', templateUrl: './tpl/account/register.html' })
                    .when('/account/register/confirmation', { controller: 'AccountRegisterConfirmationCtrl', templateUrl: './tpl/account/register/confirmation.html' })
                    .when('/companies', { controller: 'CompanyUserCtrl', templateUrl: './tpl/cabinet/company-list.html' })
                    .when('/companies/create', { controller: 'CompanyCreateCtrl', templateUrl: './tpl/cabinet/company-create.html' })
                    .when('/companies/:companyId/manage-info', { controller: 'CompanyManageInfoCtrl', templateUrl: './tpl/cabinet/manage-info.html' })
                    .when('/companies/:companyId/manage-users', { controller: 'CompanyManageUserCtrl', templateUrl: './tpl/cabinet/manage-user.html' })
                    .when('/companies/:companyId', { controller: 'WorkspaceCtrl', templateUrl: './tpl/workspace.html', reloadOnSearch: false })
                    .when('/companies/:companyId/manage', { controller: 'WorkspaceManageCtrl', templateUrl: './tpl/workspace.html', reloadOnSearch: false })
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

            // Using jQuery dom ready because it will run this even if DOM load already happened
            $(function () {
                var wfmProject = document.getElementById('wfm-project');
                angular.bootstrap(wfmProject, [PRJ_MODULE_NAME]);
                $(wfmProject).removeClass('hide');

                // ======================================= pan zoom =======================
                var $panzoom = $('.panzoom').panzoom({
                    $zoomIn: $('.panzoom-in'),
                    $zoomOut: $('.panzoom-out'),
                    $reset: $('.panzoom-reset'),
                    increment: 0.3,
                    minScale: 0.0001,
                    maxScale: 10000,
                });

                $panzoom.parent().on('mousewheel.focal', function (e) {
                    e.preventDefault();
                    var delta = e.delta || e.originalEvent.wheelDelta;
                    var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
                    $panzoom.panzoom('zoom', zoomOut, {
                        increment: 0.1,
                        focal: e
                    });
                });
                // ======================================= pan zoom end =======================
            });
        });
});