// Controllers (directives)
// requirejs: app/controllers/auth
// angular: ang-auth-controllers

define(['jquery',
    'angular',
    'app/datacontext',
    'app/datacontexts/auth', // Load auth methods to datacontext
    'angular-route'],
    function ($, angular, appDatacontext) {
        'use strict';

        angular.module('ang-auth-controllers', ['ngRoute'])
        .controller('AccountLogonCtrl', ['$scope', '$rootScope', '$location', '$routeParams', function (scp, angRootScope, angLocation, angRouteParams) {

            // TODO: chane to normal realization
            angRootScope.isLogged = false;

            scp.usver = {
                email: angRouteParams.email
            };

            // When user successfuly confirm email after registration - need to show notification
            scp.isEmailConfirmed = angRouteParams.confirmed;

            scp.isProcessBtnEnabled = true;

            scp.processError = '';

            // Password restriction bounds
            scp.bound = {
                password: {
                    minLength: 6,
                    maxLength: 18
                }
            };

            function afterLogon() {
                ////angWindow.alert('success logon');
                // Navigate to company list from /account/logon/index.html

                scp.$apply(function () {
                    angRootScope.isLogged = true;
                    angLocation.path('/companies');
                });
            }

            scp.tryAuth = function () {
                scp.isProcessBtnEnabled = false;
                appDatacontext.accountLogon({}, scp.usver).done(afterLogon).fail(function (jqXHR) {
                    if (jqXHR.status === 422) {
                        var resJson = jqXHR.responseJSON;
                        var tmpProcessError = '*';
                        require(['app/lang-helper'], function (langHelper) {
                            tmpProcessError += (langHelper.translate(resJson.errId) || 'unknown error');
                            // Because using jQuery ajax is out of the world of angular, you need to wrap your $scope assignment inside of
                            scp.$apply(function () {
                                scp.processError = tmpProcessError;
                            });
                        });
                    }
                }).always(function () {
                    // When error or smth activate login button
                    scp.$apply(function () {
                        scp.isProcessBtnEnabled = true;
                    });
                });
            };

            scp.isTestLoginBtnEnabled = true;

            scp.testAuth = function () {
                scp.isTestLoginBtnEnabled = false;
                appDatacontext.accountLogon({}, {
                    'email': 'wfm@example.com',
                    'password': '123321'
                }).done(afterLogon);
            };
        }])
        .controller('AccountLogoffCtrl', ['$window', function (angWindow) {
            // Remove AUTH httponly cookie
            appDatacontext.accountLogoff().done(function () {
                // After logoff navigate to the main page
                angWindow.location.href = '#/account/logon';
            });
        }]);
    });