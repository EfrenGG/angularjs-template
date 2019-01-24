function crudWindowController($routeParams, $translate, $log, $filter, $uibModal, httpCommonsService, toastrService, CVE_APLICACION) {
    var ctrl = this;

    ctrl.$onInit = () => {
        ctrl.action = 'READ';
        setI18N();
        setMetadata($routeParams.cveForma);
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

    function setI18N() {
        $translate(['APP.BTN_ADD', 'APP.BTN_EDIT', 'APP.BTN_CANCEL', 'APP.BTN_EXPORT', 'APP.BTN_CREATE', 'APP.BTN_UPDATE', 'APP.BTN_DELETE', 'APP.BTN_READ', 'APP.TIT_MOD_CREATE', 'APP.TIT_MOD_EDIT', 'APP.TIT_MOD_DELETE', 'APP.MSG_MOD_DELETE']).then(function (translations) {
            ctrl.txBtnAdd = translations['APP.BTN_ADD'];
            ctrl.txBtnEdit = translations['APP.BTN_EDIT'];
            ctrl.txBtnCancelar = translations['APP.BTN_CANCEL'];
            ctrl.txBtnExportar = translations['APP.BTN_EXPORT'];
            ctrl.txBtnCrear = translations['APP.BTN_CREATE'];
            ctrl.txBtnActualizar = translations['APP.BTN_UPDATE'];
            ctrl.txBtnDelete = translations['APP.BTN_DELETE'];
            ctrl.txBtnVer = translations['APP.BTN_READ'];
            ctrl.titModalCrear = translations['APP.TIT_MOD_CREATE'];
            ctrl.titModalEditar = translations['APP.TIT_MOD_EDIT'];
            ctrl.titModalEliminar = translations['APP.TIT_MOD_DELETE'];
            ctrl.txDelModalMsg = translations['APP.MSG_MOD_DELETE'];
        }, function () {
            ctrl.txBtnAdd = 'Agregar';
            ctrl.txBtnEdit = 'Editar';
            ctrl.txBtnCancelar = 'Cancelar';
            ctrl.txBtnExportar = 'Exportar';
            ctrl.txBtnCrear = 'Crear';
            ctrl.txBtnActualizar = 'Actualizar';
            ctrl.txBtnDelete = 'Eliminar';
            ctrl.txBtnVer = 'Ver';
            ctrl.titModalCrear = 'Crear registro';
            ctrl.titModalEditar = 'Editar registro';
            ctrl.titModalEliminar = 'Eliminar registro';
            ctrl.txDelModalMsg = 'Está seguro que desea eliminar el registro seleccionado?';
        });
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
        ctrl.filterFields = $filter('filter')(angular.copy(ctrl.fields), { bFiltra: true });
        ctrl.gridFields = $filter('filter')(angular.copy(ctrl.fields), { bGrid: true });
        ctrl.reportFields = $filter('filter')(angular.copy(ctrl.fields), { bReporta: true });
        ctrl.createFields = $filter('filter')(angular.copy(ctrl.fields), { bCrea: true });
        ctrl.editFields = $filter('filter')(angular.copy(ctrl.fields), { bEdita: true });
        ctrl.pkFields = $filter('filter')(angular.copy(ctrl.fields), { bPk: true });
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

    const getData = () => {
        if (!ctrl.filterParams) {
            ctrl.filterParams = {};
        }
        httpCommonsService.obtenRegistros(ctrl.metadata.urlApiForma, ctrl.filterParams, ctrl.gridPaginationOpts.pageNumber, ctrl.gridPaginationOpts.pageSize)
            .then(function (response) {
                ctrl.gridData = response.data;
                ctrl.gridTotal = response.total;
            })
            .catch(function (error) {
                $log.error(error);
            });
    };
}

angular
    .module('components.crud')
    .controller('crudWindowController', crudWindowController);
