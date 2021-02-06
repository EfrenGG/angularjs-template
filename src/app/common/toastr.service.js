/*global toastr:true*/
function toastrService() {
  const _getDefaultOptions = () => ({
    closeButton: true,
    showMethod: 'slideDown',
    progressBar: true,
  });

  const setOptions = (newOpts) =>
    Object.assign(newOpts || {}, _getDefaultOptions());

  return {
    info: (r, t, opts) => toastr.info(r, t, setOptions(opts)),
    warning: (r, t, opts) => toastr.warning(r, t, setOptions(opts)),
    success: (r, t, opts) => toastr.success(r, t, setOptions(opts)),
    error: (r, t, opts) => toastr.error(r, t, setOptions(opts)),
    getContainer: (r, t) => toastr.getContainer(r, t),
    subscribe: (r) => toastr.subscribe(r),
    clear: (r, t) => toastr.clear(r, t),
    remove: (r) => toastr.remove(r),
  };
}

angular.module('common').factory('toastrService', toastrService);
