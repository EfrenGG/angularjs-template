function gridController($translate) {
    var ctrl = this;

    ctrl.$onInit = function () {
        $translate('APP.MSG_NO_DATA').then(trans => ctrl.txNoMetadata = trans). catch(() => ctrl.txNoMetadata = 'No hay datos');
        ctrl.gridConfig = {
            columnDefs: ctrl.columnDefs,
            enableColumnResizing: true,
            enableFullRowSelection: true,
            paginationPageSizes: [5, 10, 25, 50, 100],
            paginationPageSize: ctrl.paginationOptions.pageSize || 10,
            useExternalPagination: true,
            onRegisterApi: gridApi => {
                ctrl.gridApi = gridApi;
                ctrl.gridApi.pagination.on.paginationChanged(null, function (newPage, pageSize) {
                    ctrl.paginationOptions.pageNumber = newPage;
                    ctrl.paginationOptions.pageSize = pageSize;
                    changePage(ctrl.paginationOptions);
                });
                ctrl.gridApi.selection.setMultiSelect(false);
                ctrl.gridApi.selection.on.rowSelectionChanged(null, function (row) {
                    selectRow(row.isSelected ? row.entity : undefined);
                });
            }
        };
    };

    ctrl.$onChanges = function (changes) {
        if (changes.fields) {
            ctrl.fields = angular.copy(ctrl.fields);
            setDefCols(ctrl.fields);
        }
        if (changes.paginationOptions) {
            ctrl.paginationOptions = angular.copy(ctrl.paginationOptions);
        }
        if (changes.data) {
            ctrl.data = angular.copy(ctrl.data);
            if (ctrl.gridConfig) {
                setGridHeight(ctrl.data.length);
                ctrl.gridConfig.data = ctrl.data;
            }
        }
        if (changes.total) {
            ctrl.total = angular.copy(ctrl.total);
            if (ctrl.gridConfig) {
                ctrl.gridConfig.totalItems = ctrl.total;
            }
        }
    };

    const setGridHeight = dataLength => {
        let height = 0;
        if (!dataLength) {
            height = '25px';
            return;
        } else {
            height = (dataLength * 30) + 32 + 42;
            if (ctrl.screenWidth < 700) {
                ctrl.gridConfig.enableFullRowSelection = false;
                height += 42;
            }
        }
        ctrl.gridHeight = height + 'px';
    };

    function setDefCols(fields) {
        if (!fields) {
            return;
        }
        ctrl.columnDefs = fields.map(function (obj) {
            var rObj = {};
            rObj['field'] = obj.nomCampo;
            rObj['displayName'] = obj.txEtiqueta;
            rObj['minWidth'] = getMinWidth(obj.cveTamanoCampo);
            $translate(obj.cveForma + '.' + obj.cveEtiqueta).then(trans => rObj['displayName'] = trans). catch(() => rObj['displayName'] = obj.txEtiqueta);
            return rObj;
        });
        if (ctrl.gridConfig) {
            ctrl.gridConfig.columnDefs = ctrl.columnDefs;
        }
    }

    const getMinWidth = sizeKey => {
        switch (sizeKey) {
            case 'LG':
                return 300;
            case 'SM':
            case 'XS':
                return 150;
            default:
                return 200;
        }
    };

    function selectRow(entity) {
        ctrl.onRowSelection({
            $event: {
                entity: entity
            }
        });
    }

    function changePage(params) {
        ctrl.onPageChanged({
            $event: {
                params: params
            }
        });
    }
}

angular
    .module('components.crud')
    .controller('gridController', gridController);
