
function datepickerFieldController($translate, uibDateParser, DEF_DATE_FORMAT) {
    var ctrl = this;

    const availableDateFormats = [
        'dd-MMMM-yyyy',
        'yyyy/MM/dd',
        'dd.MM.yyyy',
        'dd/MM/yyyy',
        'shortDate'
    ];

    ctrl.$onInit = () => {
        ctrl.isFocused = false;
        ctrl.isCalendarOpen = false;
    };

    ctrl.$onChanges = changes => {
        if (changes.metadata) {
            ctrl.metadata = angular.copy(ctrl.metadata);
            setDateFormat();
        }
        if (changes.model) {
            if (ctrl.model) {
                ctrl.model = uibDateParser.fromTimezone(new Date(ctrl.model), 'UTC');
            }
        }
    };

    const setDateFormat = () => {
        ctrl.dateFormat = DEF_DATE_FORMAT;
        if (ctrl.metadata.txRegex) {
            ctrl.dateFormat = (availableDateFormats.indexOf(ctrl.metadata.txRegex) > -1) ? ctrl.metadata.txRegex : DEF_DATE_FORMAT;
        }
    };

    ctrl.toggleFocus = isFocused => {
        ctrl.isFocused = isFocused;
        ctrl.updateModel();
    };

    ctrl.updateModel = () => {
        ctrl.onChange({
            $event: {
                value: ctrl.model ? getIsoDate(ctrl.model) : undefined,
                name: ctrl.metadata.nomCampo,
                isFocused: ctrl.isFocused
            }
        });
    };

    ctrl.openCalendar = () => {
        if (!ctrl.clearText) {
            loadTranslations();
        }
        ctrl.isCalendarOpen = true;
    };

    const loadTranslations = () => {
        $translate('APP.BTN_CLEAR').then(translation => ctrl.clearText = translation, () => ctrl.clearText = 'Borrar');
        $translate('APP.BTN_CLOSE').then(translation => ctrl.closeText = translation, () => ctrl.closeText = 'Cerrar');
        $translate('APP.BTN_TODAY').then(translation => ctrl.currentText = translation, () => ctrl.currentText = 'Hoy');
    };

    const getIsoDate = date => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate()).toString().padStart(2, '0')}`;
}

angular
    .module('components.form')
    .controller('datepickerFieldController', datepickerFieldController);
