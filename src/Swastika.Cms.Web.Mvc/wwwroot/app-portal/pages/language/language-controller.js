﻿'use strict';
app.controller('LanguageController', ['$scope', '$rootScope', '$routeParams', '$timeout', '$location', 'authService', 'LanguageServices',
    function ($scope, $rootScope, $routeParams, $timeout, $location, authService, languageServices) {
        $scope.request = {
            pageSize: '10',
            pageIndex: 0,
            status: $rootScope.swStatus[1],
            orderBy: 'CreatedDateTime',
            direction: '1',
            fromDate: null,
            toDate: null,
            keyword: ''
        };
        $scope.languageFile = {
            file: null,
            fullPath: '',
            folder: 'Language',
            title: '',
            description: ''
        };
        $scope.dataTypes = $rootScope.configurations.dataTypes;
        $scope.activedLanguage = null;
        $scope.relatedLanguages = [];
        $rootScope.isBusy = false;
        $scope.data = {
            pageIndex: 0,
            pageSize: 1,
            totalItems: 0,
        };
        $scope.errors = [];

        $scope.range = function (max) {
            var input = [];
            for (var i = 1; i <= max; i += 1) input.push(i);
            return input;
        };
        $scope.initEditors = function () {
            $rootScope.initEditor();
        }
        $scope.getLanguage = async function (id) {
            $rootScope.isBusy = true;
            var resp = await languageServices.getLanguage(id, 'be');
            if (resp && resp.isSucceed) {
                $scope.activedLanguage = resp.data;
                $rootScope.initEditor();
                $scope.$apply();
            }
            else {
                if (resp) { $rootScope.showErrors(resp.errors); }
                $scope.$apply();
            }
        };
        $scope.loadLanguage = async function () {
            $rootScope.isBusy = true;
            var id = $routeParams.id;
            var response = await languageServices.getLanguage(id, 'be');
            if (response.isSucceed) {
                $scope.activedLanguage = response.data;
                $rootScope.initEditor();
                $scope.$apply();
            }
            else {
                $rootScope.showErrors(response.errors);
                $scope.$apply();
            }
        };

        $scope.loadLanguages = async function (pageIndex) {
            if (pageIndex != undefined) {
                $scope.request.pageIndex = pageIndex;
            }

            var resp = await languageServices.getLanguages($scope.request);
            if (resp && resp.isSucceed) {

                $scope.data = resp.data;
                $.each($scope.data.items, function (i, language) {

                    $.each($scope.activedLanguages, function (i, e) {
                        if (e.languageId == language.id) {
                            language.isHidden = true;
                        }
                    })
                });
                $scope.$apply();
            }
            else {
                if (resp) { $rootScope.showErrors(resp.errors); }
                $scope.$apply();
            }
        };

        $scope.removeLanguage = function (id) {
            $rootScope.showConfirm($scope, 'removeLanguageConfirmed', [id], null, 'Remove Language', 'Are you sure');
        }

        $scope.removeLanguageConfirmed = async function (id) {
            var result = await languageServices.removeLanguage(id);
            if (result.isSucceed) {
                $scope.loadLanguages();
            }
            else {
                $rootScope.showMessage('failed');
                $scope.$apply();
            }
        }

        $scope.saveLanguage = async function (language) {
            language.content = $('.editor-content').val();
            language.dataType = language.property.dataType;
            var resp = await languageServices.saveLanguage(language);
            if (resp && resp.isSucceed) {
                $scope.activedLanguage = resp.data;
                $rootScope.showMessage('Thành công', 'success');
                $rootScope.isBusy = false;
                $scope.$apply();
            }
            else {
                if (resp) { $rootScope.showErrors(resp.errors); }
                $scope.$apply();
            }
        };

    }]);
