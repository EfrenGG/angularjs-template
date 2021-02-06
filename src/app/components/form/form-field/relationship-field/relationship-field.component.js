const relationshipField = {
  controller: 'relationshipFieldController',
  templateUrl: './relationship-field.html',
  bindings: {
    parentModel: '=',
    metadata: '<',
    model: '<',
    onChange: '&',
  },
};

angular
  .module('components.form')
  .component('relationshipField', relationshipField);
