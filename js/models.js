let scene, renderer, container, stars, geostar;
let camera;
const mixers = [];
const clock = new THREE.Clock();
let isMouseDown = false;


    function init() {

                    container = document.getElementById( 'clogo' );

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera( 16, window.innerWidth/window.innerHeight, 0.4, 3000 );
      camera.position.z = 50;

//      controls = new THREE.OrbitControls (camera, renderer);
//      controls.update();
      renderer = new THREE.WebGLRenderer( {
                        antialias: true,
                        alpha: true,
                        premultipliedAlpha: false } );

                    renderer.setPixelRatio( window.devicePixelRatio );
      container.appendChild( renderer.domElement );
                    renderer.setSize( container.clientWidth, container.clientHeight );
      renderer.gammaFactor = 1.2;
      renderer.gammaOutput = true;

      let light = new THREE.DirectionalLight("#97b7b3", 6);
      let ambient = new THREE.AmbientLight("#206377", 0.7);
      light.position.set( 100, -870, 800 ).normalize();
      scene.add(light);
      scene.add(ambient);


                    var geometry = new THREE.SphereGeometry(5.5,86,64);
                    var material = new THREE.MeshPhongMaterial({
                            shininess: 100,
                            color: 0xffffff,
                            specular: 0xffffff,
                            transparent: true,
                            opacity: 0.5,
                            side: THREE.BackSide,
                            blending: THREE.AdditiveBlending,
                            depthWrite: false
                          });
                    var sphere = new THREE.Mesh(geometry, material);
                    scene.add(sphere);

                    scene.fog=new THREE.Fog( 0x000000, 40, 60 );

geostar = new THREE.Geometry();

for(let i=0; i<6000; i++) {
star = new THREE.Vector3(
  Math.random() * 600 - 300,
  Math.random() * 600 - 300,
  Math.random() * 600 - 300
);

geostar.vertices.push(star);
}

let sprite = new THREE.TextureLoader().load( 'img/star.png' );
let geomaterial = new THREE.PointsMaterial({
color: 0xffffff,
size: 3,
transparent: true,
map: sprite
});

stars = new THREE.Points(geostar, geomaterial);
scene.add(stars);

//      let texture = new THREE.Texture();
//      let manager = new THREE.LoadingManager();
//      manager.onProgress = function ( item, loaded, total ) {};
      let onProgress = function ( xhr ) {};
      let onError = function ( xhr ) {};


      let loader = new THREE.GLTFLoader();

        loader.receiveShadow = true;
        loader.load(
          // resource URL
          'model/logo_blender2.glb',
          // called when the resource is loaded
          function ( gltf ) {

            const ring_logo = gltf.scene.children[ 2 ];
            const cent_logo = gltf.scene.children[ 3 ];

            const animation_ring = gltf.animations[ 2 ];
            const animation_cent = gltf.animations[ 3 ];

            const mixer_ring = new THREE.AnimationMixer( ring_logo );
            const mixer_cent = new THREE.AnimationMixer( cent_logo );
            mixers.push( mixer_ring );
            mixers.push( mixer_cent );

            const action_ring = mixer_ring.clipAction( animation_ring );
            const action_cent = mixer_cent.clipAction( animation_cent );
            action_ring.play();
            action_cent.play();

            scene.add( ring_logo, cent_logo);

          },
          // called when loading is in progresses
          function ( xhr ) {

              console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

          },
          // called when loading has errors
          function ( error ) {

              console.log( 'An error happened' );

        });

          document.addEventListener("mousedown", onMouseDown);
          document.addEventListener("touchstart", onMouseDown);
          document.addEventListener("mouseup", onMouseUp);
          document.addEventListener("touchend", onMouseUp);
          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("touchmove", onMouseMove);


          renderer.setAnimationLoop( () => {
                                    update();
                                    render();

          });

                }

function render() {
renderer.render(scene, camera);

}

function update() {
const delta = clock.getDelta();
  for ( const mixer of mixers ) {
    mixer.update( delta );
  }
}

function onMouseDown(event) {
isMouseDown = true;
}

function onMouseMove(event) {
if (isMouseDown) {
  if ( scene ) {
    scene.rotation.y = getMouseY(event)*0.02;
    scene.rotation.x = getMouseX(event)*0.02;
  }
}
}

function onMouseUp(event) {
isMouseDown = false;
}

function getMouseX(event) {
if (event.type.indexOf("touch") == -1)
  return event.clientX;
else
  return event.touches[0].clientX;
}

function getMouseY(event) {
if (event.type.indexOf("touch") == -1)
  return event.clientY;
else
  return event.touches[0].clientY;
}

   window.addEventListener('DOMContentLoaded', init);



    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize( container.clientWidth, container.clientHeight );
}
    window.addEventListener( 'resize', onWindowResize, false );
