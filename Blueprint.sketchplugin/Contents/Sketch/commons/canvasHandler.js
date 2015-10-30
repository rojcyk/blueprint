var CanvasHandler = function(context) {
  this.context = context;
  this.finder  = new Finder(context);
};

CanvasHandler.prototype = {

  addIcon: function() {
    var doc       = this.context.document,
        selection = this.context.selection;

    var parent, group, icon, item, positionX, positionY, color, position;

    if ([selection count] > 0) {

      item     = [selection objectAtIndex:0];
      parent   = this.returnParent(item);
      position = this.returnPosition(item);

      group    = [parent addLayerOfType:"group"];
      icon     = [group  addLayerOfType:"rectangle"];

      [icon   setName:"icon frame"];
      [group  setName:"7. Icon Set / icn-name"];

      this.setFrame([group frame], 32, 32, position.x, position.y);
      this.setFrameProportions([icon frame], 32, 32);

      color = [[[[icon style] fills] addNewStylePart] color];
      [color setRed:0.5];
      [color setGreen:0.5];
      [color setBlue:0.5];
      [color setAlpha:0.2];

      [[doc currentView] refresh];

      } else {
        this.displayMessage("You need to select a layer in order to add an icon.");
      }
  },

  addTable: function() {
    var group, parent, table, selection, tableStyle, tableHeader, tableFooter;

    var doc         = this.context.document,
        selections  = this.context.selection,
        layerStyles = doc.documentData().layerStyles().objects().array(),
        textStyles  = doc.documentData().layerTextStyles().objects().array();

    var tableHeaderStyle = this.finder.filterLayersByName(textStyles,"Table Header").shift().newInstance(),
        tableFooterStyle = this.finder.filterLayersByName(textStyles,"Table Footer").shift().newInstance();

    var cell1 = this.getNewSymbol("4. Table / Cell"),
        cell2 = this.getNewSymbol("4. Table / Cell with arrow");

    log(tableHeaderStyle);

    if (this.isDefinedAttr(cell1) && this.isDefinedAttr(cell2)) {

      tableStyle  = this.finder.filterLayersByName(layerStyles,"Table Background").shift().newInstance();

      if ([selections count] > 0) {

        selection   = selections[0],
        parent      = this.returnParent(selection),
        group       = [parent addLayerOfType:"group"],
        table       = [group  addLayerOfType:"rectangle"],
        tableHeader = [group  addLayerOfType:"text"],
        tableFooter = [group  addLayerOfType:"text"];

        [group       setName:"Table"];
        [table       setName:"table background"];
        [table       setStyle:tableStyle];
        [tableHeader setStyle:tableHeaderStyle];
        [tableFooter setStyle:tableFooterStyle];

        [tableHeader setStringValue: "TABLE HEADER"]
        [tableFooter setStringValue: "Table footer"]

        position = this.returnPosition(selection);

        var tableOffset = 27;

        this.setFrame([group frame], 375, tableOffset + (2*44) + 12 + 18, position.x, position.y);
        this.setFrame([table frame], 375, 88, 0, tableOffset);

        [group addLayers:[cell1]];
        [group addLayers:[cell2]];

        this.setFramePosition([cell1 frame], 15, tableOffset);
        this.setFramePosition([cell2 frame], 15, 44 + tableOffset);

        this.setFramePosition([tableHeader frame], 15, 0);
        this.setFramePosition([tableFooter frame], 15, tableOffset + (2*44) + 12);

        [tableHeader adjustFrameToFit];
        [tableFooter adjustFrameToFit];

        [[doc currentView] refresh];

      } else {
        this.displayMessage("You need to select a layer in order to add a table.");
      }
    } else {
      this.displayMessage("You are not using Blueprint template");
    }
  },

  addDevice: function(name, symbolName) {
    var symbol = this.getNewSymbol(symbolName);

    if (this.isDefinedAttr(symbol)) {

      var frame    = [symbol frame],
          width    = [frame width],
          height   = [frame height],
          artboard = this.addArtboard(name, width, height, 0, 0);

    this.setFramePosition(frame, 0, 0);
    [artboard addLayers:[symbol]];
    [symbol ungroup];
    // [artboard setIsSelected:1];

    this.addDeviceGuide(artboard);

    } else {
      this.displayMessage("You are not using Blueprint template");
    }
  },

  returnParent: function(layer) {
    if ([layer class] == "MSShapeGroup" || [layer class] == "MSTextLayer") {
      return [layer parentGroup];
    } else {
      return layer;
    }
  },

  returnPosition: function(layer) {
    var position = {};

    position.x = null,
    position.y = null;

    if ([layer class] == "MSArtboardGroup" || [layer class] == "MSLayerGroup") {
        position.x = 0;
        position.y = 0;
      } else {
        position.x = [[layer frame] x];
        position.y = [[layer frame] y];
      }

    return position;
  },

  addDeviceGuide: function(artboard) {
    var width = [[artboard frame] width];
        horizontalGuides = [artboard horizontalRulerData],
        verticalGuides   = [artboard verticalRulerData];

    if (width == 375) {
      [horizontalGuides addGuideWithValue:28];
      [horizontalGuides addGuideWithValue:width-28];
      [verticalGuides addGuideWithValue:568];
    } else if (width == 667) {
      [horizontalGuides addGuideWithValue:50];
      [horizontalGuides addGuideWithValue:width-50];
      [verticalGuides addGuideWithValue:320];
    }
  },

  addArtboard: function(name, width, height, x, y) {
    var doc      = this.context.document,
        page     = [doc currentPage],
        artboard = [MSArtboardGroup new],
        frame    = [artboard frame];

    [page addLayers:[artboard]];

    this.setFrame([artboard frame], width, height, x, y);

    log(frame);

    [artboard setName:name];

    return artboard;
  },

  getNewSymbol: function(name) {
    var symbols = this.context.document.documentData().layerSymbols().objects().array()),
        symbol  = this.finder.filterLayersByName(symbols, name).shift();

    if (this.isDefinedAttr(symbol)) {
      return [symbol newInstance];
    } else {
      return null;
    }
  },

  setFrameProportions: function(frame, width, height) {
    [frame setWidth:width];
    [frame setHeight:height];
  },

  setFramePosition: function(frame, x, y) {
    [frame setX:x];
    [frame setY:y];
  },

  setFrame: function(frame, width, height, x, y) {
    this.setFrameProportions(frame, width, height);
    this.setFramePosition(frame, x, y);
  },

  displayMessage: function(message) {
    var doc = this.context.document;

    log(message);
    [doc showMessage: message];
  },

  isDefinedAttr: function(attr) {
    return attr != undefined && attr != null && attr != false && attr != '';
  }

};