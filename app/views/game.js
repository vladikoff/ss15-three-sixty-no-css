import Ember from 'ember';
import util from '../helpers/3d/util';

export default Ember.View.extend({
  // Example on how to know when the turn has changed here in the view
  onTurnChange: Ember.observer('controller.turn', function() {
    var myTurn = this.get('controller.turn')
    Ember.Logger.info('It is ' + myTurn + ' your turn')
  }),

  didInsertElement: function () {
    this._super()
    var self = this;

    var container, stats, plane;
    var camera, controls, scene, projector, renderer;
    var objects = [], plane;
    var mouse = new THREE.Vector2(), offset = new THREE.Vector3(), INTERSECTED, SELECTED;
    init();
    animate();
    function init() {
      container = document.getElementById('render');

      camera = new THREE.PerspectiveCamera(70, 16 / 10 , 1, 10000);
      camera.position.z = 50;
      camera.position.y = 40;
      window.CAMERA = camera;
      /*controls = new THREE.TrackballControls(camera);
      controls.rotateSpeed = 1.0;
      controls.zoomSpeed = 1.2;
      controls.panSpeed = 0.8;
      controls.noZoom = false;
      controls.noPan = false;
      controls.staticMoving = true;
      controls.dynamicDampingFactor = 0.3;*/
      scene = new THREE.Scene();
      scene.add(new THREE.AmbientLight(0x505050));
      window.SCENE = scene;
      var light = new THREE.SpotLight(0xffffff, 1.5);
      light.position.set(0, 500, 2000);
      light.castShadow = true;
      light.shadowCameraNear = 200;
      light.shadowCameraFar = camera.far;
      light.shadowCameraFov = 50;
      light.shadowBias = -0.00022;
      light.shadowDarkness = 0.5;
      light.shadowMapWidth = 2048;
      light.shadowMapHeight = 2048;
      scene.add(light);

      // FLOOR
      var floorTexture = new THREE.ImageUtils.loadTexture('checkerboard.jpg');
      floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
      floorTexture.repeat.set( 10, 10 );
      var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
      var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
      var floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.position.y = -0.5;
      floor.rotation.x = Math.PI / 2;
      scene.add(floor);
      camera.lookAt(new THREE.Vector3(0,-20,-20));

      var geometry = new THREE.BoxGeometry( 10, 10, 10 );
      for (var i = 0; i < 10; i++) {
        var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}));
        object.material.ambient = object.material.color;
        object.position.x = (i  * 20) + 100;

        object.scale.x = Math.random() * 2 + 1;
        object.scale.y = Math.random() * 2 + 1;
        object.scale.z = Math.random() * 2 + 1;
        object.castShadow = true;
        object.receiveShadow = true;
        scene.add(object);
        objects.push(object);

      }
      var controller = self.get('controller');
      var navbar = controller.controllerFor('navbar');
      var gameCtrl = controller.controllerFor('game');
      var app = controller.controllerFor('application');

      util.getAvatar(app, navbar, gameCtrl);
      util.createPlanes(scene, objects);
      util.createCardSpots(scene);

      util.addCard('L1', 'Opponent', 'neoziro/grunt-shipit');
      util.addCard('L1', 'Creator', 'Pencroff/WebStorm-Live-Template');
      util.addCard('R1', 'Creator', 'Pencroff/WebStorm-Live-Template');

      setTimeout(function () {
        util.attackCard('CreatorR1', 'OpponentL1');
        setTimeout(function () {
          util.destroyCard('L1', 'Opponent');
        }, 2000);

      }, 2000);


      plane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000, 8, 8), new THREE.MeshBasicMaterial({
        color: 0x000000,
        opacity: 0.25,
        transparent: true,
        wireframe: true
      }));
      plane.visible = false;
      scene.add(plane);
      projector = new THREE.Projector();
      renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setClearColor(0xf0f0f0);
      renderer.setSize(1170, 600);
      renderer.sortObjects = false;
      renderer.shadowMapEnabled = true;
      renderer.shadowMapType = THREE.PCFShadowMap;
      container.appendChild(renderer.domElement);


      renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
      renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
      renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
      //
    }

    function cursorPositionInCanvas(canvas, event) {
      var x, y;

      var canoffset = $('canvas').offset();
      x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
      y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;

      return [x,y];
    }

    function onDocumentMouseMove(event) {
      event.preventDefault();

      mouse.x = ((cursorPositionInCanvas( renderer.domElement, event )[0]) / $('canvas').width()) * 2 - 1;
      mouse.y = ( - (cursorPositionInCanvas( renderer.domElement, event )[1])/ $('canvas').height()) * 2 + 1;

      //
      var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      projector.unprojectVector(vector, camera);
      var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
      if (SELECTED) {
        var intersects = raycaster.intersectObject(plane);
       // SELECTED.position.copy(intersects[0].point.sub(offset));
        return;
      }
      var intersects = raycaster.intersectObjects(objects);
      if (intersects.length > 0) {
        if (INTERSECTED != intersects[0].object) {
          if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
          INTERSECTED = intersects[0].object;
          INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
          plane.position.copy(INTERSECTED.position);
          //plane.lookAt(camera.position);
        }
        container.style.cursor = 'pointer';
      } else {
        if (INTERSECTED) INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
        INTERSECTED = null;
        container.style.cursor = 'auto';
      }
    }

    function onDocumentMouseDown(event) {
      event.preventDefault();
      var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      projector.unprojectVector(vector, camera);
      var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
      var intersects = raycaster.intersectObjects(objects);
      if (intersects.length > 0) {
        //controls.enabled = false;
        SELECTED = intersects[0].object;
        console.log(SELECTED);
        console.log(CURRENT_CARD);

        // if we can place
        if (SELECTED.spots && window.CURRENT_CARD) {
         // util.addCard('L1', 'opponent', 'neoziro/grunt-shipit');
        }

        container.style.cursor = 'move';
      }
    }

    function onDocumentMouseUp(event) {
      event.preventDefault();
      //controls.enabled = true;
      if (INTERSECTED) {
        //plane.position.copy(INTERSECTED.position);
        SELECTED = null;
      }
      container.style.cursor = 'auto';
    }

//
    function animate(time) {
      requestAnimationFrame(animate);
      render();
      TWEEN.update(time);
    }

    function render() {
      //controls.update();
      renderer.render(scene, camera);
    }


  }
});
