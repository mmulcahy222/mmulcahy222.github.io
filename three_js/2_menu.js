import * as THREE from "three"; // WebGL import

//webgl node builder  (not webgpu)
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoundedBoxGeometry } from "three/examples/jsm/Addons.js";
import menuData from "./menu_data.json";

////////////////////////////////
//
//     SCENE, CAMERA, & RENDERERS
//
////////////////////////////////
async function generate_threejs_objects() {
  // Set up the scene
  const scene = new THREE.Scene();

  // Set up the camera
  const camera = new THREE.PerspectiveCamera(
    45, // this is the field of vxiew
    window.innerWidth / window.innerHeight, // this is the aspect ratio
    0.5, // this is the near clipping plane
    1000 // this is the far clipping plane
  );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 10;

  // Create the WebGL renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth * 0.7, window.innerHeight); // 70% of window width

  document.getElementById("render-container").appendChild(renderer.domElement);

  ////////////////////////////////
  //
  //     MESHES
  //
  ////////////////////////////////

  //////////////////////
  //
  //	 Meshes - Background
  //
  //////////////////////

  let background_location_x = 0;
  let background_location_y = 0;
  let background_location_z = -40;

  let background_width = 48;
  let background_height = 24;
  let background_width_segments = 20;
  let background_height_segments = 20;

  let background = new THREE.PlaneGeometry(
    background_width,
    background_height,
    background_width_segments,
    background_height_segments
  ); // Adjust segments as needed

  let background_material = new THREE.MeshBasicMaterial();

  // Mickey Mouse texture
  background_material.map = new THREE.TextureLoader().load(
    "images/mickey_mouse.jpg"
  );
  //make image darker
  background_material.map.colorSpace = THREE.SRGBColorSpace;
  background_material.map.wrapS = THREE.RepeatWrapping;
  background_material.map.wrapT = THREE.RepeatWrapping;
  //set color
  background_material.color.set(0x0088ff);

  const p = background.attributes.position;
  // set coordinates further away

  const midpoint = p.count / 2;
  const strength_x = 0.5;
  const strength_y = 0.2;
  const strength_z = 0.05;

  for (let i = 0; i < p.count; i++) {
    const x = p.array[3 * i];
    const y = p.array[3 * i + 1];
    const z = p.array[3 * i + 2];

    // distort the z-axis like a parabola (also the y axis position distorts z)
    p.array[3 * i + 2] =
      Math.abs(y ** 2) * strength_y + Math.abs(x ** 2) * strength_z;
  }

  background.computeVertexNormals();

  // Mesh
  background = new THREE.Mesh(background, background_material);

  //move it back

  background.position.set(
    background_location_x,
    background_location_y,
    background_location_z
  );

  //disney mickey mouse background
  scene.add(background);

  //////////////////////
  //
  //	 Meshes - Menu Item
  //
  //////////////////////

  let menu_item_location_x = -4;
  let menu_item_location_y = 1;
  let menu_item_location_z = 0;

  let menu_item_width = 2;
  let menu_item_height = 2;
  let menu_item_margin = 1;
  let menu_length = 20;

  // START ROUNDED BOX BORDER (SELECTED)
  const radius = 0.1; // Corner round radius
  const segments = 15; // Number of segments for the rounding
  let borderMesh = null;
  function add_border(geometry_object) {
    let rounded_border_line = new RoundedBoxGeometry(
      menu_item_width,
      menu_item_height,
      0.01,
      radius,
      segments
    );
    // Create a white plane for the border
    const borderGeometry = new THREE.PlaneGeometry(
      menu_item_width + radius * 2, // Adjusted for rounded corners
      menu_item_height + radius * 2
    );
    const borderMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
    borderMesh.position.z = -0.02; // Position behind the main item
    // Apply rounded geometry to the main item
    //geometry_object.geometry = rounded_border_line;
    // Add the border mesh to the geometry object
    geometry_object.add(borderMesh);
  }
  // END ROUNDED BOX BORDER (SELECTED)

  //make mesh and set location

  const menuGroup = new THREE.Group(); // Create a group for all menu items
  const menu = [];

  let menu_item = null;

  // Create menu items
  for (let i = 0; i < menu_length; i++) {
    menu_item = new THREE.PlaneGeometry(
      menu_item_width,
      menu_item_height,
      2,
      2
    );

    //material choose
    let menu_item_material = new THREE.MeshBasicMaterial();
    menu_item_material.map = new THREE.TextureLoader().load(menuData[i].image);
    menu_item_material.map.wrapS = THREE.RepeatWrapping;
    menu_item_material.map.wrapT = THREE.RepeatWrapping;

    //make each menu item have a different texture
    menu_item_material.map = menu_item_material.map;
    menu_item_material.map.needsUpdate = true;
    menu_item.computeVertexNormals();
    menu_item = new THREE.Mesh(menu_item, menu_item_material);

    menu_item.position.set(
      menu_item_location_x + i * (menu_item_width + menu_item_margin),
      menu_item_location_y,
      menu_item_location_z
    );
    menuGroup.add(menu_item); // Add to group instead of scene directly
    menu.push(menu_item);
  }

  scene.add(menuGroup); // Add the entire group to the scene

  ////////////////////////////////
  //
  //     RAYCASTER & MOUSE INPUT
  //
  ////////////////////////////////

  // Set up Raycaster and Mouse Interaction
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const render_container_element = document.getElementById("render-container");
  let last_clicked_index = 0;

  function onMouseMove(event) {
    mouse.x = (event.clientX / render_container_element.offsetWidth) * 2 - 1;
    mouse.y = -(event.clientY / render_container_element.offsetHeight) * 2 + 1;
  }

  function onMouseClick(event) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(menuGroup.children);
    // alert(intersects);
    if (intersects.length > 0) {
      const menu_item_clicked = intersects[0].object;
      // Find the index of the clicked item in the menu array
      const clickedIndex = menu.indexOf(menu_item_clicked);
      // /      alert(clickedIndex);

      if (clickedIndex !== -1) {
        // Remove border from all items
        menu.forEach((item, index) => item.remove(borderMesh));
        // Remove border from previously selected item
        menu[last_clicked_index].remove(borderMesh);
        // Add border to newly selected item
        add_border(menu[clickedIndex]);
        // If you want to navigate immediately
        let link = menuData[clickedIndex].url;
        window.location.href = link;
        // get ready to delete the border next time
        last_clicked_index = clickedIndex;
      }
    }
  }

  // Add event listeners for mouse interaction
  window.addEventListener("mousemove", onMouseMove, false);
  //make in the last event of chain
  window.addEventListener("click", onMouseClick, false);

  ////////////////////////////////
  //
  //     KEYBOARD INPUT
  //
  ////////////////////////////////

  // Movement speed for the menu
  const MOVEMENT_SPEED = 0.2;
  const slidingWindowSize = 5; // Size of the sliding slidingWindow
  let slidingWindowStart = 0; // Start index of the sliding slidingWindow
  let selectedIndex = 0; // Index of the selected item
  let object_move = menu[0];
  let slidingWindowStartElement = document.getElementById(
    "slidingWindowStart_element"
  );
  let slidingWindowSizeElement = document.getElementById(
    "slidingWindowSize_element"
  );
  let selectedIndexElement = document.getElementById("selectedIndex_element");

  /**
   * Moves the selection left.
   * If the selection is at the start of the slidingWindow, shift the slidingWindow left.
   */
  function moveLeft() {
    // If selected index is within the slidingWindow, move it left
    if (selectedIndex > slidingWindowStart) {
      selectedIndex--;
      // add border
      menu[selectedIndex + 1].remove(borderMesh);
      add_border(menu[selectedIndex]);
    }
    // If selected index is at the left boundary of the slidingWindow, shift the slidingWindow left
    else if (slidingWindowStart > 0) {
      slidingWindowStart--;
      selectedIndex--;
      // move the entire menu group to the left
      menuGroup.position.x += menu_item_width + menu_item_margin;
      // add border
      menu[selectedIndex + 1].remove(borderMesh);
      add_border(menu[selectedIndex]);
    }

    // update debug values
    slidingWindowStartElement.textContent = slidingWindowStart;
    selectedIndexElement.textContent = selectedIndex;
    slidingWindowSizeElement.textContent = slidingWindowSize;
  }

  /**
   * Moves the selection right.
   * If the selection is at the end of the slidingWindow, shift the slidingWindow right.
   */
  function moveRight() {
    // If selected index is within the slidingWindow, move it right
    if (
      selectedIndex < slidingWindowStart + slidingWindowSize - 1 &&
      selectedIndex < menu.length - 1
    ) {
      selectedIndex++;
      // add border
      menu[selectedIndex - 1].remove(borderMesh);
      add_border(menu[selectedIndex]);
    }
    // If selected index is at the right boundary of the slidingWindow, shift the slidingWindow right
    else if (slidingWindowStart + slidingWindowSize < menu.length) {
      slidingWindowStart++;
      selectedIndex++;
      // move the entire menu group to the right
      menuGroup.position.x -= menu_item_width + menu_item_margin;
      // add border
      menu[selectedIndex - 1].remove(borderMesh);
      add_border(menu[selectedIndex]);
    }
    // update debug values
    slidingWindowStartElement.textContent = slidingWindowStart;
    selectedIndexElement.textContent = selectedIndex;
    slidingWindowSizeElement.textContent = slidingWindowSize;
  }

  function displayWindow() {
    console.log(
      "Menu: ",
      menu.slice(slidingWindowStart, slidingWindowStart + slidingWindowSize)
    );
    console.log("Selected: ", menu[selectedIndex]);
  }

  function onKeyDown(event) {
    switch (event.code) {
      case "ArrowLeft":
        moveLeft();
        break;
      case "ArrowRight":
        moveRight();
        break;
      case "KeyZ": // Move forward
        //move camera back
        camera.position.z -= MOVEMENT_SPEED;
        break;
      case "KeyX": // Move backward
        camera.position.z += MOVEMENT_SPEED;
        break;
    }
  }

  // Add keyboard event listener
  window.addEventListener("keydown", onKeyDown, false);

  // initialize the first position
  moveRight();

  //moveLeft() when leftArrowButton is pressed
  document
    .getElementById("leftArrowButton")
    .addEventListener("click", moveLeft);
  document
    .getElementById("rightArrowButton")
    .addEventListener("click", moveRight);

  ////////////////////////////////
  //
  //     LIGHTING
  //
  ////////////////////////////////

  // Add Spot Light
  const spotLight = new THREE.SpotLight(0xffffff, 100, 100, Math.PI / 4, 1);
  spotLight.position.set(
    0, // x
    0, // y
    0 // z
  );
  scene.add(spotLight);

  // add omnidirectional light
  const pointLight = new THREE.PointLight(0xffffff, 10000, 100);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);

  //////////////////////
  //
  //	 SHADER DEBUG
  //
  //////////////////////

  background_material.onBeforeCompile = (shader) => {
    document.getElementById("vertex-shader").textContent = shader.vertexShader;
    document.getElementById("fragment-shader").textContent =
      shader.fragmentShader;
  };

  ////////////////////////////////
  //
  //     ANIMATION LOOP
  //
  ////////////////////////////////

  function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
  }

  animate();
}

generate_threejs_objects();

//////////////////////
//
//	 Shaders
//
//////////////////////

// Optional: Log the shaders for debugging
// console.log("Vertex Shader:", nodeBuilder.vertexShader);
// console.log("Fragment Shader:", nodeBuilder.fragmentShader);

//////////////////////
//
//	 end
//
//////////////////////
