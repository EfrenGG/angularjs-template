function wizardFormController($translate, $timeout) {
    var ctrl = this;

    ctrl.$onInit = () => {
        ctrl.isFinished = false;
        $translate('APP.BTN_PREVIOUS')
            .then(trans => ctrl.txBtnPrevious = trans)
            .catch(id => ctrl.txBtnPrevious = id);
        $translate('APP.BTN_NEXT')
            .then(trans => ctrl.txBtnNext = trans)
            .catch(id => ctrl.txBtnNext = id);
        $translate('APP.BTN_FINISH')
            .then(trans => ctrl.txBtnFinish = trans)
            .catch(id => ctrl.txBtnFinish = id);
    };

    ctrl.$onChanges = changes => {
        if (changes.fields) {
            ctrl.fields = angular.copy(ctrl.fields);
            setGroups(ctrl.fields);
            ctrl.groupKeys = Object.keys(ctrl.groups).map(e => Number(e)).sort();
        }
        if (changes.model) {
            ctrl.model = angular.copy(ctrl.model);
        }
        if (changes.action) {
            ctrl.isValid = ctrl.action === 'UPDATE' ? true : false;
            ctrl.btnSubmitClass = ctrl.action === 'UPDATE' ? 'btn-info' : 'btn-success';
        }
    };

    ctrl.finished = () => {
        ctrl.isFinished = true;
        ctrl.onChange({
            $event: {
                model: ctrl.model,
                invalid: !ctrl.isValid
            }
        });
        $timeout(ctrl.onFinish, 1000);
    };

    ctrl.updateModel = event => {
        ctrl.isValid = !event.invalid;
        ctrl.model = event.model;
        ctrl.onChange({
            $event: {
                model: ctrl.model,
                invalid: event.invalid
            }
        });
    };

    const setGroups = fields => {
        let groups = {};
        ctrl.txGroupName = {};
        fields.forEach(field => {
            let groupName = field.numGrupo || 1;
            if (!groups[groupName]) {
                groups[groupName] = {
                    fields: [],
                    iconClass: field.iconoClsGrupo,
                };
                $translate(`${field.cveForma}.${field.cveNomGrupo}`)
                    .then(trans => groups[groupName].txGroupName = trans)
                    .catch(() => groups[groupName].txGroupName = field.txNomGrupo || groupName);
            }
            groups[groupName].fields.push(field);
        });
        ctrl.groups = groups;
    };
}

angular
    .module('components.crud')
    .controller('wizardFormController', wizardFormController);
