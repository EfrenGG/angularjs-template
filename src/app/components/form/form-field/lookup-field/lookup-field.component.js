const lookupField = {
    controller: 'lookupFieldController',
    templateUrl: './lookup-field.html',
    bindings: {
        metadata: '<',
        model: '<',
        onChange: '&'
    }
};

angular.module('components.form').component('lookupField', lookupField);
