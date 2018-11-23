const baseForm = {
    controller: 'baseFormController',
    templateUrl: './base-form.html',
    bindings: {
        hasValidation: '<',
        fields: '<',
        model: '<',
        onChange: '&'
    }
};

angular
    .module('components.form')
    .component('baseForm', baseForm);
