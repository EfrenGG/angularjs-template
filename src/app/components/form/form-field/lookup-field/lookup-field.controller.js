function lookupFieldController($translate, $uibModal, $timeout, $log, httpCommonsService) {

    var ctrl = this;

    ctrl.$onInit = () => {
        ctrl.isFocused = false;
        $translate('APP.DEF_TYPE_TEXT')
            .then(trans => ctrl.defaultText = trans)
            .catch(id => ctrl.defaultText = id);
        ctrl.timer = null;
        ctrl.loading = false;
    };

    ctrl.$onChanges = changes => {
        if (changes.metadata) {
            ctrl.metadata = angular.copy(ctrl.metadata);
        }
        if (changes.model) {
            ctrl.model = angular.copy(ctrl.model);
        }
    };

    ctrl.openModal = data => {
        $uibModal.open({
            animation: true,
            backdrop: 'static',
            component: 'modalGrid',
            resolve: {
                action: () => 'SEARCH',
                formKey: () => ctrl.metadata.cveFormaRelacion,
                data: () => data
            }
        }).result
            .then(event => onModalClose(event),
                event => onModalDismiss(event));
    };

    const onModalClose = (event) => {
        if (event.entity) {
            ctrl.model = event.entity[ctrl.metadata.nomCampoDependiente];
        }
        ctrl.updateModel();
        ctrl.loading = false;
    };

    const onModalDismiss = (event) => {
        ctrl.unsavedEvent = event;
        ctrl.model = null;
        ctrl.loading = false;

    };

    ctrl.startCountDown = () => {
        if (ctrl.loading) { return; }
        if (ctrl.timer) {
            $timeout.cancel(ctrl.timer);
        }
        ctrl.timer = $timeout(ctrl.search, 3000);
    };

    ctrl.search = () => {
        ctrl.loading = true;
        httpCommonsService.obtenRegistros('/infForma', { [ctrl.metadata.nomCampoDependiente]: ctrl.model}, 1, 5)
            .then(response => {
                if (response.total === 1) {
                    ctrl.model = response.data[0][ctrl.metadata.nomCampoDependiente];
                    ctrl.loading = false;
                }
                else {
                    ctrl.openModal(response);
                }
            })
            .catch(error => {
                $log.error('Error: ', error);
            });
    };

    ctrl.toggleFocus = isFocused => {
        ctrl.isFocused = isFocused;
        ctrl.updateModel();
    };

    ctrl.updateModel = () => {
        ctrl.onChange({
            $event: {
                value: ctrl.model,
                name: ctrl.metadata.nomCampo,
                isFocused: ctrl.isFocused
            }
        });
    };
}

angular
    .module('components.form')
    .controller('lookupFieldController', lookupFieldController);
