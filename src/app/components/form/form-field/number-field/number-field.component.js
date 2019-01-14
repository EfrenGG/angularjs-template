const numberField = {
    controller: 'numberFieldController',
    templateUrl: './number-field.html',
    bindings: {
        metadata: '<',
        model: '<',
        onChange: '&'
    }
};

angular
    .module('components.form')
    .component('numberField', numberField);
