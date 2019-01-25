const formField = {
    controller: 'formFieldController',
    templateUrl: './form-field.html',
    bindings: {
        formParent: '=',
        parentModel: '=',
        metadata: '<',
        model: '<',
        onChange: '&'
    }
};

angular
    .module('components.form')
    .component('formField', formField);
