

# ---------------------------------------------------
# マウス位置管理
# ---------------------------------------------------
class Mouse
  
  
  # -----------------------------------------------
  # コンストラクタ
  # -----------------------------------------------
  constructor: ->
    
    @x = MY.resize.sw() * 0.5;
    @y = MY.resize.sh() * 0.5;
    @oldX = 0;
    @oldY = 0;
    
    @_init();
  
  
  # ------------------------------------
  # 初期化
  # ------------------------------------
  _init: =>
    
    if MY.u.isSmt()
      $(window).on("touchstart", @_eMouseMove);
      $(window).on("touchmove", @_eMouseMove);
    else
      $(window).on("mousemove", @_eMouseMove);
  
  
  
  # -----------------------------------
  # イベント MouseMove
  # -----------------------------------
  _eMouseMove: (e) =>
    
    if MY.u.isSmt()
      
      touches = event.touches;
      event.preventDefault();
      if touches? && touches.length > 0
        @oldX = @x;
        @oldY = @y;
        @x = touches[0].pageX;	
        @y = touches[0].pageY;
    
    else
    
      @oldX = @x;
      @oldY = @y;
      @x    = e.clientX;
      @y    = e.clientY;
  
  
  
  # -----------------------------------
  # 指定位置からマウス位置までの距離
  # -----------------------------------
  dist: (tx, ty) =>
    
    dx = tx - @x;
    dy = ty - @y;
    
    return Math.sqrt(dx * dx + dy * dy);






module.exports = Mouse;