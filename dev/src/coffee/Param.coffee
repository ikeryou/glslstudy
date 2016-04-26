

# ---------------------------------------------------
# パラメータ管理
# ---------------------------------------------------
class Param
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    @_gui;
    
    @line = 10;
    @lineScale = if MY.u.isSmt() then 50 else 100;
    
    @callBack = {};
    
    
    @_init();
  
  
  
  # -----------------------------------------------
  # 初期化
  # -----------------------------------------------
  _init:  =>
    
    if MY.conf.FLG.PARAM
    
      @_gui = new dat.GUI();
      @_setGuiNum("line", 0, 20, 0.1);
      @_setGuiNum("lineScale", 0, 400, 1);
  
  
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