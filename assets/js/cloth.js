// settings
// Set canvas dimensions to match the window size
canvas = document.getElementById('cloth');
canvas_height = window.innerHeight;
canvas_width = window.innerWidth;
// Physics simulation parameters
var physics_accuracy = 3,
    mouse_influence = 20,
    mouse_cut = 5,
    gravity = 500,
    spacing = 15,
    cloth_height = Math.floor(canvas_height / spacing),
    cloth_width = Math.floor(canvas_width / spacing),
    start_y = 0,
    tear_distance = 50;
// Cross-browser requestAnimationFrame function
// Cross-browser requestAnimationFrame and cancelAnimationFrame functions
window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        return window.setTimeout(callback, 1000 / 60);
    };
window.cancelAnimFrame =
    window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msCancelAnimationFrame ||
    function (id) {
        clearTimeout(id);
    };
// Example usage of requestAnimFrame and cancelAnimFrame
var animationFrameId;
// Function to stop the animation
function stopAnimation() {
    cancelAnimFrame(animationFrameId);
}
// Initialize canvas and context, cloth object, and mouse object
var ctx,
    cloth,
    boundsx,
    boundsy,
    mouse = {
        down: false,
        button: 1,
        x: 0,
        y: 0,
        px: 0,
        py: 0
    };
// Function to check if the canvas is in view
function isCanvasInView() {
    var rect = canvas.getBoundingClientRect();
    result = (
        rect.bottom >= 0
    );
    return result;
}
// Define a constructor function for a point in the cloth
var Point = function (x, y) {
    // Point properties
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.vx = 0;
    this.vy = 0;
    this.pin_x = null;
    this.pin_y = null;
    this.constraints = []; // List of constraints connected to this point
};
// Update the properties of a point based on physics simulations
Point.prototype.update = function (delta) {
    // If the mouse is being held down
    if (mouse.down) {
        // Calculate distance between point and mouse
        var diff_x = this.x - mouse.x,
            diff_y = this.y - mouse.y,
            dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y);
        // If left mouse button is being held
        if (mouse.button == 1) {
            // Adjust position based on mouse influence
            if (dist < mouse_influence) {
                this.px = this.x - (mouse.x - mouse.px) * 1.8;
                this.py = this.y - (mouse.y - mouse.py) * 1.8;
            }
        // If right mouse button is being held, remove constraints within mouse_cut distance
        } else if (dist < mouse_cut) {
            this.constraints = [];
        }
    }
    // Apply gravity force
    this.add_force(0, gravity);
    // Update position using Verlet integration
    delta *= delta;
    var nx = this.x + ((this.x - this.px) * 0.99) + ((this.vx / 2) * delta);
    var ny = this.y + ((this.y - this.py) * 0.99) + ((this.vy / 2) * delta);
    // Update previous position and current position
    this.px = this.x;
    this.py = this.y;
    this.x = nx;
    this.y = ny;
    // Reset velocity
    this.vy = this.vx = 0;
};
// Draw the point on the canvas if it has constraints
Point.prototype.draw = function () {
    // Draw constraints connected to this point
    if (!this.constraints.length) return;
    var i = this.constraints.length;
    while (i--) this.constraints[i].draw();
};
// Resolve constraints to maintain the shape of the cloth
Point.prototype.resolve_constraints = function () {
    // If the point is pinned, set its position and exit
    if (this.pin_x != null && this.pin_y != null) {
        this.x = this.pin_x;
        this.y = this.pin_y;
        return;
    }
    // Resolve constraints by adjusting positions
    var i = this.constraints.length;
    while (i--) this.constraints[i].resolve();
    // Keep the point within canvas bounds
    this.x > boundsx ? this.x = 2 * boundsx - this.x : 1 > this.x && (this.x = 2 - this.x);
    this.y < 1 ? this.y = 2 - this.y : this.y > boundsy && (this.y = 2 * boundsy - this.y);
};
// Attach a constraint to this point
Point.prototype.attach = function (point) {
    // Add a new constraint connected to this point
    this.constraints.push(
        new Constraint(this, point)
    );
};
// Remove a constraint from this point's constraints list
Point.prototype.remove_constraint = function (constraint) {
    // Remove a specific constraint from the list
    this.constraints.splice(this.constraints.indexOf(constraint), 1);
};
// Apply a force to the point
Point.prototype.add_force = function (x, y) {
    // Add force components to the velocity
    this.vx += x;
    this.vy += y;
    // Limit velocity to avoid excessive speed
    var round = 400;
    this.vx = ~~(this.vx * round) / round;
    this.vy = ~~(this.vy * round) / round;
};
// Pin the point to a specific position
Point.prototype.pin = function (pinx, piny) {
    // Set the pinned position of the point
    this.pin_x = pinx;
    this.pin_y = piny;
};
// Define a constructor function for a constraint between two points
var Constraint = function (p1, p2) {
    // Constraint properties
    this.p1 = p1;
    this.p2 = p2;
    this.length = spacing;
};
// Resolve the constraint by adjusting the points' positions
Constraint.prototype.resolve = function () {
    // Calculate difference and distance between points
    var diff_x = this.p1.x - this.p2.x,
        diff_y = this.p1.y - this.p2.y,
        dist = Math.sqrt(diff_x * diff_x + diff_y * diff_y),
        diff = (this.length - dist) / dist;
    // If the distance between points is too large, remove the constraint
    if (dist > tear_distance) this.p1.remove_constraint(this);
    // Calculate position adjustments for both points
    var px = diff_x * diff * 0.5;
    var py = diff_y * diff * 0.5;
    // Apply adjustments to points' positions
    this.p1.x += px;
    this.p1.y += py;
    this.p2.x -= px;
    this.p2.y -= py;
};
// Draw the constraint line on the canvas
Constraint.prototype.draw = function () {
    // Draw a line representing the constraint
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
};
// Define a constructor function for the cloth
var Cloth = function () {
    this.points = [];
    // Calculate starting position for the cloth
    var start_x = canvas.width / 2 - cloth_width * spacing / 2;
    // Create points for the cloth grid
    for (var y = 0; y <= cloth_height; y++) {
        for (var x = 0; x <= cloth_width; x++) {
            var p = new Point(start_x + x * spacing, start_y + y * spacing);
            // Attach neighboring points with constraints
            x != 0 && p.attach(this.points[this.points.length - 1]);
            y == 0 && p.pin(p.x, p.y);
            y != 0 && p.attach(this.points[x + (y - 1) * (cloth_width + 1)])
            // Add point to the cloth's points array
            this.points.push(p);
        }
    }
};
// Update all points in the cloth
Cloth.prototype.update = function () {
    var i = physics_accuracy;
    // Resolve constraints multiple times for stability
    while (i--) {
        var p = this.points.length;
        while (p--) this.points[p].resolve_constraints();
    }
    // Update each point's position
    i = this.points.length;
    while (i--) this.points[i].update(0.016);
};
// Define a function to initialize cloth with random Mardi Gras colors
Cloth.prototype.initClothWithRandomColors = function () {
    this.clothColors = [];
    // Define Mardi Gras colors
    var mardiGrasColors = ['#000000', '#FF2734', '#35346D']; // Purple, Gold, Green
    // Loop through the points in the cloth
    for (var y = 0; y < cloth_height; y++) {
        this.clothColors[y] = [];
        for (var x = 0; x < cloth_width; x++) {
            // Get a random Mardi Gras color
            var randomColor = mardiGrasColors[Math.floor(Math.random() * mardiGrasColors.length)];
            // Assign the random color to the 2D array
            this.clothColors[y][x] = randomColor;
        }
    }
};
// Define a function to fill spaces between nearby constraints using the initialized colors
Cloth.prototype.fillSpacesBetweenConstraints = function () {
    ctx.beginPath();
    // Loop through the points in the cloth
    for (var y = 0; y < cloth_height; y++) {
        for (var x = 0; x < cloth_width; x++) {
            var p1 = this.points[x + y * (cloth_width + 1)];
            var p2 = this.points[x + 1 + y * (cloth_width + 1)];
            var p3 = this.points[x + (y + 1) * (cloth_width + 1)];
            var p4 = this.points[x + 1 + (y + 1) * (cloth_width + 1)];
            // Check if all endpoints of constraints are still present before filling the space
            if (p1 && p1.constraints.length-1 > 0 && p2 && p2.constraints.length-1 > 0 &&
                p3 && p3.constraints.length-1 > 0 && p4 && p4.constraints.length-1 > 0) {
                // Get the Mardi Gras color from the initialized array
                var color = this.clothColors[y][x];
                // Draw a shape using nearby constraints
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.lineTo(p4.x, p4.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.closePath();
                // Set the fill style to the selected color
                ctx.fillStyle = color;
                // Fill the shape
                ctx.fill();
            }
        }
    }
};
Cloth.prototype.draw = function () {
    // Begin drawing path
    ctx.beginPath();
    // Draw constraints for each point
    var i = cloth.points.length;
    // while (i--) cloth.points[i].draw();
    // Stroke the path to draw the constraints
    ctx.stroke();
    // Fill spaces between nearby constraints
    this.fillSpacesBetweenConstraints();
};
// Update function to be called for each animation frame
function animate() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Update and draw the cloth
    cloth.update();
    cloth.draw();
    // Request the next animation frame
    console.log("Yes");
    animationFrameId = requestAnimFrame(animate);
}
// Initialization function to set up the cloth simulation
function start() {
    // Define mouse event handlers
    canvas.onmouseup = function (e) {
        mouse.down = false;
        e.preventDefault();
    };
    canvas.onmousemove = function (e) {
        mouse.px = mouse.x;
        mouse.py = mouse.y;
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left,
        mouse.y = e.clientY - rect.top,
        mouse.down = true;
        e.preventDefault();
    };
    // Define touch event handlers (for mobile)
    canvas.ontouchstart = function (e) {
        mouse.down = true;
        e.preventDefault();
    };
    canvas.ontouchmove = function (e) {
        mouse.px = mouse.x;
        mouse.py = mouse.y;
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left,
        mouse.y = e.touches[0].clientY - rect.top;
        e.preventDefault();
    };
    canvas.ontouchend = function (e) {
        mouse.down = false;
        e.preventDefault();
    };
    // Prevent context menu on touch and long press
    canvas.oncontextmenu = function (e) {
        e.preventDefault();
    };
    // Set canvas bounds
    boundsx = canvas.width - 1;
    boundsy = canvas.height - 1;
    // Set stroke color
    ctx.strokeStyle = 'goldenrod';
    // Initialize the cloth simulation
    cloth = new Cloth();
    cloth.initClothWithRandomColors();
    // Start the animation loop
    isAnimating = true;
    animate();
}
// Event listener when the window has loaded
// window.onload = function () {
    // Get canvas and context
    canvas = document.getElementById('cloth');
    ctx = canvas.getContext('2d');
    // Set canvas dimensions
    canvas.width = canvas_width;
    canvas.height = canvas_height;
    // Start the cloth simulation
    start();
// };
// Listen for the scroll event on the window
var isAnimating = false; // Track animation state
// STOP ANIMATION WHEN EXITING
window.addEventListener('scroll', function () {
    if (isCanvasInView() && !isAnimating) {
        // Start animation only if it's in view and not already animating
        isAnimating = true;
        animate();
    } else if (!isCanvasInView() && isAnimating) {
        // Stop animation only if it's out of view and currently animating
        isAnimating = false;
        stopAnimation();    
    }
    // console.log(isCanvasInView());
});