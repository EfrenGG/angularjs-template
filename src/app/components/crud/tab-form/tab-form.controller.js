function tabFormController($translate) {
  var ctrl = this;

  ctrl.$onInit = () => {
    ctrl.isValid = false;
    $translate('APP.MSG_ERROR')
      .then((trans) => (ctrl.txErrorMessage = trans))
      .catch((id) => (ctrl.txErrorMessage = id));
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

  ctrl.updateModel = (event, groupKey) => {
    ctrl.model = event.model;
    let invalidGroups = 0;
    ctrl.groups.forEach((group) => {
      if (group.cveGpo === groupKey) {
        group.isValid = !event.invalid;
      }
      if (!group.isValid) {
        invalidGroups++;
      }
    });
    ctrl.isValid = invalidGroups === 0;
    ctrl.onChange({
      $event: {
        model: ctrl.model,
        invalid: !ctrl.isValid,
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
  .controller('tabFormController', tabFormController);
