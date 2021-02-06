function relationshipFieldController(
  $log,
  $filter,
  $translate,
  toastrService,
  httpCommonsService,
  CVE_APLICACION
) {
  var ctrl = this;

  ctrl.$onInit = () => {
    ctrl.gridPaginationOpts = {
      pageNumber: 1,
      pageSize: 5,
    };
    setI18N();
  };

  ctrl.$onChanges = (changes) => {
    if (changes.metadata) {
      ctrl.metadata = angular.copy(ctrl.metadata);
      setSubformMetadata(ctrl.metadata.cveFormaRelacion);
    }
    if (changes.model) {
      ctrl.model = angular.copy(ctrl.model);
    }
  };

  ctrl.setPage = (event) => {
    ctrl.gridPaginationOpts = angular.copy(event.params);
    getData();
  };

  ctrl.setEntity = (event) => {
    ctrl.selectedEntity = angular.copy(event.entity);
    ctrl.unsavedModel = undefined;
    ctrl.unsavedAction = undefined;
  };

  ctrl.updateModel = (event) => $log.log('Se modificó el modelo', event);

  ctrl.updateModel = (event) => {
    ctrl.model = event.model;
    ctrl.isBtnsDisabled = event.invalid;
    if (event.isFinished) {
      ctrl.isFinished = event.isFinished;
    }
  };

  ctrl.showForm = (action) => {
    if (!action) {
      throw new Error('action cannot be null.');
    }
    ctrl.action = action;
    if (action !== ctrl.unsavedAction) {
      ctrl.unsavedModel = undefined;
    }
    ctrl.isFormActive = true;
    ctrl.disableForm = false;
    switch (action) {
      case 'CREATE':
        ctrl.isBtnsDisabled = true;
        ctrl.model = ctrl.unsavedModel || getDependantValues();
        ctrl.formFields = ctrl.createFields;
        ctrl.txBtnSubmit = ctrl.txBtnCreate;
        ctrl.btnSubmitClass = 'btn-success';
        break;
      case 'UPDATE':
        ctrl.isBtnsDisabled = false;
        ctrl.model = ctrl.unsavedModel || ctrl.selectedEntity;
        ctrl.formFields = ctrl.editFields;
        ctrl.txBtnSubmit = ctrl.txBtnUpdate;
        ctrl.btnSubmitClass = 'btn-info';
        break;
      case 'DELETE':
        ctrl.isBtnsDisabled = false;
        ctrl.model = ctrl.selectedEntity;
        ctrl.formFields = ctrl.pkFields;
        ctrl.txBtnSubmit = ctrl.txBtnDelete;
        ctrl.btnSubmitClass = 'btn-danger';
        break;
      default:
        return [];
    }
  };

  ctrl.cancel = () => {
    ctrl.unsavedAction = ctrl.action;
    ctrl.unsavedModel = ctrl.model;
    ctrl.isFormActive = false;
    ctrl.disableForm = true;
  };

  ctrl.submit = () => {
    ctrl.disableForm = true;
    if (!ctrl.action) {
      throw new Error('action cannot be null.');
    }
    ctrl.unsavedModel = ctrl.model;
    ctrl.unsavedAction = ctrl.action;
    let methodName;
    switch (ctrl.action) {
      case 'CREATE':
        methodName = 'save';
        break;
      case 'UPDATE':
        methodName = 'update';
        break;
      case 'DELETE':
        methodName = 'remove';
        break;
      default:
        break;
    }
    if (methodName) {
      httpCommonsService[methodName](
        ctrl.subformMetadata.urlApiForma,
        ctrl.unsavedModel
      )
        .then((response) => onSuccessResponse(response))
        .catch((error) => onErrorResponse(ctrl.action, error));
    }
  };

  const onSuccessResponse = () => {
    ctrl.selectedEntity = undefined;
    getData();
    toastrService.success('Los cambios fueron salvados correctamente', 'Éxito');
    ctrl.action = 'READ';
    ctrl.model = {};
    ctrl.cancel();
  };

  const onErrorResponse = (action, error) => {
    $log.error(error);
    toastrService.error(
      'Ocurrió un error inesperado, contacte a su administrador',
      'Error'
    );
    ctrl.disableForm = false;
  };

  const setI18N = () => {
    $translate([
      'APP.BTN_ADD',
      'APP.BTN_EDIT',
      'APP.BTN_CANCEL',
      'APP.BTN_EXPORT',
      'APP.BTN_CREATE',
      'APP.BTN_UPDATE',
      'APP.BTN_DELETE',
      'APP.BTN_READ',
      'APP.TIT_MOD_CREATE',
      'APP.TIT_MOD_EDIT',
      'APP.TIT_MOD_DELETE',
      'APP.MSG_MOD_DELETE',
    ]).then(
      (translations) => {
        ctrl.txBtnAdd = translations['APP.BTN_ADD'];
        ctrl.txBtnEdit = translations['APP.BTN_EDIT'];
        ctrl.txBtnCancel = translations['APP.BTN_CANCEL'];
        ctrl.txBtnExport = translations['APP.BTN_EXPORT'];
        ctrl.txBtnCreate = translations['APP.BTN_CREATE'];
        ctrl.txBtnUpdate = translations['APP.BTN_UPDATE'];
        ctrl.txBtnDelete = translations['APP.BTN_DELETE'];
        ctrl.txBtnShow = translations['APP.BTN_READ'];
        ctrl.txDelModalMsg = translations['APP.MSG_MOD_DELETE'];
      },
      () => {
        ctrl.txBtnAdd = 'Agregar';
        ctrl.txBtnEdit = 'Editar';
        ctrl.txBtnCancel = 'Cancelar';
        ctrl.txBtnExport = 'Exportar';
        ctrl.txBtnCreate = 'Crear';
        ctrl.txBtnUpdate = 'Actualizar';
        ctrl.txBtnDelete = 'Eliminar';
        ctrl.txBtnShow = 'Ver';
        ctrl.txDelModalMsg =
          'Está seguro que desea eliminar el registro seleccionado?';
      }
    );
  };

  const setSubformMetadata = (form) => {
    ctrl.subformMetadata = null;
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
      .then((response) => {
        ctrl.subformMetadata = response;
        if (ctrl.subformMetadata.cveForma) {
          if (
            ctrl.subformMetadata.bCrea ||
            ctrl.subformMetadata.bEdita ||
            ctrl.subformMetadata.bBorra
          ) {
            ctrl.subformMetadata.bCrud = true;
          }
          // set export url
          ctrl.subformMetadata.exportUrl =
            ctrl.subformMetadata.urlApiForma + '/export';
          setFields(ctrl.subformMetadata.detallesForma);
          getData();
        }
        // get i18n
        $translate(
          ctrl.subformMetadata.cveForma +
            '.' +
            ctrl.subformMetadata.cveTituloForma
        ).then(
          (etiquetaCol) => (ctrl.txTitForm = etiquetaCol),
          () => (ctrl.txTitForm = ctrl.subformMetadata.txTituloForma)
        );
      })
      .catch((error) => $log.error(error));
  };

  const setFields = (details) => {
    ctrl.fields = $filter('orderBy')(details, 'numOrden');
    ctrl.visibleGridFields = [];
    ctrl.filterFields = [];
    ctrl.pkFields = [];
    ctrl.createFields = [];
    ctrl.editFields = [];
    ctrl.dependentFields = [];
    ctrl.fields.forEach((field) => {
      field.hasValidation = true;
      field.isDisabled = false;
      if (field.bGrid) {
        ctrl.visibleGridFields.push(field);
      }
      if (field.bFiltra) {
        let newField = angular.copy(field);
        newField.hasValidation = false;
        ctrl.filterFields.push(newField);
      }
      if (field.bPk) {
        let newField = angular.copy(field);
        newField.cveTipoComponente = 'OCULTO';
        ctrl.pkFields.push(newField);
      }
      if (field.bCrea) {
        let newField = angular.copy(field);
        if (
          newField.nomCampoDependiente &&
          newField.cveTipoComponente !== 'LOOKUP'
        ) {
          newField.isDisabled = true;
        }
        ctrl.createFields.push(newField);
      }
      if (field.bEdita) {
        let newField = angular.copy(field);
        if (
          newField.bPk ||
          (newField.nomCampoDependiente &&
            newField.cveTipoComponente !== 'LOOKUP')
        ) {
          newField.isDisabled = true;
        }
        ctrl.editFields.push(newField);
      }
      if (field.nomCampoDependiente && field.cveTipoComponente !== 'LOOKUP') {
        ctrl.dependentFields.push({
          fieldName: field.nomCampo,
          fieldDependent: field.nomCampoDependiente,
        });
      }
    });
  };

  const getData = () => {
    ctrl.isLoading = true;
    httpCommonsService
      .search(
        ctrl.subformMetadata.urlApiForma,
        getDependantValues(),
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

  const getDependantValues = () => {
    let dependantValues = {};
    ctrl.dependentFields.forEach((dependent) => {
      dependantValues[dependent.fieldName] =
        ctrl.parentModel[dependent.fieldDependent];
    });
    return dependantValues;
  };
}

angular
  .module('components.form')
  .controller('relationshipFieldController', relationshipFieldController);
