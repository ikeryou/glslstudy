


# ---------------------------------------------------
# コンテンツ
# ---------------------------------------------------
class Contents
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
  
    # Canvas要素
    @_c;
    
    # WebGLコンテキスト
    @_gl;
    
    # プログラムオブジェクト
    @_prg;
    
    # モデルオブジェクト
    @_mdl;
    
    @_startTime = new Date().getTime();
    
    
  
  
  # -----------------------------------------------
  # 初期化
  # -----------------------------------------------
  init: =>
    
    # Canvas要素取得
    @_c = document.getElementById("xCanvas");
    
    # WebGLコンテキスト取得
    @_gl = @_c.getContext('webgl') || @_c.getContext('experimental-webgl');
    
    # プログラムオブジェクト作成
    @_prg = @_createProgram(@_createShader("vs"), @_createShader("fs"));
    
    # モデルオブジェクト
    @_mdl = @_plane();
    
    # IBO設定
    @_gl.bindBuffer(@_gl.ELEMENT_ARRAY_BUFFER, @_createIBO(@_mdl.i));
    @_attachVBO(@_prg, "position", 3, @_mdl.p);
    
    @_gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
    MY.resize.add(@_resize, true);
    MY.update.add(@_update);
  
  
  
  # -----------------------------------------------
  # リサイズ
  # -----------------------------------------------
  _resize: (w, h) =>
    
    # 一旦サイズ固定
#     w = h = 256*2;
#     @_c.width = w;
#     @_c.height = h;
#     $("#xCanvas").css({
#       width:w, 
#       height:h
#     });
#     
#     @_gl.viewport(0, 0, @_c.width, @_c.height);
    
    if window.devicePixelRatio? && window.devicePixelRatio >= 2
      scale1 = 2;
      scale2 = 1;
    else
      scale1 = 1;
      scale2 = 1;
      
    @_c.width = w * scale1;
    @_c.height = h * scale1;
    $("#xCanvas").css({
      width:w * scale2, 
      height:h * scale2
    });
    
    @_gl.viewport(0, 0, @_c.width, @_c.height);
  
  
  
  # -----------------------------------------------
  # 更新
  # -----------------------------------------------
  _update: =>
    
    time = (new Date().getTime() - @_startTime) * 0.001;
    
    @_gl.clear(@_gl.COLOR_BUFFER_BIT);
    
    # uniform変数
    @_attachUniform(@_prg, "time", "float", time);
    @_attachUniform(@_prg, "mouse", "vec2", [MY.mouse.x / @_c.width, MY.mouse.y / @_c.height]);
    @_attachUniform(@_prg, "resolution", "vec2", [@_c.width, @_c.height]);
    
    # 描画
    @_gl.drawElements(@_gl.TRIANGLES, @_mdl.i.length, @_gl.UNSIGNED_SHORT, 0);
    @_gl.flush();
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  # -----------------------------------------------
  # シェーダーの生成、コンパイル
  # -----------------------------------------------
  _createShader: (id) =>
    
    # HTMLからscriptタグへの参照を取得
    scriptElement = document.getElementById(id);
    
    # シェーダ作成
    shader = @_gl.createShader(if scriptElement.type == "x-shader/x-vertex" then @_gl.VERTEX_SHADER else @_gl.FRAGMENT_SHADER);
    
    # 生成されたシェーダにソースを割り当てる
    @_gl.shaderSource(shader, scriptElement.text);
    
    # シェーダをコンパイルする
    @_gl.compileShader(shader);
    
    # シェーダが正しくコンパイルされたかチェック
    if @_gl.getShaderParameter(shader, @_gl.COMPILE_STATUS)
      return shader;
    else
      console.log(@_gl.getShaderInfoLog(shader));
      return null;
  
  
  
  # -----------------------------------------------
  # プログラムオブジェクトの生成
  # -----------------------------------------------
  _createProgram: (vs, fs) =>
    
    # プログラムオブジェクトの生成
    program = @_gl.createProgram();
    
    # プログラムオブジェクトにシェーダを割り当てる
    @_gl.attachShader(program, vs);
    @_gl.attachShader(program, fs);
    
    # シェーダをリンク
    @_gl.linkProgram(program);
    
    # シェーダのリンクが正しく行なわれたかチェック
    if @_gl.getProgramParameter(program, @_gl.LINK_STATUS)
    
      # 成功していたらプログラムオブジェクトを有効にする
      @_gl.useProgram(program);
      return program;
        
    else
      
      console.log(@_gl.getProgramInfoLog(program));
      return null;
  
  
  
  # -----------------------------------------------
  # VBOの作成
  # -----------------------------------------------
  _createVBO: (data) =>
    
    vbo = @_gl.createBuffer();
    
    # バッファをバインドする
    @_gl.bindBuffer(@_gl.ARRAY_BUFFER, vbo);
    
    # バッファにデータをセット
    @_gl.bufferData(@_gl.ARRAY_BUFFER, new Float32Array(data), @_gl.STATIC_DRAW);
    
    # バッファのバインドを無効化
    @_gl.bindBuffer(@_gl.ARRAY_BUFFER, null);
    
    return vbo;
  
  
  
  # -----------------------------------------------
  # VBOの登録
  # -----------------------------------------------
  _attachVBO: (prg, name, attStride, data) =>
    
    # attributeLocationの取得
    attLocation = @_gl.getAttribLocation(prg, name);
    
    # VBOの生成
    vbo = @_createVBO(data);
    
    # VBOをバインドし登録
    @_gl.bindBuffer(@_gl.ARRAY_BUFFER, vbo);
    @_gl.enableVertexAttribArray(attLocation);
    @_gl.vertexAttribPointer(attLocation, attStride, @_gl.FLOAT, false, 0, 0);
    
    # バッファのバインドを無効化
    @_gl.bindBuffer(@_gl.ARRAY_BUFFER, null);
  
  
  
  # -----------------------------------------------
  # IBOの作成
  # -----------------------------------------------
  _createIBO: (data) =>
    
    # バッファオブジェクトの生成
    ibo = @_gl.createBuffer();
    
    # バッファをバインドする
    @_gl.bindBuffer(@_gl.ELEMENT_ARRAY_BUFFER, ibo);
    
    # バッファにデータをセット
    @_gl.bufferData(@_gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), @_gl.STATIC_DRAW);
    
    # バッファのバインドを無効化
    @_gl.bindBuffer(@_gl.ELEMENT_ARRAY_BUFFER, null);
    
    return ibo;
  
  
  
  # -----------------------------------------------
  # Uniform変数の登録
  # -----------------------------------------------
  _attachUniform: (prg, name, type, data) =>
    
    uniLocation = @_gl.getUniformLocation(prg, name);
    
    switch type
      when "mat4"
        @_gl.uniformMatrix4fv(uniLocation, false, data);
      when "vec2"
        @_gl.uniform2fv(uniLocation, data);
      when "vec3"
        @_gl.uniform3fv(uniLocation, data);
      when "vec4"
        @_gl.uniform4fv(uniLocation, data);
      when "int"
        @_gl.uniform1i(uniLocation, data);
      when "float"
        @_gl.uniform1f(uniLocation, data);
  
  
  
  # -----------------------------------------------
  # フレームバッファの作成
  # -----------------------------------------------
  _createFramebuffer: (width, height) =>
    
    frameBuffer = @_gl.createFramebuffer();
    
    # フレームバッファをWebGLにバインド
    @_gl.bindFramebuffer(@_gl.FRAMEBUFFER, frameBuffer);
    
    # 深度バッファ用レンダーバッファの生成とバインド
    depthRenderBuffer = @_gl.createRenderbuffer();
    @_gl.bindRenderbuffer(@_gl.RENDERBUFFER, depthRenderBuffer);
    
    # レンダーバッファを深度バッファとして設定
    @_gl.renderbufferStorage(@_gl.RENDERBUFFER, @_gl.DEPTH_COMPONENT16, width, height);
    
    # フレームバッファにレンダーバッファを関連付ける
    @_gl.framebufferRenderbuffer(@_gl.FRAMEBUFFER, @_gl.DEPTH_ATTACHMENT, @_gl.RENDERBUFFER, depthRenderBuffer);
    
    # フレームバッファ用テクスチャの生成
    fTexture = @_gl.createTexture();
    
    # フレームバッファ用のテクスチャをバインド
    @_gl.bindTexture(@_gl.TEXTURE_2D, fTexture);
    
    # フレームバッファ用のテクスチャにカラー用のメモリ領域を確保
    @_gl.texImage2D(@_gl.TEXTURE_2D, 0, @_gl.RGBA, width, height, 0, @_gl.RGBA, @_gl.UNSIGNED_BYTE, null);
    
    # テクスチャパラメータ
    @_gl.texParameteri(@_gl.TEXTURE_2D, @_gl.TEXTURE_MAG_FILTER, @_gl.LINEAR);
    @_gl.texParameteri(@_gl.TEXTURE_2D, @_gl.TEXTURE_MIN_FILTER, @_gl.LINEAR);
    @_gl.texParameteri(@_gl.TEXTURE_2D, @_gl.TEXTURE_WRAP_S, @_gl.CLAMP_TO_EDGE);
    @_gl.texParameteri(@_gl.TEXTURE_2D, @_gl.TEXTURE_WRAP_T, @_gl.CLAMP_TO_EDGE);
    
    # フレームバッファにテクスチャを関連付ける
    @_gl.framebufferTexture2D(@_gl.FRAMEBUFFER, @_gl.COLOR_ATTACHMENT0, @_gl.TEXTURE_2D, fTexture, 0);
    
    # 各種オブジェクトのバインドを解除
    @_gl.bindTexture(@_gl.TEXTURE_2D, null);
    @_gl.bindRenderbuffer(@_gl.RENDERBUFFER, null);
    @_gl.bindFramebuffer(@_gl.FRAMEBUFFER, null);
    
    # オブジェクトを返して終了
    return {f : frameBuffer, d : depthRenderBuffer, t : fTexture};
  
  
  
  # -----------------------------------------------
  # フレームバッファの作成 キューブマップ仕様
  # -----------------------------------------------
  _createFramebufferCubeMap: (width, height, target) =>
    
    frameBuffer = @_gl.createFramebuffer();
    
    # フレームバッファをWebGLにバインド
    @_gl.bindFramebuffer(@_gl.FRAMEBUFFER, frameBuffer);
    
    # 深度バッファ用レンダーバッファの生成とバインド
    depthRenderBuffer = @_gl.createRenderbuffer();
    @_gl.bindRenderbuffer(@_gl.RENDERBUFFER, depthRenderBuffer);
    
    # レンダーバッファを深度バッファとして設定
    @_gl.renderbufferStorage(@_gl.RENDERBUFFER, @_gl.DEPTH_COMPONENT16, width, height);
    
    # フレームバッファにレンダーバッファを関連付ける
    @_gl.framebufferRenderbuffer(@_gl.FRAMEBUFFER, @_gl.DEPTH_ATTACHMENT, @_gl.RENDERBUFFER, depthRenderBuffer);
    
    # フレームバッファ用テクスチャの生成
    fTexture = @_gl.createTexture();
    
    # フレームバッファ用のテクスチャをバインド
    @_gl.bindTexture(@_gl.TEXTURE_CUBE_MAP, fTexture);
    
    # フレームバッファ用のテクスチャにカラー用のメモリ領域を 6 面分確保
    i = 0;
    while i < target.length
      @_gl.texImage2D(target[i], 0, @_gl.RGBA, width, height, 0, @_gl.RGBA, @_gl.UNSIGNED_BYTE, null);
      i++;
    
    # テクスチャパラメータ
    @_gl.texParameteri(@_gl.TEXTURE_CUBE_MAP, @_gl.TEXTURE_MAG_FILTER, @_gl.LINEAR);
    @_gl.texParameteri(@_gl.TEXTURE_CUBE_MAP, @_gl.TEXTURE_MIN_FILTER, @_gl.LINEAR);
    @_gl.texParameteri(@_gl.TEXTURE_CUBE_MAP, @_gl.TEXTURE_WRAP_S, @_gl.CLAMP_TO_EDGE);
    @_gl.texParameteri(@_gl.TEXTURE_CUBE_MAP, @_gl.TEXTURE_WRAP_T, @_gl.CLAMP_TO_EDGE);
    
    # 各種オブジェクトのバインドを解除
    @_gl.bindTexture(@_gl.TEXTURE_CUBE_MAP, null);
    @_gl.bindRenderbuffer(@_gl.RENDERBUFFER, null);
    @_gl.bindFramebuffer(@_gl.FRAMEBUFFER, null);
    
    # オブジェクトを返して終了
    return {f : frameBuffer, d : depthRenderBuffer, t : fTexture};
  
  
  
  # -----------------------------------------------
  # 2の累乗の最大値を取得
  # -----------------------------------------------
  _getMaxTexSize: (w, h) =>
    
    test = Math.max(w, h);
    i = 2;
    while 1
      if i >= test
        return i;
      else
        i *= 2;
  
  
  
  # -----------------------------------------------
  # 
  # -----------------------------------------------
  _plane: =>
    
    return {
      p: [
        -1.0,  1.0,  0.0,
         1.0,  1.0,  0.0,
        -1.0, -1.0,  0.0,
         1.0, -1.0,  0.0
      ],
      c:[
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0
      ],
      i:[
        0, 2, 1,
        1, 2, 3
      ]
    };
  
  
  
  
  # -----------------------------------------------
  # ラジアン
  # -----------------------------------------------
  _r: (degree) =>
    
    return MY.u.radian(degree);




















module.exports = Contents;