// Controllers (directives) for company page
// requirejs: app/cabinet/controllers
// angular: ang-cabinet-controllers

define(['jquery',
    'angular',
    'app/datacontext',
    'app/cookie-helper',
    'angular-route',
    'app/app-resource',
    'app/cabinet/services',
    'app/app-filters',
    'jquery.ui.widget', 'jquery.iframe-transport',
    // The XDomainRequest Transport is included for cross-domain file deletion for IE8+ 
    'ajaxupload/cors/jquery.xdr-transport',
    'ajaxupload/cors/jquery.postmessage-transport',
    'jquery.lightbox', 'bootstrap-datepicker'],
    function ($, angular, appDatacontext, cookieHelper) {
        'use strict';

        return angular.module('ang-cabinet-controllers', ['ngRoute', 'ang-app-resource', 'ang-cabinet-services', 'ang-app-filters'])
        .controller('CompanyUserCtrl', ['$scope', 'SharedService', function (scp, sharedService) {
            scp.accessLevelDict = sharedService.getSharedObject().accessLevelDict;

            scp.isLoadedCompanyUserList = false;

            scp.companyUserList = [];

            // Get company list
            appDatacontext.getCompanyUserList().done(function (response) {
                scp.$apply(function () {
                    scp.companyUserList = response;
                    scp.isLoadedCompanyUserList = true;
                });
            });

            scp.isOwnerAlready = function () {
                // when user is company owner already then block link "register company"
                // if AccessLevel == 0 then block link
                var result = false;

                $.each(scp.companyUserList, function (companyUserIndex, companyUserValue) {
                    if ((parseInt(companyUserValue.AccessLevel, 10) & sharedService.getOwnerAccessCode()) > 0) {
                        // find need value and break this cycle
                        result = true;
                        return false;
                    }
                    else {
                        // continue cycle
                        return true;
                    }
                });

                return result;
            };
        }])
        .controller('CompanyCreateCtrl', ['$scope', '$location', function (scp, angLocation) {
            scp.isPostSended = false;
            scp.postCompany = function () {
                scp.isPostSended = true;
                scp.companyNew.LogoUrl = '';
                appDatacontext.postCompany({}, scp.companyNew).done(function () {
                    angLocation.path('/companies');
                })
                .fail(function (jqXhr) {
                    if (jqXhr.status === 422) {
                        require(['app/lang-helper'], function (langHelper) {
                            // Because using jQuery ajax is out of the world of angular, you need to wrap your $scope assignment inside of
                            scp.$apply(function () {
                                scp.processError = (langHelper.translate(jqXhr.responseJSON.errId) || 'unknown error');
                            });
                        });
                    }
                })
                .always(function () {
                    scp.$apply(function () {
                        // Activate button for sending request one more time (like 'try later' or need to change some fields)
                        scp.isPostSended = false;
                    });
                });
            };
        }])
        .controller('CompanyManageInfoCtrl', ['$scope', '$routeParams', function (angScope, angRouteParams) {
            var companyId = angRouteParams.companyId;
            // Check company id as Guid
            if (!companyId || /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(companyId) === false) {
                return;
            }

            // TODO: Make url query for CORS
            // TODO: Get url query from datacontext function
            angScope.setFileUpload = function () {
                require(['app/file-helper'], function (fileHelper) {
                    var fileUploadInput = document.getElementById('company-logo-file-upload');
                    fileHelper.initFileUpload(fileUploadInput, 'http://wfm-client.azurewebsites.net/api/company?id=' + companyId, ['image/png', 'image/jpeg', 'image/gif'], function (respImg) {
                        angScope.$apply(function () {
                            // apply logo from response: plus unique hash for update img in html
                            angScope.company.LogoUrl = respImg.LogoUrl + "?" + new Date().getTime();
                        });
                    });
                });
            };

            // load company info
            angScope.isLoadedCompany = false;

            appDatacontext.getCompany({ id: companyId }).done(function (response) {
                angScope.$apply(function () {
                    angScope.companyOriginal = response;
                    angScope.company = angular.copy(angScope.companyOriginal);
                    angScope.isLoadedCompany = true;
                });
            });

            angScope.isClean = function () {
                return angular.equals(angScope.companyOriginal, angScope.company);
            };

            angScope.putCompany = function () {
                appDatacontext.putCompany({ id: companyId }, angScope.company).done(function (response) {
                    angScope.$apply(function () {
                        angScope.companyOriginal = response;
                    });
                });
            };
        }])
        .controller('CompanyManageUserCtrl', ['$scope', '$routeParams', 'SharedService', function (angScope, angRouteParams, sharedService) {
            var companyId = angRouteParams.companyId;

            if (!companyId || /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(companyId) === false) { return; }

            angScope.companyUserList = [];
            angScope.isLoadedCompanyUserList = false;

            // Load company users
            appDatacontext.getCompanyUserList({ company_id: companyId }).done(function (response) {
                angScope.$apply(function () {
                    angScope.companyUserList = response;
                    angScope.isLoadedCompanyUserList = true;
                });
            });

            angScope.accessLevelDict = sharedService.getSharedObject().accessLevelDict;

            angScope.companyUserNew = {
                CompanyId: companyId,
                AccessLevel: 0,
                UserProfileDto: {
                    Email: ''
                }
            };

            ////angScope.postCompanyUser = function () {
            // TODO: change to appDatacontext
            ////    companyUserFactory.post(angScope.companyUserNew, function (createdCompanyUser) {
            ////        angScope.companyUserList.push(createdCompanyUser);
            ////        angScope.companyUserNew.UserProfileDto.Email = '';
            ////    }, function (errorResult) {
            ////        if (errorResult.data && errorResult.data.Message) {
            ////            alert('Error: ' + errorResult.data.Message);
            ////        }
            ////    });
            ////};
        }])
        .controller('AccountLogonCtrl', ['$scope', '$rootScope', '$location', '$routeParams', function (scp, angRootScope, angLocation, angRouteParams) {
            angRootScope.isLogged = false;

            scp.usver = {
                Email: angRouteParams.email
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
                //angWindow.location.href = '../../company/index.html';
                cookieHelper.createCookie('is_auth', 'true');
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
                    "Email": "wfm@example.com",
                    "Password": "123321"
                }).done(afterLogon);
            };
        }])
        .controller('AccountLogoffCtrl', ['$window', function (angWindow) {
            // Remove AUTH httponly cookie and is_auth cookie
            appDatacontext.accountLogoff().done(function () {
                cookieHelper.removeCookie('is_auth');
                // After logoff navigate to the main page
                angWindow.location.href = '#/account/logon';
            });
        }])
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
                        email: scp.usver.Email
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
        .controller('AccountRegisterConfirmationCtrl', ['$scope', '$routeParams', '$location', function (angScope, angRouteParams, angLocation) {

            angScope.usver = {
                email: angRouteParams.email,
                token: angRouteParams.token
            };

            angScope.isProcessBtnEnabled = true;
            angScope.processError = '';
            angScope.confirmEmail = function () {
                angScope.isProcessBtnEnabled = false;
                appDatacontext.accountRegisterConfirmation({}, angScope.usver).done(function () {
                    angScope.$apply(function () {
                        angLocation.path('/account/logon').search({ email: angScope.usver.email, confirmed: true });
                    });
                }).fail(function () {
                    angScope.$apply(function () {
                        angScope.isProcessBtnEnabled = true;
                        angScope.processError = 'email confirmation is unsuccessful';
                    });
                });
            };

            ////var confirmationEmail = angRouteParams.email,// decodeURIComponent(appHelper.queryString['email']),
            ////    confirmationToken = angRouteParams.token; // appHelper.queryString['token'];            
        }])
        .controller('WorkspaceCtrl', ['$scope', '$routeParams', function (angScope, angRouteParams) {
            // View workspace: do not load libs for edit (for example Wisywig editor, or file-uploading features)
            // Views can be devided too: one - for view, second - for edit (do not put external elements, like input boxes, file-input boxes etc.)
            require(['compability-fix'], function () {
                // 
                ////require(['app/workspace/project']);
                // 

                require(['jquery',
                    'knockout',
                    'app/workspace/viewmodel',
                    'app/bindings',
                    'ko-external-template-engine'], function ($, ko, AppViewModel) {

                        // This function is called once the DOM is ready.
                        // It will be safe to query the DOM and manipulate DOM nodes in this function.
                        $(function () {

                            // Get company Id
                            ////'9cf09ba5-c049-4148-8e5f-869c1e26c330';
                            var wfmAppViewModel = new AppViewModel(angRouteParams.companyId, angRouteParams['editable'] ? true : false, {
                                regionId: parseInt(angRouteParams['region']),
                                fieldId: parseInt(angRouteParams['field']),
                                groupId: parseInt(angRouteParams['group']),
                                wellId: parseInt(angRouteParams['well']),
                                sectionId: parseInt(angRouteParams['section'])
                            });
                            ko.applyBindings(wfmAppViewModel, document.getElementById('workspace-project'));
                            var jqrWindow = $(window);
                            jqrWindow.resize(function () {
                                wfmAppViewModel.windowHeight(jqrWindow.height());
                                wfmAppViewModel.windowWidth(jqrWindow.width());
                            });
                        });
                    });
            });
        }]);
    });