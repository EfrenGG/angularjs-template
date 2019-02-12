function formFieldController($translate) {
    var ctrl = this;

    const unlabeledFields = ['OCULTO', 'RELACION'];

    ctrl.$onInit = () => ctrl.isFocused = false;

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
        // label
        ctrl.metadata.hasLabel = !(unlabeledFields.indexOf(ctrl.metadata.cveTipoComponente) > -1);
        // get label
        $translate(`${namespace}.${ctrl.metadata.cveEtiqueta}`)
            .then(trans => ctrl.metadata.labelText = trans,
                transId => ctrl.metadata.labelText = ctrl.metadata.txEtiqueta || transId);
        // get help
        if (ctrl.metadata.cveAyuda || ctrl.metadata.txAyuda) {
            $translate(`${namespace}.${ctrl.metadata.cveAyuda}`, {}, undefined, undefined, false, 'sce')
                .then(trans => ctrl.metadata.helpText = trans)
                .catch(transId => ctrl.metadata.helpText = ctrl.metadata.txAyuda || transId);
        }
    }

    ctrl.updateModel = (event) => {
        ctrl.isFocused = event.isFocused;
        ctrl.onChange({
            $event: {
                name: event.name,
                value: event.value
            }
        });
    };
}

angular
    .module('components.form')
    .controller('formFieldController', formFieldController);
