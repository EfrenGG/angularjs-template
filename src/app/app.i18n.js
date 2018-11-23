angular
    .module('app')
    .config(function ($translateProvider, BASE_DATOS, DEF_LANG) {
        $translateProvider.useSanitizeValueStrategy('escape');
        $translateProvider.useUrlLoader('http://localhost:5000/api/infEtiquetas/getI18N?baseDatos=' + BASE_DATOS + '&cveTipoEntidad=F');
        $translateProvider.preferredLanguage(DEF_LANG);
    });
