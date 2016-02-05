/* global FB */
(function() {
    'use strict';

    angular
        .module('app')
        .service('FacebookService', FacebookService);

    FacebookService.$inject = ['$timeout'];

    function FacebookService($timeout) {
        var service = this;
        service.methods = {};
        service.methods.sendGroupImage = sendGroupImage;
        service.methods.getGroupList = getGroupList;

        function sendGroupImage(param) {
            return FB.api('/' + param.id + '/photos', 'post', param.dados, function(response) {
                return response;
            });
        };

        function getGroupList() {
            return FB.api('/me/groups', function(response) {
                return response;
            });
        }
    }

})();