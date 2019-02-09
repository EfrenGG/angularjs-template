const wizardForm = {
    templateUrl: './wizard-form.html',
    controller: 'wizardFormController',
    bindings: {
        fields: '<',
        model: '<',
        action: '<',
        onChange: '&',
        onFinish: '&'
    }
};

angular
    .module('components.crud')
    .component('wizardForm', wizardForm);
