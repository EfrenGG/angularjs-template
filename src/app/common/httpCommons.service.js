function httpCommonsService($http, $q, $translate, API_URL) {

    var generaUrl = url => API_URL + url;

    function obten(url, params) {
        url = generaUrl(url);
        var deferred = $q.defer();
        $http.get(url, {
            params: params
        })
            .then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    }

    function obtenRegistro(url, params) {
        url = generaUrl(url);
        var deferred = $q.defer();
        $http.get(url + '/getByKey', {
            params: params,
            cache: true
        })
            .then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    }

    function obtenRegistros(url, params, numPagina, numRegistrosPorPagina) {
        url = generaUrl(url);
        var deferred = $q.defer();
        if (params) {
            url = url + '/search';
        }
        if (numPagina && numRegistrosPorPagina) {
            params.numPagina = numPagina;
            params.numRegistrosPorPagina = numRegistrosPorPagina;
        }

        $http.get(url, {
            params: params
        })
            .then(function (response) {
                deferred.resolve(response.data);
            }, function (response) {
                deferred.reject(response);
            });
        return deferred.promise;
    }

    function guardarRegistro(url, registro) {
        url = generaUrl(url);
        if ($translate.use())
            url = url + '?lang=' + $translate.use();
        var deferred = $q.defer();
        $http.post(url, registro)
            .then(function (response) {
                deferred.resolve(response.data);
            }, function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    function editarRegistro(url, registro) {
        url = generaUrl(url);
        if ($translate.use())
            url = url + '?lang=' + $translate.use();
        var deferred = $q.defer();
        $http.put(url, registro)
            .then(function (response) {
                deferred.resolve(response.data);
            }, function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    function eliminarRegistro(url, registro) {
        url = generaUrl(url);
        if ($translate.use())
            url = url + '?lang=' + $translate.use();
        var deferred = $q.defer();
        $http.delete(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            data: registro
        })
            .then(function (response) {
                deferred.resolve(response.data);
            }, function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    return {
        obten: obten,
        obtenRegistro: obtenRegistro,
        obtenRegistros: obtenRegistros,
        guardarRegistro: guardarRegistro,
        editarRegistro: editarRegistro,
        eliminarRegistro: eliminarRegistro
    };
}

angular
    .module('common')
    .factory('httpCommonsService', httpCommonsService);
