function crudWindowController(
  $routeParams,
  $translate,
  $log,
  $filter,
  $uibModal,
  httpCommonsService,
  toastrService,
  CVE_APLICACION
) {
  var ctrl = this;

  ctrl.$onInit = () => {
    ctrl.action = 'READ';
    ctrl.filterParams = {};
    loadTranslations();
    setMetadata(ctrl.formKey || $routeParams.cveForma);
    ctrl.gridPaginationOpts = {
      pageNumber: 1,
      pageSize: 10,
    };
  };

  ctrl.setPage = (event) => {
    ctrl.gridPaginationOpts = angular.copy(event.params);
    getData();
  };

  ctrl.setFilterParams = (event) => {
    ctrl.filterParams = angular.copy(event.params);
  };

  ctrl.setEntity = (event) => {
    ctrl.selectedEntity = angular.copy(event.entity);
    ctrl.unsavedModel = undefined;
    ctrl.unsavedAction = undefined;
  };

  ctrl.openModal = (action) =>
    $uibModal
      .open({
        animation: true,
        backdrop: 'static',
        component: 'modalForm',
        size: action === 'DELETE' ? 'sm' : 'lg',
        resolve: {
          action: () => action,
          formType: () => ctrl.metadata.cveTipoForma,
          entity: () => ctrl.selectedEntity,
          unsavedEntity: () =>
            action === ctrl.unsavedAction ? ctrl.unsavedModel : undefined,
          fields: () => getFormFields(action),
        },
      })
      .result.then(
        (event) => persistData(action, event),
        (event) => onModalDismiss(action, event)
      );

  const persistData = (action, event) => {
    if (!action) {
      throw new Error('action cannot be null.');
    }
    ctrl.unsavedModel = event.model;
    ctrl.unsavedAction = action;
    let methodName;
    let message;
    switch (action) {
      case 'CREATE':
        methodName = 'save';
        message = ctrl.txMsgCreated;
        break;
      case 'UPDATE':
        methodName = 'update';
        message = ctrl.txMsgUpdated;
        break;
      case 'DELETE':
        methodName = 'remove';
        message = ctrl.txMsgDeleted;
        break;
      case 'RESTORE':
        methodName = 'save';
        message = ctrl.txMsgRestored;
        break;
      default:
        break;
    }
    if (methodName) {
      httpCommonsService[methodName](
        ctrl.metadata.urlApiForma,
        ctrl.unsavedModel
      )
        .then((response) => onSuccessResponse(response, action, message))
        .catch((error) => onErrorResponse(action, error));
    }
  };

  const onSuccessResponse = (response, action, message) => {
    if (action === 'DELETE') {
      toastrService.warning(message, null, {
        onclick: () => persistData('RESTORE', { model: response }),
        timeOut: 10000,
      });
    } else {
      toastrService.success(message, null);
    }
    getData();
    ctrl.selectedEntity = undefined;
    ctrl.unsavedModel = undefined;
    ctrl.unsavedAction = undefined;
  };

  const onErrorResponse = (action) => {
    toastrService.error(ctrl.txMsgUnexpectedError);
    ctrl.openModal(action);
  };

  function onModalDismiss(action, event) {
    ctrl.unsavedAction = action;
    ctrl.unsavedModel = event.model;
  }

  function setMetadata(form) {
    ctrl.metadata = null;
    httpCommonsService
      .getByKey(
        'infForma',
        {
          cveAplicacion: CVE_APLICACION,
          cveForma: form,
        },
        true,
        true
      )
      .then(function (response) {
        ctrl.metadata = response;
        if (ctrl.metadata.cveForma) {
          if (
            ctrl.metadata.bCrea ||
            ctrl.metadata.bEdita ||
            ctrl.metadata.bBorra
          ) {
            ctrl.metadata.bCrud = true;
          }
          // set export url
          ctrl.metadata.exportUrl = ctrl.metadata.urlApiForma + '/export';
          let formFields = ctrl.metadata.detallesForma;
          let groups = ctrl.metadata.gruposForma;
          if (groups && groups.length > 0) {
            groups.forEach((group) => {
              group.detallesGrupo.forEach(
                (field) =>
                  (field.numOrden = group.numOrden + field.numOrden / 100)
              );
              formFields = [...formFields, ...group.detallesGrupo];
            });
          }
          setFields(formFields, groups);
          getData();
        }
        // get i18n
        $translate(
          ctrl.metadata.cveForma + '.' + ctrl.metadata.cveTituloForma
        ).then(
          function (etiquetaCol) {
            ctrl.txTitForm = etiquetaCol;
          },
          function () {
            ctrl.txTitForm = ctrl.metadata.txTituloForma;
          }
        );
      })
      .catch(function (error) {
        $log.error(error);
      });
  }

  function setFields(details, groups) {
    ctrl.fields = $filter('orderBy')(details, 'numOrden');
    ctrl.groups = $filter('orderBy')(groups, 'numOrden');
    ctrl.gridFields = [];
    ctrl.filterFields = [];
    ctrl.reportFields = [];
    ctrl.pkFields = [];
    ctrl.createFields = [];
    ctrl.createGroups = [];
    ctrl.editFields = [];
    ctrl.editGroups = [];
    if (ctrl.metadata.bCrea || ctrl.metadata.bEdita) {
      ctrl.groups.forEach((group) => {
        let groupFields = $filter('orderBy')(group.detallesGrupo, 'numOrden');
        delete group.detallesGrupo;
        if (ctrl.metadata.bCrea) {
          let createFields = groupFields.filter((field) => field.bCrea);
          if (createFields.length > 0) {
            let createGroup = { ...group };
            createGroup.fields = createFields;
            ctrl.createGroups.push(createGroup);
          }
        }
        if (ctrl.metadata.bEdita) {
          let editFields = groupFields
            .filter((field) => field.bEdita)
            .map((field) => ({ ...field, isDisabled: field.bPk }));
          if (editFields.length > 0) {
            let editGroup = { ...group };
            editGroup.fields = editFields;
            ctrl.editGroups.push(editGroup);
          }
        }
      });
    }
    ctrl.fields.forEach((field) => {
      field.hasValidation = true;
      field.isDisabled = false;
      if (field.bGrid) {
        ctrl.gridFields.push(field);
      }
      if (field.bReporta) {
        ctrl.reportFields.push(field);
      }
      if (field.bFiltra) {
        let newField = angular.copy(field);
        newField.hasValidation = false;
        newField.cveTamanoCampo = 'XS';
        ctrl.filterFields.push(newField);
      }
      if (ctrl.metadata.bBorra && field.bPk) {
        let newField = angular.copy(field);
        newField.cveTipoComponente = 'OCULTO';
        ctrl.pkFields.push(newField);
      }
      if (ctrl.metadata.bCrea && field.bCrea) {
        let newCreateField = angular.copy(field);
        if (!newCreateField.cveGpo) {
          ctrl.createFields.push(newCreateField);
        }
      }
      if (ctrl.metadata.bEdita && field.bEdita) {
        let newField = angular.copy(field);
        newField.isDisabled = newField.bPk;
        newField.isDisabled = newField.bPk;
        ctrl.editFields.push(newField);
      }
    });
  }

  const getFormFields = (action) => {
    if (!action) {
      throw new Error('action cannot be null.');
    }
    switch (action) {
      case 'CREATE':
        return { groups: ctrl.createGroups, fields: ctrl.createFields };
      case 'UPDATE':
        return { groups: ctrl.editGroups, fields: ctrl.editFields };
      case 'DELETE':
        return ctrl.pkFields;
      default:
        return [];
    }
  };

  ctrl.filterData = (event) => {
    ctrl.filterParams = event.filterParams;
    getData();
  };

  const getData = () => {
    ctrl.isLoading = true;
    httpCommonsService
      .search(
        ctrl.metadata.urlApiForma,
        ctrl.filterParams,
        ctrl.gridPaginationOpts.pageNumber,
        ctrl.gridPaginationOpts.pageSize
      )
      .then((response) => {
        ctrl.gridData = response.data;
        ctrl.gridTotal = response.total;
      })
      .catch((error) => $log.error(error))
      .finally(() => (ctrl.isLoading = false));
  };

  const loadTranslations = () => {
    $translate('APP.BTN_ADD')
      .then((trans) => (ctrl.txBtnAdd = trans))
      .catch((id) => (ctrl.txBtnAdd = id));
    $translate('APP.BTN_EDIT')
      .then((trans) => (ctrl.txBtnEdit = trans))
      .catch((id) => (ctrl.txBtnEdit = id));
    $translate('APP.BTN_EXPORT')
      .then((trans) => (ctrl.txBtnExport = trans))
      .catch((id) => (ctrl.txBtnExport = id));
    $translate('APP.BTN_DELETE')
      .then((trans) => (ctrl.txBtnDelete = trans))
      .catch((id) => (ctrl.txBtnDelete = id));
    $translate('APP.BTN_READ')
      .then((trans) => (ctrl.txBtnVer = trans))
      .catch((id) => (ctrl.txBtnVer = id));
    $translate('APP.MSG_NO_METADATA')
      .then((trans) => (ctrl.txNoMetadata = trans))
      .catch((id) => (ctrl.txNoMetadata = id));
    $translate('APP.MSG_CREATED')
      .then((trans) => (ctrl.txMsgCreated = trans))
      .catch((id) => (ctrl.txMsgCreated = id));
    $translate('APP.MSG_UPDATED')
      .then((trans) => (ctrl.txMsgUpdated = trans))
      .catch((id) => (ctrl.txMsgUpdated = id));
    $translate('APP.MSG_DELETED')
      .then((trans) => (ctrl.txMsgDeleted = trans))
      .catch((id) => (ctrl.txMsgDeleted = id));
    $translate('APP.MSG_RESTORED')
      .then((trans) => (ctrl.txMsgRestored = trans))
      .catch((id) => (ctrl.txMsgRestored = id));
    $translate('APP.MSG_UNEX_ERR')
      .then((trans) => (ctrl.txMsgUnexpectedError = trans))
      .catch((id) => (ctrl.txMsgUnexpectedError = id));
    $translate('APP.MSG_UNEX_ERR_CODE')
      .then((trans) => (ctrl.txMsgUnexpectedErrorCode = trans))
      .catch((id) => (ctrl.txMsgUnexpectedErrorCode = id));
  };
}

angular
  .module('components.crud')
  .controller('crudWindowController', crudWindowController);
