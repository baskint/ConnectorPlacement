/**
 * Created by baskint on 9/18/2014.
 */
'use strict';

'use strict';

app.directive('connectorTabs', function () {
  return {
    restrict: 'E',
    scope: {},
    controller: function($scope) {
      // TODO: common functions
    }
  }
}).directive('connectorSourceSide', function () {

  return {
    require: '^connectorTabs',
    restrict: 'A',
    scope: '=',
    templateUrl: '../public/templates/_ConnectorPlacementSourceSide.html'

  }
}).directive('connectorTapSide', function () {

  return {
    require: '^connectorTabs',
    restrict: 'A',
    scope: '=',
    templateUrl: '../public/templates/_ConnectorPlacementTapSide.html'

  }
});
