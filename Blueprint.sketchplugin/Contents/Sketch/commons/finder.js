/**
* https://gist.github.com/rojcyk/c5635b097ba52618249f
*
* USAGE
*
* First you need to create a new instance wherever you want to use the class.
* Like this:
*
* @import 'finder.js';
*
* var finder = new Finder(context);
*
* Then you can access the class functions
*
* var iosAssets                    = finder.searchForLayers("[a-zA-Z-.0-9]+@iOS$");
* var iosAssetsInContainer         = finder.searchForLayers("[a-zA-Z-.0-9]+@iOS$",[[[doc currentPage] artboards] firstObject]));
* var iosAssetsInContainerByGroup  = finder.searchForLayers("[a-zA-Z-.0-9]+@iOS$",[[[doc currentPage] artboards] firstObject],"MSLayerGroup");
*
* or
*
* var rectangleLayers              = finder.getLayersNamed("Rectangle 1");
* var layersEndingWith             = finder.getLayersEndingWith("@2x");
*/

/**
* Make context and context.document available
* in all functions for searching
*/
var Finder = function(context) {
  this.context    = context;
  this.doc        = context.document;
};

Finder.prototype = {

  /**
  * Search Layers function will go trough the whole document
  * if container is not supplied, and will search for
  * layers matching regex w/ or without layertype
  */
  searchForLayers: function(regex, container, layerType) {
    var result;

    // If container is supplied, function will search
    // for layers only in the container. Otherwise
    // it will go trough the whole document
    if (this.isDefinedAttr(container)) {
      var layers = this.getLayersInContainer(container);
      result = this.filterLayersByRegex(layers, regex);
    } else {
      result = this.getLayersMatchingRegex(regex);
    }

    // If layer type is specified, fungction will filter
    // out those not matching the layerType
    if (this.isDefinedAttr(layerType)) {
      result = this.filterLayersByClass(result, layerType);
    }

    // Returns filtered result
    return result;
  },

  /**
  * Function returns all available layers in the document
  * except those irelevant for this plugin. Like paths for MSShapeGroup
  */
  getAllLayers: function() {
    var pages   = this.doc.pages(),
        layers  = [];

    // Looping trough pages
    for (var pageIndex = 0, count = [pages count]; pageIndex < count; pageIndex++) {
      layers = layers.concat(this.getLayersInContainer([pages objectAtIndex:pageIndex]));
    }

    return layers;
  },

  /**
  * Function to return all document artboards
  */
  getAllArtboards: function() {
    var pages         = this.doc.pages(),
        pageArtboards = [NSArray array],
        docArtboards  = [NSArray array];

    for (var pageIndex = 0, count = [pages count]; pageIndex < count; pageIndex++) {

      page            = [pages objectAtIndex:pageIndex];
      pageArtboards   = [page artboards];
      docArtboards    = [docArtboards arrayByAddingObjectsFromArray:pageArtboards];
    }

    return this.arrayFromNSArray(docArtboards)
  },

  /**
  * Returns all layers in container.
  */
  getLayersInContainer: function(layer) {
    var layers = this.getObjectAndLayers(layer);

    // Get rid of the parent layer
    layers.shift();

    return layers;
  },

  /**
  * Function will add parent layer and recursively loop
  * trough all its sublayers. F is very similiar to
  * the bohemia coding child method, but since it also
  * returned unwanted layers I had to write my own version.
  */
  getObjectAndLayers: function(container) {
    var objects = [];

    // Push container
    objects.push(container);

    // If we can dive in, dive in.
    if ( this.isParentLayer([container className]) ) {

      var children = [container layers],
          child    = null;

      for (var childIndex = 0, count = [children count]; childIndex < count; childIndex++) {

        child = [children objectAtIndex:childIndex];

        // For every child, get its sublayers, if there are none, returns only the parent.
        objects = objects.concat(this.getObjectAndLayers(child));
      }
    }
    return objects;
  },

  /**
  * Functions below are quite unefficient, but something
  * is broken and NSMutable arrays and sketch are not
  * working properly, so there is a conversion from
  * NSArray to JS array. Things are working so don't
  * change anything until things get fixed.
  */

  /**
  * Will filter all supplied layers by className
  */
  filterLayersByClass: function(layers, layerClass) {
    var predicate           = NSPredicate.predicateWithFormat("className == %@", layerClass),
        predicateLayers     = [NSArray arrayWithArray:layers];

    predicateLayers         = predicateLayers.filteredArrayUsingPredicate(predicate);

    return this.arrayFromNSArray(predicateLayers);
  },

  /**
  * Will filter all supplied layers by layer name
  */
  filterLayersByName: function(layers, layerName) {
    var predicate           = NSPredicate.predicateWithFormat("name == %@", layerName),
        predicateLayers     = [NSArray arrayWithArray:layers];

    predicateLayers         = predicateLayers.filteredArrayUsingPredicate(predicate);

    return this.arrayFromNSArray(predicateLayers);
  },

  /**
  * Will filter all supplied layers by regex
  */
  filterLayersByRegex: function(layers, regex) {
    var predicate           = NSPredicate.predicateWithFormat("name MATCHES[c] %@", regex),
        predicateLayers     = [NSArray arrayWithArray:layers];

    predicateLayers         = predicateLayers.filteredArrayUsingPredicate(predicate);

    return this.arrayFromNSArray(predicateLayers);
  },

  /**
  * Will filter all supplied layers by starting string
  */
  filterLayersStartingWith: function(layers, startingWith) {
    var predicate           = NSPredicate.predicateWithFormat("name beginswith[c] %@", startingWith),
        predicateLayers     = [NSArray arrayWithArray:layers];

    predicateLayers         = predicateLayers.filteredArrayUsingPredicate(predicate);

    return this.arrayFromNSArray(predicateLayers);
  },

  /**
  * Will filter all supplied layers by ending string
  */
  filterLayersEndingWith: function(layers, endingWith) {
    var predicate           = NSPredicate.predicateWithFormat("name endswith[c] %@", endingWith),
        predicateLayers     = [NSArray arrayWithArray:layers];

    predicateLayers         = predicateLayers.filteredArrayUsingPredicate(predicate);

    return this.arrayFromNSArray(predicateLayers);
  },

  /**
  * Get layers from the whole document
  */
  getLayersNamed: function(predicate) {
    var pages           = this.doc.pages(),
        filteredArray   = [NSarray array],
        predicate       = NSPredicate.predicateWithFormat("name == %@", predicate),
        page            = null,
        scope           = null;

    // Looping trough pages
    for (var pageIndex = 0, count = [pages count]; pageIndex < count; pageIndex++) {

      page   = [pages objectAtIndex:pageIndex];
      scope  = [page children];

      // If layer named "predicate" is found, add it to filtered array
      filteredArray = scope.filteredArrayUsingPredicate(predicate);
    }

    // Returns all layers named "predicate"
    return filteredArray;
  },

  getLayersMatchingClass: function(layerClass) {
    var predicate       = NSPredicate.predicateWithFormat("className == %@", layerClass),
        filteredArray   = [NSArray array],
        pages           = this.doc.pages(),
        pageLayers      = null;

    // Looping trough pages
    for (var pageIndex = 0, count = [pages count]; pageIndex < count; pageIndex++) {

      pageLayers  = [[pages objectAtIndex:pageIndex] children];

      // Add every layer matching our predicate to filtered array
      filteredArray   = [filteredArray arrayByAddingObjectsFromArray:pageLayers.filteredArrayUsingPredicate(predicate)];
    }

    // Last step convers NS array to JS array
    return this.arrayFromNSArray(filteredArray);
  },

  getLayersMatchingRegex: function(regex) {
    var predicate       = NSPredicate.predicateWithFormat("name MATCHES[c] %@", regex),
        filteredArray   = [NSArray array],
        pages           = this.doc.pages(),
        pageLayers      = null;

    // Looping trough pages
    for (var pageIndex = 0, count = [pages count]; pageIndex < count; pageIndex++) {

      pageLayers  = [[pages objectAtIndex:pageIndex] children];

      // Add every layer matching our predicate to filtered array
      filteredArray   = [filteredArray arrayByAddingObjectsFromArray:pageLayers.filteredArrayUsingPredicate(predicate)];
    }

    // Last step convers NS array to JS array
    return this.arrayFromNSArray(filteredArray);
  },

  getLayersEndingWith: function(endingWith) {
    // Will filter all supplied layers ending with "endingWith"

    var predicate       = NSPredicate.predicateWithFormat("name endswith[c] %@", endingWith),
        filteredArray   = [NSArray array],
        pages           = this.doc.pages(),
        pageLayers      = null;

    // Looping trough pages
    for (var pageIndex = 0, count = [pages count]; pageIndex < count; pageIndex++) {

      pageLayers  = [[pages objectAtIndex:pageIndex] children];

      // Add every layer matching our predicate to filtered array
      filteredArray   = [filteredArray arrayByAddingObjectsFromArray:pageLayers.filteredArrayUsingPredicate(predicate)];
    }

    // Last step convers NS array to JS array
    return this.arrayFromNSArray(filteredArray);
  },

  getLayersStartingWith: function(startingWith) {
    // Will filter all supplied layers starting with "startingWith"

    var predicate       = NSPredicate.predicateWithFormat("name beginswith[c] %@", startingWith),
        filteredArray   = [NSArray array],
        pages           = this.doc.pages(),
        pageLayers      = null;

    // Looping trough pages
    for (var pageIndex = 0, count = [pages count]; pageIndex < count; pageIndex++) {

      pageLayers  = [[pages objectAtIndex:pageIndex] children];

      // Add every layer matching our predicate to filtered array
      filteredArray   = [filteredArray arrayByAddingObjectsFromArray:pageLayers.filteredArrayUsingPredicate(predicate)];
    }

    // Last step convers NS array to JS array
    return this.arrayFromNSArray(filteredArray);
  },

  /**
  * Checks where we can dive in current layer class
  * Returns true for MSPage, MSArtboardGroupd and MSLayerGroup
  */
  isParentLayer: function(layerClass) {
    return layerClass == "MSPage" || layerClass == "MSArtboardGroup" || layerClass == "MSLayerGroup";
  },

  /**
  * Array operations
  */
  arrayFromNSArray: function(nsarray) {
    // Simple function to convert NSArray to JS array

    var array = [];

    for (var itemIndex = 0, count = [nsarray count]; itemIndex < count; itemIndex++) {
      array.push([nsarray objectAtIndex:itemIndex]);
    }

    return array;
  },

  /**
  * Returns true if parameter is not undefined, null, false
  * or empty string.
  */
  isDefinedAttr: function(attr) {
    return attr != undefined && attr != null && attr != false && attr != '';
  }
};