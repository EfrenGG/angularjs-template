function wizardFormController($translate, $timeout) {
  var ctrl = this;

  ctrl.$onInit = () => {
    ctrl.isFinished = false;
    $translate('APP.BTN_PREVIOUS')
      .then((trans) => (ctrl.txBtnPrevious = trans))
      .catch((id) => (ctrl.txBtnPrevious = id));
    $translate('APP.BTN_NEXT')
      .then((trans) => (ctrl.txBtnNext = trans))
      .catch((id) => (ctrl.txBtnNext = id));
    $translate('APP.BTN_FINISH')
      .then((trans) => (ctrl.txBtnFinish = trans))
      .catch((id) => (ctrl.txBtnFinish = id));
  };

  ctrl.$onChanges = (changes) => {
    if (changes.groups) {
      ctrl.groups = [...ctrl.groups];
      newGroup(ctrl.groups);
    }
    if (changes.model) {
      ctrl.model = angular.copy(ctrl.model);
    }
    if (changes.action) {
      ctrl.isValid = ctrl.action === 'UPDATE' ? true : false;
      ctrl.btnSubmitClass =
        ctrl.action === 'UPDATE' ? 'btn-info' : 'btn-success';
    }
  };

  ctrl.finished = () => {
    ctrl.isFinished = true;
    ctrl.onChange({
      $event: {
        model: ctrl.model,
        invalid: !ctrl.isValid,
      },
    });
    $timeout(ctrl.onFinish, 1000);
  };

  ctrl.updateModel = (event) => {
    ctrl.isValid = !event.invalid;
    ctrl.model = event.model;
    ctrl.onChange({
      $event: {
        model: ctrl.model,
        invalid: event.invalid,
      },
    });
  };

  const newGroup = (groups) => {
    groups.forEach((group) => {
      $translate(`${group.cveForma}.${group.cveEtiqueta}`)
        .then((trans) => (group.txNombreGrupo = trans))
        .catch(
          (transId) => (group.txNombreGrupo = group.txEtiqueta || transId)
        );
      group.isValid = ctrl.action === 'UPDATE' ? true : false;
    });
  };
}

angular
  .module('components.crud')
  .controller('wizardFormController', wizardFormController);
