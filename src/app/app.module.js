angular
    .module('app', [
        'templates',
        'common',
        'components',
        'ngRoute',
        'ngSanitize',
        'pascalprecht.translate',
    ])
    .constant('CVE_APLICACION', 'FACTURACION')
    .constant('BASE_DATOS', 'ADMON01')
    .constant('DEF_LANG', 'es');
