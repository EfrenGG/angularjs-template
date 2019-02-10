function selectFieldController($log, $translate, $timeout, httpCommonsService) {
    var ctrl = this;

    ctrl.$onInit = () => {
        ctrl.isFocused = false;
        loadTranslations();
    };

    ctrl.$onChanges = changes => {
        if (changes.metadata) {
            ctrl.metadata = angular.copy(ctrl.metadata);
        }
        if (changes.model) {
            ctrl.model = angular.copy(ctrl.model);
            if (ctrl.model && !ctrl.modelUpdated) {
                ctrl.loadData();
            }
        }
    };

    ctrl.toggleFocus = isFocused => {
        ctrl.isFocused = isFocused;
        if (ctrl.isFocused && !ctrl.selectData) {
            ctrl.loadData();
        }
        ctrl.updateModel();
    };

    ctrl.updateModel = () => {
        ctrl.modelUpdated = true;
        ctrl.onChange({
            $event: {
                value: ctrl.model,
                name: ctrl.metadata.nomCampo,
                isFocused: ctrl.isFocused
            }
        });
    };

    ctrl.loadData = () => {
        ctrl.isLoading = true;
        $timeout(() => httpCommonsService.obtenRegistros(ctrl.metadata.urlApi)
            .then(response => ctrl.selectData = response.data)
            .catch(error => $log.error(error))
            .finally(() => ctrl.isLoading = false), 500);
    };

    const loadTranslations = () => {
        $translate('APP.DEF_SELECT_TEXT').then(translation => ctrl.defaultText = translation).catch(() => ctrl.defaultText = 'Seleccione una opción...');
        $translate('APP.BTN_RELOAD').then(translation => ctrl.txBtnReload = translation).catch(() => ctrl.txBtnReload = 'Recargar');
    };
}

angular
    .module('components.form')
    .controller('selectFieldController', selectFieldController);
