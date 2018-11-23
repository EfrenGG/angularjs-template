function modalFormController($log, $translate) {
    var ctrl = this;

    ctrl.$onInit = function() {
        ctrl.isBtnsDisabled = false;
        $translate('APP.BTN_CANCEL')
            .then(translation => ctrl.txBtnCancel = translation, () => ctrl.txBtnCancel = 'Cancelar');
    };

    ctrl.$onChanges = function(changes) {
        if (changes.resolve) {
            ctrl.resolve = angular.copy(ctrl.resolve);
            ctrl.action = ctrl.resolve.action;
            ctrl.entity = ctrl.resolve.entity;
            ctrl.fields = ctrl.resolve.fields;
            setModalAttrs();
        }
    };

    ctrl.submit = function() {
        ctrl.isBtnsDisabled = true;
        ctrl.btnSubmitClass += ' btn-loading';
        ctrl.close({
            $value: {
                model: ctrl.model
            }
        });
    };

    ctrl.cancel = function() {
        ctrl.isBtnsDisabled = true;
        ctrl.btnCancelClass = 'btn-loading';
        ctrl.dismiss({
            $value: {
                model: ctrl.model
            }
        });
    };

    function setModalAttrs() {
        switch(ctrl.action) {
            case 'CREATE':
                ctrl.model = {};
                $translate('APP.TIT_MOD_CREATE')
                    .then(translation => ctrl.txModalTitle = translation, () => ctrl.txBtnSubmit = 'Crear nuevo registro');
                $translate('APP.BTN_CREATE')
                    .then(translation => ctrl.txBtnSubmit = translation, () => ctrl.txBtnSubmit = 'Crear');
                ctrl.btnSubmitClass = 'btn-success';
                break;
            case 'UPDATE':
                ctrl.model = ctrl.entity;
                $translate('APP.TIT_MOD_EDIT')
                    .then(translation => ctrl.txModalTitle = translation, () => ctrl.txBtnSubmit = 'Modificar registro');
                $translate('APP.BTN_UPDATE')
                    .then(translation => ctrl.txBtnSubmit = translation, () => ctrl.txBtnSubmit = 'Actualizar');
                ctrl.btnSubmitClass = 'btn-info';
                break;
            case 'DELETE':
                ctrl.model = ctrl.entity;
                ctrl.btnSubmitClass = 'btn-danger';
                $translate('APP.TIT_MOD_DELETE')
                    .then(translation => ctrl.txModalTitle = translation, () => ctrl.txBtnSubmit = 'Eliminar registro');
                $translate('APP.MSG_MOD_DELETE')
                    .then(translation => ctrl.txDeleteMsg = translation, () => ctrl.txDeleteMsg = 'Está seguro que desea eliminar el registro seleccionado?');
                $translate('APP.BTN_DELETE')
                    .then(translation => ctrl.txBtnSubmit = translation, () => ctrl.txBtnSubmit = 'Eliminar');
                break;
        }
    }
}

angular
    .module('components.crud')
    .controller('modalFormController', modalFormController);
