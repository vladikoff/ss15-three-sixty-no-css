export default {
  createPlanes: function (scene) {
    var pos = [
      // YOURS
      {
        x: 0,
        z: 60,
        c: 0x7FF72E
      },
      {
        x: -30,
        z: 60,
        c: 0x00FBE4
      },
      {
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
      var material = new THREE.MeshLambertMaterial({color: position.c, opacity: 0.99, transparent: true});
      var object = new THREE.Mesh(geometry, material);
      object.rotation.y = Math.PI;
      object.position.x = position.x;
      object.position.y = 2;
      object.position.z = position.z;

      scene.add(object);

    });

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

}


}

