import text from './text';

export default {
  controller: null,
  createPlanes: function (scene) {
    var pos = [
      // YOURS
      {
        _direction: 'center',
        _type: 'placeholder',
        add: true,
        x: 0,
        z: 60,
        c: 0x7FF72E
      },
      {
        _direction: 'left',
        _type: 'placeholder',
        add: true,
        x: -30,
        z: 60,
        c: 0x00FBE4
      },
      {
        _direction: 'right',
        _type: 'placeholder',
        add: true,
        x: 30,
        z: 60,
        c: 0xFF2F1A
      },

      // OTHERS
      {
        x: 0,
        z: -60,
        c: 0x468966
      },
      {
        x: -30,
        z: -60,
        c: 0x1B63F7
      },
      {
        x: 30,
        z: -60,
        c: 0xD25025
      }
    ];

    pos.forEach(position => {
      var geometry = new THREE.BoxGeometry(30, 0.1, 120);
      var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: position.c}));
      object.material.ambient = object.material.color;
      object.position.x = position.x;
      object.position.y = 2;
      object.position.z = position.z;
      object.castShadow = true;
      object._type = position._type;
      object._direction = position._direction;
      object.receiveShadow = true;
      scene.add(object);

      if (position.add) {
        scene._clickable_objects.push(object);
      }

    });
  },

  createCardSpots: function (scene) {
    window.POSITIONS = {
      boardCreatorL1:
      {
        x: -25,
        z: 20,
      },
      boardCreatorL2: {
        x: -25,
        z: 35,
      },
      boardCreatorC1:
      {
        x: 0,
        z: 20,
      },
      boardCreatorC2: {
        x: 0,
        z: 35,
      },
      boardCreatorR1: {
        x: 25,
        z: 20,
      },
      boardCreatorR2: {
        x: 25,
        z: 35,
      },

      boardOpponentL1:
      {
        x: 25,
        z: -5,
      },
      boardOpponentL2: {
        x: 25,
        z: -20,
      },
      boardOpponentC1:
      {
        x: 0,
        z: -5,
      },
      boardOpponentC2: {
        x: 0,
        z: -20,
      },
      boardOpponentR1: {
        x: -25,
        z: -5,
      },
      boardOpponentR2: {
        x: -25,
        z: -20,
      }


    };

    var objects = [];
/*
    Object.keys(window.POSITIONS).forEach(position => {
      var item = window.POSITIONS[position];
      var geometry = new THREE.BoxGeometry(5, 5, 5);
      var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xD25025}));
      object.position.x = item.x;
      object.position.y = 10;
      object.position.z = item.z;
      scene.add(object);
      //objects.push(object);

    });*/

    return objects;

  },
  /**
   *       util.addCard('L1', 'Opponent', 'neoziro/grunt-shipit');
           util.addCard('L1', 'Creator', 'Pencroff/WebStorm-Live-Template');
   */
  addCard: function (position, owner, card) {
    var scene = window.SCENE;
    if (scene) {
      var debug = location.search.indexOf('debug') > -1;

      if (!card.get && !debug) throw new Error('You tried setting a card without an id')

      Ember.Logger.info('Adding Card', card);

      var destination = window.POSITIONS['board' + owner + position];
      if (!debug) {
        var data = card.get('id')
        destination.data = data;
      }

      var geometry = new THREE.BoxGeometry(10, 15, 0.1);
      var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xFFFFFF, transparent: true}));

      object.position.x = destination.x;
      object.position.y = 10;
      object.position.z = destination.z;
      object.name = 'board' + owner + position;

      var dmgTxt = text.createDmgText('2 DMG');
      object.add(dmgTxt);
      var hpTxt = text.createHpText('2 HP');
      object.add(hpTxt);

      var image = new Image();
      image.crossOrigin = "Anonymous";
      image.addEventListener('load', () => {
        console.log('loaded img');
        var texture = new THREE.Texture(image);
        texture.needsUpdate = true;
        var geometry = new THREE.BoxGeometry(9, 9, 0.6);
        var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: texture}));
        // TODO: this messh should also
        mesh.rotation.y = Math.PI;
        mesh.position.y = -2;
        object.add(mesh);
      }, false);
      if (!debug) {
        image.src = card.get('owner.avatar_url');
      }
      scene.add(object);
      scene._clickable_objects.push(object);
    }
  },
  attackCard: function (source, destination) {
    Ember.Logger.info('Attacking', source, destination);
    var scene = window.SCENE;

    var origSource = window.POSITIONS[source];

    var sourceObject = scene.getObjectByName(source);
    var destinationObject = scene.getObjectByName(destination);

    var cameraOrigPos = window.CAMERA.position;

    var tween = new TWEEN.Tween(sourceObject.position)
      .to({x: destinationObject.position.x, z: destinationObject.position.z }, 500)
      .easing(TWEEN.Easing.Quadratic.Out).onComplete(function (params) {
          window.SOUNDTRACK.hit();
      });

    var tweenBack = new TWEEN.Tween(sourceObject.position)
      .to({x: origSource.x, z: origSource.z }, 1000);

    tween.chain(tweenBack);
    tween.start();
  },
  destroyCard: function (position, owner) {
    var scene = window.SCENE;
    Ember.Logger.info('Removing Card', 'board' + owner + position);
    var sourceObject = scene.getObjectByName('board' + owner + position);

    new TWEEN.Tween(sourceObject.position)
      .to({x: 200, y: 200, rotation: 0}, 3000)
      .easing(TWEEN.Easing.Elastic.InOut)
      .onComplete(function (params) {
        scene.remove(sourceObject);
      }).start();
  },
  cardAttackSelectionMode : function (selectedCardId) {
    //stop last selected card
    var lastSelected = window.__SELECTED_CARD_TWEEN;
    if (lastSelected) lastSelected.stop();

    var scene = window.SCENE;
    var sourceObject = scene.getObjectByName(selectedCardId);
    var up = 20;
    var down = sourceObject.position.y;

    var tween = new TWEEN.Tween(sourceObject.position)
      .to({y: up}, 500)
      .easing(TWEEN.Easing.Quadratic.Out);

    var tweenBack = new TWEEN.Tween(sourceObject.position)
      .to({y: down}, 1000);

    tween.chain(tweenBack);
    tweenBack.chain(tween);

    tween.onStop(function (params) {
      sourceObject.position.y = down;
    });

    window.__SELECTED_CARD_TWEEN = tween.start();
  },
  stopAttackSelectionMode: function () {
    var lastSelected = window.__SELECTED_CARD_TWEEN;
    if (lastSelected) lastSelected.stop();
    window.__SELECTED_CARD = null;
  },
  makeAllOppositeCardsAttackable: function () {
    if (window.__ATTACK_TWEENS) {
      window.__ATTACK_TWEENS.forEach(function (tween) {
        tween.stop();
      })
      window.__ATTACK_TWEENS = [];
    } else {
      window.__ATTACK_TWEENS = [];
    }


    var scene = window.SCENE;
    // TODO: Get a better list
    var oppositeObjs = [
      'boardOpponentL1',
      'boardOpponentL2',
      'boardOpponentC1',
      'boardOpponentC2',
      'boardOpponentR1',
      'boardOpponentR2'
    ];

    oppositeObjs.forEach(function (cardName) {

      var sourceObject = scene.getObjectByName(cardName);
      if (sourceObject) {
        var t1 = new TWEEN.Tween( sourceObject.material ).to( { opacity: 0.6 }, 1000 )
        var t2 = new TWEEN.Tween( sourceObject.material ).to( { opacity: 1 }, 1000 )

        t1.chain(t2);
        t2.chain(t1);
        t1.start();

        t1.onStop(function () {
          sourceObject.material.opacity = 1;
        });

        window.__ATTACK_TWEENS.push(t1);
      }
    })
  },
  stopAllOppositeCardsAttackable: function() {
    if (window.__ATTACK_TWEENS) {
      window.__ATTACK_TWEENS.forEach(function (tween) {
        tween.stop();
      })
    }
  }
}

