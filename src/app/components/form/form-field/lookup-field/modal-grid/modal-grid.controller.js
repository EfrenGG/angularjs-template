function modalGridController(
    $log,
    $filter,
    $timeout,
    $translate,
    httpCommonsService
) {
    var ctrl = this;

    ctrl.$onInit = () => {
        ctrl.hasSelection = false;
        loadTranslations();
    };

    ctrl.$onChanges = changes => {
        if (!ctrl.gridPaginationOpts) {
            ctrl.gridPaginationOpts = {
                pageNumber: 1,
                pageSize: 5
            };
        }
        if (changes.resolve) {
            setModalMetadata(angular.copy(ctrl.resolve.metadata));
            ctrl.data = angular.copy(ctrl.resolve.data);
            ctrl.filterParams = angular.copy(ctrl.resolve.params) || {};
            if (ctrl.data && ctrl.data.total > 0) {
                ctrl.isLoading = true;
                $timeout(() => setData(ctrl.data), 1000);
                ctrl.isLoading = false;
            } else {
                getData(ctrl.modalMetadata.urlApiForma);
            }
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

    ctrl.setPage = event => {
        ctrl.gridPaginationOpts = angular.copy(event.params);
        getData();
    };

    ctrl.filterData = event => {
        ctrl.filterParams = event.filterParams || {};
        getData();
    };

    ctrl.select = () => {
        ctrl.close({
            $value: {
                entity: ctrl.selectedEntity
            }
        });
    };

    const loadTranslations = () => {
        $translate('APP.TIT_MOD_SEARCH')
            .then(trans => (ctrl.txModalTitle = trans))
            .catch(id => (ctrl.txModalTitle = id));
        $translate('APP.BTN_CANCEL')
            .then(trans => (ctrl.txBtnCancel = trans))
            .catch(id => (ctrl.txBtnCancel = id));
        $translate('APP.BTN_SELECT')
            .then(trans => (ctrl.txBtnSelect = trans))
            .catch(id => (ctrl.txBtnSelect = id));
    };

    const setModalMetadata = metadata => {
        ctrl.modalMetadata = metadata;
        setFields(ctrl.modalMetadata.detallesForma);
        // get i18n
        $translate(
            `${ctrl.modalMetadata.cveForma}.${
                ctrl.modalMetadata.cveTituloForma
            }`
        ).then(
            function(trans) {
                ctrl.txTitForm = trans;
            },
            function() {
                ctrl.txTitForm = ctrl.modalMetadata.txTituloForma;
            }
        );
    };

    const setData = data => {
        ctrl.gridData = data.data;
        ctrl.gridTotal = data.total;
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
        ctrl.isLoading = true;
        httpCommonsService
            .obtenRegistros(
                ctrl.modalMetadata.urlApiForma,
                ctrl.filterParams || {},
                ctrl.gridPaginationOpts.pageNumber,
                ctrl.gridPaginationOpts.pageSize
            )
            .then(response => setData(response))
            .catch(error => $log.error(error))
            .finally(() => (ctrl.isLoading = false));
    };
}

angular
    .module('components.form')
    .controller('modalGridController', modalGridController);
