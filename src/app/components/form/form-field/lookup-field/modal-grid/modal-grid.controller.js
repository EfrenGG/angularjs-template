function modalGridController($log, $filter, $translate, $timeout, httpCommonsService, CVE_APLICACION) {

    var ctrl = this;

    ctrl.$onInit = () => {
        ctrl.hasSelection = false;
        ctrl.filterParams = {};
        ctrl.gridPaginationOpts = {
            pageNumber: 1,
            pageSize: 5
        };
        ctrl.txModalTitle = 'Buscar';
        ctrl.txBtnCancel = 'Cancelar';
        ctrl.txBtnSelect = 'Seleccionar';
    };

    ctrl.$onChanges = changes => {
        if (changes.resolve) {
            ctrl.formKey = angular.copy(ctrl.resolve.formKey);
            ctrl.data = angular.copy(ctrl.resolve.data);
            setModalMetadata(ctrl.formKey);
        }
    };

    ctrl.cancel = () => {
        ctrl.dismiss({
            $value: {
                selectedValue: ctrl.selectedValue
            }
        });
    };

    ctrl.setSelectedRow = event => {
        ctrl.selectedEntity = event.entity;
        ctrl.hasSelection = !(event.entity === undefined);
    };

    ctrl.filterData = event => {
        ctrl.filterParams = event.filterParams;
        getData();
    };

    ctrl.select = () => {
        ctrl.close({
            $value: {
                entity: ctrl.selectedEntity
            }
        });
    };

    const setModalMetadata = form => {
        ctrl.modalMetadata = null;
        httpCommonsService.obtenRegistro('infForma', {
            cveAplicacion: CVE_APLICACION,
            cveForma: form
        }).then(function (response) {
            ctrl.modalMetadata = response;
            if (ctrl.modalMetadata.cveForma) {
                setFields(ctrl.modalMetadata.detallesForma);
                if (ctrl.data && ctrl.data.total > 0) {
                    $log.log('Carga datos previos...', ctrl.data);
                    $timeout(setData, 1000);
                } else {
                    getData(ctrl.modalMetadata.urlApiForma);
                }
            }
            // get i18n
            $translate(ctrl.modalMetadata.cveForma + '.' + ctrl.modalMetadata.cveTituloForma)
                .then(function (etiquetaCol) {
                    ctrl.txTitForm = etiquetaCol;
                }, function () {
                    ctrl.txTitForm = ctrl.modalMetadata.txTituloForma;
                });
        }).catch(function (error) {
            $log.error(error);
        });
    };

    const setData = () => {
        ctrl.gridData = ctrl.data.data;
        ctrl.gridTotal = ctrl.data.total;
    };

    const setFields = details => {
        ctrl.fields = $filter('orderBy')(details, 'numOrden');
        ctrl.gridFields = [];
        ctrl.filterFields = [];
        ctrl.fields.forEach(field => {
            if (field.bGrid) {
                ctrl.gridFields.push(field);
            }
            if (field.bFiltra) {
                let newField = angular.copy(field);
                newField.hasValidation = false;
                newField.cveTamanoCampo = 'MD';
                ctrl.filterFields.push(newField);
            }
        });
    };

    const getData = () => {
        httpCommonsService.obtenRegistros(ctrl.modalMetadata.urlApiForma, ctrl.filterParams, ctrl.gridPaginationOpts.pageNumber, ctrl.gridPaginationOpts.pageSize)
            .then(response => {
                ctrl.data = response;
                $timeout(setData, 1000);
            })
            .catch(error => $log.error(error));
    };
}

angular
    .module('components.form')
    .controller('modalGridController', modalGridController);
