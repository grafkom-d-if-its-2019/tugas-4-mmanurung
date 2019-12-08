(function(){
	glUtils.SL.init({ callback: function() { main(); }});
	function main() {
		var canvas = document.getElementById("glcanvas");
		var gl = glUtils.checkWebGL(canvas);
		var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
		var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
		var program = glUtils.createProgram(gl, vertexShader, fragmentShader);
		gl.useProgram(program);

		function onKeyDown(event) {
		  if (event.keyCode == 38) camera.y -= 0.1;
		  else if (event.keyCode == 40) camera.y += 0.1;
		  if (event.keyCode == 37) camera.x -= 0.1;
		  else if (event.keyCode == 39) camera.x += 0.1;
		}
		document.addEventListener('keydown', onKeyDown);
		var camera = {x: 0.0, y: 0.0, z:0.0};
		var matrixLocation = gl.getUniformLocation(program, "vMatrix");
		var mm = glMatrix.mat4.create();
		var vmLoc = gl.getUniformLocation(program, 'viewMatrix');
		var vm = glMatrix.mat4.create();
		var pmLoc = gl.getUniformLocation(program, 'projectionMatrix');
		var pm = glMatrix.mat4.create();
		var camera = {x: 0.0, y: 0.0, z:0.0};
		glMatrix.mat4.perspective(pm,glMatrix.glMatrix.toRadian(90),canvas.width/canvas.height, 
		  0.5,  // near
		  10.0, // far  
		);

		gl.uniformMatrix4fv(pmLoc, false, pm);
		function drawA(type, vertices){
			var n = initBuffers(vertices);
			if (n < 0) {
				console.log('Failed to set the positions of the vertices');
				return;
			}
			gl.drawArrays(type, 0, n);
		}
		
		function initBuffers(vertices){
			var n = vertices.length / 6;
			var vertexBufferObject = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			var vPosition = gl.getAttribLocation(program, 'vPosition');
			var vColor = gl.getAttribLocation(program, 'vColor');
			gl.vertexAttribPointer(vPosition,3,gl.FLOAT,gl.FALSE,6 * Float32Array.BYTES_PER_ELEMENT,0);
			gl.vertexAttribPointer(vColor, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
			gl.enableVertexAttribArray(vPosition);
			gl.enableVertexAttribArray(vColor);
			return n;
		}
		var cubePoints = [
			-0.7, -0.7,  0.7,		1.0, 0.0, 1.0,//a
			-0.7,  0.7,  0.7,		0.0, 1.0, 0.0,//d
			 0.7, -0.7,  0.7,		1.0, 1.0, 1.0,//b
			 0.7,  0.7,  0.7,		1.0, 1.0, 0.0,//c
			-0.7, -0.7, -0.7,		0.0, 1.0, 1.0,//h
			-0.7,  0.7, -0.7,		1.0, 0.0, 1.0,//e
			 0.7, -0.7, -0.7,		0.0, 1.0, 0.0,//g
			 0.7,  0.7, -0.7,		1.0, 1.0, 0.0,//f
			-0.7, -0.7,  0.7,		1.0, 0.0, 1.0,//a
			-0.7, -0.7, -0.7,		0.0, 1.0, 1.0,//h
			-0.7,  0.7,  0.7,		1.0, 0.0, 1.0,//d
			-0.7,  0.7, -0.7,		1.0, 1.0, 0.0,//e
			 0.7, -0.7,  0.7,		1.0, 0.0, 1.0,//b
			 0.7, -0.7, -0.7,		0.0, 1.0, 1.0,//g
			 0.7,  0.7,  0.7,		1.0, 0.0, 1.0,//c
			 0.7,  0.7, -0.7,		1.0, 1.0, 0.0,//f
			 0.7, -0.7,  0.7,		1.0, 0.0, 1.0,//b
			-0.7, -0.7,  0.7,		0.0, 1.0, 0.0,//a
			 0.7,  0.7,  0.7,		1.0, 1.0, 1.0,//c
			-0.7,  0.7,  0.7,		1.0, 0.0, 1.0,//d
			-0.7, -0.7, -0.7,		1.0, 1.0, 0.0,//
			 0.7, -0.7, -0.7,		1.0, 0.0, 1.0,//
			-0.7,  0.7, -0.7,		0.0, 1.0, 1.0,//
			 0.7,  0.7, -0.7,		1.0, 1.0, 1.0,//
		];

		var Outline = [
			-0.4, -0.4, 0,  0.0, 1.0, 0.0,
      		-0.25, 0.4, 0,  1.0, 1.0, 0.0,
      		-0.25, -0.4, 0, 1.0, 0.0, 0.0,
    
      		-0.4, -0.4, 0,  1.0, 1.0, 0.0,
      		-0.4, 0.4, 0,   1.0, 0.0, 1.0,
      		-0.25, 0.4, 0,  0.0, 1.0, 0.0,

      		-0.25, 0.2, 0,  1.0, 1.0, 0.0,
      		-0.25, 0.4, 0,  0.0, 1.0, 1.0,
      		-0.1, 0, 0,     0.0, 1.0, 0.0,

      		-0.25, 0.4, 0,  0.0, 1.0, 0.0,
      		0, 0.1, 0,      1.0, 0.0, 1.0,
      		-0.1, 0, 0,     1.0, 0.0, 0.0,

      		-0.1, 0, 0,     1.0, 1.0, 0.0,
      		0, 0.1, 0,      0.0, 1.0, 1.0,
      		0.1, 0, 0,      1.0, 0.0, 1.0,

      		0.25, 0.4, 0,   0.0, 1.0, 0.0,
      		0.1, 0, 0,      1.0, 0.0, 1.0,
      		0, 0.1, 0,      1.0, 0.0, 0.0,

      		0.25, 0.4, 0,   1.0, 0.0, 1.0,
     		0.25, 0.2, 0,   1.0, 0.0, 0.0,  
      		0.1, 0, 0,      0.0, 0.0, 1.0,

      		0.25, 0.4, 0,   1.0, 1.0, 0.0,
      		0.4, -0.4, 0,   0.0, 0.0, 1.0,
      		0.25, -0.4, 0,  0.0, 1.0, 0.0,

      		0.25, 0.4, 0,   0.0, 1.0, 0.0,
      		0.4, 0.4, 0,    0.0, 0.0, 1.0,
      		0.4, -0.4, 0,   1.0, 0.0, 0.0
		];

		var flag = {
			x:1,
			y:1,
			z:1
		};
		var theta = 0; // rotation angle in radian
		var trans = {
			x:0.0,
			y:0.0,
			z:0.0
		}

		function render(){
			gl.clear(gl.COLOR_BUFFER_BIT);
			if(flag.x){trans.x+=0.005;}
			else{trans.x-=0.005;}

			if(flag.y){trans.y+=0.007;}
			else{trans.y-=0.007;}

			if(flag.z){trans.z+=0.006;}
			else{trans.z-=0.006;}

			if(trans.x>0.5 || trans.x < -0.5){
				flag.x = !flag.x;
			}
			if(trans.y>0.5 || trans.y < -0.5){
				flag.y = !flag.y;
			}
			if(trans.z>0.5 || trans.z < -0.5){
				flag.z = !flag.z;
			}

			theta += 0.0063;
			mm = glMatrix.mat4.create();
			glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -1.5]);
			gl.uniformMatrix4fv(matrixLocation, false, mm);
			drawA(gl.LINES, cubePoints);

			mm = glMatrix.mat4.create();
			glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -1.5]);
			glMatrix.mat4.translate(mm, mm, [trans.x, trans.y, trans.z]);
			glMatrix.mat4.scale(mm, mm, [0.3, 0.3, 0.3]);
			glMatrix.mat4.rotateY(mm,mm, theta)
			gl.uniformMatrix4fv(matrixLocation, false, mm);
			drawA(gl.TRIANGLES, Outline);

			glMatrix.mat4.lookAt(vm,
			  [camera.x, camera.y, camera.z],
			  [0.0, 0.0, -2.0],
			  [0.0, 1.0, 0.0]
			);
			gl.uniformMatrix4fv(vmLoc, false, vm);
			requestAnimationFrame(render)
		}
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.enable(gl.DEPTH_TEST);
		render()
	}
})();