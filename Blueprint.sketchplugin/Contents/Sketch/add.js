@import 'commons/sandbox.js';
@import 'commons/finder.js';
@import 'commons/projectHandler.js';
@import 'commons/canvasHandler.js';

var newProjectHandler = function (context) {
  new AppSandbox().authorize("/Users/" + NSUserName(), function(){
    var project  = new ProjectHandler(context);
    project.copyFiles("blueprint");
  })
};

var newAppstoreHandler = function (context) {
  new AppSandbox().authorize("/Users/" + NSUserName(), function(){
    var project  = new ProjectHandler(context);
    project.copyFiles("appstore");
  })
};

var createIconHandler = function (context) {
  var canvasHandler  = new CanvasHandler(context);
  canvasHandler.addIcon();
};

var createTableHandler = function (context) {
  var canvasHandler  = new CanvasHandler(context);
  canvasHandler.addTable();
};

var addIphonePortraitHandler = function (context) {
  var canvasHandler  = new CanvasHandler(context);
  canvasHandler.addDevice("iPhone 6","Devices / iPhone / 6 Portrait");
};

var addIphoneLandscapeHandler = function (context) {
  var canvasHandler  = new CanvasHandler(context);
  canvasHandler.addDevice("iPhone 6 Landscape","Devices / iPhone / 6 Landscape");
};

var addIpadPortraitHandler = function (context) {
  var canvasHandler  = new CanvasHandler(context);
  canvasHandler.addDevice("iPhone 6","Devices / iPad / Portrait");
};

var addIpadLandscapeHandler = function (context) {
  var canvasHandler  = new CanvasHandler(context);
  canvasHandler.addDevice("iPad Landscape","Devices / iPad / Landscape");
};