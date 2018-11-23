function formFieldController() {
    var ctrl = this;

    ctrl.$onInit = () => {
    };

    ctrl.$onChanges = changes => {
        if (changes.metadata) {
            ctrl.metadata = angular.copy(ctrl.metadata);
            setFieldId();
        }
    };

    function setFieldId() {
        ctrl.fieldId = ctrl.metadata.cveForma + ctrl.metadata.nomCampo;
    }
}

angular
    .module('components.form')
    .controller('formFieldController', formFieldController);
