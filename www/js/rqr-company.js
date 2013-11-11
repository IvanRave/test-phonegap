require(['require-config'], function () {
    'use strict';

    require(['jquery', 'angular', 'app/cabinet/project', 'jquery.bootstrap'], function ($, angular, cabinetProject) {
        // Using jQuery dom ready because it will run this even if DOM load already happened
        $(function () {
            var wfmProject = document.getElementById('wfm-project');
            angular.bootstrap(wfmProject, [cabinetProject.name]);
            $(wfmProject).removeClass('hide');
        });
    });
});