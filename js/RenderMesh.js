function RenderMesh()
{
    InitScene(MeshRenderer, MeshScene, MeshCamera, MeshControls, MeshAxisHelper);
    $MeshContainer.append(MeshRenderer.domElement);

    /* Sphere */
    //CurrGeometry = "Cube";
    //MeshGeometry = new THREE.BoxGeometry(1,2,1);
    /* Sphere */
    //CurrGeometry = "Sphere";
    //MeshGeometry = new THREE.SphereGeometry(1);
    /* Cylinder radiusTop, radiusBottom, radiusHeight, radiusSegments, heightSegments*/
    // CurrGeometry = "Cylinder";
    // MeshGeometry = new THREE.CylinderGeometry(0.5,0.5,1,32);
    /* Cone */
    //CurrGeometry = "Cone";
    //MeshGeometry = new THREE.CylinderGeometry(0,0.3,1,32);
    /* Semi Torus radius, tube, radialSegments, tubularSegments, arc */
    //CurrGeometry = "SemiTorus";
    //MeshGeometry = new THREE.TorusGeometry(1.5,0.3,16,100, Math.PI+(0.5*Math.PI));
    /* Full Torus */
    //CurrGeometry = "Torus";
    //MeshGeometry = new THREE.TorusGeometry(1,0.2,16,100);
    /* Torus knot */
    CurrGeometry = "TorusKnot";
    MeshGeometry = new THREE.TorusKnotGeometry(1,0.2,100,16);


    MeshGeometry.computeBoundingBox();
    console.log(MeshGeometry);
    var MeshMaterial = new THREE.MeshNormalMaterial();
    console.log("MeshMaterial");
    MeshMaterial.side = THREE.DoubleSide;

    console.log(MeshMaterial);
    MeshObject = new THREE.Mesh(MeshGeometry, MeshMaterial);
    MeshObject.overdraw = true;
    console.log(MeshObject);

    var box = new THREE.BoxHelper( MeshObject );

    MeshScene.add(MeshObject);
    MeshScene.add(box);

    var max = MeshGeometry.boundingBox.max;
    var min = MeshGeometry.boundingBox.min;
    var MaxBoundingBoxHTML= "<p><strong>Max BoundingBox Coordinates:</strong>  x = " +  max.x + ",   y = " + max.y + ",   z = " + max.z + "</p>";
    var MinBoundingBoxHTML= "<p><strong>Min BoundingBox Coordinates:</strong>  x = " +  min.x + ",   y = " + min.y + ",   z = " + min.z + "</p>";
    $("#DebugInfo").html(MaxBoundingBoxHTML + MinBoundingBoxHTML);

    MeshAnimate();
}

/* Recursive loop for MeshCamera! */
function MeshAnimate() 
{
    MeshAnimationFrame = requestAnimationFrame(MeshAnimate);
    MeshControls.update();
    MeshRenderer.render(MeshScene, MeshCamera);
}


