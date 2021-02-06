var gl;
var MVmatrix, MVmatrixLoc;



window.onload = function init() {
    
	const canvas = document.querySelector("#glcanvas");
	// Initialize the GL context
	gl = WebGLUtils.setupWebGL(canvas);
	// Only continue if WebGL is available and working
	if (!gl) {
		alert("Unable to initialize WebGL. Your browser or machine may not support it.");
		return;
	}
    
    
	  
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram( program );
    
    
    var m = document.getElementById("mymenu");
	m.addEventListener("click", function() {
		switch (m.selectedIndex) {
		
			case 0:
				MVmatrix = mult(rotateX(5), MVmatrix);
				render();
				break;
			case 1:
				MVmatrix = mult(rotateX(-5), MVmatrix);
				render();
				break;
            case 2:
				MVmatrix = mult(rotateY(5), MVmatrix);
				render();
				break;
			case 3:
				MVmatrix = mult(rotateY(-5), MVmatrix);
				render();
				break;
            case 4:
				MVmatrix = mult(rotateZ(5), MVmatrix);
				render();
				break;
			case 5:
				MVmatrix = mult(rotateZ(-5), MVmatrix);
				render();
				break;
		}
	});

	var vertices = [
                    vec3(-0.5, -0.5, 0.5),
                    vec3(-0.5, 0.5, 0.5),
                    vec3(0.5, 0.5, 0.5),
                    vec3(0.5, -0.5, 0.5),
                    vec3(-0.5, -0.5, -0.5),
                    vec3(-0.5, 0.5, -0.5),
                    vec3(0.5, 0.5, -0.5),
                    vec3(0.5, -0.5, -0.5)
        
                    ];
    var vertexColors = [
         [0.0,1.0,0.0,1.0],//black
         [1.0,1.0,0.0,1.0],//red
         [0.0,1.0,1.0,1.0],//yellow
         [0.0,1.0,0.0,1.0],//green
         [1.0,0.0,1.0,1.0],//blue
         [1.0,1.0,0.0,1.0],//magenta
         [1.0,0.0,1.0,1.0],//white
         [0.0,1.0,1.0,1.0]//cyan
    ];

    var indices = [ 1,0,3,   1,3,2, // front
                    2,3,7,   2,7,6, // right
                    3,0,4,   3,4,7, // bottom
                    6,5,1,   6,1,2, // top
                    4,5,6,   4,6,7, // back
                    5,4,0,   5,0,1 // left
    ];
					
	var vBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

	// Associate out shader variables with our data buffer
	var vPosition = gl.getAttribLocation( program, "vPosition" );
	gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( vPosition );
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,flatten(vertexColors),gl.STATIC_DRAW);
    
    var cPosition= gl.getAttribLocation(program,"vColor");
    gl.vertexAttribPointer(cPosition,4,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(cPosition);
    
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices),gl.STATIC_DRAW);
    
    var modelViewMatrix = lookAt( 
                                  vec3(1.5,1.0,3.0), //eye
                                  vec3(0.0,0.0,0.0), //at 
                                  vec3(0.0,1.0,0.0) //up
                                );
    var projectionMatrix = ortho(-1.0,1.0,-1.0,1.0,-1.0,20.0); //perspective(60,1.0,1.0,20.0); 
	// make the default transformation matrix identity matrix
    
    var mVMatLoc = gl.getUniformLocation( program, "modelViewMatrix");
    gl.uniformMatrix4fv(mVMatLoc,false,flatten(modelViewMatrix));
    
    var pMatLoc = gl.getUniformLocation (program,"projectionMatrix");
    gl.uniformMatrix4fv(pMatLoc, false, flatten(projectionMatrix));
    
    MVmatrix = mat4();
	
	// Get access to the uniform matrix in the shader and send the default matrix first
	MVmatrixLoc = gl.getUniformLocation(program, "vMVmatrix");
	gl.uniformMatrix4fv(MVmatrixLoc, false, flatten(MVmatrix));
    
	gl.enable(gl.DEPTH_TEST);
    

    //gl.enable(gl.CULL_FACE);//we see only one face of the polygon
    //gl.cullFace(gl.FRONT); // making polygons only visible from their backsides
    //when we execute without the depth test this we still have the correct shape, default is back 
	// Set clear color to light gray
	gl.clearColor(0.5, 0.5, 0.5, 1.0);
	
	render();

};

function render() {
	// Clear the color buffer with specified clear color
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    
	gl.uniformMatrix4fv(MVmatrixLoc, false, flatten(MVmatrix));
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
	
}