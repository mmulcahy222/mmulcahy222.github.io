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
  camera.position.z = 8;

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
  // Meshes - variables
  //////////////////////

  let menu_item_location_x = 0;
  let menu_item_location_y = 0.5;
  let menu_item_location_z = 0;

  let menu_item_width = 2;
  let menu_item_height = 2;
  let menu_item_margin = 1;
  let menu_length = 20;

  //////////////////////
  // ROUNDED BOX BORDER (SELECTED)
  //////////////////////

  const radius = 0.1; // Corner round radius
  const segments = 15; // Number of segments for the rounding

  function add_border(parentGroup) {
    const borderGeometry = new THREE.PlaneGeometry(
      menu_item_width + radius * 2,
      menu_item_height + radius * 2
    );
    const borderMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
    });
    const borderMesh = new THREE.Mesh(borderGeometry, borderMaterial);
    borderMesh.position.z = -0.02; // Position behind the main item
    borderMesh.visible = false; // Initially hidden
    parentGroup.add(borderMesh);
  }

  //////////////////////
  // MENU ITEMS
  //////////////////////

  const menuGroup = new THREE.Group(); // Create a group for all menu items
  const menu = [];

  for (let i = 0; i < menu_length; i++) {
    const menuItemGeometry = new THREE.PlaneGeometry(
      menu_item_width,
      menu_item_height,
      5,
      3
    );

    // Material setup
    let menuItemMaterial = new THREE.MeshBasicMaterial();
    menuItemMaterial.map = new THREE.TextureLoader().load(menuData[i].image);
    menuItemMaterial.map.wrapS = THREE.RepeatWrapping;
    menuItemMaterial.map.wrapT = THREE.RepeatWrapping;
    menuItemMaterial.map.needsUpdate = true;

    // Create menu item mesh
    const menuItemMesh = new THREE.Mesh(menuItemGeometry, menuItemMaterial);

    // Create group for menu item + border
    const itemGroup = new THREE.Group();
    itemGroup.add(menuItemMesh);
    add_border(itemGroup); // Add border to the group

    // Position the entire group
    itemGroup.position.set(
      menu_item_location_x + i * (menu_item_width + menu_item_margin),
      menu_item_location_y,
      menu_item_location_z
    );

    menuGroup.add(itemGroup); // Add item group to main menu group
    menu.push(itemGroup);
  }

  scene.add(menuGroup); // Add the entire menu group to the scene

  // Create a bounding box for the entire menuGroup
  const menuBoundingBox = new THREE.Box3().setFromObject(menuGroup);
  // Get the minimum and maximum x coordinates
  const leftmostX = menuBoundingBox.min.x;
  const rightmostX = menuBoundingBox.max.x;
  // If you need the width of the entire menu
  const menuWidth = menuBoundingBox.max.x - menuBoundingBox.min.x;
  const menu_item_z_distort_dampen = -0.05;
  const menu_group_midpoint =
    (menuBoundingBox.min.x + menuBoundingBox.max.x) / 2;
  // Add these variables at the top with your other declarations
  let targetGroupPositionX = 0;
  let isAnimating = false;
  let animationDuration = 1000; // milliseconds
  let animationStartTime = 0;
  let previousSelectedIndex = 0;

  //keep selectedIndex in the middle of the screen
  function updateMenuCurve(fromIndex, toIndex, progress) {
    // Get positions of the from and to items
    const fromItem = menu[fromIndex];
    const toItem = menu[toIndex];

    const fromPosition = new THREE.Vector3();
    const toPosition = new THREE.Vector3();

    fromItem.getWorldPosition(fromPosition);
    toItem.getWorldPosition(toPosition);

    // Interpolate between the two positions
    const currentCenterX =
      fromPosition.x + (toPosition.x - fromPosition.x) * progress;

    menuGroup.children.forEach((menuItemGroup, menuIndex) => {
      menuItemGroup.children.forEach((menuItem) => {
        if (menuItem.geometry && menuItem.geometry.attributes.position) {
          const positions = menuItem.geometry.attributes.position;
          const vertex = new THREE.Vector3();

          for (let i = 0; i < positions.count; i++) {
            vertex.set(positions.getX(i), positions.getY(i), positions.getZ(i));
            menuItem.localToWorld(vertex);

            let menu_item_x_position = vertex.x;

            // Calculate z-position based on distance from interpolated center position
            let menu_item_z_position =
              Math.abs(menu_item_x_position - currentCenterX) ** 2 *
              menu_item_z_distort_dampen;

            menuItem.worldToLocal(vertex);
            positions.setXYZ(i, vertex.x, vertex.y, menu_item_z_position);
          }
          positions.needsUpdate = true;
        }
      });
    });
  }

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
    const intersects = raycaster.intersectObjects(menuGroup.children, true); // Add true to check children

    if (
      intersects.length > 0 &&
      intersects[0].object === menuGroup.children[selectedIndex].children[0]
    ) {
      // Find the parent group of the clicked object
      const clickedObject = intersects[0].object;
      const parentGroup = clickedObject.parent;

      // Find the index of the parent group in the menu array
      const clickedIndex = menu.indexOf(parentGroup);

      if (clickedIndex !== -1) {
        // Hide border on current selected item
        menu[selectedIndex].children[1].visible = false;

        // Update selected index
        selectedIndex = clickedIndex;

        // Show border on newly selected item
        menu[selectedIndex].children[1].visible = true;

        // Center the clicked item
        menuGroup.position.x = -(
          clickedIndex *
          (menu_item_width + menu_item_margin)
        );

        // Update the curve
        updateMenuCurve();

        // Navigate to the URL
        let link = menuData[clickedIndex].url;
        window.location.href = link;
      }
    }
  }

  // Add event listeners for mouse interaction
  window.addEventListener("mousemove", onMouseMove, false);
  //make in the last event of chain
  window.addEventListener("click", onMouseClick, false);
  window.addEventListener("click", onMouseClick, false);

  ////////////////////////////////
  //
  //     KEYBOARD INPUT
  //
  ////////////////////////////////

  // Movement speed for the menu
  const MOVEMENT_SPEED = 0.2;
  let selectedIndex = 0; // Only keep track of selected item
  let selectedIndexElement = document.getElementById("selectedIndex_element");

  // direction should be 1 for right, -1 for left
  function moveSelection(direction) {
    const isMovingRight = direction > 0;
    const canMove = isMovingRight
      ? selectedIndex < menu.length - 1
      : selectedIndex > 0;

    if (canMove) {
      // Removed the "&& !isAnimating" check
      // Start animation
      isAnimating = true;
      animationStartTime = Date.now();
      previousSelectedIndex = selectedIndex;

      // Hide current border
      menu[selectedIndex].children[1].visible = false;

      // Update selected index
      selectedIndex += direction;

      // Show new border
      menu[selectedIndex].children[1].visible = true;

      // Calculate target position
      targetGroupPositionX = -(
        selectedIndex *
        (menu_item_width + menu_item_margin)
      );

      // Update debug value
      selectedIndexElement.textContent = selectedIndex;
    }
  }
  function onKeyDown(event) {
    switch (event.code) {
      case "ArrowLeft":
        moveSelection(-1);
        break;
      case "ArrowRight":
        moveSelection(1);
        break;
      case "KeyZ": // Move forward
        //move camera back
        camera.position.z -= MOVEMENT_SPEED;
        break;
      case "KeyX": // Move backward
        camera.position.z += MOVEMENT_SPEED;
        break;
      //enter
      case "Enter":
        let link = menuData[selectedIndex].url;
        window.location.href = link;
        break;
    }
  }

  // Add keyboard event listener
  window.addEventListener("keydown", onKeyDown, false);

  // initialize the first position
  moveSelection(1);
  moveSelection(1);
  moveSelection(1);
  moveSelection(1);
  moveSelection(1);
  moveSelection(1);

  //moveSelection when leftArrowButton or rightArrowButton is pressed
  document
    .getElementById("leftArrowButton")
    .addEventListener("click", () => moveSelection(-1));
  document
    .getElementById("rightArrowButton")
    .addEventListener("click", () => moveSelection(1));

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

    // Handle animations
    if (isAnimating) {
      const elapsedTime = Date.now() - animationStartTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);

      // Apply easing function (ease-out quadratic)
      const easedProgress = 1 - Math.pow(1 - progress, 10);

      // Interpolate menuGroup position
      const startX = menuGroup.position.x;
      const endX = targetGroupPositionX;
      menuGroup.position.x = startX + (endX - startX) * easedProgress;

      // Gradually update the curve during animation
      updateMenuCurve(previousSelectedIndex, selectedIndex, easedProgress);

      // Check if animation is complete
      if (progress >= 1) {
        isAnimating = false;
        menuGroup.position.x = targetGroupPositionX; // Ensure exact final position
        updateMenuCurve(); // Final update of the curve
      }
    }
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
