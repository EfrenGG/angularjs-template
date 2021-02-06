function httpCommonsService($http, $q, $translate, INFRA_BASE_URL, API_URL) {
  const getUrl = (url, isInfra) =>
    `${isInfra ? INFRA_BASE_URL : API_URL}${url}`;

  const get = (url, params, saveCache = false) => {
    let deferred = $q.defer();
    if (params === undefined) {
      params = {};
    }
    $http
      .get(url, {
        params: params,
        cache: saveCache,
      })
      .then(
        (response) => deferred.resolve(response.data),
        (response) => deferred.reject(response)
      );
    return deferred.promise;
  };

  const getByKey = (url, params, isInfra = false, saveCache = false) => {
    const absoluteUrl = `${getUrl(url, isInfra)}/getByKey`;
    return get(absoluteUrl, params, saveCache);
  };

  const search = (
    url,
    params,
    pageNumber = 0,
    pageSize = 0,
    isInfra = false,
    saveCache = false
  ) => {
    let absoluteUrl = getUrl(url, isInfra);
    if (params && !angular.equals({}, params)) {
      absoluteUrl = `${absoluteUrl}/search`;
    } else {
      params = {};
    }
    params.pageNumber = pageNumber;
    params.pageSize = pageSize;
    return get(absoluteUrl, params, saveCache);
  };

  const save = (url, registro, isInfra) => {
    url = getUrl(url, isInfra);
    if ($translate.use()) url = url + '?lang=' + $translate.use();
    var deferred = $q.defer();
    $http.post(url, registro).then(
      (response) => deferred.resolve(response.data),
      (error) => deferred.reject(error)
    );
    return deferred.promise;
  };

  const update = (url, registro, isInfra) => {
    url = getUrl(url, isInfra);
    if ($translate.use()) url = url + '?lang=' + $translate.use();
    var deferred = $q.defer();
    $http.put(url, registro).then(
      (response) => deferred.resolve(response.data),
      (error) => deferred.reject(error)
    );
    return deferred.promise;
  };

  const remove = (url, registro, isInfra) => {
    url = getUrl(url, isInfra);
    if ($translate.use()) url = url + '?lang=' + $translate.use();
    var deferred = $q.defer();
    $http
      .delete(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: registro,
      })
      .then(
        (response) => deferred.resolve(response.data),
        (error) => deferred.reject(error)
      );
    return deferred.promise;
  };

  return {
    getByKey: getByKey,
    search: search,
    save: save,
    update: update,
    remove: remove,
  };
}

angular.module('common').factory('httpCommonsService', httpCommonsService);
