import Ember from 'ember';

export default Ember.View.extend({
  didInsertElement: function() {
    this._super()
    console.log('im inside yer game')


// standard global variables
    var container, scene, camera, renderer, controls, stats;
    var clock = new THREE.Clock();

// custom global variables
    var cube;
    var projector, mouse = { x: 0, y: 0 }, INTERSECTED;
    var sprite1;
    var canvas1, context1, texture1;

    init();
    animate();

// FUNCTIONS
    function init()
    {
      // SCENE
      scene = new THREE.Scene();
      // CAMERA
      var SCREEN_WIDTH = 800, SCREEN_HEIGHT = 600;
      var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
      camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
      scene.add(camera);
      camera.position.set(0,150,400);
      camera.lookAt(scene.position);
      // RENDERER
      if ( Detector.webgl )
        renderer = new THREE.WebGLRenderer( {antialias:true} );
      else
        renderer = new THREE.CanvasRenderer();
      renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
      container = document.getElementById( 'render' );
      container.appendChild( renderer.domElement );
      // CONTROLS
      //controls = new THREE.OrbitControls( camera, renderer.domElement );
      // LIGHT
      var light = new THREE.PointLight(0xffffff);
      light.position.set(0,250,0);
      scene.add(light);
      // FLOOR
      var floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
      floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
      floorTexture.repeat.set( 10, 10 );
      var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
      var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
      var floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.position.y = -0.5;
      floor.rotation.x = Math.PI / 2;
      floor.name = "Checkerboard Floor";
      scene.add(floor);
      // SKYBOX/FOG
      var skyBoxGeometry = new THREE.BoxGeometry( 10000, 10000, 10000 );
      var skyBoxMaterial = new THREE.MeshBasicMaterial( { color: 0x9999ff, side: THREE.BackSide } );
      var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );
      scene.add(skyBox);

      ////////////
      // CUSTOM //
      ////////////
      var cubeGeometry = new THREE.BoxGeometry( 50, 50, 50 );
      var cubeMaterial = new THREE.MeshBasicMaterial( { color: 0x000088 } );
      cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
      cube.position.set(0,26,0);
      cube.name = "Cube";
      scene.add(cube);

      // initialize object to perform world/screen calculations
      projector = new THREE.Projector();

      // when the mouse moves, call the given function
      container.addEventListener( 'mousemove', onDocumentMouseMove, false );

      /////// draw text on canvas /////////

      // create a canvas element
      canvas1 = document.createElement('canvas');
      context1 = canvas1.getContext('2d');
      context1.font = "Bold 20px Arial";
      context1.fillStyle = "rgba(0,0,0,0.95)";
      context1.fillText('Hello, world!', 0, 20);

      // canvas contents will be used for a texture
      texture1 = new THREE.Texture(canvas1)
      texture1.needsUpdate = true;

      ////////////////////////////////////////

      var spriteMaterial = new THREE.SpriteMaterial( { map: texture1, useScreenCoordinates: true } );

      sprite1 = new THREE.Sprite( spriteMaterial );
      sprite1.scale.set(200,100,1.0);
      sprite1.position.set( 50, 50, 0 );
      scene.add( sprite1 );

      //////////////////////////////////////////

    }

    function onDocumentMouseMove( event )
    {
      console.log(event);
      // the following line would stop any other event handler from firing
      // (such as the mouse's TrackballControls)
      // event.preventDefault();

      // update sprite position
      sprite1.position.set( event.x, event.y - 20, 0 );

      // update the mouse variable
      mouse.x = ( event.clientX / 800 ) * 2 - 1;
      mouse.y = - ( event.clientY / 600 ) * 2 + 1;
    }

    function animate()
    {
      requestAnimationFrame( animate );
      render();
      update();
    }

    function update()
    {

      // create a Ray with origin at the mouse position
      //   and direction into the scene (camera direction)
      var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
      projector.unprojectVector( vector, camera );
      var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

      // create an array containing all objects in the scene with which the ray intersects
      var intersects = ray.intersectObjects( scene.children );

      // INTERSECTED = the object in the scene currently closest to the camera
      //		and intersected by the Ray projected from the mouse position

      // if there is one (or more) intersections
      if ( intersects.length > 0 )
      {
        // if the closest object intersected is not the currently stored intersection object
        if ( intersects[ 0 ].object != INTERSECTED )
        {
          // restore previous intersection object (if it exists) to its original color
          if ( INTERSECTED )
            INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
          // store reference to closest object as current intersection object
          INTERSECTED = intersects[ 0 ].object;
          // store color of closest object (for later restoration)
          INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
          // set a new color for closest object
          INTERSECTED.material.color.setHex( 0xffff00 );

          // update text, if it has a "name" field.
          if ( intersects[ 0 ].object.name )
          {
            context1.clearRect(0,0,640,480);
            var message = intersects[ 0 ].object.name;
            var metrics = context1.measureText(message);
            var width = metrics.width;
            context1.fillStyle = "rgba(0,0,0,0.95)"; // black border
            context1.fillRect( 0,0, width+8,20+8);
            context1.fillStyle = "rgba(255,255,255,0.95)"; // white filler
            context1.fillRect( 2,2, width+4,20+4 );
            context1.fillStyle = "rgba(0,0,0,1)"; // text color
            context1.fillText( message, 4,20 );
            texture1.needsUpdate = true;
          }
          else
          {
            context1.clearRect(0,0,300,300);
            texture1.needsUpdate = true;
          }
        }
      }
      else // there are no intersections
      {
        // restore previous intersection object (if it exists) to its original color
        if ( INTERSECTED )
          INTERSECTED.material.color.setHex( INTERSECTED.currentHex );
        // remove previous intersection object reference
        //     by setting current intersection object to "nothing"
        INTERSECTED = null;
        context1.clearRect(0,0,300,300);
        texture1.needsUpdate = true;
      }


      //controls.update();
    }

    function render()
    {
      renderer.render( scene, camera );
    }




  }
});
