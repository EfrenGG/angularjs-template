const modalForm = {
    templateUrl: './modal-form.html',
    controller: 'modalFormController',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    }
};

angular
    .module('components.crud')
    .component('modalForm', modalForm);
