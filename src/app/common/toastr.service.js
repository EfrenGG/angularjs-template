/*global toastr:true*/
function toastrService() {

    const _getDefaultOptions = () => ({ closeButton: true, showMethod: 'slideDown', progressBar: true });

    return { 
        info: (r, t) => toastr.info(r, t, _getDefaultOptions()),
        warning: (r, t) => toastr.warning(r, t, _getDefaultOptions()),
        success: (r, t) => toastr.success(r, t, _getDefaultOptions()),
        error: (r, t) => toastr.error(r, t, _getDefaultOptions()),
        getContainer: (r, t) => toastr.getContainer(r, t),
        subscribe: (r) => toastr.subscribe(r),
        clear: (r, t) => toastr.clear(r, t),
        remove: (r) => toastr.remove(r)
    };
}

angular
    .module('common')
    .factory('toastrService', toastrService);
