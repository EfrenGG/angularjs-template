const switchField = {
  controller: 'switchFieldController',
  templateUrl: './switch-field.html',
  bindings: {
    metadata: '<',
    model: '<',
    onChange: '&',
  },
};

angular.module('components.form').component('switchField', switchField);
