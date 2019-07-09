window.onload = function() {
	
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(65, window.innerWidth/window.innerHeight, 0.1, 10000);
	var render = new THREE.WebGLRenderer({antialias: true});
	render.setSize(window.innerWidth, window.innerHeight);
	render.setClearColor(0xffffff);
	
	document.body.appendChild(render.domElement);
	
camera.position.z = 190;

	var meshes = [];
	
	var objLoader = new THREE.OBJLoader();
	
	objLoader.load('model/Shape1.obj', function( object ){
		console.log(object);
	});
	
	
	var rendering = function() {
		requestAnimationFrame(rendering);
		
		render.render(scene, camera);
	}
	rendering();
}