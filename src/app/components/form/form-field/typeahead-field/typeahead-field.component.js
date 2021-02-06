const typeaheadField = {
  controller: 'typeaheadFieldController',
  templateUrl: './typeahead-field.html',
  bindings: {
    metadata: '<',
    model: '<',
    onChange: '&',
  },
};

angular.module('components.form').component('typeaheadField', typeaheadField);
