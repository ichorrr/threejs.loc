window.onload = function() {
	
	var container;
	
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(65, window.innerWidth/window.innerHeight, 0.1, 1000);
	var render = new THREE.WebGLRenderer({antialias: true});
	render.setSize(window.innerWidth, window.innerHeight);
	render.setClearColor(0xffffff);
	
	document.body.appendChild(render.domElement);
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );
	
camera.position.z = 5;

	var meshes = [];
	
	var objLoader = new THREE.OBJLoader();
	
	objLoader.load('model/shape.obj', function( object ){
		console.log(object);
		
		object.traverse(function(child) {
			if (child instanceof THREE.Mesh)
				{
					meshes.push(child);
				}
		});
	});
	
	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
            directionalLight.position.set( 10, 10, 10 );
            scene.add( directionalLight );	

	
	var rendering = function() {
		requestAnimationFrame(rendering);
		
		render.render(scene, camera);
	}
	rendering();
}