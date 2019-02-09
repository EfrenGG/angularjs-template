function filterPanelController($translate) {
    var ctrl = this;

    ctrl.$onInit = function() {
        $translate(['APP.TIT_FILTER', 'APP.BTN_COLLAPSE', 'APP.BTN_EXPAND', 'APP.BTN_FILTER', 'APP.BTN_CLEAN']).then(function (translations) {
            ctrl.txPanelTitle = translations['APP.TIT_FILTER'];
            ctrl.txCollapse = translations['APP.BTN_COLLAPSE'];
            ctrl.txExpand = translations['APP.BTN_EXPAND'];
            ctrl.txBtnFilter = translations['APP.BTN_FILTER'];
            ctrl.txBtnClean = translations['APP.BTN_CLEAN'];
        }, function () {
            ctrl.txPanelTitle = 'Filtros';
            ctrl.txCollapse = 'Colapsar';
            ctrl.txExpand = 'Expandir';
            ctrl.txBtnFilter = 'Filtrar';
            ctrl.txBtnClean = 'Limpiar';
        });
        ctrl.isOpen = false;
        ctrl.clearModel();
        setBtnText();
    };

    ctrl.$onChanges = changes => {
        if (changes.fields) {
            ctrl.fields = angular.copy(ctrl.fields);
        }
    };

    ctrl.toggle = function() {
        ctrl.isOpen = !ctrl.isOpen;
        setBtnText();
    };

    ctrl.clearModel = () => {
        ctrl.model = {};
    };

    ctrl.filter = () => {
        ctrl.onFilter({
            $event: {
                filterParams: ctrl.model
            }
        });
    };

    ctrl.updateModel = event => {
        ctrl.model = event.model;
    };

    const setBtnText = () => {
        ctrl.txBtnToggle = ctrl.isOpen ? ctrl.txCollapse : ctrl.txExpand;
    };
}

angular
    .module('components.crud')
    .controller('filterPanelController', filterPanelController);
