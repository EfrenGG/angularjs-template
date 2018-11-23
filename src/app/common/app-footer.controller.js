function appFooterController() {
    var ctrl = this;

    ctrl.txFooter = '© 2018 Cero Uno S. A. de C. V. Todos los derechos reservados.';
}

angular
    .module('common')
    .controller('appFooterController', appFooterController);
