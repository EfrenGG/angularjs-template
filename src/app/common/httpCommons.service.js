function httpCommonsService($http, $q, $translate, API_URL) {

    var getUrl = url => API_URL + url;

    function obten(url, params) {
        url = getUrl(url);
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
        url = getUrl(url);
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

    function obtenRegistros(url, params, pageNumber, pageSize) {
        url = getUrl(url);
        var deferred = $q.defer();
        if (params) {
            url = url + '/search';
        }
        if (pageNumber && pageSize) {
            params.pageNumber = pageNumber;
            params.pageSize = pageSize;
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

    function save(url, registro) {
        url = getUrl(url);
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

    function update(url, registro) {
        url = getUrl(url);
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

    function remove(url, registro) {
        url = getUrl(url);
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
        save: save,
        update: update,
        remove: remove
    };
}

angular
    .module('common')
    .factory('httpCommonsService', httpCommonsService);
