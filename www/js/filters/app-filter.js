// Filters for all app (angular)
// requirejs: filters/app-filter
// angular: ang-app-filter

define(['angular'], function (angular) {
    'use strict';

    return angular.module('ang-app-filter', [])
    .filter('bitwiseand', function () {
        return function (firstNumber, secondNumber) {
            return ((parseInt(firstNumber, 10) & parseInt(secondNumber, 10)) === parseInt(secondNumber, 10));
        };
    });
});