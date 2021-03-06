'use strict';
app.controller('AppPortalController', ['$rootScope', '$scope', 'ngAppSettings', '$location'
    , 'CommonService', 'AuthService', 'TranslatorService', 'GlobalSettingsService', 'RoleService',
    function ($rootScope, $scope, ngAppSettings, $location, commonService, authService, translatorService, configurationService, roleServices) {
        $scope.isInit = false;
        $scope.pageTagName ='';
        $scope.pageTagTypeName ='';
        $scope.pageTagType =0;
        $scope.isAdmin = false;
        $scope.translator = translatorService;
        $scope.configurationService = configurationService;
        $scope.lang = '';
        $scope.settings = {};
        $scope.init = function () {            
            if (!$rootScope.isBusy) {
                $rootScope.isBusy = true;
                $rootScope.configurationService.fillGlobalSettings().then(function (response) {
                    $scope.isInit = true;
                    $rootScope.isInit = true;
                    $rootScope.globalSettings = response;
                    ngAppSettings.globalSettings = response;

                    if ($rootScope.globalSettings) {
                        $rootScope.translator.fillTranslator($rootScope.globalSettings.lang).then(function () {

                            commonService.fillSettings().then(function (response) {

                                authService.fillAuthData().then(function (response) {
                                    $rootScope.authentication = authService.authentication;
                                    if (authService.authentication && authService.authentication.isAuth) {
                                        $scope.isAdmin = authService.authentication.isAdmin;
                                        if (!$scope.isAdmin) {

                                            roleServices.getPermissions().then(function (response) {

                                                if (response && response.isSucceed) {

                                                    $scope.isInit = true;
                                                    $scope.roles = response.data;
                                                    $rootScope.isBusy = false;
                                                    $scope.$apply();
                                                }
                                            });
                                        }
                                    }
                                    else {
                                        window.top.location.href = '/init/login';
                                    }
                                });
                                $rootScope.isBusy = false;
                                $scope.$apply();
                            });
                        });

                    } else {
                        window.top.location.href = '/init/login';
                    }
                });
            }
        };
        $scope.$on('$routeChangeStart', function($event, next, current) { 
            // ... you could trigger something here ...
            $scope.pageTagName =$location.$$path.toString().split('/')[2];
            $scope.pageTagTypeName =$location.$$path.toString().split('/')[3];
            if($scope.pageTagTypeName == 'list') $scope.pageTagType =0;
            if($scope.pageTagTypeName == 'create') $scope.pageTagType =1;
          });
        $rootScope.limString = function(str, max){
            return str.substring(0, max);
        };
    }]);
