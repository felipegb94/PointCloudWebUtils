function RenderThreeMesh(MeshName)
{
    InitScene(MeshRenderer, MeshScene, MeshCamera, MeshControls, MeshAxisHelper);
    $MeshContainer.append(MeshRenderer.domElement);
    CurrGeometry = MeshName;
    switch(MeshName) 
    {
        case "Cube":
            MeshGeometry = new THREE.BoxGeometry(1,1,1);
        break;
        case "Sphere":
            MeshGeometry = new THREE.SphereGeometry(1);
        break;
        /* Cylinder radiusTop, radiusBottom, radiusHeight, radiusSegments, heightSegments*/
        case "Cylinder":
            MeshGeometry = new THREE.CylinderGeometry(1.05,1.05,4,128);
        break;
        case "Cone":
            MeshGeometry = new THREE.CylinderGeometry(0,1.05,2,128);
        break;
        case "SemiTorus":
            MeshGeometry = new THREE.TorusGeometry(1.5,0.3,16,100, Math.PI+(0.5*Math.PI));
        break;
        case "Torus":
            MeshGeometry = new THREE.TorusGeometry(1,0.2,16,100);
        break;
        case "TorusKnot":
            MeshGeometry = new THREE.TorusKnotGeometry(1,0.2,100,16);
        break;
        default:
            CurrGeometry = "Sphere"
            MeshGeometry = new THREE.SphereGeometry(1);
    }

    var MeshMaterial = new THREE.MeshNormalMaterial();
    MeshMaterial.side = THREE.DoubleSide;
    
    MeshObject = new THREE.Mesh(MeshGeometry, MeshMaterial);
    MeshObject.overdraw = true;
    console.log(MeshObject);

    MeshBox = new THREE.BoxHelper( MeshObject );
    var numChildren = MeshScene.children.length;
    MeshObject.name = numChildren;
    MeshScene.add(MeshObject);
    MeshBox.name = numChildren+1;
    MeshScene.add(MeshBox);

    var max = MeshGeometry.boundingBox.max;
    var min = MeshGeometry.boundingBox.min;
    var MaxBoundingBoxHTML= "<p><strong>Max BoundingBox Coordinates:</strong>  x = " +  max.x + ",   y = " + max.y + ",   z = " + max.z + "</p>";
    var MinBoundingBoxHTML= "<p><strong>Min BoundingBox Coordinates:</strong>  x = " +  min.x + ",   y = " + min.y + ",   z = " + min.z + "</p>";
    $("#DebugInfo").html(MaxBoundingBoxHTML + MinBoundingBoxHTML);
    $("#MeshToPC").toggleClass("disabled",false);

    MeshAnimate();

}

function ClearMesh()
{
    console.log(MeshScene);

    for(var i = 0;i < MeshScene.children.length;i++)
    {
        currChild = MeshScene.children[i];

        if((currChild instanceof THREE.Mesh) || (currChild instanceof THREE.BoxHelper))
        {
            MeshScene.remove(currChild);
        }
    }

    MeshAnimate();

}

function RenderMesh(filename)
{
    InitScene(MeshRenderer, MeshScene, MeshCamera, MeshControls, MeshAxisHelper);
    $MeshContainer.append(MeshRenderer.domElement);
    
    var ambient = new THREE.AmbientLight( 0x101030 );
    MeshScene.add( ambient );
    var directionalLight = new THREE.DirectionalLight( 0xffeedd );
    directionalLight.position.set( 0, 0, 1 );
    MeshScene.add( directionalLight );

    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
      console.log( item, loaded, total );
    };
    var texture = new THREE.Texture();
    var onProgress = function ( xhr ) 
    {
        if ( xhr.lengthComputable ) 
        {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
        }
    };
    var onError = function ( xhr ) {};
    var loader = new THREE.ImageLoader( manager );
    loader.load( 'textures/water.jpg', function ( image ) 
    {
        texture.image = image;
        texture.needsUpdate = true;
    } );

    loader = new THREE.OBJLoader( manager );
    loader.load( filename, function ( object ) 
    {
        object.traverse( function ( child ) 
        {
            if ( child instanceof THREE.Mesh ) 
            {
                child.material.map = texture;
            }
        });
        object.scale =  new THREE.Vector3( 1, 1, 1);
        MeshObject = object.children[0];
        var MeshMaterial = new THREE.MeshNormalMaterial();
        console.log("MeshMaterial");
        MeshMaterial.side = THREE.DoubleSide;
        MeshGeometry = MeshObject.geometry;
        MeshGeometry.computeBoundingBox();
        var box = new THREE.BoxHelper( MeshObject );

        MeshObject = new THREE.Mesh(MeshGeometry, MeshMaterial);

        MeshScene.add( MeshObject );
        CurrGeometry = filename;

        console.log(MeshGeometry);
        console.log(MeshObject);

        var max = MeshGeometry.boundingBox.max;
        var min = MeshGeometry.boundingBox.min;
        var MaxBoundingBoxHTML= "<p><strong>Max BoundingBox Coordinates:</strong>  x = " +  max.x + ",   y = " + max.y + ",   z = " + max.z + "</p>";
        var MinBoundingBoxHTML= "<p><strong>Min BoundingBox Coordinates:</strong>  x = " +  min.x + ",   y = " + min.y + ",   z = " + min.z + "</p>";
        $("#DebugInfo").html(MaxBoundingBoxHTML + MinBoundingBoxHTML);
        MeshAnimate();

        MeshToPC(MeshGeometry, MeshObject);

    }, onProgress, onError );

}

/* Recursive loop for MeshCamera! */
function MeshAnimate() 
{
    MeshAnimationFrame = requestAnimationFrame(MeshAnimate);
    MeshControls.update();
    MeshRenderer.render(MeshScene, MeshCamera);
}


