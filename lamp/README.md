# `<lamp>` component for node-red-contrib-uibuilder and VueJS

## How to load the `<lamp>` component

### Using web components (modern browsers only)

See the example files in [examples/module](./examples/module)

1. Change `index.html`, note the change to how to load your `index.js` file, if you don't change that, it wont work.
   
   ```html
   <script type="module" src="./index.js"></script>
   ```

2. Load the component in `index.js`:

   ```javascript
   // Before the app1 definition
   import lamp from '../uibuilder/vendor/uibuilder-vuejs-component-extras/lamp/lamp-module.js'
   ...
        // Inside app1
        components: {
            lamp
        },
   ```


### Using `http-vue-loader`

See the example files in [examples/http-vue-loader](./examples/http-vue-loader)

1. Load `http-vue-loader` into `index.html` by adding a line: `<script src="../uibuilder/vendor/http-vue-loader/src/httpVueLoader.js"></script>`
2. Load the component in `index.js`:

   ```javascript
    components: {
        'lamp': httpVueLoader('../uibuilder/vendor/uibuilder-vuejs-component-extras/lamp/lamp.vue'),
    }, // --- End of components --- //
   ```
3. Use the component in your HTML
   
   ```html
    <div id="floorplan" style="position:relative; width:100%; height:50em; background:url(./serveimage.svg);">
        <lamp id="a" :color="isona ? 'red' : 'grey'" :glow="isona" :clickable="false" x="100" y="100" @bulbclicked="myClick" title="A: This one does not respond to clicks"><desc>Here we use a component slot to insert some more custom svg</desc></lamp>
        <lamp id="b" :color="isonb ? 'red' : 'grey'" :glow="isonb" :clickable="true"  x="270" y="120" @bulbclicked="myClick" title="B"><circle cx="50" cy="50" r="50"/></lamp>
        <lamp id="c" :ison="isonc" :clickable="true"  x="650" y="120" @bulbclicked="myClick" title="C"></lamp>
        <lamp id="d" :ison="isond" :clickable="true"  x="250" y="270" @bulbclicked="myClick" :title="'D: ' + (isond ? 'ON' : 'off')"></lamp>
    </div>
   ```

## Props

* **color** {String[optional]} Default: `grey`
  
  Changes the fill color of the default icon shape.

  Ignored if using a custom shape via the `icon` slot.

* **height** {String[optional]} Default: `32`
  
  Defines the height of the outer SVG element. Default measure is in pixels, percentage may also be used.

* **x** {String[optional]} Default: `0`
  
  Defines the position of the _top_ of the image.

  **NOTE** that the parent html element **MUST** have `position:relative` in its style or class otherwise, this position is measured from the top/left of the browser viewport.
  
* **y** {String[optional]} Default: `0`
  
  Defines the position of the _left_ of the image.

  **NOTE** that the parent html element **MUST** have `position:relative` in its style or class otherwise, this position is measured from the top/left of the browser viewport.
  
* **title** {String[optional]} Default: '' (empty string)
  
  Adds a `<title>` element to the SVG image. This will be rendered as a tooltip by most browsers.

* **clickable** {Boolean[optional]} Default: `false`
  

  
* **glow** {Boolean[optional]} Default: `false`
  
* **ison** {Boolean[optional]} Default: `false`
  
* **filter** {String[optional]} Default: `shadow`
  The ID (html element id) of the SVG filter to be used.

## Slots

* **default**
  Use this slot to add extra SVG content into the lamp. e.g. text, description, extra shapes.

  Any valid SVG content may be used but note that the viewbox is 1024x1024

* **icon**
  Use this slot to completely replace the lamp icon that is the default display.

* **filter**
  Use this slot to create new SVG filter statements that can be used for display.

  You **must** give your filter(s) a unique ID.

  To activate a custom filter, you also have to pass the filter ID in the `filter` prop.

  ## Events

  * **lampclicked**
  
     This event is issued only if the `clickable` prop is `true`.

     It is issued if the image is clicked on.

     To make use of it, add `@lampclicked="myClick"` to the lamp element
     where `myClick` is a method you define that will be called when the user
     clicks on the element.

     ```html
    <lamp id="lamp5" :clickable="true"  @lampclicked="myClick"></lamp>
    ```