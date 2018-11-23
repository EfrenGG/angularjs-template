const grid = {
    templateUrl: './grid.html',
    controller: 'gridController',
    bindings: {
        fields: '<',
        paginationOptions: '<',
        data: '<',
        total: '<',
        onRowSelection: '&',
        onPageChanged: '&'
    }
};

angular
    .module('components.crud')
    .component('grid', grid);
