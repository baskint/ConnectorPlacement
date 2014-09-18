/**
 * Created by baskint on 9/18/2014.
 */

var module = angular.module("cp.dragdrop", ['cp.services']);

module.directive('cpDraggable', ['$rootScope', 'uuid', function ($rootScope, uuid) {
  return {
    restrict: 'A',
    link: function (scope, el, attrs, controller) {
      angular.element(el).attr("draggable", "true");

      var id = angular.element(el).attr("id");
      if (!id) {
        id = uuid.new();
        angular.element(el).attr("id", id);
      }

      el.bind("dragstart", function (e) {
        e.dataTransfer = e.originalEvent.dataTransfer;
        e.dataTransfer.setData('text', id);

        $rootScope.$emit("PD-DRAG-START");
      });

      el.bind("dragend", function (e) {
        $rootScope.$emit("PD-DRAG-END");
      });
    }
  };
}]);

module.directive('pdDropTarget', ['$rootScope', 'uuid', function ($rootScope, uuid) {
  return {
    restrict: 'A',
    scope: {
      onDrop: '&'
    },
    link: function (scope, el, attrs, controller) {
      var id = angular.element(el).attr("id");
      if (!id) {
        id = uuid.new();
        angular.element(el).attr("id", id);
      }

      el.bind("dragover", function (e) {
        if (e.preventDefault) {
          e.preventDefault(); // Necessary. Allows us to drop.
        }

        if (e.target.children.length === 0 || e.target.hasAttributes('ngIf')) {
          e.dataTransfer = e.originalEvent.dataTransfer;
          e.dataTransfer.dropEffect = 'move';
        } else {
          e.dataTransfer.dropEffect = 'none';
        }
        return false;
      });

      el.bind("dragenter", function (e) {
        // this / e.target is the current hover target.

        if (angular.element(e.target).hasClass('actual-drop-zone')) {
          angular.element(e.target).addClass('pd-over');
        }

        var firstParent = angular.element(e.target);
        if (firstParent.hasClass('actual-drop-zone')) {
          firstParent.addClass('pd-over');
        }

        var secondParent = firstParent.parent();
        if (secondParent.hasClass('actual-drop-zone')) {
          secondParent.addClass('pd-over');
        }

        var thirdParent = secondParent.parent();
        if (thirdParent.hasClass('actual-drop-zone')) {
          thirdParent.addClass('pd-over');
        }
      });

      el.bind("dragleave", function (e) {
        angular.element(e.target).removeClass('pd-over');  // this / e.target is previous target element.
      });

      el.bind("drop", function (e) {
        if (e.preventDefault) {
          e.preventDefault(); // Necessary. Allows us to drop.
        }

        if (e.stopPropagation) {
          e.stopPropagation(); // Necessary. Allows us to drop.
        }
        e.dataTransfer = e.originalEvent.dataTransfer;
        var data = e.dataTransfer.getData("text");

        var dest = document.getElementById(id);
        var src = document.getElementById(data);


        scope.onDrop({ dragEl: src, dropEl: dest });
      });

      $rootScope.$on("PD-DRAG-START", function () {
        var el = document.getElementById(id);
        angular.element(el).addClass("pd-target");
      });

      $rootScope.$on("PD-DRAG-END", function () {
        var el = document.getElementById(id);
        angular.element(el).removeClass("pd-target");
        angular.element(el).removeClass("pd-over");

        // buffer code to clean up all pd-over elements in the document
        var elements = document.getElementsByClassName('pd-over');
        if (elements.length > 0) {
          for (var i = 0; i < elements.length; i++) {
            angular.element(elements[i]).removeClass('pd-over');
          }
        }
      });
    }
  };

}]);
