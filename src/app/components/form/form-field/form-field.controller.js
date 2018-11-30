function formFieldController($log, $translate) {
    var ctrl = this;

    ctrl.$onInit = () => {
        ctrl.isInvalid = true;
    };

    ctrl.$onChanges = changes => {
        if (changes.metadata) {
            ctrl.metadata = angular.copy(ctrl.metadata);
            setInitAttrs();
        }
        if (changes.model) {
            ctrl.model = angular.copy(ctrl.model);
        }
    };

    function setInitAttrs() {
        ctrl.metadata.elementId = ctrl.metadata.cveForma + ctrl.metadata.nomCampo;
        // get translated data
        let namespace = ctrl.metadata.cveForma;
        // get label
        $translate(namespace + ctrl.metadata.cveEtiqueta)
            .then(translation => ctrl.metadata.labelText = translation,
                translationId => ctrl.metadata.labelText = ctrl.metadata.txEtiqueta ? ctrl.metadata.txEtiqueta : translationId);
        // get help
        if (ctrl.metadata.cveAyuda || ctrl.metadata.txAyuda) {
            $translate(namespace + ctrl.metadata.cveAyuda)
                .then(translation => ctrl.metadata.helpText = translation,
                    translationId => ctrl.metadata.helpText = ctrl.metadata.txAyuda ? ctrl.metadata.txAyuda : translationId);
        }
    }

    ctrl.updateModel = function() {
        ctrl.onChange({
            $event: {
                value: ctrl.model,
                name: ctrl.metadata.nomCampo
            }
        });
    };
}

angular
    .module('components.form')
    .controller('formFieldController', formFieldController);
