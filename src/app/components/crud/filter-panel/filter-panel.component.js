const filterPanel = {
    templateUrl: './filter-panel.html',
    controller: 'filterPanelController',
    bindings: {
        fields: '<',
        onFilter: '&',
    }
};

angular
    .module('components.crud')
    .component('filterPanel', filterPanel);
