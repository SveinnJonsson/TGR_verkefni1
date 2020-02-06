"use strict";
var canvas;
var gl;
var vPosition;

var mouseX;
var movement = false;

var bufferIdA;
var bufferIdB;
var bufferIdC;
var theta = 0.0;
var thetaLoc;
var fps = 30;
var birdVertices;
var vertices;
var bulletVertices;
var i;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    bulletVertices = [
        vec2( -0.4, -1 ),
        vec2( -0.2, -0.9 ),
        vec2( -0.2, -0.9 ),
        vec2(  -0.0, -1)
    ]
    birdVertices = [
        vec2( 1.1, 0.6 ),
        vec2( 1.1, 0.56 ),
        vec2(  1, 0.56),
        vec2(  1, 0.6)
    ];
    vertices = [
        vec2( -0.4, -1 ),
        vec2( -0.2, -0.9 ),
        vec2( -0.2, -0.9 ),
        vec2(  -0.0, -1)
    ];

    bufferIdA = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdA);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);

    // Load the data into the GPU
    bufferIdB = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdB );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(birdVertices), gl.DYNAMIC_DRAW );

    bufferIdC = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdC);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(bulletVertices), gl.DYNAMIC_DRAW);

    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation( program, "theta" );


    window.addEventListener("keyup", function(e) {
        if(e.keyCode==32) {
            bulletVertices = [
                vec2( -0.4, -1 ),
                vec2( -0.2, -0.9 ),
                vec2( -0.2, -0.9 ),
                vec2(  -0.0, -1)
            ];
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdC);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(bulletVertices));
        }
    });
    canvas.addEventListener("mousedown", function(e) {
        movement=true;
        mouseX = e.offsetX;
    });
    canvas.addEventListener("mouseup", function(e) {
        movement=false;
    });
    canvas.addEventListener("mousemove", function(e) {
        if(movement){
            var xmove = 2*(e.offsetX - mouseX)/canvas.width;
            mouseX = e.offsetX;
            for(i = 0; i < 4; i++) {
                vertices[i][0] += xmove;
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdA);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(vertices));
        }
    });

    render();
};


function render() {

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdA);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdB);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdC);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

   setTimeout( function() {
        window.requestAnimFrame(render);
        gl.clear( gl.COLOR_BUFFER_BIT );

        // Change the rotating angle
        theta += 0.0;
        if(birdVertices[0][0] < -1) {
            birdVertices = [
                vec2( 1.1, 0.6 ),
                vec2( 1.1, 0.56 ),
                vec2(  1, 0.56),
                vec2(  1, 0.6)
            ];
        } else {
            for(i = 0; i < 4; i++) {
                birdVertices[i][0] -= 0.025;
                gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdB);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(birdVertices));
            }
        }

        window.addEventListener("keyup", function(e) {
            console.log(e.keyCode);
        });
    
      // Send the new angle over to GPU
      gl.uniform1f( thetaLoc, theta );

      // Draw!
      gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
   }, 1000/fps);
   
}
