function dateFieldController() {

    var ctrl = this;

    const modelDateFormat = 'yyyy-mm-dd'; // ISO format

    ctrl.$onInit = () => {
        ctrl.language = 'es';
    };

    ctrl.$onChanges = changes => {
        if (changes.metadata) {
            ctrl.metadata = angular.copy(ctrl.metadata);
            setDateFormat();
        }
        if (changes.model) {
            if (ctrl.model !== ctrl.dateString) {
                ctrl.date = new Date(ctrl.model);
            }
        }
    };

    ctrl.show = () => ctrl.updateModel(true);

    ctrl.hide = () => ctrl.updateModel(false);

    ctrl.changeDate = event => {
        if (event.date) {
            ctrl.dateString = getDateString(event.date);
        }
    };

    ctrl.updateModel = isFocused => {
        ctrl.onChange({
            $event: {
                value: ctrl.dateString,
                name: ctrl.metadata.nomCampo,
                isFocused: isFocused
            }
        });
    };

    const setDateFormat = () => {
        ctrl.dateFormat = ctrl.metadata.txRegex || modelDateFormat;
    };

    const getDateString = date => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate()).toString().padStart(2, '0')}`;
}

angular
    .module('components.form')
    .controller('dateFieldController', dateFieldController);
