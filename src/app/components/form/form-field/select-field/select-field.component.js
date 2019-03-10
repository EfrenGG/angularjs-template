const selectField = {
    controller: 'selectFieldController',
    templateUrl: './select-field.html',
    bindings: {
        metadata: '<',
        model: '<',
        onChange: '&'
    }
};

angular.module('components.form').component('selectField', selectField);
