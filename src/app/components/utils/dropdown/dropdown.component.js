const dropdown = {
  templateUrl: './dropdown.html',
  controller: 'dropdownController',
  bindings: {
    type: '<',
    labelId: '<',
    label: '<',
    icon: '<',
    options: '<',
    onOpen: '&',
    onSelect: '&',
  },
};

angular.module('components.utils').component('dropdown', dropdown);
