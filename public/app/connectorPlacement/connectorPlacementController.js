/**
 * Created by baskint on 9/18/2014.
 */

'use strict';

app.controller('ConnectorPlacementController', ['$scope', 'connectorPlacementRepository',  '$location', '$timeout',
  function ($scope, connectorPlacementRepository, psdaSignalRSvc, $location, $timeout) {
    connectorPlacementRepository.getConnectorPlacement($scope).then(function (connectorPlacement) {

      $scope.connectorPlacement = connectorPlacement;

      $scope.$emit('UNLOAD');

      $scope.connectorDelete = true;
      $scope.selectedConnectorId = 0;

      if ($scope.connectorPlacement.placedConnectors.length > 0 ) {

        $timeout(function () {
          for (var i = 0; i < $scope.connectorPlacement.placedConnectors.length; i++) {
            placeConnector($scope.connectorPlacement.placedConnectors[i]);
          }
        }, 500);
      }
    });

    $scope.dropped = function (dragEl, dropEl, tab) {
      var drag = angular.element(dragEl);
      var drop = angular.element(dropEl);
      var connId = drag.children(0).prop('id');
      var alreadyPlaced = checkForPreviousPlacement(connId);
      var placedConnector = null;

      var dropParent = drop.parent();

      // happens on the connector-container area - move from source to the container
      if (dropParent.hasClass('ng-scope') === false && !alreadyPlaced) {

        for (var i = 0; i < $scope.connectorPlacement.sourceConnectors.length; i++) {
          if ($scope.connectorPlacement.sourceConnectors[i].id === connId) {
            // create a placed connector
            placedConnector = {
              "id": connId,
              "type": $scope.connectorPlacement.sourceConnectors[i].type,
              "size": $scope.connectorPlacement.sourceConnectors[i].size,
              "label": $scope.connectorPlacement.sourceConnectors[i].label,
              "locationId": drop.prop('id')
            }
            $scope.connectorPlacement.placedConnectors.push(placedConnector);
          }
        }

        for (var j = 0; j < $scope.connectorPlacement.tapConnectors.length; j++) {
          if ($scope.connectorPlacement.tapConnectors[j].id === connId) {
            // create a placed connector
            placedConnector = {
              "id": connId,
              "type": $scope.connectorPlacement.tapConnectors[j].type,
              "size": $scope.connectorPlacement.tapConnectors[j].size,
              "label": $scope.connectorPlacement.tapConnectors[j].label,
              "locationId": drop.prop('id')
            }
            $scope.connectorPlacement.placedConnectors.push(placedConnector);
          }
        }

        drop.attr('style', 'display:none');
        drag.parent().children(0).removeAttr('style');
        dropParent.append(dragEl);

        // happens when the connector moved within the container-drop area
      } else if (!dropParent.hasClass('ng-scope') && alreadyPlaced) {
        // update the new location
        for (var i = 0; i < $scope.connectorPlacement.placedConnectors.length; i++) {
          if ($scope.connectorPlacement.placedConnectors[i].id === connId) {
            $scope.connectorPlacement.placedConnectors[i].locationId = drop.prop('id');
          }

        }
        drop.attr('style', 'display:none');
        drag.parent().children(0).removeAttr('style');
        dropParent.append(dragEl);
        //  happens on the source-container from the  container area
      } else {
        drag.parent().children(0).removeAttr('style');
        drop.append(dragEl);
        for (var i = 0; i < $scope.connectorPlacement.sourceConnectors.length; i++) {
          if ($scope.connectorPlacement.sourceConnectors[i].id === connId) {
            // remove the connector
            $scope.connectorPlacement.placedConnectors.splice(i, 1);
          }
        }

        for (var j= 0; j < $scope.connectorPlacement.tapConnectors.length; j++) {
          if ($scope.connectorPlacement.tapConnectors[j].id === connId) {
            // remove the connector
            $scope.connectorPlacement.placedConnectors.splice(j, 1);
          }
        }
      }
      console.log("Number of placed Connectors: " + $scope.connectorPlacement.placedConnectors.length);
    }

    $scope.connectorClicked = function (connId) {
      if (connId === $scope.selectedConnectorId) {
        $scope.selectedConnectorId = 0;
        $scope.connectorDelete = true;
      } else {
        $scope.selectedConnectorId = connId;
        $scope.connectorDelete = false;
      }
    }

    $scope.deleteConnector = function () {
      if ($scope.selectedConnectorId !== 0) {
        for (var i = 0; i < $scope.connectorPlacement.sourceConnectors.length; i++) {
          if ($scope.connectorPlacement.sourceConnectors[i].id === $scope.selectedConnectorId) {
            $scope.connectorPlacement.sourceConnectors.splice(i, 1); // yank the element
          }
        }
        for (var j = 0; j < $scope.connectorPlacement.tapConnectors.length; j++) {
          if ($scope.connectorPlacement.tapConnectors[j].id === $scope.selectedConnectorId) {
            $scope.connectorPlacement.tapConnectors.splice(j, 1); // yank the element
          }
        }
        $scope.connectorDelete = true;
      }
    }

    $scope.addConnector = function (sideType) {
      $scope.selectedConnectorId = 0;
      connectorPlacementRepository.addConnector($scope, sideType);
    }

    $scope.save = function () {

      var jsonString = JSON.stringify($scope.connectorPlacement.placedConnectors);
      console.log(jsonString);
      connectorPlacementRepository.save(jsonString).then(function () {
        $location.url('/CabinetandControls');
      });
    };

    //#region helper methods
    function checkForPreviousPlacement(connId) {
      for (var i = 0; i < $scope.connectorPlacement.placedConnectors.length; i++) {
        if ($scope.connectorPlacement.placedConnectors[i].id === connId) {
          return true;
        }
      }
      return false;
    }

    function placeConnector(connector) {
      var source = document.getElementById(connector.id);
      var destination = document.getElementById(connector.locationId);

      var drop = angular.element(destination);
      drop.attr('style', 'display:none');
      var drag = angular.element(source);

      drag.parent().children(0).removeAttr('style');

      var outsource = document.getElementById(connector.id).parentNode;
      var dropParent = drop.parent();
      dropParent.append(outsource);
    }

    //#endregion

  }]);
