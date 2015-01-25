import Ember from 'ember';
import util from '../helpers/3d/util';

export default Ember.View.extend({
  didInsertElement: function() {
    this._super()
    this.init3d()
  },

  // When the opponent avatar changes
  onOpponentAvatar: Ember.observer('controller.opponentAvatarUrl', function() {
    var src = this.get('controller.opponentAvatarUrl')
    if (!src) return
    var image = new Image();
    image.crossOrigin = "Anonymous";
    image.addEventListener('load', () => {
      console.log('loaded img');
      var texture = new THREE.Texture(image);
      texture.needsUpdate = true;
      var geometry = new THREE.BoxGeometry(30, 30, 0.1);
      var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: texture}));
      mesh.rotation.y = Math.PI;
      mesh.position.x = 0;
      mesh.position.y = 15;
      mesh.position.z = -80;
      this.get('scene').add(mesh);
    }, false);
    image.src = src
  }),

  // Add board keys
  dynamicallyAddBoardKeyObservers: Ember.on('didInsertElement', function() {
    this.get('controller.boardKeys').forEach((key) => {
      Ember.addObserver(this.get('controller'), key, this, this.onBoardChange)
    })
  }),
  onBoardChange: function(controller, key) {
    if (!this.get('scene')) return
    // var isOpponent = this.get('controller.isOpponent')
    // if (isOpponent) {
    //   if (key.indexOf('Creator') != -1) {
    //     key = key.replace('Creator', 'Opponent')
    //   } else if (key.indexOf('Opponent') != -1) {
    //     key = key.replace('Opponent', 'Creator')
    //   }
    // }

    var cardId = this.get('controller.' + key)
    var position = key.replace('board', '')
    var owner = 'Creator'
    if (key.indexOf('Opponent') != -1) {
      owner = 'Opponent'
    }
    position = position.replace(owner, '')
    this.get('controller').lookupCard(cardId).then((card) => {
      Ember.Logger.info('Creating mesh for card', position, owner, card.get('id'));
      util.addCard(position, owner, card)
    })
  },

  init3d: function () {
    var self = this;

    var container, stats, plane;
    var camera, controls, scene, projector, renderer;
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
      scene._clickable_objects = [];

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
        scene._clickable_objects.push(object);

      }

      util.createPlanes(scene);
      util.createCardSpots(scene);

      //util.addCard('L2', 'Opponent', 'neoziro/grunt-shipit');
      //util.addCard('L1', 'Opponent', 'neoziro/grunt-shipit');
      //util.addCard('L1', 'Creator', 'Pencroff/WebStorm-Live-Template');
      //util.addCard('R1', 'Creator', 'Pencroff/WebStorm-Live-Template');
      //util.addCard('R2', 'Creator', 'Pencroff/WebStorm-Live-Template');

      // setTimeout(function () {
      //   util.attackCard('CreatorL1', 'OpponentL1');
      //   setTimeout(function () {
      //     util.destroyCard('L1', 'Opponent');
      //   }, 2000);

      // }, 2000);


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

      // set properties to make them available on this view
      self.setProperties({ container, camera, scene, renderer, mouse, projector })
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
      var intersects = raycaster.intersectObjects(scene._clickable_objects);
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
      var intersects = raycaster.intersectObjects(scene._clickable_objects);

      if (intersects.length > 0) {
        //controls.enabled = false;

        // TODO: Check if a card, not a grid space was clicked
        if (intersects[0].object.hasOwnProperty('_direction')) {
          // A grid space clicked
          var direction = intersects[0].object._direction;
          direction = direction.slice(0, 1).toUpperCase() + '1'
          Ember.Logger.info('You are the opponent? ', self.get('controller.isOpponent'))
          var owner = self.get('controller.isOpponent') ? 'Opponent' : 'Creator'
          self.get('controller').send('setBoard', 'board' + owner + direction)
        } else {
          // A card was clicked
          var spot = intersects[0].object.name;
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
  },
});
