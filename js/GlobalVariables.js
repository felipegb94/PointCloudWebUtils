/**
 * Initialize Common Variables
 */
var WIDTH = 600;
var HEIGHT = 600;
/* set some camera attributes */
var VIEW_ANGLE = 45;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 0.001;
var FAR = 100;

var outputBlob;
var totalNumPoints;
/**
 * Initialize Mesh Scene Variables
 */
var MeshBox;
var CurrGeometry = "";
var MeshGeometry, MeshObject;
var MeshAnimationFrame, MeshControls, MeshRenderer, MeshScene, MeshCamera, MeshAxisHelper;
var MeshContainerID = "#MeshContainer";
MeshRenderer = new THREE.WebGLRenderer();
MeshScene = new THREE.Scene();
MeshCamera = new THREE.PerspectiveCamera(VIEW_ANGLE,
                                         ASPECT,
                                         NEAR,
                                         FAR);
MeshAxisHelper = new THREE.AxisHelper(100);
var $MeshContainer = $(MeshContainerID);
MeshControls = new THREE.TrackballControls(MeshCamera, $MeshContainer[0]);
var Octree = new THREE.Octree();
/**
 * Initialize Point Cloud Scene Variables
 */
var PointCloud, PointCloudBoundary, SolidCloud;
var PointCloudGeometry, PointCloudBoundaryGeometry, SolidCloudGeometry;
var PointCloudMaterial, PointCloudBoundaryMaterial, SolidCloudMaterial;
var PCAnimationFrame, PCControls, PCRenderer, PCScene, PCCamera, PCAxisHelper;
var PCContainerID = "#PointCloudContainer";

PCRenderer = new THREE.WebGLRenderer();
PCScene = new THREE.Scene();
PCCamera = new THREE.PerspectiveCamera(VIEW_ANGLE,
                                     ASPECT,
                                     NEAR,
                                     FAR);
PCAxisHelper = new THREE.AxisHelper(100);
var $PCContainer = $(PCContainerID);
PCControls = new THREE.TrackballControls(PCCamera, $PCContainer[0]);

PointCloudGeometry = new THREE.Geometry();
PointCloudBoundaryGeometry = new THREE.Geometry();
SolidCloudGeometry = new THREE.Geometry();
PointCloudMaterial = new THREE.PointCloudMaterial({color: 0x99CCFF,
                                                       size: 0.1
                                                      });
PointCloudBoundaryMaterial = new THREE.PointCloudMaterial({color: 0xE6E6E6,
                                                               size: 0.1
                                                              });
SolidCloudMaterial = new THREE.PointCloudMaterial({color: 0xFFA347,
                                                                   size: 0.1
                                                                  });  