function baseFormController() {
    var ctrl = this;

    ctrl.$onChanges = changes => {
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

    ctrl.updateModel = function(event) {
        ctrl.model[event.name] = event.value;
        ctrl.onChange({
            $event: {
                model: ctrl.model
            }
        });
    };
}

angular
    .module('components.form')
    .controller('baseFormController', baseFormController);
