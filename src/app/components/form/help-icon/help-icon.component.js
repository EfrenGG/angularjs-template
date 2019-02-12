const helpIcon = {
    templateUrl: './help-icon.html',
    bindings: {
        helpText: '<',
        delay: '<'
    }
};

angular
    .module('components.form')
    .component('helpIcon', helpIcon);
