function selectFieldController($log, $translate, $timeout, httpCommonsService) {
  var ctrl = this;

  ctrl.$onInit = () => {
    ctrl.isFocused = false;
    loadTranslations();
  };

  ctrl.$onChanges = (changes) => {
    if (changes.metadata) {
      ctrl.metadata = angular.copy(ctrl.metadata);
    }
    if (changes.model) {
      ctrl.model = angular.copy(ctrl.model);
      if (ctrl.model && !ctrl.modelUpdated) {
        ctrl.loadData(true);
      }
    }
  };

  ctrl.toggleFocus = (isFocused) => {
    ctrl.isFocused = isFocused;
    if (ctrl.isFocused && !ctrl.selectData) {
      ctrl.loadData(true);
    }
    ctrl.updateModel();
  };

  ctrl.updateModel = () => {
    ctrl.modelUpdated = true;
    ctrl.onChange({
      $event: {
        value: ctrl.model,
        name: ctrl.metadata.nomCampo,
        isFocused: ctrl.isFocused,
      },
    });
  };

  ctrl.loadData = (saveCache) => {
    ctrl.isLoading = true;
    $timeout(
      () =>
        httpCommonsService
          .search(ctrl.metadata.urlApi, {}, 0, 0, false, saveCache)
          .then((response) => (ctrl.selectData = response.data))
          .catch((error) =>
            $log.error('An error ocurred on the combo data loading...', error)
          )
          .finally(() => (ctrl.isLoading = false)),
      500
    );
  };

  const loadTranslations = () => {
    $translate('APP.DEF_SELECT_TEXT')
      .then((translation) => (ctrl.defaultText = translation))
      .catch((id) => (ctrl.defaultText = id));
    $translate('APP.BTN_RELOAD')
      .then((translation) => (ctrl.txBtnReload = translation))
      .catch((id) => (ctrl.txBtnReload = id));
  };
}

angular
  .module('components.form')
  .controller('selectFieldController', selectFieldController);
