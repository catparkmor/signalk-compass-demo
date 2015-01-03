;(function(module) {
  var renderer
    , scene 
    , camera
    , sphere
    , light
    , offset  = -0.09
    , last    = 0
    , heading = 0
    , pitch   = 0
    , roll    = 0
    , vessel  = null
  ;

  function createSphere() {
    var geometry    = new THREE.SphereGeometry(2, 50, 50);
    //var material  = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
    var material    = new THREE.MeshPhongMaterial();
    material.map    = THREE.ImageUtils.loadTexture('styles/compass.png');
    sphere          = new THREE.Mesh(geometry, material);

    scene.add(sphere);
  }

  function addMainNeedle(clr) {
    var geometry  = new THREE.Geometry();
    var material  = new THREE.LineBasicMaterial({ color: clr, linewidth: 4 });
    var mesh      = new THREE.Line(geometry, material);

    geometry.vertices.push(new THREE.Vector3(0, -0.29, 3));
    geometry.vertices.push(new THREE.Vector3(0, 0.29, 3));

    scene.add(mesh);
  }

  function addRing() {
    var geometry    = new THREE.TorusGeometry(2.41, 0.2, 50, 50);
    //var material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: false });
    var material    = new THREE.MeshPhongMaterial();
    material.map    = THREE.ImageUtils.loadTexture('styles/quarters.png');
   
    var torus       = new THREE.Mesh(geometry, material);
    
    scene.add(torus);
  }

  function init(canvas, width, height) {
    canvas    = typeof canvas === 'string' ? $(canvas) : canvas;
    width     = width || $(window).width();
    height    = height || $(window).height();

    scene     = new THREE.Scene();
    camera    = new THREE.PerspectiveCamera(75, width / height, 0.01, 10000);
    renderer  = new THREE.WebGLRenderer();
    light     = new THREE.AmbientLight(0xEEEEEE);

    scene.add(light);
    camera.position.z = 5;
    
    renderer.setSize($(window).width(), $(window).height());
    renderer.setClearColor(0x003300, 1);

    canvas.empty().append(renderer.domElement);
    
    createSphere();
    addMainNeedle(0x00CC00);
    addRing();
    animate();
  }

  function resizeScene(width, height) {
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function calculateRotation() {
    if(heading !== last) {
      //* Heading
      var compass = -(heading - 90);
      sphere.rotation.y = (compass * Math.PI / 180) + offset;
      //*/

      //* Roll
      sphere.rotation.x = (roll * Math.PI / 180);
      sphere.rotation.z = (roll * Math.PI / 180);
      //*/

      //* Pitch
      sphere.rotation.x = (pitch * Math.PI / 180);
      //*/

      last = heading;
    }
  }

  function render() {
    calculateRotation();
    renderer.render(scene, camera);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function updateVariables(h, p, r) {
    heading = h || 0.0;
    pitch = p || 0.0;
    roll = r || 0.0;
  }

  if(module !== null && typeof module === 'object' && typeof module.exports !== 'undefined') {
    module.exports = {
      init: init,
      update: updateVariables,
      resize: resizeScene
    };
  }
})(module);