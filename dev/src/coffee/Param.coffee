

# ---------------------------------------------------
# パラメータ管理
# ---------------------------------------------------
class Param
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    @_gui;
    
    @cx = 1;
    @cy = 2;
    @cz = 4.5;
    
    @cDirX = 0;
    @cDirY = 0;
    @cDirZ = -1;
    
    @callBack = {};
    
    
    @_init();
  
  
  
  # -----------------------------------------------
  # 初期化
  # -----------------------------------------------
  _init:  =>
    
    if MY.conf.FLG.PARAM
    
      @_gui = new dat.GUI();
      @_setGuiNum("cx", -10, 10, 0.1);
      @_setGuiNum("cy", -10, 10, 0.1);
      @_setGuiNum("cz", -10, 10, 0.1);
      @_setGuiNum("cDirX", -10, 10, 0.1);
      @_setGuiNum("cDirY", -10, 10, 0.1);
      @_setGuiNum("cDirZ", -10, 10, 0.1);
  
  
  # -----------------------------------------------
  # 
  # -----------------------------------------------
  _setGuiNum: (name, min, max, step) =>
    
    @_gui.add(@, name, min, max).step(step).onFinishChange((e) =>
      @[name] = e;
      @_callBack(name);
    );
  
  
  
  # -----------------------------------------------
  # 
  # -----------------------------------------------
  _setGuiBool: (name) =>
    
    @_gui.add(@, name).onFinishChange((e) =>
      @[name] = e;
      @_callBack(name);
    );
  
  
  
  # -----------------------------------------------
  # コールバック実行
  # -----------------------------------------------
  _callBack: (name) =>
    
    if @callBack[name]?
      for val,i in @callBack[name]
        if val?
          val();
  
  
  
  # -----------------------------------------------
  # コールバック登録
  # -----------------------------------------------
  addCallBack: (name, func) =>
    
    if !@callBack[name]?
      @callBack[name] = [];
    
    @callBack[name].push(func);






module.exports = Param;