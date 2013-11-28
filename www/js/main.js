require(['require-config'], function () {
    'use strict';

    require(['jquery', 'angular', 'blueimp-gallery', 'app/controllers/company', 'app/controllers/auth', 'app/controllers/register',
        'angular-route', 'jquery.bootstrap',
        'console-shim', 'es5-shim'], function ($, angular, blueimpGallery) {
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

                console.log('blueimp', blueimpGallery);
                ////document.getElementById('links').onclick = function (event) {
                ////    event = event || window.event;
                ////    // event.target / event.srcElement contains a reference to the element the event was raised on.
                ////    var target = event.target || event.srcElement,
                ////        // get parent link or link if no image inside
                ////        link = target.src ? target.parentNode : target,
                ////        // all links for building gallery
                ////        links = this.getElementsByTagName('a');
                ////    //event.preventDefault();
                ////    blueimpGallery(links, {
                ////        index: link,
                ////        event: event,
                ////        stretchImages: false
                ////    });

                ////    //console.log(link);
                ////    //console.log(links);
                ////    //console.log(options);
                    
                ////    return false;
                ////};
            });
        });
});