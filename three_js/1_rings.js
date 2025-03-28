import WGSLNodeBuilder from "three/src/renderers/webgpu/nodes/WGSLNodeBuilder.js";
import * as THREE from "three/webgpu"; // WebGPU import
import { NodeBuilder } from "three/webgpu";

////////////////////////////////
//
//     SCENE, CAMERA, & RENDERER
//
////////////////////////////////

// Set up the scene
const scene = new THREE.Scene();

// Set up the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Create the WebGPU renderer
const renderer = new THREE.WebGPURenderer();
renderer.setSize(window.innerWidth * 0.7, window.innerHeight); // 70% of window width
document.getElementById("render-container").appendChild(renderer.domElement);

////////////////////////////////
//
//     MATERIAL & RINGS
//
////////////////////////////////

// Create a Material for the Rings
const ringMaterial = new THREE.MeshStandardMaterial({
  color: 0xffff00, // Brighter yellow color
  metalness: 1, // Fully metallic
  roughness: 0.0, // Shiny and smooth
  emissive: 0xffff00, // Bright yellow glow effect
  emissiveIntensity: 0.3, // Higher emissive intensity for a brighter effect
});

// Create a Row of 5 Rings
const rings = [];
const numRings = 2;
const spacing = 3; // Spacing between the rings

for (let i = 0; i < numRings; i++) {
  const geometry = new THREE.TorusGeometry(1, 0.2, 16, 30); // Inner radius, tube radius, radial segments, tube segments
  const ring = new THREE.Mesh(geometry, ringMaterial);
  ring.position.x = i * spacing - ((numRings - 1) * spacing) / 2; // Position rings in a row
  ring.rotation.set(0, 0, 0); // Ensure all rings start with the same orientation

  scene.add(ring);
  rings.push(ring);
}

// Reference to the first ring
const first_ring = rings[0];

////////////////////////////////
//
//     LIGHTING
//
////////////////////////////////

// Add Spot Light
const spotLight = new THREE.SpotLight(0xffffff, 10000, 100, Math.PI / 4, 1);
spotLight.position.set(0, 2, 10);
spotLight.target = rings[1]; // Focus light on the center ring
scene.add(spotLight);

////////////////////////////////
//
//     RAYCASTER & MOUSE INPUT
//
////////////////////////////////

// Set up Raycaster and Mouse Interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onMouseClick(event) {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(rings);

  if (intersects.length > 0) {
    const clickedRing = intersects[0].object;

    // If the first ring is clicked, navigate to Google
    if (clickedRing === first_ring) {
      window.location.href = "https://www.google.com";
    }
  }
}

// Add event listeners for mouse interaction
window.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("click", onMouseClick, false);

////////////////////////////////
//
//     KEYBOARD INPUT
//
////////////////////////////////

// Movement speed for the first ring
const MOVEMENT_SPEED = 0.1;

function onKeyDown(event) {
  switch (event.code) {
    case "ArrowUp":
      first_ring.position.y += MOVEMENT_SPEED;
      break;
    case "ArrowDown":
      first_ring.position.y -= MOVEMENT_SPEED;
      break;
    case "ArrowLeft":
      first_ring.position.x -= MOVEMENT_SPEED;
      break;
    case "ArrowRight":
      first_ring.position.x += MOVEMENT_SPEED;
      break;
    case "KeyZ": // Move forward
      first_ring.position.z -= MOVEMENT_SPEED;
      break;
    case "KeyX": // Move backward
      first_ring.position.z += MOVEMENT_SPEED;
      break;
  }
}

// Add keyboard event listener
window.addEventListener("keydown", onKeyDown, false);

////////////////////////////////
//
//     ANIMATION LOOP
//
////////////////////////////////

function animate() {
  requestAnimationFrame(animate);

  // Rotate all rings individually
  rings.forEach((ring) => {
    ring.rotation.y += 0.01;
  });

  renderer.render(scene, camera);
}

animate();
//////////////////////
//
//	 Shaders
//
//////////////////////

renderer.init().then(() => {
  const nodeBuilder = new WGSLNodeBuilder(first_ring, renderer);

  nodeBuilder.scene = scene;
  nodeBuilder.material = first_ring.material;
  nodeBuilder.camera = camera;
  nodeBuilder.build();

  document.getElementById("vertex-shader").textContent =
    nodeBuilder.vertexShader || "No vertex shader available";
  document.getElementById("fragment-shader").textContent =
    nodeBuilder.fragmentShader || "No fragment shader available";
  document.getElementById("compute-shader").textContent =
    nodeBuilder.computeShader || "No compute shader available";

  //console log all shaders
  //console.log(nodeBuilder.vertexShader);
  //console.log(nodeBuilder.fragmentShader);
  //console.log(nodeBuilder.computeShader);
});

//////////////////////
//
//	 end
//
//////////////////////
