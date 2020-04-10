const autoPlayLoop = function () {
  const instance = window.Runner.instance_;
  // always adjust the jump speed based on the current frame speed
  const JUMP_SPEED = instance.currentSpeed * 9;
  // the distance from the next obstacle
  const DISTANCE_BEFORE_JUMP = 120;
  const tRex = instance.tRex;
  const tRexPos = tRex.xPos;
  const obstacles = instance.horizon.obstacles;
  const nextObstacle = obstacles.find((o) => o.xPos > tRexPos);
  instance.horizon.updateObstacles = function (deltaTime, currentSpeed) {
    // obstacles, move to Horizon layer.
    var updatedObstacles = this.obstacles.slice(0);
    for (var i = 0; i < this.obstacles.length; i++) {
      var obstacle = this.obstacles[i];
      obstacle.update(deltaTime, currentSpeed);
      // clean up existing obstacles.
      if (obstacle.remove) {
        updatedObstacles.shift();
        if (tRex.ducking) {
          tRex.setDuck(false);
        }
      }
    }
    this.obstacles = updatedObstacles;

    if (this.obstacles.length > 0) {
      var lastObstacle = this.obstacles[this.obstacles.length - 1];

      if (
        lastObstacle &&
        !lastObstacle.followingObstacleCreated &&
        lastObstacle.isVisible() &&
        lastObstacle.xPos + lastObstacle.width + lastObstacle.gap <
          this.dimensions.WIDTH
      ) {
        this.addNewObstacle(currentSpeed);
        lastObstacle.followingObstacleCreated = true;
      }
    } else {
      // create new obstacles.
      this.addNewObstacle(currentSpeed);
    }
  }.bind(instance.horizon);

  if (tRex.jumping || tRex.ducking) {
    requestAnimationFrame(autoPlayLoop);
    return;
  }

  if (nextObstacle && nextObstacle.xPos - tRexPos <= DISTANCE_BEFORE_JUMP) {
    // if the obstacle is Pterodactyl and it's in the middle-air
    if (
      nextObstacle.typeConfig.type === "PTERODACTYL" &&
      nextObstacle.yPos !== 100
    ) {
      tRex.setDuck(true);
    } else {
      tRex.startJump(JUMP_SPEED);
    }
  }
  requestAnimationFrame(autoPlayLoop);
};
requestAnimationFrame(autoPlayLoop);
