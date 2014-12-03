;(function() {
  var renderer
    , scene 
    , camera
    , sphere
    , light
    , offset  = -0.09
    , last    = 0
    , degrees = 0
    , vessel  = null
  ;

  var primus = Primus.connect('http://localhost:3000/signalk/stream');

  primus.on('data', function(data) {
    deriveDegrees(data);
    $('#value').html(degrees);
  });

  function deriveDegrees(data) {
    if(vessel === null) {
      for(var id in data.vessels) {
        var ves = data.vessels[id];

        if(ves.navigation !== null && typeof ves.navigation === 'object') {
          if(typeof ves.navigation.courseOverGroundMagnetic !== 'undefined') {
            vessel = id;
          }
        }
      }
    }

    data = data.vessels[vessel];

    if(data.navigation !== null && typeof data.navigation === 'object' && data.navigation.courseOverGroundMagnetic !== null && typeof data.navigation.courseOverGroundMagnetic === 'object') {
      degrees = data.navigation.courseOverGroundMagnetic.value;
    }
  }

  function createSphere() {
    var geometry  = new THREE.SphereGeometry(2.5, 50, 50);
    //var material  = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true });
    var material  = new THREE.MeshPhongMaterial();
    material.map  = THREE.ImageUtils.loadTexture('styles/compass.png');
    
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
  }

  function addMainNeedle() {
    var geometry = new THREE.Geometry();
    var material = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 10 });
    var mesh = new THREE.Line(geometry, material);

    geometry.vertices.push(new THREE.Vector3(0, -0.39, 3));
    geometry.vertices.push(new THREE.Vector3(0, 0.39, 3));

    scene.add(mesh);
  }

  function init() {
    scene     = new THREE.Scene();
    camera    = new THREE.PerspectiveCamera(75, $(window).width() / $(window).height(), 0.01, 10000);
    renderer  = new THREE.WebGLRenderer();
    light     = new THREE.AmbientLight(0xEEEEEE);

    scene.add(light);
    camera.position.z = 5;
    renderer.setSize($(window).width(), $(window).height());
    $('main').empty().append(renderer.domElement);
    
    createSphere();
    addMainNeedle();
    animate();
  }

  function calculateRotation() {
    var deg = -(degrees - 90);
    sphere.rotation.y = (deg * Math.PI / 180) + offset;
  }

  function render() {
    calculateRotation();
    renderer.render(scene, camera);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  init();
})();