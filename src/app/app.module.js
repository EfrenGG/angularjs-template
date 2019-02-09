angular
    .module('app', [
        'templates',
        'common',
        'components',
        'ngRoute',
    ])
    .constant('CVE_APLICACION', 'INFRA')
    .constant('INFRA_BASE_URL', 'http://indiepals-infra-dev.us-east-2.elasticbeanstalk.com/api/')
    .constant('DEF_DATE_FORMAT', 'yyyy-MM-dd')
    .constant('DEF_LANG', 'es');
