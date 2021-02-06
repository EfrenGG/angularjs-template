angular
  .module('common', ['pascalprecht.translate', 'px-footer', 'ui.bootstrap'])
  .constant(
    'INFRA_BASE_URL',
    'http://nucleo.us-east-2.elasticbeanstalk.com/api/'
  );
