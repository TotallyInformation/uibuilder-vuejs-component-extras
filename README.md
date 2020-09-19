# uibuilder-vuejs-component-extras
A set of extra VueJS components designed to work with node-red-contrib-uibuilder though they should also work with other VueJS installations.

**WARNING**: Currently pre-alpha and highly experimental. Don't assume that anything works right now. Also the installation instructions won't yet work.
Right now, the only way to use this is to install it manually.

## Components

This package contains a number of VueJS components:

* [&lt;lamp>](./lamp/README.md)
  
  A small SVG lamp icon designed for home-automation use. Overlay on a floorplan background to show what lamps are available and whether they are on or off.

  
* [&lt;gauge>](./gauge/README.md)
  
  An SVG gauge chart using [vue-svg-gauge](https://github.com/hellocomet/vue-svg-gauge)

  The purpose of having a component wrapped round the vue-svg-gauge component is to standardise the data and props.

## Installation

### Using with node-red-contrib-uibuilder

You will need a working installation of Node-RED with uibuilder installed.

Add at least 1 uibuilder node to your flows and deploy. Now open the configuration panel in the Node-RED Editor
then click on the "Manage front-end libraries" button.

Click on the add button and type in `uibuilder-vuejs-component-extras` then click on the install button.

After a few seconds, this library should be added to the list of installed packages. Close the library manager.

Each of the components in this library should now be available to your front-end code by loading the component from `../uibuilder/vendor/uibuilder-vuejs-component-extras/<folder>/<component-name>`.

Use the "Show Detailed Information" button to see where libraries and other resources are sourced and what URL's they are available from.

Note that if you install the package manually using npm, don't forget to update `<uibRoot>/.config/packageList.json` if needed. This may not be needed if using a version of uibuilder >2.0.4 since this package is included in the master package list and so will be discovered automatically. You will have to reload Node-RED when installing manually however.

#### Using without installation

If you just want to try these components without installing, you can use `https://unpkg.com/uibuilder-vuejs-component-extras`, simply replace any references to `../uibuilder/vendor/uibuilder-vuejs-component-extras/<folder>/<component-name>` in your html with `https://unpkg.com/uibuilder-vuejs-component-extras@latest/<folder>/<component-name>`.

### Using without uibuilder

You should be able to use this library of code without uibuilder. Each component is loadable in several ways and uses a reasonably standard data format.
See each component for details.

## Usage

Please see the README file in each component folder for usage details.

In general, there are 3 different ways to load these components:

1. Include the source `.vue` file in your own build step and let webpack (or your chosen build tool) sort everything out for you.
2. Load dynamically as an HTML web component.
3. Load dynamically using the `http-vue-loader` module.