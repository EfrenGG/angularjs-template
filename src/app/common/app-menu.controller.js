function appMenuController(httpCommonsService) {
  var ctrl = this;

  ctrl.$onChanges = (changes) => {
    if (changes.appKey) {
      httpCommonsService
        .getByKey(
          'infSegMenu',
          {
            cveAplicacion: ctrl.appKey,
            cveMenu: ctrl.menuRootKey,
          },
          true,
          true
        )
        .then((response) => (ctrl.root = angular.copy(response)))
        .catch((error) => (ctrl.error = error));
    }
  };
}

angular.module('common').controller('appMenuController', appMenuController);
