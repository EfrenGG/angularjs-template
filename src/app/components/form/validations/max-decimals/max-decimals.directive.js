function maxDecimals() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, $element, $attrs, $ctrl) {
            $ctrl.$validators.maxDecimals = function (modelValue, viewValue) {
                if ($ctrl.$isEmpty(modelValue)) {
                    return true;
                }
                var maxDecRegex = new RegExp('^[-+]?[0-9]+(\.[0-9]{0,' + $attrs.maxDecimals + '})?$');
                return maxDecRegex.test(modelValue);
            }
        }
    }
}

angular
    .module('components.form')
    .directive('maxDecimals', maxDecimals);