export default {
  createPlanes: function (scene, objects) {
    var pos = [
      // YOURS
      {
        add: true,
        x: 0,
        z: 60,
        c: 0x7FF72E
      },
      {
        add: true,
        x: -30,
        z: 60,
        c: 0x00FBE4
      },
      {
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
        c: 0x8E2800
      },
      {
        x: 30,
        z: -60,
        c: 0xD25025
      }
    ];

    pos.forEach(position => {
      var geometry = new THREE.BoxGeometry( 30, 0.1, 120 );
      var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: position.c}));
      object.material.ambient = object.material.color;
      object.position.x = position.x;
      object.position.y = 2;
      object.position.z = position.z;
      object.castShadow = true;
      object.receiveShadow = true;
      scene.add(object);

      if (position.add) {
        objects.push(object);
      }

    });

    return objects

  },

  getAvatar: function () {
  var image = new Image();
  image.crossOrigin = "Anonymous";

  image.addEventListener('load', function () {
    console.log('loaded img');
    var texture = new THREE.Texture(image);
    texture.needsUpdate = true;
    var geometry = new THREE.BoxGeometry( 30, 30, 0.1 );
    var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
    mesh.rotation.y = Math.PI;
    mesh.position.x = 0;
    mesh.position.y = 15;
    mesh.position.z = -80;
    window.SCENE.add(mesh);
  }, false);

  image.src = 'https://avatars0.githubusercontent.com/u/128755?v=3&s=460';

  },

  createCardSpots: function (scene) {
    var pos = [
      // YOURS
      {
        x: 0,
        z: 20,
      },
      {
        x: -25,
        z: 20,
      },
      {
        x: 25,
        z: 20,
      },
      {
        x: 0,
        z: 35,
      },
      {
        x: -25,
        z: 35,
      },
      {
        x: 25,
        z: 35,
      },

/////////////////////
      {
        x: 0,
        z: -5,
      },
      {
        x: -25,
        z: -5,
      },
      {
        x: 25,
        z: -5,
      },
      {
        x: 0,
        z: -20,
      },
      {
        x: -25,
        z: -20,
      },
      {
        x: 25,
        z: -20,
      },

    ];

    var objects = [];

    pos.forEach(position => {
      var geometry = new THREE.BoxGeometry( 5, 5, 5);
      var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xD25025}));
      object.position.x = position.x;
      object.position.y = 10;
      object.position.z = position.z;
      scene.add(object);
      //objects.push(object);

    });

    return objects;

  },


}

