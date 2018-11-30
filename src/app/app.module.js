angular
    .module('app', [
        'templates',
        'common',
        'components',
        'ngRoute',
    ])
    .constant('CVE_APLICACION', 'FACTURACION')
    .constant('BASE_DATOS', 'ADMON01')
    .constant('DEF_LANG', 'es');
