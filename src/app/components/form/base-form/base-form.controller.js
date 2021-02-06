function baseFormController() {
  var ctrl = this;

  ctrl.$onChanges = (changes) => {
    if (changes.fields) {
      ctrl.fields = angular.copy(ctrl.fields);
      if (ctrl.fields) {
        setRowGroups();
      }
    }
    if (changes.model) {
      ctrl.model = angular.copy(ctrl.model);
    }
  };

  ctrl.updateModel = (event) => {
    ctrl.model[event.name] = event.value;
    if (event.entityName) {
      ctrl.model[event.entityName] = event.entity;
    }
    ctrl.onChange({
      $event: {
        model: ctrl.model,
        invalid: ctrl.formName.$invalid,
      },
    });
  };

  const setRowGroups = () => {
    let row = [];
    let colCounter = 0;
    ctrl.rowGroups = [];
    ctrl.fields.forEach((field) => {
      if (field.cveTipoComponente === 'SECCION') {
        field.cveTamanoCampo = 'XL';
      }
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
  };

  const getSize = (size) => {
    switch (size) {
      case 'XL':
        return 12;
      case 'LG':
        return 9;
      case 'SM':
        return 4;
      case 'XS':
        return 3;
      default:
        return 6;
    }
  };
}

angular
  .module('components.form')
  .controller('baseFormController', baseFormController);
