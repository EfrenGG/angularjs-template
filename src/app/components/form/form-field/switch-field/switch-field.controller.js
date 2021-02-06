function switchFieldController() {
  var ctrl = this;

  ctrl.$onInit = () => (ctrl.isFocused = false);

  ctrl.$onChanges = (changes) => {
    if (changes.metadata) {
      ctrl.metadata = angular.copy(ctrl.metadata);
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
}

angular
  .module('components.form')
  .controller('switchFieldController', switchFieldController);
