;(function() {
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

  var primus = Primus.connect('http://localhost:3000/signalk/stream');

  primus.on('data', function(data) {
    deriveData(data);

    $('#heading').html(heading);
    $('#pitch').html(pitch);
    $('#roll').html(roll);
  });

  function deriveData(data) {
    if(vessel === null) {
      for(var id in data.vessels) {
        var ves = data.vessels[id];

        if(ves.navigation !== null && typeof ves.navigation === 'object') {
          if(typeof ves.navigation.courseOverGroundTrue !== 'undefined') {
            vessel = id;
          }
        }
      }
    }

    data = data.vessels[vessel];

    if(data.navigation !== null && typeof data.navigation === 'object') {
      if(data.navigation.courseOverGroundTrue !== null && typeof data.navigation.courseOverGroundTrue === 'object') {
        heading = data.navigation.courseOverGroundTrue.value;
      }

      if(data.navigation.pitch !== null && typeof data.navigation.pitch === 'object') {
        pitch = data.navigation.pitch.value;
      }

      if(data.navigation.roll !== null && typeof data.navigation.roll === 'object') {
        roll = data.navigation.roll.value;
      }
    }
  }

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

  function init() {
    scene     = new THREE.Scene();
    camera    = new THREE.PerspectiveCamera(75, $(window).width() / $(window).height(), 0.01, 10000);
    renderer  = new THREE.WebGLRenderer();
    light     = new THREE.AmbientLight(0xEEEEEE);

    scene.add(light);
    camera.position.z = 5;
    
    renderer.setSize($(window).width(), $(window).height());
    renderer.setClearColor(0x003300, 1);

    $('main').empty().append(renderer.domElement);
    
    createSphere();
    addMainNeedle(0x00CC00);
    addRing();
    animate();
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

  init();
})();