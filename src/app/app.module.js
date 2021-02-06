angular
  .module('app', [
    'templates',
    'common',
    'components',
    'ngAnimate',
    'ngRoute',
    'px-nav',
  ])
  .constant('CVE_APLICACION', 'INFRA')
  .constant(
    'API_URL',
    'http://infraapi-env.eba-paymrbmj.us-east-1.elasticbeanstalk.com/api/'
  )
  .constant('DEF_DATE_FORMAT', 'yyyy-MM-dd')
  .constant('DEF_LANG', 'es');
