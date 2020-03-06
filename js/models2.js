
let renderer,  container, camera, ring, center;
let geostars = [];
var scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 35, window.innerWidth/window.innerHeight, 1, 300 );
camera.position.z = 40;
camera.position.x = 9;

container = document.getElementById( 'clogo' );
renderer = new THREE.WebGLRenderer( {
                  antialias: true,
                  alpha: true,
                  premultipliedAlpha: false } );

container.appendChild(renderer.domElement);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);

let light = new THREE.DirectionalLight("#3d4c4a", 10);
let light2 = new THREE.DirectionalLight("#48b6a0", 2);
light2.position.set( 100, 870, 1500 ).normalize();

light.position.set( 100, -870, 500 ).normalize();
let ambient = new THREE.AmbientLight("#43555a", 0.3);
ambient.position.set( 100, 870, -500 ).normalize();
scene.add(light);
scene.add(ambient);
scene.add(light2);

// SPHEIRE //


var geometry = new THREE.SphereGeometry(6.5,86,64);
var material = new THREE.MeshPhongMaterial({
        shininess: 100,
        color: 0x000000,
        specular: 0x000000,
        transparent: true,
        opacity: 0.5,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
var sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);


function dumpObject(obj, lines = [], isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─';
  lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
  const newPrefix = prefix + (isLast ? '  ' : '│ ');
  const lastNdx = obj.children.length - 1;
  obj.children.forEach((child, ndx) => {
    const isLast = ndx === lastNdx;
    dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
}


// LOGOTYPE //


let gltfLoader = new THREE.GLTFLoader();

  gltfLoader.load(
    // resource URL
    'model/logo_blender2.glb',
    // called when the resource is loaded
    function ( gltf ) {
      const root = gltf.scene;
      scene.add( root );
      console.log(dumpObject(root).join('\n'));
      ring = root.getObjectByName('ring_logo');
      center = root.getObjectByName('center_logo');
    });


  // STARS //


  let starTexture = new THREE.TextureLoader().load( "img/star.png" );

  for (let i = 0; i < 30000; i++) {
  let geometry = new THREE.PlaneGeometry( 0.2, 0.2);
  let material = new THREE.MeshBasicMaterial( { map: starTexture, side: THREE.DoubleSide } );

  let star = new THREE.Mesh( geometry, material );
  star.position.set(
    Math.random() * 600 - 300,
    Math.random() * 600 - 300,
    Math.random() * 600 - 620
  );
  geostars.push( star );
  scene.add( geostars[i] )
}

/*

SECOND METHOD

    geostar = new THREE.Geometry();

    for(let i=0; i<400000; i++) {
      star = new THREE.Vector3(
        Math.random() * 600 - 300,
        Math.random() * 600 - 300,
        Math.random() * 600 - 600
      );

    geostar.vertices.push(star);
    }

    let opastar = Math.random() *1;
    let sprite = new THREE.TextureLoader().load( 'img/star.png' );
    let geomaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.6,
    transparent: true,
    map: sprite
    });

    stars = new THREE.Points(geostar, geomaterial);
    scene.add(stars);

*/


var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};
$(renderer.domElement).on('mousedown', function(e) {
    isDragging = true;
})
.on('mousemove', function(e) {
    //console.log(e);
    var deltaMove = {
        x: e.offsetX-previousMousePosition.x,
        y: e.offsetY-previousMousePosition.y
    };

    if(isDragging) {

        var deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 1),
                toRadians(deltaMove.x * 1),
                0,
                'XYZ'
            ));

        ring.quaternion.multiplyQuaternions(deltaRotationQuaternion, ring.quaternion);
        center.quaternion.multiplyQuaternions(deltaRotationQuaternion, center.quaternion);
    }

    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    };
});

function onWindowResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener( 'resize', onWindowResize, false );


$(document).on('mouseup', function(e) {
    isDragging = false;
});

let lightness = 0;
function render(time) {
  time *= 0.0003;  // convert to seconds

  if (ring, center) {
      ring.rotation.x = time;
      center.rotation.x = time;
  }

  for (let j=0; j < geostars.length; j++) {
    let star = geostars[j];
    star.position.x += 0.007;
    star.position.y += 0.007;
    star.material.color = new THREE.Color("hsl(255, 100%, " + j + "%)");
  }

  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();


function toRadians(angle) {
	return angle * (Math.PI / 180);
}

function toDegrees(angle) {
	return angle * (180 / Math.PI);
}
