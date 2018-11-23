function appMenuOptController(httpCommonsService, CVE_APLICACION) {
    var ctrl = this;

    ctrl.$onInit = function () {
        getOptions('api/segMenus', {
            cveAplicacion: CVE_APLICACION,
            cveMenuP: ctrl.parent
        });
    };

    function getOptions(url, params) {
        httpCommonsService.obtenRegistros(url, params)
            .then(function(response) {
                ctrl.options = response.datos;
            })
            .catch(function(error) {
                ctrl.error = error;
            });
    }
}

angular
    .module('common')
    .controller('appMenuOptController', appMenuOptController);
