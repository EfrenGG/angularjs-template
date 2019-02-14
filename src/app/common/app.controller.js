function appController($rootScope, $translate, CVE_APLICACION) {
    var ctrl = this;

    ctrl.$onInit = () => {
        ctrl.appKey = CVE_APLICACION;
        ctrl.menuRootKey = 'MN_ROOT';
        getTranslations();

    };

    const getTranslations = () => {
        $translate('APP.TIT_PRINCIPAL')
            .then(trans => ctrl.appTitle = trans)
            .catch(transId => ctrl.appTitle = transId);
        $translate('APP.MSG_FOOTER')
            .then(trans => ctrl.footerText = trans)
            .catch(transId => ctrl.footerText = transId);
        $translate('APP.TIT_MENU')
            .then(trans => ctrl.menuTitle = trans)
            .catch(id => ctrl.menuTitle = id);
        $translate('APP.MSG_WELCOME')
            .then(trans => ctrl.welcomeMessage = trans)
            .catch(id => ctrl.welcomeMessage = id);
    };

    $rootScope.$on('$translateChangeSuccess', getTranslations);
}

angular
    .module('common')
    .controller('appController', appController);
