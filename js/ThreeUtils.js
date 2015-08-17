
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
    var offCenter2 = new THREE.Vector3(center.x+0.00000001,center.y,center.z);

    var currPoint = new THREE.Vector3(0,0,0);
    var direction1 = new THREE.Vector3(0,0,0);
    var direction2 = new THREE.Vector3(0,0,0);
    var direction2OffCenter = new THREE.Vector3(0,0,0);
    var direction2OffCenter2 = new THREE.Vector3(0,0,0);

    var intersect1;
    var intersect2;
    var intersect3;
    var intersect4;
    var intersect4OffCenter;
    var intersect4OffCenter2;

    var raycaster1 = new THREE.Raycaster();
    var raycaster2 = new THREE.Raycaster();
    var raycaster3 = new THREE.Raycaster();
    var raycaster4 = new THREE.Raycaster();
    var raycaster4OffCenter = new THREE.Raycaster();
    var raycaster4OffCenter2 = new THREE.Raycaster();


    var noLoops = true;
    var multipleLoops = false;
    var dr = 0.07;
    var sum2Count = 0;
    var wrongPoint = 0;
    var pointCounter = 0;

    for(var i = min.x - 0.00000001; i < max.x + 0.00000001 ; i = i + dr)
    {
      for(var j = min.y - 0.00000001; j < max.y + 0.00000001; j = j + dr)
      {
        for(var k = min.z - 0.00000001; k < max.z + 0.00000001; k = k + dr)
        {
          currPoint = new THREE.Vector3(i,j,k);
          /* From center to point */
          direction1.set(i - center.x, j - center.y, k - center.z);
          /* From point to center */
          direction2.set(center.x - i, center.y - j, center.z - k);
          /* From point to offCenter */    
          direction2OffCenter.set(offCenter.x - i, offCenter.y - j, offCenter.z - k);
          direction2OffCenter2.set(offCenter2.x - i, offCenter2.y - j, offCenter2.z - k);

          // IMPORTANT!! We have to normalize the direction in order for raycaster to work! 
          direction1.normalize();
          direction2.normalize();
          direction2OffCenter.normalize();
          direction2OffCenter2.normalize();

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
          raycaster4OffCenter2.set(currPoint, direction2OffCenter);

          // Intersect from center to point
          intersect1 = raycaster1.intersectObject(MeshObject, true);
          // Intersect from center to opposite to point
          intersect2 = raycaster2.intersectObject(MeshObject, true);
          // Intersect from point to away from center
          intersect3 = raycaster3.intersectObject(MeshObject, true);
          // Intersect from point to center
          intersect4 = raycaster4.intersectObject(MeshObject, true);
          // Intersect from point to off center
          intersect4OffCenter = raycaster4OffCenter.intersectObject(MeshObject, true);
          intersect4OffCenter2 = raycaster4OffCenter.intersectObject(MeshObject, true);

          if((intersect4.length%2 == 1) && 
             (intersect4OffCenter.length%2 == 1))
          {
            SolidCloudGeometry.vertices.push(currPoint);
            if(CurrGeometry == "Sphere" && currPoint.distanceTo(center) > 1)
            {
                console.log("Adding wrong point to sphere geometry");
                wrongPoint = wrongPoint+1;
                console.log(currPoint.distanceTo(center));
            }
          }
          // else if(!noLoops && )
          // {

          // }
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

    console.log(intersect1);
    console.log(intersect2);
    console.log(intersect3);
    console.log(intersect4);
    console.log(intersect4OffCenter);

    InitScene(PCRenderer, PCScene, PCCamera, PCControls, PCAxisHelper);
    RenderPointCloud();

}








