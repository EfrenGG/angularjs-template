function appController() {
    var ctrl = this;

    ctrl.appTitle = 'AngularJS Template';
    ctrl.footerText = `© ${new Date().getFullYear()} Cero Uno S. A. de C. V. Todos los derechos reservados.`;
}

angular
    .module('common')
    .controller('appController', appController);
