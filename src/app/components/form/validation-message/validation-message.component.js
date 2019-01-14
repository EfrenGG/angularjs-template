const validationMessage = {
    controller: 'validationMessageController',
    templateUrl: './validation-message.html',
    bindings: {
        formModel: '=',
        translationData: '<'
    }
};

angular
    .module('components.form')
    .component('validationMessage', validationMessage);
