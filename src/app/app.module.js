angular
    .module('app', [
        'templates',
        'common',
        'components',
        'ngRoute',
    ])
    .constant('CVE_APLICACION', 'INFRA')
    .constant('INFRA_BASE_URL', 'https:localhost:5001/api/')
    .constant('DEF_LANG', 'es');