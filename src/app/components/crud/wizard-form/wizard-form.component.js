const wizardForm = {
    templateUrl: './wizard-form.html',
    controller: 'wizardFormController',
    bindings: {
        fields: '<',
        model: '<',
        btnClass: '<',
        onChange: '&',
        onFinish: '&'
    }
};

angular
    .module('components.crud')
    .component('wizardForm', wizardForm);
