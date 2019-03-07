function lookupFieldController(
    $translate,
    $uibModal,
    $timeout,
    $log,
    httpCommonsService,
    CVE_APLICACION
) {
    var ctrl = this;

    ctrl.$onInit = () => {
        ctrl.isFocused = false;
        $translate('APP.DEF_TYPE_TEXT')
            .then(trans => (ctrl.defaultText = trans))
            .catch(id => (ctrl.defaultText = id));
        ctrl.timer = null;
        ctrl.loading = false;
    };

    ctrl.$onChanges = changes => {
        if (changes.metadata) {
            ctrl.metadata = angular.copy(ctrl.metadata);
            setRelatedFormMetadata(ctrl.metadata.cveFormaRelacion);
        }
        if (changes.model) {
            ctrl.model = angular.copy(ctrl.model);
            ctrl.viewModel = angular.copy(ctrl.model);
        }
    };

    ctrl.startCountDown = () => {
        if (ctrl.loading) {
            return;
        }
        if (ctrl.timer) {
            $timeout.cancel(ctrl.timer);
        }
        ctrl.timer = $timeout(ctrl.search, 3000);
    };

    ctrl.search = () => {
        if (!ctrl.viewModel) {
            ctrl.model = undefined;
            ctrl.relatedEntity = {};
            ctrl.updateModel();
            return;
        }
        ctrl.loading = true;
        httpCommonsService
            .obtenRegistros(
                ctrl.relatedFormMetadata.urlApiForma,
                { [ctrl.dependantField]: ctrl.viewModel },
                1,
                5
            )
            .then(response => {
                if (response.total === 1) {
                    ctrl.model = response.data[0][ctrl.dependantField];
                    ctrl.relatedEntity = response.data[0];
                    ctrl.updateModel();
                } else {
                    ctrl.openModal(response);
                }
            })
            .catch(error => {
                $log.error('Error: ', error);
                ctrl.openModal();
            })
            .finally(() => {
                ctrl.loading = false;
            });
    };

    ctrl.toggleFocus = isFocused => {
        ctrl.isFocused = isFocused;
        if (!isFocused && ctrl.viewModel !== ctrl.model) {
            ctrl.viewModel = undefined;
        }
        ctrl.updateModel();
    };

    ctrl.updateModel = () => {
        ctrl.onChange({
            $event: {
                name: ctrl.metadata.nomCampo,
                value: ctrl.model,
                isFocused: ctrl.isFocused,
                entityName: `lk_${ctrl.metadata.nomCampo}`,
                entity: ctrl.relatedEntity
            }
        });
    };

    ctrl.openModal = data => {
        $uibModal
            .open({
                animation: true,
                backdrop: 'static',
                component: 'modalGrid',
                resolve: {
                    action: () => 'SEARCH',
                    metadata: () => ctrl.relatedFormMetadata,
                    params: () => ({ [ctrl.dependantField]: ctrl.viewModel }),
                    data: () => data
                }
            })
            .result.then(
                event => onModalClose(event),
                event => onModalDismiss(event)
            );
    };

    const setRelatedFormMetadata = relatedFormKey => {
        httpCommonsService
            .obtenRegistro('infForma', {
                cveAplicacion: CVE_APLICACION,
                cveForma: relatedFormKey
            })
            .then(function(response) {
                ctrl.relatedFormMetadata = response;
                ctrl.dependantField = ctrl.metadata.nomCampoDependiente;
            })
            .catch(function(error) {
                $log.error(error);
            });
    };

    const onModalClose = event => {
        if (event.entity) {
            ctrl.relatedEntity = event.entity;
            ctrl.model = event.entity[ctrl.dependantField];
        }
        ctrl.updateModel();
        ctrl.loading = false;
    };

    const onModalDismiss = event => {
        ctrl.viewModel = ctrl.model;
        ctrl.unsavedEvent = event;
        ctrl.loading = false;
    };
}

angular
    .module('components.form')
    .controller('lookupFieldController', lookupFieldController);
