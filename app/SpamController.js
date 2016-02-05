/* global FB */
(function() {
    'use strict'
    angular
        .module('app')
        .controller('SpamController', SpamController);

    SpamController.$inject = ['$scope', '$timeout', '$window', 'FacebookService'];

    function SpamController($scope, $timeout, $window, FacebookService) {
        var vm = this;

        vm.lista = [];

        vm.listaSelecionados = [];
        vm.usuariologado = "Nenhum Usuario Logado";
        vm.checkLoginState = checkLoginState;
        vm.SegundaEtapa = SegundaEtapa;
        vm.EnviarSpam = EnviarSpam;
        vm.atualizarDados = atualizarDados;
        vm.isPrimeiraEtapa = true;
        vm.progresso = 0;

        function atualizarDados(link) {
            console.log("Atualizar");
            vm.hasImage = true;
            vm.link = link;
        }

        function SegundaEtapa() {
            vm.listaSelecionados = vm.lista.filter(function(x) {
                return x.checked == true;
            });
            vm.isPrimeiraEtapa = false;

        }

        function EnviarSpam() {
            console.log("a", vm.link);
            var params = {
                id: 0,
                dados: {
                    message: vm.Mensagem,
                    access_token: vm.response.authResponse.accessToken,
                    url: vm.link
                }
            };

            console.log("Face", FacebookService.methods);

            for (var x = 0, ln = vm.listaSelecionados.length; x < ln; x++) {
                setTimeout(function(y) {
                    params.id = vm.listaSelecionados[y].id;

                    FB.api('/' + params.id + '/photos', 'post', params.dados, function(response) {
                        vm.listaSelecionados[y] = !response.error;
                    });


                    console.log("%d => %s", y, vm.listaSelecionados[y].name);
                    atualizarProgresso(y + 1, ln);
                }, x * 50000, x);
            }
        }

        function atualizarProgresso(percent, total) {
            var porcentagem = percent === 0 ? 0 : ((percent / total) * 100)
            $timeout(function() {
                vm.progresso = porcentagem;
            });
        }

        function statusChangeCallback(response) {
            console.log('statusChangeCallback');
            console.log(response);
            if (response.status === 'connected') {
                vm.response = response;
                console.log("Response", vm.response);
                testAPI();
            } else if (response.status === 'not_authorized') {
                vm.usuariologado = 'Please log ' +
                    'into this app.';
            } else {

                vm.usuariologado = 'Please log ' +
                    'into Facebook.';
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

        function testAPI() {
            console.log('Welcome!  Fetching your information.... ');

            FB.api('/me', function(response) {
                console.log('Successful login for: ' + response.name);

                $timeout(function() {
                    vm.usuariologado = 'Thanks for logging in, ' + response.name + '!';
                });

                console.log("vm", vm);

                FB.api('/me/groups', function(response) {
                    console.log("groups", response);
                    if (response && !response.error) {
                        $timeout(function() {
                            vm.lista = response.data;
                        });

                    }
                });
            });
        }
    }
}())