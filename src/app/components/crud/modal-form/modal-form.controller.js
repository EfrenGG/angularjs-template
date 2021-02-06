function modalFormController($translate) {
  var ctrl = this;

  ctrl.$onInit = function () {
    $translate('APP.BTN_CANCEL')
      .then((translation) => (ctrl.txBtnCancel = translation))
      .catch((id) => (ctrl.txBtnCancel = id));
  };

  ctrl.$onChanges = function (changes) {
    if (changes.resolve) {
      ctrl.resolve = angular.copy(ctrl.resolve);
      ctrl.action = ctrl.resolve.action;
      ctrl.entity = ctrl.resolve.entity;
      ctrl.unsavedEntity = ctrl.resolve.unsavedEntity;
      ctrl.fields = ctrl.resolve.fields.fields;
      ctrl.groups = ctrl.resolve.fields.groups;
      ctrl.formType = ctrl.resolve.formType;
      setModalAttrs();
    }
  };

  ctrl.submit = function () {
    ctrl.isBtnsDisabled = true;
    ctrl.btnSubmitClass += ' btn-loading';
    ctrl.close({
      $value: {
        model: ctrl.model,
      },
    });
  };

  ctrl.cancel = function () {
    ctrl.isBtnsDisabled = true;
    ctrl.btnCancelClass += 'btn-loading';
    ctrl.dismiss({
      $value: {
        model: ctrl.model,
      },
    });
  };

  function setModalAttrs() {
    ctrl.isBtnsDisabled = true;
    switch (ctrl.action) {
      case 'CREATE':
        ctrl.model = ctrl.unsavedEntity || {};
        ctrl.btnSubmitClass = 'btn-success';
        $translate('APP.TIT_MOD_CREATE')
          .then((trans) => (ctrl.txModalTitle = trans))
          .catch((id) => (ctrl.txModalTitle = id));
        $translate('APP.BTN_CREATE')
          .then((trans) => (ctrl.txBtnSubmit = trans))
          .catch((id) => (ctrl.txBtnSubmit = id));
        break;
      case 'UPDATE':
        ctrl.model = ctrl.unsavedEntity || ctrl.entity;
        ctrl.btnSubmitClass = 'btn-info';
        ctrl.isBtnsDisabled = false;
        $translate('APP.TIT_MOD_EDIT')
          .then((trans) => (ctrl.txModalTitle = trans))
          .catch((id) => (ctrl.txModalTitle = id));
        $translate('APP.BTN_UPDATE')
          .then((trans) => (ctrl.txBtnSubmit = trans))
          .catch((id) => (ctrl.txBtnSubmit = id));
        break;
      case 'DELETE':
        ctrl.model = ctrl.entity;
        ctrl.btnSubmitClass = 'btn-danger';
        ctrl.isBtnsDisabled = false;
        $translate('APP.TIT_MOD_DELETE')
          .then((trans) => (ctrl.txModalTitle = trans))
          .catch((id) => (ctrl.txModalTitle = id));
        $translate('APP.MSG_MOD_DELETE')
          .then((trans) => (ctrl.txDeleteMsg = trans))
          .catch((id) => (ctrl.txDeleteMsg = id));
        $translate('APP.BTN_DELETE')
          .then((trans) => (ctrl.txBtnSubmit = trans))
          .catch((id) => (ctrl.txBtnSubmit = id));
        break;
    }
  }

  ctrl.updateModel = (event) => {
    ctrl.model = event.model;
    ctrl.isBtnsDisabled = event.invalid;
  };
}

angular
  .module('components.crud')
  .controller('modalFormController', modalFormController);
