function crudWindowController($routeParams, $translate, $log, $filter, $uibModal, httpCommonsService, toastrService, CVE_APLICACION) {
    var ctrl = this;

    ctrl.$onInit = () => {
        ctrl.action = 'READ';
        ctrl.filterParams = {};
        loadTranslations();
        setMetadata(ctrl.formKey || $routeParams.cveForma);
        ctrl.gridPaginationOpts = {
            pageNumber: 1,
            pageSize: 10
        };
    };

    ctrl.setPage = event => {
        ctrl.gridPaginationOpts = angular.copy(event.params);
        getData();
    };

    ctrl.setFilterParams = event => {
        ctrl.filterParams = angular.copy(event.params);
    };

    ctrl.setEntity = event => {
        ctrl.selectedEntity = angular.copy(event.entity);
        ctrl.unsavedModel = undefined;
        ctrl.unsavedAction = undefined;
    };

    ctrl.openModal = action => $uibModal.open({
        animation: true,
        backdrop: 'static',
        component: 'modalForm',
        size: action === 'DELETE' ? 'sm' : 'lg',
        resolve: {
            action: () => action,
            formType: () => ctrl.metadata.cveTipoForma,
            entity: () => ctrl.selectedEntity,
            unsavedEntity: () => action === ctrl.unsavedAction ? ctrl.unsavedModel : undefined,
            fields: () => getFormFields(action)
        }
    }).result
        .then(event => onModalClose(action, event),
            event => onModalDismiss(action, event));

    function onModalClose(action, event) {
        if (!action) {
            throw new Error('action cannot be null.');
        }
        ctrl.unsavedModel = event.model;
        ctrl.unsavedAction = action;
        let methodName;
        switch (action) {
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
            httpCommonsService[methodName](ctrl.metadata.urlApiForma, ctrl.unsavedModel)
                .then(response => onSuccessResponse(response)).catch(error => onErrorResponse(action, error));
        }
    }

    const onSuccessResponse = response => {
        if (response) $log.log(response);
        ctrl.selectedEntity = undefined;
        getData();
        toastrService.success('Los cambios fueron salvados correctamente', 'Éxito');
        ctrl.unsavedModel = undefined;
        ctrl.unsavedAction = undefined;
    };

    const onErrorResponse = (action, error) => {
        $log.error(error);
        toastrService.error('Ocurrió un error inesperado, contacte a su administrador', 'Error');
        ctrl.openModal(action);
    };

    function onModalDismiss(action, event) {
        ctrl.unsavedAction = action;
        ctrl.unsavedModel = event.model;
    }

    function setMetadata(form) {
        ctrl.metadata = null;
        httpCommonsService.obtenRegistro('infForma', {
            cveAplicacion: CVE_APLICACION,
            cveForma: form
        }).then(function (response) {
            ctrl.metadata = response;
            if (ctrl.metadata.cveForma) {
                if (ctrl.metadata.bCrea || ctrl.metadata.bEdita || ctrl.metadata.bBorra) {
                    ctrl.metadata.bCrud = true;
                }
                // set export url
                ctrl.metadata.exportUrl = ctrl.metadata.urlApiForma + '/export';
                setFields(ctrl.metadata.detallesForma);
                getData();
            }
            // get i18n
            $translate(ctrl.metadata.cveForma + '.' + ctrl.metadata.cveTituloForma)
                .then(function (etiquetaCol) {
                    ctrl.txTitForm = etiquetaCol;
                }, function () {
                    ctrl.txTitForm = ctrl.metadata.txTituloForma;
                });
        }).catch(function (error) {
            $log.error(error);
        });
    }

    function setFields(details) {
        ctrl.fields = $filter('orderBy')(details, 'numOrden');
        ctrl.gridFields = [];
        ctrl.filterFields = [];
        ctrl.pkFields = [];
        ctrl.createFields = [];
        ctrl.editFields = [];
        ctrl.fields.forEach(field => {
            field.hasValidation = true;
            field.isDisabled = false;
            if (field.bGrid) {
                ctrl.gridFields.push(field);
            }
            if (field.bFiltra) {
                let newField = angular.copy(field);
                newField.hasValidation = false;
                newField.cveTamanoCampo = 'XS';
                ctrl.filterFields.push(newField);
            }
            if (field.bPk) {
                let newField = angular.copy(field);
                newField.cveTipoComponente = 'OCULTO';
                ctrl.pkFields.push(newField);
            }
            if (field.bCrea) {
                ctrl.createFields.push(field);
            }
            if (field.bEdita) {
                let newField = angular.copy(field);
                if (newField.bPk) {
                    newField.isDisabled = true;
                }
                ctrl.editFields.push(newField);
            }
        });
    }

    function getFormFields(action) {
        if (!action) {
            throw new Error('action cannot be null.');
        }
        switch (action) {
            case 'CREATE':
                return ctrl.createFields;
            case 'UPDATE':
                return ctrl.editFields;
            case 'DELETE':
                return ctrl.pkFields;
            default:
                return [];
        }
    }

    ctrl.filterData = event => {
        ctrl.filterParams = event.filterParams;
        getData();
    };

    const getData = () => {
        ctrl.isLoading = true;
        httpCommonsService.obtenRegistros(ctrl.metadata.urlApiForma, ctrl.filterParams, ctrl.gridPaginationOpts.pageNumber, ctrl.gridPaginationOpts.pageSize)
            .then(response => {
                ctrl.gridData = response.data;
                ctrl.gridTotal = response.total;
            }).catch(error => $log.error(error))
            .finally(() => ctrl.isLoading = false);
    };

    const loadTranslations = () => {
        $translate('APP.BTN_ADD')
            .then(trans => ctrl.txBtnAdd = trans)
            .catch(id => ctrl.txBtnAdd = id);
        $translate('APP.BTN_EDIT')
            .then(trans => ctrl.txBtnEdit = trans)
            .catch(id => ctrl.txBtnEdit = id);
        $translate('APP.BTN_EXPORT')
            .then(trans => ctrl.txBtnExport = trans)
            .catch(id => ctrl.txBtnExport = id);
        $translate('APP.BTN_DELETE')
            .then(trans => ctrl.txBtnDelete = trans)
            .catch(id => ctrl.txBtnDelete = id);
        $translate('APP.BTN_READ')
            .then(trans => ctrl.txBtnVer = trans)
            .catch(id => ctrl.txBtnVer = id);
        $translate('APP.MSG_NO_METADATA')
            .then(trans => ctrl.txNoMetadata = trans)
            .catch(id => ctrl.txNoMetadata = id);
    };
}

angular
    .module('components.crud')
    .controller('crudWindowController', crudWindowController);
