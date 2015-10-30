var ProjectHandler = function(context) {
  this.context     = context;
  this.fileManager = [NSFileManager defaultManager];
  this.scriptPath  = context.scriptPath.substring(0, context.scriptPath.lastIndexOf("/")) + "/";
};

ProjectHandler.prototype = {

  copyFiles: function(filename) {
    var fromPath  = this.scriptPath + "sketchfiles/" + filename + ".sketch",
        exporTo   = this.exportPath(),
        toPath    = null;

    if (exporTo) {
      toPath = exporTo + filename + ".sketch";
      this.copyFileToUrl(fromPath, toPath);

      [[NSWorkspace sharedWorkspace] openFile:toPath withApplication:"Sketch"];
    }

  },

  exportPath: function() {

    log("Asking for save location");

    var openPanel = [NSOpenPanel openPanel];

    [openPanel setTitle:@"Save"];
    [openPanel setNameFieldLabel:@"Save file to:"];
    [openPanel setPrompt:@"Save"];
    [openPanel setCanCreateDirectories:true];
    [openPanel setCanChooseFiles:false];
    [openPanel setCanChooseDirectories:true];
    [openPanel setAllowsMultipleSelection:false];
    [openPanel setDirectoryURL:[NSURL fileURLWithPath:[@"~/Desktop" stringByExpandingTildeInPath]]];

    if ([openPanel runModal] != NSOKButton) {
        return null;
    }

    log("Export location: " + [[openPanel URL] path] + "/");

    return [[openPanel URL] path] + "/";
  },

  copyFileToUrl: function(fromPath, toPath) {

    var fileManager = this.fileManager;

    [fileManager removeItemAtPath:toPath error:nil];
    [fileManager copyItemAtPath:fromPath toPath:toPath error:nil];
  },

  displayMessage: function(message) {
    var doc = this.context.document;

    log(message);
    [doc showMessage: message];
  }
}