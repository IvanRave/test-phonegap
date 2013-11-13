// Controllers (directives)
// requirejs: app/controllers/register
// angular: ang-register-controllers

define(['jquery',
    'angular',
    'app/datacontext',
    'app/datacontexts/register',
    'angular-route'],
    function ($, angular, appDatacontext) {
        'use strict';

        angular.module('ang-register-controllers', ['ngRoute'])
        .controller('AccountRegisterCtrl', ['$scope', '$location', function (scp, angLocation) {
            scp.isProcessBtnEnabled = true;

            scp.processError = '';

            // Password restriction bounds
            scp.bound = {
                password: {
                    minLength: 6,
                    maxLength: 18
                }
            };

            scp.tryRegister = function () {
                scp.isProcessBtnEnabled = false;

                appDatacontext.accountRegister({}, scp.usver).done(function () {
                    angLocation.path('/account/register/confirmation').search({
                        email: scp.usver.email
                    });
                    ////angWindow.alert('Success. Please check your email to confirm registration.');
                    // TODO:
                    // Send to email-confirm-sending
                    // Redirect to email-confirmation with email in url
                    // page with one text box (or with email) to put token into 
                    // and confirm button
                }).fail(function (jqXhr) {
                    if (jqXhr.status === 422) {
                        require(['app/lang-helper'], function (langHelper) {
                            // Because using jQuery ajax is out of the world of angular, you need to wrap your $scope assignment inside of
                            scp.$apply(function () {
                                scp.processError = (langHelper.translate(jqXhr.responseJSON.errId) || 'unknown error');
                                scp.isProcessBtnEnabled = true;
                            });
                        });
                    }
                });
            };
        }])
        .controller('AccountRegisterConfirmationCtrl', ['$scope', '$routeParams', '$location', function (scp, angRouteParams, angLocation) {

            scp.usver = {
                email: angRouteParams.email,
                token: angRouteParams.token
            };

            scp.isProcessBtnEnabled = true;
            scp.processError = '';
            scp.confirmEmail = function () {
                scp.isProcessBtnEnabled = false;
                appDatacontext.accountRegisterConfirmation({}, scp.usver).done(function () {
                    scp.$apply(function () {
                        angLocation.path('/account/logon').search({ email: scp.usver.email, confirmed: true });
                    });
                }).fail(function () {
                    scp.$apply(function () {
                        scp.isProcessBtnEnabled = true;
                        scp.processError = 'email confirmation is unsuccessful';
                    });
                });
            };

            ////var confirmationEmail = angRouteParams.email,
            ////    confirmationToken = angRouteParams.token;
        }]);
    });