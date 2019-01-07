angular
    .module('app')
    .config(function ($translateProvider, INFRA_BASE_URL, CVE_APLICACION, DEF_LANG) {
        $translateProvider.useSanitizeValueStrategy('escape');
        $translateProvider.useUrlLoader(INFRA_BASE_URL + 'infEtiqueta/' + CVE_APLICACION);
        $translateProvider.preferredLanguage(DEF_LANG);
    });
