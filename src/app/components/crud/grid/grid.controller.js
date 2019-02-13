function gridController($translate, $timeout) {
    var ctrl = this;

    ctrl.$onInit = function () {
        ctrl.lang = $translate.use();
        $translate('APP.MSG_NO_DATA')
            .then(trans => ctrl.txNoMetadata = trans)
            .catch(id => ctrl.txNoMetadata = id);
        ctrl.gridConfig = {
            columnDefs: ctrl.columnDefs,
            enableColumnResizing: true,
            // pagination
            useExternalPagination: true,
            paginationPageSizes: [5, 10, 25, 50, 100],
            paginationPageSize: ctrl.paginationOptions.pageSize || 5,
            // selection
            enableFullRowSelection: true,
            onRegisterApi: gridApi => {
                gridApi.pagination.on.paginationChanged(null, function (newPage, pageSize) {
                    ctrl.paginationOptions.pageNumber = newPage;
                    ctrl.paginationOptions.pageSize = pageSize;
                    changePage(ctrl.paginationOptions);
                });
                gridApi.selection.setMultiSelect(false);
                gridApi.selection.on.rowSelectionChanged(null, function (row) {
                    selectRow(row.isSelected ? row.entity : undefined);
                });
                gridApi.core.on.gridDimensionChanged(null, (oldGridHeight, oldGridWidth, newGridHeight, newGridWidth) => {
                    if (oldGridWidth !== newGridWidth && ctrl.gridWidth !== newGridWidth) {
                        let previousFooterHeight = ctrl.gridFooterHeight;
                        ctrl.gridWidth = newGridWidth;
                        ctrl.gridFooterHeight = ctrl.gridWidth < 575 ? 84 : 42;
                        if (!previousFooterHeight) { return; }
                        if (previousFooterHeight !== ctrl.gridFooterHeight) {
                            if (ctrl.resizingTimeOut) { $timeout.cancel(ctrl.resizingTimeOut); }
                            ctrl.isResizing = true;
                            ctrl.resizingTimeOut = $timeout(setGridHeight, 500);

                        }
                    }
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
            if (!ctrl.paginationOptions) {
                enablePagination: false
            }
        }
        if (changes.data) {
            ctrl.data = angular.copy(ctrl.data);
            if (ctrl.gridConfig) {
                ctrl.gridConfig.data = ctrl.data;
                setGridHeight();
            }
        }
        if (changes.total) {
            ctrl.total = angular.copy(ctrl.total);
            if (ctrl.gridConfig) {
                ctrl.gridConfig.totalItems = ctrl.total;
            }
        }
    };

    const setGridHeight = () => {
        if (!ctrl.data.length) {
            ctrl.gridHeight = 0;
            return;
        } else {
            ctrl.gridHeight = (ctrl.data.length * 30) + 32 + (ctrl.gridFooterHeight || 42);
        }
        ctrl.isResizing = false;
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
            $translate(obj.cveForma + '.' + obj.cveEtiqueta).then(trans => rObj['displayName'] = trans).catch(() => rObj['displayName'] = obj.txEtiqueta);
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
