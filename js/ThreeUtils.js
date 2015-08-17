
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
    console.log("SolidCloudGeometry");
    console.log(SolidCloudGeometry);

    console.log(MeshGeometry);
    console.log(MeshObject);

    var boundingBox = MeshGeometry.boundingBox;
    console.log(boundingBox);
    var min = boundingBox.min;
    var max = boundingBox.max;
    var center = boundingBox.center();
    var offCenter = new THREE.Vector3(center.x,center.y,center.z+0.00000001);

    var currPoint = new THREE.Vector3(0,0,0);
    var direction1 = new THREE.Vector3(0,0,0);
    var direction2 = new THREE.Vector3(0,0,0);
    var direction2OffCenter = new THREE.Vector3(0,0,0);

    var intersect1;
    var intersect2;
    var intersect3;
    var intersect4;
    var intersect4OffCenter;

    var raycaster1 = new THREE.Raycaster();
    var raycaster2 = new THREE.Raycaster();
    var raycaster3 = new THREE.Raycaster();
    var raycaster4 = new THREE.Raycaster();
    var raycaster4OffCenter = new THREE.Raycaster();


    var noLoops = true;
    var multipleLoops = false;
    var dr = 0.05;
    var sum2Count = 0;
    var wrongPoint = 0;
    var pointCounter = 0;

    for(var i = min.x-0.0005; i < max.x-0.0005; i = i + dr)
    {
      for(var j = min.y-0.0005; j < max.y-0.0005; j = j + dr)
      {
        for(var k = min.z-0.0005; k < max.z-0.0005; k = k + dr)
        {
          currPoint = new THREE.Vector3(i,j,k);
          /* From center to point */
          direction1.set(i - center.x, j - center.y, k - center.z);
          /* From point to center */
          direction2.set(center.x - i, center.y - j, center.z - k);
          /* From point to offCenter */    
          direction2OffCenter.set(offCenter.x - i, offCenter.y - j, offCenter.z - k);

          // IMPORTANT!! We have to normalize the direction in order for raycaster to work! 
          direction1.normalize();
          direction2.normalize();
          direction2OffCenter.normalize();

          // Cast rays from center to point
          raycaster1.set(center, direction1);
          // Ray from center to opposite point
          raycaster2.set(center, direction2);
          // Ray from point to away from center
          raycaster3.set(currPoint, direction1);
          // Ray from point to center
          raycaster4.set(currPoint, direction2);
          // Ray from point to off center
          raycaster4OffCenter.set(currPoint, direction2OffCenter);

          intersect1 = raycaster1.intersectObject(MeshObject);
          intersect2 = raycaster2.intersectObject(MeshObject);
          intersect3 = raycaster3.intersectObject(MeshObject);
          intersect4 = raycaster4.intersectObject(MeshObject);
          intersect4OffCenter = raycaster4OffCenter.intersectObject(MeshObject);

          /**
           * Recall: direction1 is from center to point and direction2 is from point to center
           * If point is inside mesh and center is inside
           *     intersect1.length === intersect2.length
           * If point is outside mesh and center is inside
           *     intersect1.length+1 === intersect2.length  
           * If point is outside mesh and center is outside mesh
           *     intersect1.length === intersect2.length
           * If point is inside mesh and center is outside mesh
           *     intersect1.length+1 === intersect2.length
           *     
           * If center is inside mesh and no closed loops
           *     intersect1.length == 0
           * If point is inside mesh and no closed loops
           *     intersect1.length == 0
           *     intersect2.length == 0
           * If point is outside mesh and no closed loops
           *     intersect1.length == 0
           *     intersect2.length == 1
           */
          var sum = intersect1.length+intersect2.length;//+intersect3.length;
          if((intersect1.length==0 && intersect4.length==0 && intersect4OffCenter.length==0) && (noLoops))
          {
            //console.log(currPoint);

            SolidCloudGeometry.vertices.push(currPoint);
            if(CurrGeometry == "Sphere" && currPoint.distanceTo(center) > 1)
            {
                console.log("Adding wrong point to sphere geometry");
                wrongPoint = wrongPoint+1;
                console.log(currPoint.distanceTo(center));
            }
          }
          // else
          // {
          //   if(intersect2.length == 1 && intersect1.length == 0)
          //   {
          //       console.log("intersect2 == 1");
          //       console.log(currPoint.distanceTo(center));
          //       SolidCloudGeometry.vertices.push(currPoint);

          //   }

          //   if((intersect1.length==1 && intersect3.length==0 && intersect4.length==0) || 
          //      (intersect1.length==1 && intersect2.length==1 && intersect3.length==0 && intersect4.length==1)) 
          //   {
          //       console.log("Adding fluid point");
          //       PointCloudGeometry.vertices.push(currPoint);
          //   }
          //   else if((intersect1.length%2==0 && intersect3.length%2==1 && intersect4.length%2==0) ||
          //       (intersect1.length%2==0 && intersect3.length%2==0 && intersect4.length%2==1)
          //       )
          //   {
          //       console.log("Adding solid point");
          //       SolidCloudGeometry.vertices.push(currPoint);

          //   }

          // }
          pointCounter++;

        }    
      }
    }
    console.log("Num of Possible points in box = ");
    console.log(pointCounter);
    console.log("sum2 = ");
    console.log(sum2Count);
    console.log("wrong count = ");
    console.log(wrongPoint);

    InitScene(PCRenderer, PCScene, PCCamera, PCControls, PCAxisHelper);
    RenderPointCloud();

}








