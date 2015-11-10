/**
* https://gist.github.com/rojcyk/7a24007beb75c5641ed4
*
* USAGE
*
* You must include another class from link below
* https://gist.github.com/rojcyk/c5635b097ba52618249f
*
* First you need to create a new instance wherever you want to use the class.
* Like this:
*
* @import 'finder.js';
* @import 'exportHandler.js';
*
* var exporter = new ExportHandler(context,path);
*
* Then you can access the class functions
*
* exporter.exportAllAssets();
* exporter.exportLayer(MSlayer, 1, ".png", "destination/", "appIcon");
*/

/**
* Constructor needs sketch context as first parameter
* and default destination path as the second one.
* Everything exported with this class will be exported to
* "path". Functions like exportLayer() accept folder parameter
* which adds anorther subfolder to path. (path + folder) =
* exported location.
*/
var ExportHandler = function(context, path) {

    this.context      = context;

    // There is various ways how to ask for export location

    // This will ask for export location
    // this.exportPath   = this.exportPath();

    // Or you can use a predefined export location
    // this.exportPath   = "/Users/rojcyk/Desktop/test/";

    // Or you can export files to desktop in a folder with
    // current file name
    this.exportPath   = context.scriptPath.substring(0, context.scriptPath.indexOf("/",7)) + "/Desktop/" + this.documentName();

    this.finder       = new Finder(context);
};

ExportHandler.prototype = {

  delegate: function(methodNumber) {
    if (this.isDefinedAttr(this.exportPath)) {
      switch (methodNumber) {

        case "exportAllArtboards" :
          this.exportAllArtboards(this.setOptions(2,".png"));
        break;

        case "exportSelectedArtboards" :
          this.exportSelectedArtboards(this.setOptions(2,".png"));
        break;

        case "exportSelectedAssets" :
          this.exportSelectedAssets();
        break;

        case "exportAppIcon" :
          this.exportAppIcon();
        break;
      }
    }
  },

  setOptions: function(scale, sufix, folder) {
    var options = {};

    // Check if attributes are set, if not, give them
    // default values. For scale its 1;
    if (!this.isDefinedAttr(scale)) {
      options.scale  = 1;
    } else {
      options.scale  = scale;
    }

    // Should always export to .png, JPEG works too
    if (!this.isDefinedAttr(sufix)) {
      options.sufix = ".png";
    } else {
      options.sufix = sufix;
    }

    // If folder is undefined, folder is an empty string.
    // Otherwise add "/" to the end of the string
    if (!this.isDefinedAttr(folder)) {
      options.folder = "";
    } else {
      options.folder = folder;
    }

    return options;
  },

  /**
  * ExportAllArtboards method will export every artboard
  * without exceptions. With scale, sufix ".png"or ".jpeg"
  * in specified folder. All parameters can be empty.
  */
  exportAllArtboards: function(options) {
    var artboards = this.finder.getAllArtboards();

    for (var artboardIndex = 0, count = artboards.length; artboardIndex < count; artboardIndex++) {
      this.exportLayer(artboards[artboardIndex], options.scale, options.sufix, options.folder);
    }

    [[NSWorkspace sharedWorkspace] openFile:this.exportPath withApplication:"Finder"];
  },

  exportSelectedArtboards: function(options) {
    var selection = this.context.selection,
        doc       = this.context.document,
        artboards = null;

    // If the user has something selected, export selected
    // assets. If the selection is empty, export all assets
    // from the current page.
    if (selection.count()) {
      this.exportArtboards(this.finder.arrayFromNSArray(selection), options.scale, options.sufix, options.folder);
    } else {
      this.exportArtboards(this.finder.arrayFromNSArray([[doc currentPage] artboards]), options.scale, options.sufix, options.folder);
    }

    [[NSWorkspace sharedWorkspace] openFile:this.exportPath withApplication:"Finder"];
  },

  /**
  * Almost the same as exportAllArtboards, with only exception.
  * Artboards parameter accepts array of artboards and must be present
  */
  exportArtboards: function(artboards, scale, sufix, folder) {
    if (!this.isDefinedAttr(artboards)) {
      this.displayMessage("No artboards provided");
      return;
    }

    for (var artboardIndex = 0, count = artboards.length; artboardIndex < count; artboardIndex++) {
      this.exportLayer(artboards[artboardIndex], scale, sufix, folder);
    }
  },

  /**
  * Will export selected iOS assets
  */
  exportSelectedAssets: function() {
    var selection       = this.context.selection,
        doc             = this.context.document;

    if (selection.count()) {
      this.exportIosAssets(this.finder.arrayFromNSArray(selection));
      [[NSWorkspace sharedWorkspace] openFile:this.exportPath withApplication:"Finder"];
    } else {
      this.displayMessage("No layers selected");
    }
  },

  /**
  * Exports passed asset, in iOS like
  * naming convention.
  */
  exportIosAsset: function (asset) {
    this.exportLayer(asset, 1, ".png",   "");
    this.exportLayer(asset, 2, "@2x.png","");
    this.exportLayer(asset, 3, "@3x.png","");
  },

  /**
  * Exports passed asset, in Android like
  * naming convention and folder structure.
  */
  exportAndroidAsset: function (asset) {
    this.exportLayer(asset, 0.5, ".png", "ldpi/");
    this.exportLayer(asset, 1,   ".png", "mdpi/");
    this.exportLayer(asset, 1.5, ".png", "hdpi/");
    this.exportLayer(asset, 2,   ".png", "xhdpi/");
    this.exportLayer(asset, 3,   ".png", "xxhdpi/");
    this.exportLayer(asset, 4,   ".png", "xxxhdpi/");
  },

  /**
  * Loops trough passed layers and exports
  *  assets in iOS naming convention style.
  */
  exportIosAssets: function (layers) {);
    for (var layerIndex = 0, count = layers.length; layerIndex < count; layerIndex++ ) {
      this.exportIosAsset(layers[layerIndex]);
    }
  },

  /**
  * Loops trough passed layers and exports
  * assets in android naming convention style.
  */
  exportAndroidAssets: function (layers) {
    for (var layerIndex = 0, count = layers.length; layerIndex < count; layerIndex++ ) {
      this.exportAndroidAsset(layers[layerIndex]);
    }
  },

  exportAppIcon: function (exportPath) {
    var selection = this.context.selection,
        icons     = this.finder.arrayFromNSArray(selection),
        icon      = icons[0];

    if (icons.length === 0) {

      this.displayMessage("Use a 120pt rectangle as base");

    } else {

      if (this.isDefinedAttr(icon)) {
        this.exportLayer(icon, 0.24,  "-29@1x.png","");
        this.exportLayer(icon, 0.333, "-40@1x.png","");
        this.exportLayer(icon, 0.5,   "-60@1x.png","");
        this.exportLayer(icon, 0.633, "-76@1x.png","");

        this.exportLayer(icon, 0.483, "-29@2x.png","");
        this.exportLayer(icon, 0.667, "-40@2x.png","");
        this.exportLayer(icon, 1,     "-60@2x.png","");
        this.exportLayer(icon, 1.266, "-76@2x.png","");
        this.exportLayer(icon, 1.391, "-83@2x.png","");

        this.exportLayer(icon, 0.725, "-29@3x.png","");
        this.exportLayer(icon, 1,     "-40@3x.png","");
        this.exportLayer(icon, 1.5,   "-60@3x.png","");
        this.exportLayer(icon, 1.9,   "-76@3x.png","");

        this.exportLayer(icon, 4.267, "-iTunes@1x.png","");
        this.exportLayer(icon, 8.533, "-iTunes@2x.png","");

        [[NSWorkspace sharedWorkspace] openFile:this.exportPath withApplication:"Finder"];
      } else {
        this.displayMessage("No layers selected");
      }
    }
  },

  isGroup: function(layer) {
    if ([layer class] == "MSArtboardGroup" || [layer class] == "MSLayerGroup") {
      return true;
    } else {
      return false;
    }
  },

  /**
  * Core of this class. Exports passed layer, with
  * optional scale, sufix, folder, and name.
  */
  exportLayer: function(layer, scale, sufix, folder) {
    var doc   = this.context.document,
        name  = [layer name],
        path  = this.exportPath + folder + name + sufix,
        slice = this.scaleLayer(layer, scale);

    if (this.isGroup(layer)) {
      this.displayMessage("Exporting file: " + name + sufix);

      [doc saveArtboardOrSlice:slice toFile: path];
    } else {
      this.displayMessage("Selected layer needs to be a group");
    }
  },

  /** Returns slice from layer and scale. */
  scaleLayer: function(layer, scale) {

    // originaly working version ~ now broken. Waiting for fix
    // var rect    = [layer absoluteInfluenceRect];
    // var slice   = [[MSSliceMaker slicesFromExportableLayer:layer inRect:rect] firstObject];

    var rect  = [MSSliceTrimming trimmedRectForSlice:layer];
    var slice = [[MSSliceMaker slicesFromExportableLayer:layer] firstObject];

    log(rect);

    [slice setShouldTrim:0];
    [slice setScale:scale];
    [slice setSaveForWeb:1];

    return slice;
  },

  displayMessage: function(message) {
    var doc = this.context.document;

    log(message);
    [doc showMessage: message];
  },

  exportPath: function() {

    log("Asking for export location");

    var openPanel = [NSOpenPanel openPanel];

    [openPanel setTitle:@"Export"];
    [openPanel setNameFieldLabel:@"Export To:"];
    [openPanel setPrompt:@"Export"];
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

  /**
  * Returns true if parameter is not undefined, null, false
  * or empty string.
  */
  isDefinedAttr: function(attr) {
    return attr != undefined && attr != null && attr != false && attr != '';
  },

  /**
  * Very dirty way of getting the name of the current file
  * Fuck that, couldn't get it work any other way
  */
  documentName: function() {
    var doc = this.context.document,
        url = "" + doc.fileURL();

    var folder;

    if (url != "null") {
      folder = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
    } else {
      folder = "Untitled";
    }

    return folder + " assets/";
  }
};