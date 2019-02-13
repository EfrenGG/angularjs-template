function appMenuController($translate, httpCommonsService) {
    var ctrl = this;

    ctrl.$onInit = () => {
        $translate('APP.TIT_MENU')
            .then(trans => ctrl.txMenu = trans)
            .catch(id => ctrl.txMenu = id);
    };

    ctrl.$onChanges = changes => {
        if (changes.title) {
            if (ctrl.appKey || ctrl.menuRootKey) {
                httpCommonsService.obtenRegistro('infSegMenu', {
                    cveAplicacion: ctrl.appKey,
                    cveMenu: ctrl.menuRootKey
                }).then(response => ctrl.root = response)
                    .catch(error => ctrl.error = error);
            }
        }
    };
}

angular
    .module('common')
    .controller('appMenuController', appMenuController);
