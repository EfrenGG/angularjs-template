const wizardForm = {
  templateUrl: './wizard-form.html',
  controller: 'wizardFormController',
  bindings: {
    groups: '<',
    model: '<',
    action: '<',
    onChange: '&',
    onFinish: '&',
  },
};

angular.module('components.crud').component('wizardForm', wizardForm);
