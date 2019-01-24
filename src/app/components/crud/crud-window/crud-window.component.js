const crudWindow = {
    templateUrl: './crud-window.html',
    controller: 'crudWindowController',
    bindings: {
        formKey: '<'
    }
};

angular
    .module('components.crud')
    .component('crudWindow', crudWindow);
