const areaField = {
  controller: 'areaFieldController',
  templateUrl: './area-field.html',
  bindings: {
    metadata: '<',
    model: '<',
    onChange: '&',
  },
};

angular.module('components.form').component('areaField', areaField);
