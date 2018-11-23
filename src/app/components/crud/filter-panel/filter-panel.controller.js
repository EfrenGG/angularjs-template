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
        setBtnText();
    };

    ctrl.toggle = function() {
        ctrl.isOpen = !ctrl.isOpen;
        setBtnText();
    };

    function setBtnText() {
        ctrl.txBtnToggle = ctrl.isOpen ? ctrl.txCollapse : ctrl.txExpand;
    }
}

angular
    .module('components.crud')
    .controller('filterPanelController', filterPanelController);
