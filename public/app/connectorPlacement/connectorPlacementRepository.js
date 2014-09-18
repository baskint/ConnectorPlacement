/**
 * Created by baskint on 9/18/2014.
 */


'use strict';
app.factory('connectorPlacementRepository', function ($http, $q, uuid) {
  return {
    getConnectorPlacement: function ($scope) {
      $scope.$emit('LOAD');
      var deferred = $q.defer();

      $http.get('/api/PSDAConnectorPlacement').success(deferred.resolve).error(deferred.reject);

      return deferred.promise;
    },

    addConnector: function ($scope, sideType) {
      var connector = null;
      if (sideType === "source") {
        connector = {
          "id": uuid.new(),
          "type": $scope.connectorPlacement.sourceConnectorType,
          "size": $scope.connectorPlacement.sourceConnectorSize,
          "label": $scope.connectorPlacement.sourceConnectorLabel

        }
        $scope.connectorPlacement.sourceConnectors.push(connector);
      } else if (sideType === "tap") {
        connector = {
          "id": uuid.new(),
          "type": $scope.connectorPlacement.tapConnectorType,
          "size": $scope.connectorPlacement.tapConnectorSize,
          "label": $scope.connectorPlacement.tapConnectorLabel

        }
        $scope.connectorPlacement.tapConnectors.push(connector);
      }

    },

    save: function (data) {
      var deferred = $q.defer();
      var rootSeg = getRootUrlAppBpaf();
      $http({
        url: rootSeg + '/api/PSDAConnectorPlacement',
        dataType: 'json',
        method: 'POST',
        data: data,
        contentType: "application/json"
      }).success(function () {
        deferred.resolve();
      }).error(function (e) {
        //  console.log(e);
        deferred.reject("Server Error!");
      });
      return deferred.promise;
    }

  }
});

