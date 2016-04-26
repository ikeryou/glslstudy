UpdateMgr = require('./libs/mgr/UpdateMgr');
ResizeMgr = require('./libs/mgr/ResizeMgr');
DelayMgr  = require('./libs/mgr/DelayMgr');
Utils     = require('./libs/Utils');
Profiler  = require('./Profiler');
Func      = require('./Func');
Mouse     = require('./Mouse');
Contents  = require('./Contents');
Conf      = require('./Conf');
Param     = require('./Param');



# ------------------------------------
# メイン
# ------------------------------------
class Main
  
  # ------------------------------------
  # コンストラクタ
  # ------------------------------------
  constructor: ->
  
  
  
  # ------------------------------------
  # 初期化
  # ------------------------------------
  init: =>
    
    # app専用オブジェクト
    window.MY = {};
    
    # コンフィグ
    MY.conf = new Conf();
    
    # ユーティリティーオブジェクト
    MY.u = new Utils();
    
    # 画面更新管理
    MY.update = new UpdateMgr();
    MY.update.add(@_update);
    
    # リサイズ管理
    MY.resize = new ResizeMgr();
    
    # 遅延実行管理
    MY.delay = new DelayMgr();
    
    # マウス監視
    MY.mouse = new Mouse();
    
    # 共通関数
    MY.f = new Func();
    
    # アプリ監視
    MY.profiler = new Profiler();
    
    # パラメータ管理
    MY.param = new Param();
    
    # コンテンツ
    MY.c = new Contents();
    MY.c.init();
  
  
  
  # ------------------------------------
  # 更新
  # ------------------------------------
  _update: =>
    
    window.MY.delay.update();









$(window).ready(=>
  app = new Main();
  app.init();
  window.MY.main = app;
);