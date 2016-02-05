/* global FB */
(function() {
    'use strict';

    angular
        .module('app')
        .service('FacebookService', FacebookService);

    FacebookService.$inject = ['$timeout', '$q'];

    function FacebookService($timeout, $q) {
        var service = this;
        service.methods = {};
        service.methods.sendGroupImage = sendGroupImage;
        service.methods.getGroupList = getGroupList;
        return service;

        function sendGroupImage(param) {
            var deferred = $q.defer();

            FB.api('/' + param.id + '/photos', 'post', param.dados, function(response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        };

        function getGroupList() {
            return FB.api('/me/groups', function(response) {
                return response;
            });
        }
    }

})();