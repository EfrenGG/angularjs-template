function gridController($translate) {
    var ctrl = this;

    ctrl.$onInit = function() {
        ctrl.gridConfig = {
            columnDefs: ctrl.columnDefs,
            enableFullRowSelection: true,
            paginationPageSizes: [5, 10, 25, 50, 100],
            paginationPageSize: 10,
            useExternalPagination: true,
            onRegisterApi: function(gridApi) {
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
        ctrl.gridHeight = '25px';
    };

    ctrl.$onChanges = function(changes) {
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

    function setDefCols(fields) {
        ctrl.columnDefs = fields.map(function (obj) {
            var rObj = {};
            rObj['field'] = obj.nomCampo;
            $translate(obj.cveForma + '.' + obj.cveEtiqueta)
                .then(function (etiquetaCol) {
                    rObj['displayName'] = etiquetaCol;
                }, function () {
                    rObj['displayName'] = obj.txEtiqueta;
                });
            return rObj;
        });
    }

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
