function appMenuController(httpCommonsService, CVE_APLICACION) {
    var ctrl = this;

    ctrl.$onInit = function () {
        ctrl.txMenu = 'Menú';
        ctrl.menuRoot = 'MN_ROOT';
        getMenuOpts('infSegMenu', {
            cveAplicacion: CVE_APLICACION,
            cveMenu: ctrl.menuRoot
        });
    };

    function getMenuOpts(url, params) {
        httpCommonsService.obtenRegistro(url, params)
            .then(function(response) {
                ctrl.root = response;
            })
            .catch(function(error) {
                ctrl.error = error;
            });
    }
}

angular
    .module('common')
    .controller('appMenuController', appMenuController);
