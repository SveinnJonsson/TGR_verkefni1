//////////////////////////////////////////////////////////////////////
//    SÃ½nisforrit Ã­ dÃ¦mi 1 Ã­ HD2 Ã­ TÃ¶lvugrafÃ­k
//     L-laga form teiknaÃ° meÃ° TRIANGLE-FAN
//
//    HjÃ¡lmtÃ½r Hafsteinsson, janÃºar 2020
//////////////////////////////////////////////////////////////////////
var canvas;
var gl;

var mouseX;
var movement = false;
var vBuffer;
var bufferIdA;
var bufferIdB;
var bufferIdC;
var vPosition;

var vertices;
var birdVertices;

var TRISIZE = 8;
var maxNumPoints = 600;  
var index = 0;

var theta = 0.0;
var thetaLoc;
var fps = 20;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    
    vertices = [

        vec2( -0.4, -1 ),
        vec2( -0.2, -0.9 ),
        vec2( -0.2, -0.9 ),
        vec2(  -0.0, -1)
    ];
    birdVertices = [
        vec2( -0.4, -0.4 ),
        vec2( -0.4, -0.36 ),
        vec2( -0.1, -0.36),
        vec2(  -0.1, -0.4)
    ];
    
    // Load the data into the GPU
    
    bufferIdA = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdA );
    gl.bufferData( gl.ARRAY_BUFFER,flatten(vertices), gl.DYNAMIC_DRAW );


    bufferIdB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdB);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(birdVertices), gl.DYNAMIC_DRAW);  

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    thetaLoc = gl.getUniformLocation(program, "theta");

    window.addEventListener("keyup", function(e){
        if(e.keyCode==32) {
            var rand1 = Math.random();
            var rand2 = Math.random();
            var rand3 = Math.random();
            var rand4 = Math.random();
            birdVertices = [
                vec2( rand1, rand2 ),
                vec2( rand1, rand3 ),
                vec2( rand4, rand3),
                vec2(  rand4, rand2)
            ];
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdB);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(birdVertices));
        }
    });

    canvas.addEventListener("mousedown", function(e){
        movement=true;
        mouseX = e.offsetX;
    });
        canvas.addEventListener("mouseup", function(e){
        movement=false;
    });
    canvas.addEventListener("mousemove", function(e){
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
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdA);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );


    setTimeout(function() {
        window.requestAnimationFrame(render);
        gl.clear(gl.COLOR_BUFFER_BIT);

        theta += 0.1;

        gl.uniform1f(thetaLoc, theta);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }, 1000/fps);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferIdB);
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    window.requestAnimationFrame(render);

}
