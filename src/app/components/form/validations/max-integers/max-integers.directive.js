function maxIntegers() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function ($scope, $element, $attrs, $ctrl) {
            $ctrl.$validators.maxIntegers = function (modelValue, viewValue) {
                if ($ctrl.$isEmpty(modelValue)) {
                    return true;
                }
                var maxIntRegex = new RegExp('^[-+]?[0-9]{0,' + $attrs.maxIntegers + '}(?:[.][0-9]*)?$');
                return maxIntRegex.test(modelValue);
            }
        }
    }
}

angular
    .module('components.form')
    .directive('maxIntegers', maxIntegers);