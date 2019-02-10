function filterPanelController($translate) {

    var ctrl = this;

    ctrl.$onInit = function() {
        ctrl.isOpen = false;
        ctrl.clearModel();
        loadTranslations();
        setBtnText();
    };

    ctrl.$onChanges = changes => {
        if (changes.fields) {
            ctrl.fields = angular.copy(ctrl.fields);
        }
    };

    ctrl.toggle = () => {
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

    const loadTranslations = () => {
        $translate('APP.TIT_FILTER').then(translation => ctrl.txPanelTitle = translation).catch(ctrl.txPanelTitle = 'Filtros');
        $translate('APP.BTN_COLLAPSE').then(translation => ctrl.txCollapse = translation).catch(ctrl.txCollapse = 'Colapsar');
        $translate('APP.BTN_EXPAND').then(translation => ctrl.txExpand = translation).catch(ctrl.txExpand = 'Expandir');
        $translate('APP.BTN_FILTER').then(translation => ctrl.txBtnFilter = translation).catch(ctrl.txBtnFilter = 'Filtrar');
        $translate('APP.BTN_CLEAN').then(translation => ctrl.txBtnClean = translation).catch(ctrl.txBtnClean = 'Limpiar');
    };

    const setBtnText = () => ctrl.txBtnToggle = ctrl.isOpen ? ctrl.txCollapse : ctrl.txExpand;
}

angular
    .module('components.crud')
    .controller('filterPanelController', filterPanelController);
