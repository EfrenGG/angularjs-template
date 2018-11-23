const crudWindow = {
    templateUrl: './crud-window.html',
    controller: 'crudWindowController'
};

angular
    .module('components.crud')
    .component('crudWindow', crudWindow);
