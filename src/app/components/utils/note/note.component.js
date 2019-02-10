const note = {
    templateUrl: './note.html',
    controller: 'noteController',
    bindings: {
        type: '<',
        title: '<',
        description: '<',
    }
};

angular
    .module('components.utils')
    .component('note', note);
