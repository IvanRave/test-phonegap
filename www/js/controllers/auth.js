// Controllers (directives)
// requirejs: controllers/auth
// angular: ang-auth-controllers

define(['jquery',
    'angular',
    'services/datacontext',
    'services/auth', // Load auth methods to datacontext
    'angular-route'],
    function ($, angular, appDatacontext) {
        'use strict';

        // From asdf=awegawe&mobaweb=123&aqwegWQ=12
        // To {asdf: asdfads, awega:123, awegawe=12}
        function getSearchParamsFromUrl(searchParamsString) {
            var searchParams = {};
            if (searchParamsString) {
                var tmpStringArr = searchParamsString.split('&');
                for (var i = 0; i < tmpStringArr.length; i += 1) {
                    var urlParamObj = tmpStringArr[i].split('=');
                    searchParams[urlParamObj[0]] = urlParamObj[1];
                }
            }

            return searchParams;
        }

        angular.module('ang-auth-controllers', ['ngRoute'])
        .controller('AccountLogonCtrl', ['$scope', '$rootScope', '$location', '$routeParams', function (scp, angRootScope, angLocation, angRouteParams) {

            // TODO: chane to normal realization
            angRootScope.isLogged = false;

            scp.usver = {
                email: angRouteParams.email
            };

            var redirectUrl = angRouteParams.rurl;
            var searchParams = {};
            if (redirectUrl) {
                var rurlArr = redirectUrl.split('?');
                if (rurlArr[0]) {
                    redirectUrl = rurlArr[0];
                }
                if (rurlArr[1]) {
                    searchParams = getSearchParamsFromUrl(rurlArr[1]);
                }
            }


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
                    angLocation.path(redirectUrl || '/companies').search(searchParams);
                });
            }

            scp.tryAuth = function () {
                scp.isProcessBtnEnabled = false;
                appDatacontext.accountLogon({}, scp.usver).done(afterLogon).fail(function (jqXHR) {
                    if (jqXHR.status === 422) {
                        var resJson = jqXHR.responseJSON;
                        var tmpProcessError = '*';
                        require(['helpers/lang-helper'], function (langHelper) {
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