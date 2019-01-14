const textField = {
    controller: 'textFieldController',
    templateUrl: './text-field.html',
    bindings: {
        metadata: '<',
        model: '<',
        onChange: '&'
    }
};

angular
    .module('components.form')
    .component('textField', textField);
