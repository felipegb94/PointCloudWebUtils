# PointCloudWebUtils
Compilation of different utils for point cloud rendering and generation

Steps

1. Clone repository
2. Make sure you can run `http-server`
3. Make a directory called `meshes` inside the repository.
4. Put the `*.obj` file in the meshes directory.
5. Open `MeshFileToPointCloud.html` and edit
6. 

## Description
PointCloudWebUtils are two WebGL/Three.js powered tools that I made to make the SPH model development easier for myself. 

The first one is a simple point cloud rendering tool that receives a csv file as an input and displays a color-coded point cloud where the colors represent the SPH marker type (fluid, boundary or solid). I could also use Paraview or other visualizing tool but having to specify a bunch of options only to visualize the first time step to see if the initialization was done correctly is a couple minutes of work against a couple seconds in the web app. A couple of minutes does not sound bad, but some days I have to do that tens of times so the couple minutes can become more than an hour. 

The second one is the implementation of the ray crossing approach described in the <a href="http://felipegb94.github.io/Papers/TR-MeshToPointCloudTool/TR-2015-10.pdf" target="_blank">Evaluation of Mesh To Point Cloud Alternatives report</a>. I generates a point cloud from an input .obj file or from one of the premade meshes in three.js (cube, cylinder, torus, etc.). The figure on the right is the input mesh and the resulting point cloud of a humvee model.
