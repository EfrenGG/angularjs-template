function wizardFormController($timeout) {
    var ctrl = this;

    ctrl.$onInit = () => {
        ctrl.isFinished = false;
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
        fields.forEach(field => {
            let groupName = field.numGrupo || 1;
            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(field);
        });
        ctrl.groups = groups;
    };
}

angular
    .module('components.crud')
    .controller('wizardFormController', wizardFormController);
