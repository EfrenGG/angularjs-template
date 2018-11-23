const filterPanel = {
    templateUrl: './filter-panel.html',
    controller: 'filterPanelController'
};

angular
    .module('components.crud')
    .component('filterPanel', filterPanel);
