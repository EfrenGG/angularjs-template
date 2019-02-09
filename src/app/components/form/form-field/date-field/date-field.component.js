const dateField = {
    controller: 'dateFieldController',
    templateUrl: './date-field.html',
    bindings: {
        metadata: '<',
        model: '<',
        onChange: '&'
    }
};

angular
    .module('components.form')
    .component('dateField', dateField);
