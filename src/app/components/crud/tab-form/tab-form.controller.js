function tabFormController($translate) {

    var ctrl = this;

    ctrl.$onInit = () => {
        ctrl.isValid = false;
        $translate('APP.MSG_ERROR').then(trans => ctrl.txErrorMessage = trans).catch(() => ctrl.txErrorMessage = 'Existen uno o más errores');
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
            setGroups(ctrl.fields);
        }
    };

    ctrl.updateModel = (event, key) => {
        ctrl.model = event.model;
        ctrl.groups[key].isValid = !event.invalid;
        for (let subformKey of ctrl.groupKeys) {
            if (!ctrl.groups[subformKey].isValid) {
                ctrl.isValid = false;
                break;
            }
            ctrl.isValid = true;
        }
        ctrl.onChange({
            $event: {
                model: ctrl.model,
                invalid: !ctrl.isValid
            }
        });
    };

    const setGroups = fields => {
        let groups = {};
        ctrl.txGroupName = {};
        fields.forEach(field => {
            let groupName = field.numGrupo || 1;
            if (!groups[groupName]) {
                $translate(`${field.cveForma}.${field.cveNomGrupo}`)
                    .then(trans => ctrl.txGroupName[groupName] = trans)
                    .catch(() => ctrl.txGroupName[groupName] = field.txNomGrupo || groupName);
                groups[groupName] = {
                    fields: [],
                    iconClass: field.iconoClsGrupo,
                    isValid: ctrl.isValid
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
    .controller('tabFormController', tabFormController);
