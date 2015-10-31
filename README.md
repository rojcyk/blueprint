![Blueprint](http://rojcyk.github.io/blueprint/logo.png)

# Blueprint

iOS Blueprint plugin is here to accelerate your iOS app design workflow. It contains **lightweight** iPhone and iPad template, App Store Screenshot template, as well as collections of export, and canvas manipulation scripts.

#### Contact
- [@rojcyk](https://twitter.com/rojcyk)
- [Email](mailto:hi@rojcyk.com)
- [Website](http://rojcyk.com)

## Installation

1. [Download the ZIP file containing the plugin](https://github.com/rojcyk/blueprint/archive/master.zip)
2. Double click the `Blueprint.sketchplugin` file and it will be automatically installed

## Change log 

- Only Sketch 3.4 (Completely rewritten from scratch)
- New powerful classes to ease development of your plugins. [Exporter](https://gist.github.com/rojcyk/7a24007beb75c5641ed4) and [Finder classes](https://gist.github.com/rojcyk/c5635b097ba52618249f).
- New Blueprint template, cleaner and easier to work with.
- Exporting App Icon is now available via script

## How to use

![Blueprint](http://rojcyk.github.io/blueprint/usage.png)

The script is a perfect companion, if you use Blueprint as your starting app template. If not, its functionality is fairly limited.

- **New App Template** - `⌃ + ⇧ + N` Will generate a new Blueprint template at your desired location. See the [homepage](http://rojcyk.com/blueprint/) for its full functionality.
- **New App Store Template** - Will generate a new easily editable
template. Fully connected via layer styles, text styles and symbols. iPhone and iPad support for both portrait and landscape modes. Contains White, Golden and Black devices, as well as their black and white outline variations.

![Blueprint](http://rojcyk.github.io/blueprint/appstore.png)

- **Add Device** - Will add artboard to canvas, with the size of an iPhone or an iPad, with basic controllers like status bar and navigation bar. *Works only with blueprint template*.
- **Add Table** - `⌃ + ⇧ + T` If layer is selected, plugin will generate a simple table with two cells, header and footer labels native to iOS. *Works only with blueprint template*.

![Blueprint](http://rojcyk.github.io/blueprint/devices.png)

- **Export App Icon** - Will export layer in iOS App sizes: 29, 40, 60, 76, 512, 1024, for @1x, @2x, and @3x. Final export assets have correct sizes **only if the original file is 120x120 pt square**!
- **Export Selected Asset(s)** - `⌃ + ⇧ + S` If layer is selected, plugin will export it as iOS assets. Generating 3 files in the process: @1x, @2x, and @3x.
- **Export Selected Artboards** - `⌃ + ⇧ + A` Since Blueprint is done in points (@1x scale), artboards need to be exported at least at retina scale in order to have all the details. Export Selected Artboards is a shortcut to do just that. 
