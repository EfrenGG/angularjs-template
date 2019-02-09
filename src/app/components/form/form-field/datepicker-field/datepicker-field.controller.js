
function datepickerFieldController(uibDateParser, DEF_DATE_FORMAT) {
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

    const getIsoDate = date => `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate()).toString().padStart(2, '0')}`;

    ctrl.openCalendar = () => ctrl.isCalendarOpen = true;
}

angular
    .module('components.form')
    .controller('datepickerFieldController', datepickerFieldController);
