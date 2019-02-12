function dropdownController($translate) {

    var ctrl = this;

    ctrl.$onChanges = changes => {
        if (changes.options) {
            ctrl.options = angular.copy(ctrl.options);
        }
        setProps();
    };

    ctrl.toggle = open => {
        if (open) {
            ctrl.onOpen();
        }
    };

    ctrl.click = option => {
        ctrl.onSelect({
            $event: {
                key: option.key,
                desc: option.desc,
            }
        });

    };

    const setProps = () => {
        switch (ctrl.type) {
            case 'NAV':
                ctrl.labelClass = !ctrl.icon ? null : 'px-navbar-icon-label';
                ctrl.element = 'li';
                $translate(ctrl.labelId)
                    .then(trans => ctrl.labelText = trans)
                    .catch(() => ctrl.labelText = ctrl.label);
                break;
            default:
                ctrl.noteClass = 'note-info';
                ctrl.iconClass = 'fas fa-info-circle';
                $translate('APP.MSG_INFO').then(trans => ctrl.defaultTitle = trans).catch(() => ctrl.defaultTitle = 'Información');
                break;
        }
    };
}

angular
    .module('components.utils')
    .controller('dropdownController', dropdownController);
