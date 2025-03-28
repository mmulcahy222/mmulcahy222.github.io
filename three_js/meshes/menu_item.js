import * as THREE from "three"; // WebGL import

let location_x = 0;
let location_y = 0;
let location_z = 2;

let menu_item = new THREE.PlaneGeometry(2, 1, 2, 2); // Adjust segments as needed

// set locations

const material = new THREE.MeshBasicMaterial();
menu_item.computeVertexNormals();

material.map = new THREE.TextureLoader().load(
  "../images/red_dead_redemption.jpeg"
);
material.map.wrapS = THREE.RepeatWrapping;
material.map.wrapT = THREE.RepeatWrapping;

//make mesh and set location
menu_item = new THREE.Mesh(menu_item, material);
menu_item.position.set(location_x, location_y, location_z);

export { menu_item };
