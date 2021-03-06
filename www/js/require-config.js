define([], function () {
    requirejs.config({
        //baseUrl: '.',
        paths: {
            'jquery.bootstrap': 'bootstrap',
            // The basic File Upload plugin
            'yandex-map': 'http://api-maps.yandex.ru/2.0/?load=package.full&lang=en-US'
            ////'blob-js': 'blobjs/Blob.min',
            ////'blob-builder': 'blobjs/BlobBuilder.min',
            ////'filesaver': 'filesaverjs/filesaver.min',
            ////'jspdf': 'jspdf/jspdf',
            ////'jspdf.plugin.addimage': 'jspdf/jspdf.plugin.addimage',
            ////'jspdf.plugin.cell': 'jspdf/jspdf.plugin.cell',
            ////'jspdf.plugin.from_html': 'jspdf/jspdf.plugin.from_html',
            ////'jspdf.plugin.ie_below_9_shim': 'jspdf/jspdf.plugin.ie_below_9_shim',
            ////'jspdf.plugin.javascript': 'jspdf/jspdf.plugin.javascript',
            ////'jspdf.plugin.sillysvgrenderer': 'jspdf/jspdf.plugin.sillysvgrenderer',
            ////'jspdf.plugin.split_text_to_size': 'jspdf/jspdf.plugin.split_text_to_size',
            ////'jspdf.plugin.standard_fonts_metrics': 'jspdf/jspdf.plugin.standard_fonts_metrics',
            ////'jspdf.PLUGINTEMPLATE': 'jspdf/jspdf.PLUGINTEMPLATE'
        },
        shim: {
            // Shim config does not work after optimization builds with CDN resources.
            // Need only for 3-rd side libraries when no AMD
            // Bootstrap - set module define in it's file
            'jquery.bootstrap': { deps: ['jquery'] },
            'jquery.slimscroll': { deps: ['jquery'] },
            'jquery.Jcrop': { deps: ['jquery'] },
            'angular': { deps: ['jquery'], exports: 'angular' }, // work: angular.module and other
            'angular-route': { deps: ['angular'] },
            'd3': { exports: 'd3' }
            ////'jspdf.plugin.addimage': { deps: ['jspdf'] },
            ////'jspdf.plugin.cell': { deps: ['jspdf'] },
            ////'jspdf.plugin.from_html': { deps: ['jspdf'] },
            ////'jspdf.plugin.ie_below_9_shim': { deps: ['jspdf'] },
            ////'jspdf.plugin.javascript': { deps: ['jspdf'] },
            ////'jspdf.plugin.sillysvgrenderer': { deps: ['jspdf'] },
            ////'jspdf.plugin.split_text_to_size': { deps: ['jspdf'] },
            ////'jspdf.plugin.standard_fonts_metrics': { deps: ['jspdf'] },
            ////'jspdf.PLUGINTEMPLATE': { deps: ['jspdf'] }
        }
        // need define or exports for each module
        // enforceDefine: true
    });
});