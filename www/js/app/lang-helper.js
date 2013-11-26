define([], function () {
    'use strict';

    var langDict = {
        // 
        'wfm': 'WFM',
        // 
        'wellfilemanager': 'well file manager',
        // 
        'name': 'name',
        // 
        'description': 'description',
        // 
        'email': 'email',
        // 
        'password': 'password',
        // 
        'passwordconfirmation': 'password confirmation',
        // 
        'passwordconfirmationandpasswordarenotequal': 'password confirmation and password are not equal',
        // 
        'steps': 'steps',
        // 
        'required': 'required',
        // 
        'cancel': 'cancel',
        // 
        'tocancel': 'cancel',
        // 
        'saved': 'saved',
        // 
        'saving': 'saving',
        // 
        'tosave': 'save',
        // 
        'toadd': 'add',
        // 
        'adding': 'add',
        // 
        'viewing': 'view',
        // 
        'toview': 'view',
        // 
        'editing': 'edit',
        // 
        'toedit': 'edit',
        // 
        'deletion': 'deletion',
        // 
        'todelete': 'delete',
        // 
        'selection': 'selection',
        // 
        'toselect': 'select',
        // 
        'using': 'use',
        // 
        'touse': 'use',
        // 
        'registration': 'registration',
        // 
        'toregister': 'register',
        // 
        'loading': 'loading',
        // 
        'toload': 'load',
        // 
        'rememberme': 'remember me',
        // 
        'remembermeinthisbrowser': 'remember me in this browser',
        // 
        'error': 'error',
        // 
        'unknownerror': 'unknown error',
        // 
        'wrongcredentials': 'incorrect email or password',
        // 
        'emailisnotconfirmed': 'email is not confirmed',
        // 
        'confirmationtoken': 'confirmation token',
        // 
        'emailconfirmation': 'email confirmation',
        // 
        'emailisalreadytaken': 'email is already taken',
        // 
        'confirmationemailfailedtosend': 'confirmation email failed to send. Please try register again later.',
        // 
        'validationerrors': 'validation errors',
        // 
        'wrongemailformat': 'wrong email format',
        // 
        'emailconfirmationisunsuccessful': 'email confirmation is unsuccessful',
        // 
        'success': 'success',
        // 
        'signin': 'sign in',
        // 
        'logout': 'log out',
        // 
        'companylist': 'companies',
        // 
        'companyname': 'company name',
        // 
        'companydescription': 'company description',
        // 
        'companyinfo': 'company info',
        // 
        'companyusers': 'company users',
        // 
        'toregisteracompany': 'register a company',
        // 
        'logo': 'logo',
        // 
        'minlength': 'min length',
        // 
        'maxlength': 'max length',
        // 
        'admin': 'admin',
        // 
        'or': 'or',
        // 
        'test': 'test',
        // 
        'demo': 'demo',
        // 
        'demowfmcaution': 'please don&#x27;t load secret or important data. All loaded data can be removed at any time.',
        // 
        'termsandconditions': 'terms and conditions',
        // 
        'usercannotregisterfewcompanies': 'user can not register few companies',
        // 
        'pagenotfound': 'page not found',
        // 
        'aboutwfm': 'about',
        // 
        'contacts': 'contacts',
        // 
        'pricing': 'pricing',
        // 
        'home': 'home',
        // 
        'workspace': 'workspace',
        // 
        'processing': 'processing',
        // 
        'toaddwidget': 'add widget',
        // 
        'productionhistory': 'production history',
        // 
        'summary': 'summary',
        // 
        'sketch': 'sketch',
        // 
        'settings': 'settings',
        // 
        'layout': 'layout',
        // 
        'todeletelayout': 'delete layout',
        // 
        'tocreatelayout': 'create new layout',
        // 
        'confirmtodelete': 'are you sure you want to delete',
        // 
        'development': 'development',
        // 
        'documentation': 'documentation',
        // 
        'attachfile': 'attach a file',
        // 
        'cropimage': 'crop an image',
        // 
        'tocreaterecord': 'create new record',
        // 
        'filterbydate': 'filter by date',
        // 
        'filterbyjobtype': 'filter by job type',
        // 
        'sortbydate': 'sort by date',
        // 
        'nowellhistorylist': 'no well history',
        // 
        'jobtype': 'job type',
        // 
        'timeperiod': 'period',
        // 
        'toaddjobtypetolist': 'add job type to list',
        // 
        'underconstruction': 'under construction',
        // 
        'todeletewell': 'delete well',
        // 
        'well': 'well',
        // 
        'dashboard': 'dashboard',
        // 
        'group': 'group',
        // 
        'region': 'region',
        // 
        'field': 'field',
        // 
        'filemanager': 'file manager',
        // 
        'volume': 'volume',
        // 
    };

    ////var signArr = /,!/g; [',', '!', '.', ':', '?', '(', ')', '[', ']', '{', '}', '\'', ';'];
    ////var signRegExp = /[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g;

    var langHelper = {};

    // Translate without punktuation signs
    langHelper.translate = function (str) {
        str = str.toLowerCase();
        var startSignIndex = str.search(/[\w]/g);
        var endSignIndex = str.search(/[^\w]+$/g);
        if (startSignIndex === -1) {
            startSignIndex = 0;
        }
        if (endSignIndex === -1) {
            endSignIndex = str.length;
        }
        var cleanStr = str.substring(startSignIndex, endSignIndex);
        var transStr = langDict[cleanStr];
        if (transStr) {
            return str.replace(cleanStr, transStr);
        }
        else {
            return str;
        }
    };

    // From: unknownParam: Email, Pass
    // To: unknown parameters: email, password
    // Only for ASCII strRow (no Unicode)
    langHelper.translateRow = function (strRow) {
        // TODO: translate entire row by space, colon etc.
        ////var rowArr = strRow.split(/[ ;:]/g);
        // Divide by whitespace
        var rowArr = strRow.split(' ');
        var destArr = [];
        // Translate every word without punktuation signs
        // If no translation then put origin word
        for (var i = 0; i < rowArr.length; i += 1) {
            destArr.push(langHelper.translate(rowArr[i]) || rowArr[i]);
        }

        // Join by space
        return destArr.join(' ');
    };

    return langHelper;

    ////var langHelper = {};

    ////// Get language id from cookie or url
    ////var langId = 'en';
    ////var dict;

    ////langHelper.translate = function (strId) {
    ////    if (dict) {
    ////        console.log('no dict');
    ////        return dict[strId] || strId;
    ////    }
    ////    else {
    ////        $.get('/data/lang/' + langId + '/lang.json', function (langDict) {
    ////            console.log('myData', langDict);
    ////            console.log('myDataStrId', langDict[strId]);
    ////            dict = langDict;
    ////            console.log(dict)
    ////            console.log('this is a dict');
    ////            return langDict[strId] || strId;
    ////        });
    ////    }
    ////};
});