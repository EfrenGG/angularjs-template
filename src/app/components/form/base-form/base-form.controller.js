function baseFormController($log) {
    var ctrl = this;

    ctrl.$onInit = function() {
        $log.log('Inicializando formulario básico...');
    };

    ctrl.$onChanges = changes => {
        if (changes.hasValidation) {
            ctrl.hasValidation = angular.copy(ctrl.hasValidation);
        }
        if (changes.fields) {
            ctrl.fields = angular.copy(ctrl.fields);
            setRowGroups();
        }
        if (changes.model) {
            ctrl.model = angular.copy(ctrl.model);
        }
    };

    function setRowGroups() {
        let row = [];
        let colCounter = 0;
        ctrl.rowGroups = [];
        ctrl.fields.forEach(field => {
            const size = getSize(field.cveTamanoCampo);
            field.sizeClass = 'col-md-' + size;
            colCounter += size;
            if (colCounter > 12) {
                colCounter = size;
                ctrl.rowGroups.push(row);
                row = [];
            }
            row.push(field);
        });
        if (row.length > 0) ctrl.rowGroups.push(row);
        $log.log(ctrl.rowGroups);
    }

    function getSize(size) {
        switch(size) {
            case 'LG':
                return 12;
            case 'SM':
                return 4;
            case 'XS':
                return 3;
            default:
                return 6;
        }
    }
}

angular
    .module('components.form')
    .controller('baseFormController', baseFormController);
