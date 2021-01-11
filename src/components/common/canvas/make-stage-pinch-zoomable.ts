import Konva from "konva";

export const makeStagePinchZoomable = (stage: Konva.Stage): void => {
    var lastCenter = null;
    var lastDist = 0;

    stage.on('touchmove', (e) => {
      e.evt.preventDefault();
      var touch1 = e.evt.touches[0];
      var touch2 = e.evt.touches[1];

      if (touch1 && touch2) {
        // if the stage was under Konva's drag&drop
        // we need to stop it, and implement our own pan logic with two pointers
        if (stage.isDragging()) {
          stage.stopDrag();
        }

        var p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        };
        var p2 = {
          x: touch2.clientX,
          y: touch2.clientY,
        };

        if (!lastCenter) {
          lastCenter = getCenter(p1, p2);
          return;
        }
        var newCenter = getCenter(p1, p2);

        var dist = getDistance(p1, p2);

        if (!lastDist) {
          lastDist = dist;
        }

        // local coordinates of center point
        var pointTo = {
          x: (newCenter.x - stage.x()) / stage.scaleX(),
          y: (newCenter.y - stage.y()) / stage.scaleX(),
        };

        var scale = stage.scaleX() * (dist / lastDist);

        stage.scaleX(scale);
        stage.scaleY(scale);

        // calculate new position of the stage
        var dx = newCenter.x - lastCenter.x;
        var dy = newCenter.y - lastCenter.y;

        var newPos = {
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy,
        };

        stage.position(newPos);
        stage.batchDraw();

        lastDist = dist;
        lastCenter = newCenter;
      }
    });

    stage.on('touchend', function () {
      lastDist = 0;
      lastCenter = null;
    });
};

const getDistance = (p1, p2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

const getCenter = (p1, p2) => ({
  x: (p1.x + p2.x) / 2,
  y: (p1.y + p2.y) / 2,
});
