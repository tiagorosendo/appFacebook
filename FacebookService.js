(function() {
    'use strict';

    angular
        .module('app')
        .service('FacebookService', FacebookService);

    FacebookService.$inject = ['$timeout'];

    function FacebookService($timeout) {
        var service = this;
        service.methods = sendGroupImage;

        function sendGroupImage(param) {
            return FB.api('/' + param.id + '/photos', 'post', param.dados, function(response) {
                return response;
            });
        }
    }
})();