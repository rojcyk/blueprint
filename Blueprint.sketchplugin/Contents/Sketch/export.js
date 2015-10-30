@import 'commons/sandbox.js';
@import 'commons/finder.js';
@import 'commons/exportHandler.js';


function exportAllMockupsHandler (context) {

  new AppSandbox().authorize("/Users/" + NSUserName(), function(){
    var exporter = new ExportHandler(context);
    exporter.delegate("exportAllArtboards");
  })
};


function exportSelectedMockupsHandler (context) {

  new AppSandbox().authorize("/Users/" + NSUserName(), function(){
    var exporter = new ExportHandler(context);
    exporter.delegate("exportSelectedArtboards");
  })

};

function exportAppIconHandler (context) {

  new AppSandbox().authorize("/Users/" + NSUserName(), function(){
    var exporter = new ExportHandler(context);
    exporter.delegate("exportAppIcon");
  })

};

function exportSelectedAssetsHandler (context) {

  new AppSandbox().authorize("/Users/" + NSUserName(), function(){
    var exporter = new ExportHandler(context);
    exporter.delegate("exportSelectedAssets");
  })

};