function typeaheadFieldController($log, $translate, $filter, httpCommonsService) {
    var ctrl = this;

    ctrl.$onInit = () => {
        ctrl.isFocused = false;
        $translate('APP.DEF_TYPEAHEAD_TEXT')
            .then(translation => ctrl.defaultText = translation,
                translationId => {
                    ctrl.defaultText = 'Comience a escribir...';
                    $log.warn('No se pudo cargar la traducción para ' + translationId);
                });
        loadData();
    };

    ctrl.$onChanges = changes => {
        if (changes.metadata) {
            ctrl.metadata = angular.copy(ctrl.metadata);
            ctrl.minLenght = ctrl.metadata.numLongMin || 0;
            ctrl.limit = ctrl.metadata.numLongMax || 3;
        }
        if (changes.model) {
            ctrl.model = angular.copy(ctrl.model);
        }
    };
    
    ctrl.toggleFocus = isFocused => {
        ctrl.isFocused = isFocused;
    };

    ctrl.format = () => ctrl.selectedLabel;

    ctrl.updateModel = ($item, $model, $label) => {
        $log.log('toggleFocus', ctrl.model);
        ctrl.selectedItem = $item;
        ctrl.selectedLabel = $label;
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
                ctrl.data = response.data;
                setInitValues(response.data);
            })
            .catch(function (error) {
                $log.error(error);
            });
    }

    function setInitValues (data) {
        if (data && ctrl.model) {
            let selectedOption = $filter('filter')(data, { [ctrl.metadata.nomCampoValor]: ctrl.model });
            if (selectedOption) {
                ctrl.selectedItem = selectedOption;
                ctrl.selectedLabel = ctrl.selectedItem[ctrl.metadata.nomCampoEtiqueta];
            } else {
                ctrl.model = undefined;
            }
        }
    }
}

angular
    .module('components.form')
    .controller('typeaheadFieldController', typeaheadFieldController);
