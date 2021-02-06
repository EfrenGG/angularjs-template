const formSection = {
  templateUrl: './form-section.html',
  bindings: {
    title: '<',
    subtitle: '<',
  },
};

angular.module('components.form').component('formSection', formSection);
