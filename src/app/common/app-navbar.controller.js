function appNavbarController($translate, $route, httpCommonsService, toastrService, CVE_APLICACION) {
    var ctrl = this;

    ctrl.$onInit = () => {
        httpCommonsService.obtenRegistros('infCatCatalogo', {
            cveAplicacion: CVE_APLICACION,
            cveCatalogo: 'IDIOMA'
        })
            .then(response => {
                ctrl.langOptions = response.data.map(obj => ({
                    key: obj.cveCampo,
                    desc: `${obj.txCampo} (${obj.cveCampo})`
                }));
            })
            .catch(() => ctrl.langOptions = []);
    };

    ctrl.changeLang = event => {
        $translate.use(event.key)
            .then(() => $route.reload())
            .catch(() => toastrService.error('Ocurrió un error inesperado, contacte a su administrador', 'Error'));
    };

    ctrl.$onChanges = changes => {
        if (changes.title) {
            ctrl.title = angular.copy(ctrl.title);
        }
    };
}

angular
    .module('common')
    .controller('appNavbarController', appNavbarController);
