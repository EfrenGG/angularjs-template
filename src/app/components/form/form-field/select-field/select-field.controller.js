function selectFieldController($log, httpCommonsService, $translate) {
    var ctrl = this;

    ctrl.$onInit = () => {
        ctrl.isFocused = false;
        $translate('APP.DEF_SELECT_TEXT')
            .then(translation => ctrl.defaultText = translation,
                translationId => {
                    ctrl.defaultText = 'Seleccione una opción...';
                    $log.warn('No se pudo cargar la traducción para ' + translationId);
                });
        loadData();
    };

    ctrl.$onChanges = changes => {
        if (changes.metadata) {
            ctrl.metadata = angular.copy(ctrl.metadata);
        }
        if (changes.model) {
            ctrl.model = angular.copy(ctrl.model);
        }
    };
    
    ctrl.toggleFocus = isFocused => {
        ctrl.isFocused = isFocused;
        ctrl.updateModel();
    };

    ctrl.updateModel = () => {
        ctrl.onChange({
            $event: {
                value: ctrl.model,
                name: ctrl.metadata.nomCampo,
                isFocused: ctrl.isFocused
            }
        });
    };

    function loadData () {
        httpCommonsService.obtenRegistros(ctrl.metadata.urlApi)
            .then(function (response) {
                ctrl.selectData = response.data;
            })
            .catch(function (error) {
                $log.error(error);
            });
    }
}

angular
    .module('components.form')
    .controller('selectFieldController', selectFieldController);