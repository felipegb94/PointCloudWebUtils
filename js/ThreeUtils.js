
function InitScene(renderer, scene, camera, controls, axisHelper)
{
    console.log("Setting up the scene...");

    /* get the DOM element to attach to */
    /* assume we've got jQuery to hand */
    /* Create renderer*/
    renderer.autoClear = true;
    //renderer.setSize(window.innerWidth/2, window.innerHeight/2);
    renderer.setSize(WIDTH, HEIGHT);

    /* Create Camera */
    camera.position.set(7, 7, 7);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.position.z = 10;

    /* Create controls for the camera. This allows us to zoom in and rotate the camera. */
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 0.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    scene.add(axisHelper);
    scene.add(camera);

    console.log("End of setting up the scene");
}

function MeshToPC(MeshGeometry, MeshObject)
{
    console.log("MeshToPC applied to: " + CurrGeometry);
    MeshGeometry.computeBoundingBox();
    console.log(MeshGeometry);
    console.log(MeshObject);


    var boundingBox = MeshGeometry.boundingBox;
    console.log(boundingBox);
    var min = boundingBox.min;
    var max = boundingBox.max;
    var center = boundingBox.center();
    var currPoint = new THREE.Vector3(0,0,0);
    var direction = new THREE.Vector3(0,0,0);
    var directionOffCenter = new THREE.Vector3(0,0,0);
    var directionMin = new THREE.Vector3(0,0,0);

    var intersect;
    var intersectOffCenter;
    var intersectMin;

    var raycaster = new THREE.Raycaster();
    var raycasterOffCenter = new THREE.Raycaster();
    var raycasterMin = new THREE.Raycaster();

    var dr = 0.1;
    var wrongPoint = 0;
    var pointCounter = 0;

    var dirX = 0;
    var dirY = 0;
    var dirZ = 0;
    var dirXMin = 0;
    var dirYMin = 0;
    var dirZMin = 0;

    for(var i = min.x ; i < max.x  ; i = i + dr)
    {
      currPoint.setX(i);
      dirX = center.x - i;
      dirXMin = min.x - i;
      direction.setX(dirX);
      directionOffCenter.setX(dirX + 0.0000001);
      directionMin.setX(dirXMin);

      for(var j = min.y ; j < max.y ; j = j + dr)
      {
        currPoint.setY(j);
        dirY = center.y - j;
        dirYMin = min.y - j;
        direction.setY(dirY);
        directionOffCenter.setY(dirY);
        directionMin.setY(dirYMin);

        for(var k = min.z ; k < max.z ; k = k + dr)
        {

          currPoint.setZ(k);
          dirZ = center.z - k;
          dirZMin = min.z - k;
          direction.setZ(dirZ);
          directionOffCenter.setZ(dirZ);
          directionMin.setZ(dirZMin);

          // IMPORTANT!! We have to normalize the direction in order for raycaster to work! 
          direction.normalize();
          directionOffCenter.normalize();
          directionMin.normalize();

          // Ray from point to center
          raycaster.set(currPoint, direction);
          // Ray from point to off center
          raycasterOffCenter.set(currPoint, directionOffCenter);
          raycasterMin.set(currPoint, directionMin);

          // Intersect from point to center
          intersect = raycaster.intersectObject(MeshObject, true);
          // Intersect from point to off center
          intersectOffCenter = raycasterOffCenter.intersectObject(MeshObject, true);
          intersectMin = raycasterMin.intersectObject(MeshObject, true);

          if((intersect.length%2 == 1) && 
             (intersectOffCenter.length%2 == 1) && 
             (intersectMin.length%2 == 1) )
          {
            var pointToAdd = new THREE.Vector3(currPoint.x,currPoint.y,currPoint.z);
            SolidCloudGeometry.vertices.push(pointToAdd);
            pointCounter++;
            console.log(currPoint);
          }

        }    
      }
    }
    console.log("Total Number of Points: ");
    console.log(pointCounter);

    var csv = VerticesToCSV(SolidCloudGeometry.vertices);
    DownloadCSV(csv);
    InitScene(PCRenderer, PCScene, PCCamera, PCControls, PCAxisHelper);
    RenderPointCloud();

}








