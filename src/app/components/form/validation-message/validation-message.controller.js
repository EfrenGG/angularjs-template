function validationMessageController() {
  var ctrl = this;

  ctrl.$onChanges = (changes) => {
    if (changes.translationData) {
      ctrl.translationData = angular.copy(ctrl.translationData);
    }
  };
}

angular
  .module('components.form')
  .controller('validationMessageController', validationMessageController);
