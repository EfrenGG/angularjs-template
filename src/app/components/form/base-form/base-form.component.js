const baseForm = {
    controller: 'baseFormController',
    templateUrl: './base-form.html',
    bindings: {
        fields: '<',
        model: '<',
        isDisabled: '<',
        onChange: '&'
    }
};

angular.module('components.form').component('baseForm', baseForm);
