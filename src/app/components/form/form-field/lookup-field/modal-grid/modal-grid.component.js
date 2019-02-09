const modalGrid = {
    controller: 'modalGridController',
    templateUrl: './modal-grid.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    }
};

angular
    .module('components.form')
    .component('modalGrid', modalGrid);
