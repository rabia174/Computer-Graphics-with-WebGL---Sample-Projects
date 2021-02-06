var canvas;
var gl;
var MVmatrix, MVmatrixLoc;

var indices = []; // To keep the indices of triangle vertices

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var normalMatrix, normalMatrixLoc;

var lightPosition = vec4(1.0,1.0,1.0,0.0 );
var lightAmbient = vec4(0.5, 0.5, 0.5, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 10.0;

var ambientProduct, diffuseProduct, specularProduct;

// TEAPOT DATA
var vertices = [ 
//box2
-4.9644, 0.3123, -3.8395,
-2.0381, 0.3123, -5.7513,
-4.9644, 9.4172, -3.8395,
-2.0381, 9.4172, -5.7513,
-3.0212, 0.3123, -0.8654,
-0.0950, 0.3123, -2.7772,
-3.0212, 9.4172, -0.8654,
-0.0950, 9.4172, -2.7772,
//box1
-6.6025,0.0245,-8.8805,
6.6490,0.0245,-8.8805,
-6.6025,17.1462,-8.8805,
6.6490,17.1462,-8.8805,
-6.6025,0.0245,10.9969,
6.6490,0.0245,10.9969,
-6.6025,17.1462,10.9969,
6.6490,17.1462,10.9969,
    
//box3
    
0.0045,0.2900,4.5152,
0.9166,0.2900,0.1648,
0.0045,5.9792,4.5152,
0.9166,5.9792,0.1648,
4.4261,0.2900,5.4423,
5.3383,0.2900,1.0919,
4.4261,5.9792,5.4423,
5.3383,5.9792,1.0919,

//box4
2.8096, 17.1165, 2.3659,
-2.1904, 17.1165, 2.3659,
2.8096, 17.1165, -2.6341,
-2.1904, 17.1165, -2.6341
]; 

var normals=[
0.0000,-1.0000,-0.0000,
0.0000,-1.0000,-0.0000,
0.0000,-1.0000,-0.0000,
0.0000,-1.0000,-0.0000,
0.0000,-1.0000,-0.0000,
0.0000,-1.0000,-0.0000,
0.0000,1.0000,-0.0000,
0.0000,1.0000,-0.0000,
0.0000,1.0000,-0.0000,
0.0000,1.0000,-0.0000,
0.0000,1.0000,-0.0000,
0.0000,1.0000,-0.0000,
0.0000,0.0000,1.0000,
0.0000,0.0000,1.0000,
0.0000,0.0000,1.0000,
0.0000,0.0000,1.0000,
0.0000,0.0000,1.0000,
0.0000,0.0000,1.0000,
1.0000,0.0000,-0.0000,
1.0000,0.0000,-0.0000,
1.0000,0.0000,-0.0000,
1.0000,0.0000,-0.0000,
1.0000,0.0000,-0.0000,
1.0000,0.0000,-0.0000,
0.0000,0.0000,-1.0000,
0.0000,0.0000,-1.0000,
0.0000,0.0000,-1.0000,
0.0000,0.0000,-1.0000,
0.0000,0.0000,-1.0000,
0.0000,0.0000,-1.0000,
1.0000,0.0000,-0.0000,
-1.0000,0.0000,-0.0000,
-1.0000,0.0000,-0.0000,
-1.0000,0.0000,-0.0000,
-1.0000,0.0000,-0.0000,
-1.0000,0.0000,-0.0000,
//box2
    
0.0000,-0.0000,1.0000,
0.0000,-0.0000,1.0000,
0.0000,-0.0000,1.0000,
0.0000,-0.0000,1.0000,
0.0000,-0.0000,1.0000,
0.0000,-0.0000,1.0000,
0.0000,1.0000,0.0000,
0.0000,1.0000,0.0000,
0.0000,1.0000,0.0000,
0.0000,1.0000,0.0000,
0.0000,1.0000,0.0000,
0.0000,1.0000,0.0000,
-1.0000,0.0000,-0.0000,
-1.0000,0.0000,-0.0000,
-1.0000,0.0000,-0.0000,
-1.0000,0.0000,-0.0000,
-1.0000,0.0000,-0.0000,
-1.0000,0.0000,-0.0000,
0.0000,-1.0000,-0.0000,
0.0000,-1.0000,-0.0000,
0.0000,-1.0000,-0.0000,
0.0000,-1.0000,-0.0000,
0.0000,-1.0000,-0.0000,
0.0000,-1.0000,-0.0000,
1.0000,0.0000,-0.0000,
1.0000,0.0000,-0.0000,
1.0000,0.0000,-0.0000,
1.0000,0.0000,-0.0000,
1.0000,0.0000,-0.0000,
1.0000,0.0000,-0.0000,
    
//box3
    
0.0000,-1.0000,-0.0000,
0.0000,-1.0000,-0.0000,
0.0000,-1.0000,-0.0000,
0.0000,-1.0000,-0.0000,
0.0000,-1.0000,-0.0000,
0.0000,-1.0000,-0.0000,
0.0000,1.0000,-0.0000,
0.0000,1.0000,-0.0000,
0.0000,1.0000,-0.0000,
0.0000,1.0000,-0.0000,
0.0000,1.0000,-0.0000,
0.0000,1.0000,-0.0000,
0.0000,0.0000,1.0000,
0.0000,0.0000,1.0000,
0.0000,0.0000,1.0000,
0.0000,0.0000,1.0000,
0.0000,0.0000,1.0000,
0.0000,0.0000,1.0000,
1.0000,0.0000,-0.0000,
1.0000,0.0000,-0.0000,
1.0000,0.0000,-0.0000,
1.0000,0.0000,-0.0000,
1.0000,0.0000,-0.0000,
1.0000,0.0000,-0.0000,
0.0000,0.0000,-1.0000,
0.0000,0.0000,-1.0000,
0.0000,0.0000,-1.0000,
0.0000,0.0000,-1.0000,
0.0000,0.0000,-1.0000,
0.0000,0.0000,-1.0000,
-1.0000,0.0000,-0.0000,
-1.0000,0.0000,-0.0000,
-1.0000,0.0000,-0.0000,
-1.0000,0.0000,-0.0000,
-1.0000,0.0000,-0.0000,
-1.0000,0.0000,-0.0000,
    
//box4
    
0.0000, -1.0000, -0.0000,
0.0000, -1.0000, -0.0000,
0.0000, -1.0000, -0.0000,
0.0000, -1.0000, -0.0000,
0.0000, -1.0000, -0.0000,
0.0000, -1.0000, -0.0000
];
var textureCoords = [
	2.00,2.00,0.00,
	1.50,2.00,0.00,
	1.50,1.95,0.00,
	2.00,1.95,0.00,
	1.50,1.90,0.00,
	2.00,1.90,0.00,
	1.00,2.00,0.00,
	1.00,1.95,0.00,
	1.00,1.90,0.00,
	0.50,2.00,0.00,
	0.50,1.95,0.00,
	0.50,1.90,0.00,
	0.00,2.00,0.00,
	0.00,1.95,0.00,
	0.00,1.90,0.00,
	1.50,1.45,0.00,
	2.00,1.45,0.00,
	1.50,1.00,0.00,
	2.00,1.00,0.00,
	1.00,1.45,0.00,
	1.00,1.00,0.00,
	0.50,1.45,0.00,
	0.50,1.00,0.00,
	0.00,1.45,0.00,
	0.00,1.00,0.00,
	1.50,0.70,0.00,
	2.00,0.70,0.00,
	1.50,0.40,0.00,
	2.00,0.40,0.00,
	1.00,0.70,0.00,
	1.00,0.40,0.00,
	0.50,0.70,0.00,
	0.50,0.40,0.00,
	0.00,0.70,0.00,
	0.00,0.40,0.00,
	1.50,0.20,0.00,
	2.00,0.20,0.00,
	1.50,0.00,0.00,
	1.00,0.20,0.00,
	1.00,0.00,0.00,
	0.50,0.20,0.00,
	0.50,0.00,0.00,
	0.00,0.20,0.00,
	0.00,0.00,0.00,
	0.75,1.00,0.00,
	0.75,0.75,0.00,
	1.00,0.75,0.00,
	0.75,0.50,0.00,
	1.00,0.50,0.00,
	0.50,0.75,0.00,
	0.50,0.50,0.00,
	0.25,1.00,0.00,
	0.25,0.75,0.00,
	0.25,0.50,0.00,
	0.00,0.75,0.00,
	0.00,0.50,0.00,
	0.75,0.25,0.00,
	1.00,0.25,0.00,
	0.75,0.00,0.00,
	0.50,0.25,0.00,
	0.25,0.25,0.00,
	0.25,0.00,0.00,
	0.00,0.25,0.00,
	0.75,0.45,0.00,
	0.50,0.45,0.00,
	0.75,0.90,0.00,
	0.50,0.90,0.00,
	1.00,0.45,0.00,
	1.00,0.90,0.00,
	0.25,0.45,0.00,
	0.00,0.45,0.00,
	0.25,0.90,0.00,
	0.00,0.90,0.00,
	0.75,0.95,0.00,
	0.50,0.95,0.00,
	1.00,0.95,0.00,
	0.25,0.95,0.00,
	0.00,0.95,0.00
];

var quads=[];

var triangles = [
// indices for vertex1, textureCoord of vertex1, normal of vertex1, vertex2, ...
// each index starts from 1, we will probably need to subtract 1 from each
1,1,3,2,4,3,
4,4,2,5,1,6,
5,7,6,8,8,9,
8,10,7,11,5,12,
1,13,2,14,6,15,
6,16,5,17,1,18,
2,19,4,20,8,21,
8,22,6,23,2,24,
4,25,3,26,7,27,
7,28,8,29,4,30,
3,31,1,32,5,33,
5,34,7,35,3,36,
//box2    
11,37,9,38,12,39,
10,40,12,41,9,42,
10,43,9,44,14,45,
13,46,14,47,9,48,

12,49,10,50,16,51,
14,52,16,53,10,54,

11,55,12,56,15,57,
16,58,15,59,12,60,

9,61,11,62,13,63,
15,64,13,65,11,66,

//box3
17,67,19,68,20,69,
20,70,18,71,17,72,
21,73,22,74,24,75,
24,76,23,77,21,78,
17,79,18,80,22,81,
22,82,21,83,17,84,
18,85,20,86,24,87,
24,88,22,89,18,90,
20,91,19,92,23,93,
23,94,24,95,20,96,
19,97,17,98,21,99,
21,100,23,101,19,102,
    
//box4
27,103 ,25,104, 28,105, 
26,106 ,28,107, 25,108  

];


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
	
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    gl.enable(gl.DEPTH_TEST);
	
	prepareTeapot();
    
    var m = document.getElementById("mymenu");
	m.addEventListener("click", function() {
		switch (m.selectedIndex) {
			case 0:
				MVmatrix = mult(scalem(1.1,1.1,1.1), MVmatrix);
				render();
				break;
			case 1:
				MVmatrix = mult(scalem(.9,.9,.9), MVmatrix);
				render();
				break;
			case 2:
				MVmatrix = mult(rotateZ(5), MVmatrix);
				render();
				break;
			case 3:
				MVmatrix = mult(rotateZ(-5), MVmatrix);
				render();
				break;
            
		}
	});
    

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    
    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vNormal);
    
	var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray( vPosition);
	
	var iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);
	
	modelViewMatrix = mat4();
	projectionMatrix = ortho(-20.0, 20.0, -20.0, 20.0, -20.0, 20.0);
	
	modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
	gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix));
	
    document.getElementById("XButton").onclick = function(){
		modelViewMatrix = mult(rotateX(5), modelViewMatrix);
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
		render();
	};
    document.getElementById("YButton").onclick = function(){
		modelViewMatrix = mult(rotateY(5), modelViewMatrix);
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
		render();
	};
    document.getElementById("ZButton").onclick = function(){
		modelViewMatrix = mult(rotateZ(5), modelViewMatrix);
		gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix));
		render();
	};
    
    MVmatrix = mat4();
	
	// Get access to the uniform matrix in the shader and send the default matrix first
	MVmatrixLoc = gl.getUniformLocation(program, "vMVmatrix");
	gl.uniformMatrix4fv(MVmatrixLoc, false, flatten(MVmatrix));
    
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);
    
    gl.uniform4fv( gl.getUniformLocation(program,"ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,"diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,"specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,"lightPosition"),flatten(lightPosition) );
    gl.uniform1f(  gl.getUniformLocation(program, "shininess"), materialShininess);

	render();
};

// This function goes over the given teapot data and 
// does the necessary index organization tasks.
// The main task is to convert the given polygons (quads and triangles)
// into a single indices array correctly
function prepareTeapot() {
	
	for (var i = 0; i < triangles.length; i+=6) {
		indices.push(triangles[i]-1, triangles[i+2]-1, triangles[i+4]-1); 
	}
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];
    gl.uniformMatrix4fv(MVmatrixLoc, false, flatten(MVmatrix));
    
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );
    
    gl.drawElements( gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0 );
}