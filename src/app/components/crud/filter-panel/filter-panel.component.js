const filterPanel = {
    templateUrl: './filter-panel.html',
    controller: 'filterPanelController',
    bindings: {
        fields: '<',
        params: '<',
        isLoading: '<',
        onFilter: '&'
    }
};

angular.module('components.crud').component('filterPanel', filterPanel);
