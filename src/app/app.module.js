angular
    .module('app', [
        'templates',
        'common',
        'components',
        'ngRoute',
    ])
    .constant('INFRA_BASE_URL', 'https://localhost:5001/api/')
    .constant('CVE_APLICACION', 'INFRA')
    .constant('DEF_LANG', 'es');
