const tabForm = {
  templateUrl: './tab-form.html',
  controller: 'tabFormController',
  bindings: {
    groups: '<',
    model: '<',
    action: '<',
    onChange: '&',
    onFinish: '&',
  },
};

angular.module('components.crud').component('tabForm', tabForm);
