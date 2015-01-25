export default {
  controller: null,
  createBaseText: function (text, size) {
    return createTextMesh(text, 0x000088, -10, 5, 15, 5);
  },
  createDmgText: function (text, size) {
    return createTextMesh(text, 0x000088, -2, 5, 0, size);
  },
  createHpText: function (text) {
    return createTextMesh(text, 0xF9904A, -2, 3);
  }
}

function createTextMesh (text, colour, x, y, z, size) {
  var materialFront = new THREE.MeshBasicMaterial( { color: colour } );
  var materialSide = new THREE.MeshBasicMaterial( { color: colour } );
  var materialArray = [ materialFront, materialSide ];
  var textGeom = new THREE.TextGeometry(text,
    {
      size: size || 1.2, height: 0.1, curveSegments: 3,
      font: "helvetiker", weight: "normal", style: "normal",
      bevelThickness: 0, bevelSize: 0, bevelEnabled: true,
      material: 0, extrudeMaterial: 1
    });

  var textMaterial = new THREE.MeshFaceMaterial(materialArray);
  var textMesh = new THREE.Mesh(textGeom, textMaterial );
  textMesh.position.x = x;
  textMesh.position.y = y;
  textMesh.position.z = z ||0;
  textGeom.computeBoundingBox();

  return textMesh;
}
