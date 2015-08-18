
function RenderSPHPointCloud() 
{
    console.log("Generating Point Cloud...");

    var numParticles = data.length - 1;


    PointCloudBoundaryMaterial.transparent = true;
    PointCloudBoundaryMaterial.opacity = 0.2;

    var MaxBoundaryParticle = new THREE.Vector3(0, 0, 0);
    var MinBoundaryParticle = new THREE.Vector3(0, 0, 0);
    var MaxFluidParticle = new THREE.Vector3(0, 0, 0);
    var MinFluidParticle = new THREE.Vector3(0, 0, 0);

    /* Check for right input format */
    p = data[0];
    console.log(p);
    if(p.hasOwnProperty('x') && 
       p.hasOwnProperty('y') && 
       p.hasOwnProperty('z'))
    {
        console.log("Points have the right properties");
    }
    else
    {
        throw "Invalid input format Exception";
    }

    for (var i = 0; i <numParticles; i++) 
    {
        point = data[i];
        var vertex = new THREE.Vector3(point.x, point.y, point.z);
        /* Check if boundary or fluid particle to be able to draw them with different colors */
        if (point.TypeofParticle == -1) 
        {
            if(vertex.x > MaxFluidParticle.x)
            {
                MaxFluidParticle.x = vertex.x;
            }
            if(vertex.y > MaxFluidParticle.y)
            {
                MaxFluidParticle.y = vertex.y;
            }                
            if(vertex.z > MaxFluidParticle.z)
            {
                MaxFluidParticle.z = vertex.z;
            } 
            if(vertex.x < MinFluidParticle.x)
            {
                MinFluidParticle.x = vertex.x;
            }
            if(vertex.y < MinFluidParticle.y)
            {
                MinFluidParticle.y = vertex.y;
            }                
            if(vertex.z < MinFluidParticle.z)
            {
                MinFluidParticle.z = vertex.z;
            }  
            PointCloudGeometry.vertices.push(vertex);
        } 
        else if (point.TypeofParticle == 0) 
        {
            if(vertex.x > MaxBoundaryParticle.x)
            {
                MaxBoundaryParticle.x = vertex.x;
            }
            if(vertex.y > MaxBoundaryParticle.y)
            {
                MaxBoundaryParticle.y = vertex.y;
            }                
            if(vertex.z > MaxBoundaryParticle.z)
            {
                    MaxBoundaryParticle.z = vertex.z;
            } 
            if(vertex.x < MinBoundaryParticle.x)
            {
                MinBoundaryParticle.x = vertex.x;
            }
            if(vertex.y < MinBoundaryParticle.y)
            {
                MinBoundaryParticle.y = vertex.y;
            }                
            if(vertex.z < MinBoundaryParticle.z)
            {
                MinBoundaryParticle.z = vertex.z;
            }  
            PointCloudBoundaryGeometry.vertices.push(vertex);
        }
        else
        {
            SolidCloudGeometry.vertices.push(vertex);
        }
    }

    var MaxParticleHTML= "<p><strong>Max Fluid Particle Coordinates:</strong>  x = " +  MaxFluidParticle.x + ",   y = " + MaxFluidParticle.y + ",   z = " + MaxFluidParticle.z + "</p>";

    var MinParticleHTML= "<p><strong>Min Fluid Particle Coordinates:</strong>  x = " +  MinFluidParticle.x + ",   y = " + MinFluidParticle.y + ",   z = " + MinFluidParticle.z + "</p>";

    var MaxBoundaryHTML= "<p><strong>Max Boundary Particle Coordinates:</strong>  x = " +  MaxBoundaryParticle.x + ",   y = " + MaxBoundaryParticle.y + ",   z = " + MaxBoundaryParticle.z + "</p>";

    var MinBoundaryHTML= "<p><strong>Min Boundary Particle Coordinates:</strong>  x = " +  MinBoundaryParticle.x + ",   y = " + MinBoundaryParticle.y + ",   z = " + MinBoundaryParticle.z + "</p>";

    $("#DebugInfo").html(MaxParticleHTML + MinParticleHTML + MaxBoundaryHTML + MinBoundaryHTML);
    
    RenderPointCloud();
}

function RenderPointCloud()
{
    InitScene(PCRenderer, PCScene, PCCamera, PCControls, PCAxisHelper);
    $PCContainer.append(PCRenderer.domElement);

    console.log(SolidCloudGeometry);

    /* Create the PointClouds. PointCloudBoundary can be empty */
    PointCloud = new THREE.PointCloud(PointCloudGeometry, PointCloudMaterial);
    PointCloudBoundary = new THREE.PointCloud(PointCloudBoundaryGeometry,PointCloudBoundaryMaterial);
    SolidCloud = new THREE.PointCloud(SolidCloudGeometry, SolidCloudMaterial);
    console.log(SolidCloud);
    console.log("End of Generating Point Cloud Geometry...");
    PCScene.add(PointCloudBoundary);
    PCScene.add(PointCloud);
    PCScene.add(SolidCloud);

    /* Call recursive loop that allow us to animate the PCCamera. */
    PointCloudAnimate();
}

/* Recursive loop for PCCamera! */
function PointCloudAnimate() 
{
    PCAnimationFrame = requestAnimationFrame(PointCloudAnimate);
    PCControls.update();
    PCRenderer.render(PCScene, PCCamera);
}