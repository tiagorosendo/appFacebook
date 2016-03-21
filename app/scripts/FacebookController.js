/* global FB */
(function() {
    'use strict'
    angular
        .module('app.facebook')
        .controller('SpamController', SpamController);

    SpamController.$inject = ['$scope', '$timeout', '$window', 'imgurUploadService'];

    function SpamController($scope, $timeout, $window, imgurUploadService) {
        var vm = this;

        vm.listGroups = [];

        vm.usuariologado = "Nenhum Usuario Logado";
        vm.checkLoginState = checkLoginState;
        vm.SendMessage = SendMessage;
        vm.countSelectedGroups = countSelectedGroups;
        vm.upload = upload;

        function countSelectedGroups() {
            return vm.listGroups.filter(function(x) {
                return x.select;
            }).length || 0;
        }

        function SendMessage() {
            var params = {
                id: 0,
                dados: {
                    message: 'TResteatadfadfadfadfadf',
                    description: 'Teste Description',
                    access_token: vm.response.authResponse.accessToken,
                    url: vm.imgLink
                }
            };

            var selectedGroups = vm.listGroups.filter(function(x) {
                return x.select;
            });

            for (var x = 0, ln = selectedGroups.length; x < ln; x++) {
                vm.sending = true;
                setTimeout(function(y) {
                    params.id = selectedGroups[y].id;

                    FB.api('/' + params.id + '/photos', 'post', {
                        'message': 'Testando isso aqui',
                        'url': 'http://i.imgur.com/SYTMXQ2.jpg'
                    }, function(response) {
                        $timeout(function() {
                            selectedGroups[y].done = !response.error;
                        });
                    });
                    console.log("%d => %s", y, selectedGroups[y].name);
                }, x * 10000, x);
            }

            vm.sending = false;
        }

        function statusChangeCallback(response) {
            if (response.status === 'connected') {
                vm.response = response;
                GetInformation();
            } else {
                vm.usuariologado = "Entre no seu facebook"
            }
        }

        function checkLoginState() {
            $timeout(function() {
                FB.getLoginStatus(function(response) {
                    statusChangeCallback(response);
                });
            });
        }

        $window.fbAsyncInit = function() {
            FB.init({
                appId: '1578396682448127',
                cookie: true, // enable cookies to allow the server to access
                // the session
                xfbml: true, // parse social plugins on this page
                version: 'v2.2' // use version 2.2
            });


            FB.getLoginStatus(function(response) {
                statusChangeCallback(response);
            });

        };

        // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        function GetInformation() {
            FB.api('/me', function(response) {
                vm.usuariologado = response.name;

                FB.api('/me/groups', function(response) {
                    if (response && !response.error) {
                        $timeout(function() {
                            vm.listGroups = response.data;
                        });
                    }
                });
            });
        }

        function upload(element) {
            var success = function(result) {
                vm.sendingImage = false;
                vm.imageSended = true;
                vm.imgLink = result.data.link;
            };

            var error = function(err) {
                vm.sendingImage = false;
                vm.imageSended = false;
                vm.error = err;
            };

            vm.sendingImage = true;
            vm.imageSended = false;
            vm.error = false;
            vm.selectedImage = element.files[0];
            imgurUploadService
                .upload(vm.selectedImage)
                .then(success, error);
        };
    }
}())