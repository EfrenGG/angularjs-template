angular
  .module('common', ['pascalprecht.translate', 'px-footer', 'ui.bootstrap'])
  .constant(
    'INFRA_BASE_URL',
    'http://infraapi-env.eba-paymrbmj.us-east-1.elasticbeanstalk.com/api/'
  );
