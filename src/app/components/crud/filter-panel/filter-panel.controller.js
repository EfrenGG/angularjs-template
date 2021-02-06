function filterPanelController($translate) {
  var ctrl = this;

  ctrl.$onInit = function () {
    ctrl.isOpen = false;
    loadTranslations();
    setBtnText();
  };

  ctrl.$onChanges = (changes) => {
    if (changes.fields) {
      ctrl.fields = angular.copy(ctrl.fields);
    }
    if (changes.params) {
      ctrl.clearModel();
      ctrl.params = angular.copy(ctrl.params);
      if (ctrl.params) {
        ctrl.model = Object.assign({}, ctrl.params);
      }
    }
  };

  ctrl.toggle = () => {
    ctrl.isOpen = !ctrl.isOpen;
    setBtnText();
  };

  ctrl.clearModel = () => {
    ctrl.model = {};
  };

  ctrl.filter = () => {
    if (ctrl.isOpen) {
      ctrl.toggle();
    }
    ctrl.onFilter({
      $event: {
        filterParams: ctrl.model,
      },
    });
  };

  ctrl.updateModel = (event) => {
    ctrl.model = event.model;
  };

  const loadTranslations = () => {
    $translate('APP.TIT_FILTER')
      .then((trans) => (ctrl.txPanelTitle = trans))
      .catch((id) => (ctrl.txPanelTitle = id));
    $translate('APP.BTN_COLLAPSE')
      .then((trans) => (ctrl.txCollapse = trans))
      .catch((id) => (ctrl.txCollapse = id));
    $translate('APP.BTN_EXPAND')
      .then((trans) => (ctrl.txExpand = trans))
      .catch((id) => (ctrl.txExpand = id));
    $translate('APP.BTN_FILTER')
      .then((trans) => (ctrl.txBtnFilter = trans))
      .catch((id) => (ctrl.txBtnFilter = id));
    $translate('APP.BTN_CLEAN')
      .then((trans) => (ctrl.txBtnClean = trans))
      .catch((id) => (ctrl.txBtnClean = id));
  };

  const setBtnText = () =>
    (ctrl.txBtnToggle = ctrl.isOpen ? ctrl.txCollapse : ctrl.txExpand);
}

angular
  .module('components.crud')
  .controller('filterPanelController', filterPanelController);
