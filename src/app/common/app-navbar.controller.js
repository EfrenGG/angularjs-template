function appNavbarController(
    $translate,
    $route,
    httpCommonsService,
    toastrService,
    CVE_APLICACION
) {
    var ctrl = this;

    ctrl.$onInit = () => {
        loadTranslations();
        httpCommonsService
            .search('infCatCatalogo', {
                cveAplicacion: CVE_APLICACION,
                cveCatalogo: 'IDIOMA'
            })
            .then(response => {
                ctrl.langOptions = response.data.map(obj => ({
                    key: obj.cveCampo,
                    desc: `${obj.txCampo} (${obj.cveCampo})`
                }));
            })
            .catch(() => (ctrl.langOptions = []));
    };

    ctrl.$onChanges = changes => {
        if (changes.title) {
            ctrl.title = angular.copy(ctrl.title);
            loadTranslations();
        }
    };

    ctrl.changeLang = option => {
        $translate
            .use(option.key)
            .then(() => $route.reload())
            .catch(() => toastrService.error(ctrl.txMsgUnexpectedError));
    };

    const loadTranslations = () => {
        $translate('APP.BTN_LANG')
            .then(trans => (ctrl.txBtnLang = trans))
            .catch(id => (ctrl.txBtnLang = id));
        $translate('APP.MSG_UNEX_ERR')
            .then(trans => (ctrl.txMsgUnexpectedError = trans))
            .catch(id => (ctrl.txMsgUnexpectedError = id));
    };
}

angular.module('common').controller('appNavbarController', appNavbarController);
