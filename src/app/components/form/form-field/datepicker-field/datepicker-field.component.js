const datepickerField = {
    controller: 'datepickerFieldController',
    templateUrl: './datepicker-field.html',
    bindings: {
        metadata: '<',
        model: '<',
        onChange: '&'
    }
};

angular
    .module('components.form')
    .component('datepickerField', datepickerField);
