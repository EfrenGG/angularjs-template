function noteController($translate) {

    var ctrl = this;

    ctrl.$onChanges = function (changes) {
        if (changes.type) {
            switch (ctrl.type) {
                case 'SUCCESS':
                    ctrl.noteClass = 'note-success';
                    ctrl.iconClass = 'fas fa-check-circle';
                    $translate('APP.MSG_SUCCESS').then(trans => ctrl.defaultTitle = trans).catch(() => ctrl.defaultTitle = 'Éxito');
                    break;
                case 'WARN':
                    ctrl.noteClass = 'note-warning';
                    ctrl.iconClass = 'fas fa-exclamation-circle';
                    $translate('APP.MSG_WARNING').then(trans => ctrl.defaultTitle = trans).catch(() => ctrl.defaultTitle = 'Alerta');
                    break;
                case 'DANGER':
                    ctrl.noteClass = 'note-danger';
                    ctrl.iconClass = 'fas fa-radiation-alt';
                    $translate('APP.MSG_DANGER').then(trans => ctrl.defaultTitle = trans).catch(() => ctrl.defaultTitle = 'Peligro');
                    break;
                default:
                    ctrl.noteClass = 'note-info';
                    ctrl.iconClass = 'fas fa-info-circle';
                    $translate('APP.MSG_INFO').then(trans => ctrl.defaultTitle = trans).catch(() => ctrl.defaultTitle = 'Información');
                    break;
            }
        }
        if (changes.title) {
            if (ctrl.title) { ctrl.defaultTitle = ctrl.title; }
        }
    };
}

angular
    .module('components.utils')
    .controller('noteController', noteController);
