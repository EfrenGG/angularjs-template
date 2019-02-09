const datePickerField = {
    controller: 'datePickerFieldController',
    templateUrl: './date-picker-field.html',
    bindings: {
        metadata: '<',
        model: '<',
        onChange: '&'
    }
};

angular
    .module('components.form')
    .component('datePickerField', datePickerField);
