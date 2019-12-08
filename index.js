(function() {

  glUtils.SL.init({ callback: function() { main(); }});
  function main() {
    var canvas = document.getElementById("glcanvas");
    var gl = glUtils.checkWebGL(canvas);
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
    var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    var program = glUtils.createProgram(gl, vertexShader, fragmentShader);
    var ddLoc, dd, ac, nmLoc, vNormal, vTexCoord, vColor;
    var scaleXUniformLocation, scaleX, widen;
    var XLOc, x_char, YLOc, y_char, ZLOc, z_char, X, Y, Z;
    var mmLoc, mm, pm, camera, vmLoc, vm, pmLoc;  
    
    initGlSize(canvas);
    gl.useProgram(program);
    
    var Cube = [];
    var cubePoints = [
      [ -0.9, -0.9,  0.9 ],
      [ -0.9,  0.9,  0.9 ],
      [  0.9,  0.9,  0.9 ],
      [  0.9, -0.9,  0.9 ],
      [ -0.9, -0.9, -0.9 ],
      [ -0.9,  0.9, -0.9 ],
      [  0.9,  0.9, -0.9 ],
      [  0.9, -0.9, -0.9 ]
    ];
    var cubeColors = [
      [],
      [1.0, 0.0, 0.0], // merah
      [0.0, 1.0, 0.0], // hijau
      [0.0, 0.0, 1.0], // biru
      [1.0, 1.0, 1.0], // putih
      [1.0, 0.5, 0.0], // oranye
      [1.0, 1.0, 0.0], // kuning
      []
    ];
    var cubeNormals = [
      [],
      [  0.0,  0.0,  1.0 ], // depan
      [  1.0,  0.0,  0.0 ], // kanan
      [  0.0, -1.0,  0.0 ], // bawah
      [  0.0,  0.0, -1.0 ], // belakang
      [ -1.0,  0.0,  0.0 ], // kiri
      [  0.0,  1.0,  0.0 ], // atas
      []
    ];
    var hurufM = new Float32Array([
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
    ]);

    function quad(a, b, c, d) {
      var indices = [a, b, c, a, c, d];
      for (var i=0; i < indices.length; i++) {
        for (var j=0; j < 3; j++) {
          Cube.push(cubePoints[indices[i]][j]);}
        for (var j=0; j < 3; j++) {
          Cube.push(cubeColors[a][j]);}
        for (var j=0; j < 3; j++) {
          Cube.push(-1*cubeNormals[a][j]);}
        switch (indices[i]) {
          case a:
            Cube.push((a-2)*0.125); Cube.push(0.0);
          break;
          case b:
            Cube.push((a-2)*0.125); Cube.push(1.0);
          break;
          case c:
            Cube.push((a-1)*0.125); Cube.push(1.0);
          break;
          case d:
            Cube.push((a-1)*0.125); Cube.push(0.0);
          break;
          default:
          break;
        }
      }
    }
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
    quad(6, 5, 1, 2);
    // FOTO
    function initTexture() {
      // texture's uniform
      var sampler0Loc = gl.getUniformLocation(program, 'sampler0');
      gl.uniform1i(sampler0Loc, 0);
      // Create
      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
      // load image
      var image = new Image();
	    image.src = "gambar/grid.jpg";
      image.addEventListener('load', function() {
        // make copy it to the texture.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
      });
    }
    function initGlSize(canvas) {
      var width, height;
      width   = canvas.getAttribute("width"); 
      height  = canvas.getAttribute("height");
      if (width) {gl.maxWidth = width;}
      if (height) {gl.maxHeight = height;}
    }
    function Translasi(){
      if (x_char >= (0.9 - Math.abs(0.2 * 0.9 * scaleX))) X = -1.0;
      else if (x_char <= (-0.9 + Math.abs(0.2 * 0.9 * scaleX))) X = 1.0;
      x_char += 0.009 * X;
      gl.uniform1f(XLOc, x_char);
    
      if (z_char >= (0.9 - Math.abs(0.2 * 0.9 * scaleX))) Z = -1.0;
      else if (z_char <= (-0.9 + Math.abs(0.2 * 0.9 * scaleX))) Z = 1.0;
      z_char += 0.011 * Z;
      gl.uniform1f(ZLOc, z_char);

      if (y_char >= (0.9 - (0.3 * 0.9))) Y = -1.0;
      else if (y_char <= (-0.9 + (0.3 * 0.9))) Y = 1.0;
      y_char += 0.010 * Y;
      gl.uniform1f(YLOc, y_char);
    }
    function initBuffers(gl,vertices) {// total points
      var n = vertices.length/6;
      var vertexBufferObject = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      var vPosition = gl.getAttribLocation(program, 'vPosition');
      vColor = gl.getAttribLocation(program, 'vColor');
      gl.vertexAttribPointer(
        vColor,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.enableVertexAttribArray(vColor);
      // Assign the buffer object to vPosition variable
      gl.vertexAttribPointer(
        vPosition,   //variable yang memegang posisis attribute di shader
        3,          // jumlah elemen per atribut vPosition
        gl.FLOAT,   // tipe data atribut
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap vertex (overall)
        0                                    // offset dari posisi elemen di array
      );
      gl.enableVertexAttribArray(vPosition);
      return n;
    }

    function initBuffersKubus(gl,vertices) {
      var n = vertices.length/11;
      // Create a buffer object
      var vertexBufferObject = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBufferObject);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
      var vPosition = gl.getAttribLocation(program, 'vPosition');
      vTexCoord = gl.getAttribLocation(program, 'vTexCoord');
      vNormal = gl.getAttribLocation(program, 'vNormal');
      gl.vertexAttribPointer(
        vPosition,   //variable yang memegang posisis attribute di shader
        3,          // jumlah elemen per atribut vPosition
        gl.FLOAT,   // tipe data atribut
        gl.FALSE,
        11 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap vertex (overall)
        0                                    // offset dari posisi elemen di array
      );
      gl.enableVertexAttribArray(vPosition);
      gl.vertexAttribPointer(
        vTexCoord,
        2,
        gl.FLOAT,
        gl.FALSE,
        11 * Float32Array.BYTES_PER_ELEMENT,
        9 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.enableVertexAttribArray(vTexCoord);
      gl.vertexAttribPointer(
        vNormal,
        3,
        gl.FLOAT,
        gl.FALSE,
        11 * Float32Array.BYTES_PER_ELEMENT,
        6 * Float32Array.BYTES_PER_ELEMENT
      );
      gl.enableVertexAttribArray(vNormal);
      return n;
    }
    var theta = 0;
    var phi   = 0;
    var isDragging = false, AMORTIZATION = 0.144, deltaX = 0, deltaY = 0, x_old, y_old;
    var onMouseMove = (e) => {
    e.preventDefault();
    if (!isDragging) return false;
    deltaX = (e.pageX-x_old)*2*Math.PI/canvas.width,
    deltaY = (e.pageY-y_old)*2*Math.PI/canvas.height;
    phi    += deltaY;
    theta  += deltaX;
    x_old  = e.pageX;
    y_old  = e.pageY;
    };

    var onMouseDown = (e) => {
      e.preventDefault();
      isDragging = true;
      x_old = e.pageX, y_old = e.pageY;
    };
    var onMouseUp = (e) => {isDragging = false;};
    document.addEventListener("mousedown", onMouseDown, false);
    document.addEventListener("mouseup", onMouseUp, false);
    document.addEventListener("mousemove", onMouseMove, false);
    //rotation
    function rotateX(m, angle) {
      var c = Math.cos(angle);
      var s = Math.sin(angle);
      var mv1 = m[1], mv5 = m[5], mv9 = m[9];

      m[1] = m[1]*c-m[2]*s;
      m[5] = m[5]*c-m[6]*s;
      m[9] = m[9]*c-m[10]*s;

      m[2] = m[2]*c+mv1*s;
      m[6] = m[6]*c+mv5*s;
      m[10] = m[10]*c+mv9*s;
    }

    function rotateY(m, angle) {
      var c = Math.cos(angle);
      var s = Math.sin(angle);
      var mv0 = m[0], mv4 = m[4], mv8 = m[8];

      m[0] = c*m[0]+s*m[2];
      m[4] = c*m[4]+s*m[6];
      m[8] = c*m[8]+s*m[10];

      m[2] = c*m[2]-s*mv0;
      m[6] = c*m[6]-s*mv4;
      m[10] = c*m[10]-s*mv8;
    }

    function render(){
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      theta += thetaSpeed;
      // Perhitungan modelMatrix untuk vektor normal
      var nm = glMatrix.mat3.create();
      glMatrix.mat3.normalFromMat4(nm, mm);
      gl.uniformMatrix3fv(nmLoc, false, nm);

      glMatrix.mat4.lookAt(vm,
        [camera.x, camera.y, camera.z], // di mana posisi kamera (posisi)
        [0.0, 0.0, -2.0], // ke mana kamera menghadap (vektor)
        [0.0, 1.0, 0.0]  // ke mana arah atas kamera (vektor)
      );
      gl.uniformMatrix4fv(vmLoc, false, vm);
      // Interaksi mouse
      if (!isDragging) {
        deltaX *= AMORTIZATION, deltaY *= AMORTIZATION;
        theta += deltaX, phi += deltaY;
      }

      mm[0] = 1, mm[1] = 0, mm[2] = 0,
      mm[3] = 0,
      mm[4] = 0, mm[5] = 1, mm[6] = 0,
      mm[7] = 0,
      mm[8] = 0, mm[9] = 0, mm[10] = 1,
      mm[11] = 0,
      mm[12] = 0, mm[13] = 0, mm[14] = 0,
      mm[15] = 1;
      glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);
      rotateY(mm, theta);
      rotateX(mm, phi);
      gl.uniformMatrix4fv(mmLoc, false, mm);

      var nCube = initBuffersKubus(gl, Cube);
      var flag = 0;
      gl.uniform1i(flagUniformLocation, flag);
      gl.uniform1i(fFlagUniformLocation, flag);
      gl.drawArrays(gl.TRIANGLES, 0, nCube);
      gl.disableVertexAttribArray(vNormal);
      gl.disableVertexAttribArray(vTexCoord);
      // animasi refleksi
      if (scaleX >= 1.0) widen = -1.0;
      else if (scaleX <= -1.0) widen = 1.0;
      scaleX += 0.0144 * widen;
    
      gl.uniform1f(scaleXUniformLocation, scaleX);
      Translasi();//animasi translasi
      // arah cahaya berdasarkan koordinat huruf
      dd = glMatrix.vec3.fromValues(x_char, y_char, z_char);  // xyz
      gl.uniform3fv(ddLoc, dd);
      var nHuruf = initBuffers(gl,hurufM);
      var flag = 1;
      gl.uniform1i(fFlagUniformLocation, flag);
      gl.uniform1i(flagUniformLocation, flag);
      gl.drawArrays(gl.TRIANGLES, 0, nHuruf);
      gl.disableVertexAttribArray(vColor);
      requestAnimationFrame(render);
    }

    function draw(){
      theta = 0;
      thetaSpeed = 0.0;
      // model matrix
      mmLoc = gl.getUniformLocation(program, 'modelMatrix');
      mm = glMatrix.mat4.create();
      glMatrix.mat4.translate(mm, mm, [0.0, 0.0, -2.0]);
      // view and projection matrix
      vmLoc = gl.getUniformLocation(program, 'viewMatrix');
      vm = glMatrix.mat4.create();
      pmLoc = gl.getUniformLocation(program, 'projectionMatrix');
      pm = glMatrix.mat4.create();
      camera = {x: 0.0, y: 0.0, z:0.0};
      /*fovy dalam rad, aspect ratio, near, far*/
      glMatrix.mat4.perspective(pm, glMatrix.glMatrix.toRadian(90), canvas.width/canvas.height, 0.5, 10.0);
      gl.uniformMatrix4fv(pmLoc, false, pm);

      XLOc = gl.getUniformLocation(program, 'x_char');
      x_char = 0.0;
      gl.uniform1f(XLOc, x_char);

      YLOc = gl.getUniformLocation(program, 'y_char');
      y_char = 0.0;
      gl.uniform1f(YLOc, y_char);

      ZLOc = gl.getUniformLocation(program, 'z_char');
      z_char = 0.0;
      gl.uniform1f(ZLOc, z_char);
    
      scaleXUniformLocation = gl.getUniformLocation(program, 'scaleX');
      scaleX = 1.0;
      gl.uniform1f(scaleXUniformLocation, scaleX);

      flagUniformLocation = gl.getUniformLocation(program, 'flag');
      flag = 0;
      gl.uniform1i(flagUniformLocation, flag);

      fFlagUniformLocation = gl.getUniformLocation(program, 'fFlag');
      gl.uniform1i(fFlagUniformLocation, flag);

      X = 1.0;
      Y = 1.0;
      Z = 1.0;

      // Uniform untuk pencahayaan
      var dcLoc = gl.getUniformLocation(program, 'diffuseColor');
      var dc = glMatrix.vec3.fromValues(1.0, 1.0, 1.0);  // rgb
      gl.uniform3fv(dcLoc, dc);
      ddLoc = gl.getUniformLocation(program, 'diffusePosition');
      var acLoc = gl.getUniformLocation(program, 'ambientColor');
      ac = glMatrix.vec3.fromValues(0.17, 0.40, 0.144);
      gl.uniform3fv(acLoc, ac);
      // Uniform untuk modelMatrix vektor normal
      nmLoc = gl.getUniformLocation(program, 'normalMatrix');
      gl.clearColor(0.7, 0.3, 0.8, 0.5);
      gl.enable(gl.DEPTH_TEST);
      render();
    }
    initTexture();
    draw();
  }
})();