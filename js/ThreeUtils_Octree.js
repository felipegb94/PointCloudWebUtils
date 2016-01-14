
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
    Octree.add(MeshObject,{ usesFaces:true });
    Octree.update();
    console.log(MeshGeometry);
    console.log(MeshObject);
    console.log(Octree);



    var boundingBox = MeshGeometry.boundingBox;
    console.log(boundingBox);
    var min = boundingBox.min;
    var max = boundingBox.max;
    var center = boundingBox.center();
    var currPoint = new THREE.Vector3(0,0,0);
    var direction = new THREE.Vector3(0,0,0);
    var directionMin = new THREE.Vector3(0,0,0);
    var directionMax = new THREE.Vector3(0,0,0);

    var intersect;
    var intersectMin;
    var intersectMax;

    var raycaster = new THREE.Raycaster();
    var raycasterMin = new THREE.Raycaster();
    var raycasterMax = new THREE.Raycaster();

    var dr = parseFloat($("#deltaR").val());
    console.log(dr);
    var wrongPoint = 0;
    var pointCounter = 0;

    var dirX = center.x;
    var dirY = center.y;
    var dirZ = center.z;
    var dirMinX = min.x;
    var dirMinY = min.y;
    var dirMinZ = min.z;
    var dirMaxX = max.x;
    var dirMaxY = max.y;
    var dirMaxZ = max.z;

    direction.setX(dirX);
    direction.setY(dirY);
    direction.setZ(dirZ);
    directionMin.setX(dirMinX);
    directionMin.setY(dirMinY);
    directionMin.setZ(dirMinZ);
    directionMax.setX(dirMaxX);
    directionMax.setY(dirMaxY);
    directionMax.setZ(dirMaxZ);

    // IMPORTANT!! We have to normalize the direction in order for raycaster to work! 
    direction.normalize();
    directionMin.normalize();
    directionMax.normalize();

    var octreeResults;
    var octreeResultsMin;

    currPoint = center;
    directionMin.setX(min.x - center.x);
    directionMin.setY(min.y - center.y);
    directionMin.setZ(min.z - center.z);  
    directionMin.normalize();

    // console.log("Center..")
    // console.log(currPoint); 
    // raycasterMin.set(currPoint, directionMin);
    // octreeResultsMin = Octree.search( raycasterMin.ray.origin, raycasterMin.ray.far, true, raycasterMin.ray.direction );
    // console.log("Octree Results..")
    // console.log(octreeResultsMin);
    // intersectMin = raycasterMin.intersectOctreeObjects( octreeResultsMin, true );
    // console.log("Intersect Results..")
    // console.log(intersectMin);

    // currPoint = min;
    // directionMin.setX(min.x);
    // directionMin.setY(min.y);
    // directionMin.setZ(min.z);  
    // directionMin.normalize();
    // console.log("Min..")
    // console.log(currPoint); 
    // raycasterMin.set(currPoint, directionMin);
    // octreeResultsMin = Octree.search( raycasterMin.ray.origin, raycasterMin.ray.far, true, raycasterMin.ray.direction );
    // console.log("Octree Results..")
    // console.log(octreeResultsMin);
    // intersectMin = raycasterMin.intersectOctreeObjects( octreeResultsMin );
    // console.log("Intersect Results..")
    // console.log(intersectMin);

    for(var i = min.x ; i <= max.x  ; i = i + dr)
    {
      currPoint.setX(i);
      dirX = center.x - i;
      dirMinX = min.x - i;
      direction.setX(dirX);
      directionMin.setX(dirMinX);

      for(var j = min.y ; j <= max.y ; j = j + dr)
      {
        currPoint.setY(j);
        dirY = center.y - j;
        dirMinY = min.y - j;
        direction.setY(dirY);
        directionMin.setY(dirMinY);

        for(var k = min.z ; k <= max.z ; k = k + dr)
        {

          currPoint.setZ(k);
          dirZ = center.z - k;
          dirMinZ = min.z - k;
          direction.setZ(dirZ);
          directionMin.setZ(dirMinZ);
          
          direction.normalize();
          directionMin.normalize();

          // Ray from point to center
          raycaster.set(currPoint, direction);
          raycasterMin.set(currPoint, directionMin);
          //raycasterMax.set(currPoint, directionMax);
          
          // octreeResults = Octree.search( raycaster.ray.origin, raycaster.ray.far, true, raycaster.ray.direction );
          // octreeResultsMin = Octree.search( raycasterMin.ray.origin, raycasterMin.ray.far, true, raycasterMin.ray.direction );
          // intersect = raycaster.intersectOctreeObjects( octreeResults, true );
          // intersectMin = raycasterMin.intersectOctreeObjects( octreeResultsMin, true );

          // Intersect from point to center
          intersect = raycaster.intersectObject(MeshObject, true);
          intersectMin = raycasterMin.intersectObject(MeshObject, true);
          //intersectMax = raycasterMax.intersectObject(MeshObject, true);

          if(   (intersect.length%2 == 1) 
             && (intersectMin.length%2 == 1) )
             //&& (intersectMax.length%2 == 1)       
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

    // var csv = VerticesToCSV(SolidCloudGeometry.vertices);
    // DownloadCSV(csv);
    InitScene(PCRenderer, PCScene, PCCamera, PCControls, PCAxisHelper);
    RenderPointCloud();

}








