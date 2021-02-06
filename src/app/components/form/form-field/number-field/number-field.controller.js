function numberFieldController() {
  var ctrl = this;

  ctrl.$onInit = () => (ctrl.isFocused = false);

  ctrl.$onChanges = (changes) => {
    if (changes.metadata) {
      ctrl.metadata = angular.copy(ctrl.metadata);
      if (!ctrl.metadata.numEnteros || ctrl.metadata.numEnteros < 0) {
        ctrl.metadata.numEnteros = 8;
      }
      if (!ctrl.metadata.numDecimales || ctrl.metadata.numDecimales < 0) {
        ctrl.metadata.numDecimales = 0;
      }
      ctrl.step = getStep(ctrl.metadata.numDecimales);
    }
    if (changes.model) {
      ctrl.model = angular.copy(ctrl.model);
    }
  };

  ctrl.toggleFocus = (isFocused) => {
    ctrl.isFocused = isFocused;
    ctrl.updateModel();
  };

  ctrl.updateModel = () => {
    ctrl.onChange({
      $event: {
        value: ctrl.model,
        name: ctrl.metadata.nomCampo,
        isFocused: ctrl.isFocused,
      },
    });
  };

  function getStep(decimals) {
    if (decimals === 0) {
      return '1';
    }
    return '0.' + '1'.padStart(decimals, '0');
  }
}

angular
  .module('components.form')
  .controller('numberFieldController', numberFieldController);
