# Project Template for Samsung.com

To set up a new project from this project template, first cd into your project directory:

```shell
$ cd documents/projects
```
* Note that the path `documents/projects` is arbitrary, and is wherever you keep your projects.

```shell
$ ls
SamsungProject1		SamsungProject2
```

If you have already cloned the `project-template` into this directory, skip to "Updating the Project Template"

## Cloning the Project Template

Clone the project template
```shell
$ git clone git@git.samsmk.com:samsung-com/project-template.git
```

If you see this error:

```shell
ssh: connect to host git.samsmk.com port 22: Connection refused
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

You are not connected to the `Rosetta VPN`. To connect, enable `Tunnelblick` and sign in. As you have already obtained the newest copy of the `project-template`, skip ahead to "Creating a New Project from the Template"

## Updating the Project Template
To update the project template to ensure you have the newest version:

```shell
$ cd project-template
$ git pull
```

## Creating a New Project from the Template
To create a new project from the template, first navigate to the `project-template`'s parent directory:

```shell
$ ls
SamsungProject1		SamsungProject2		project-template
```

Next, clone the `project-template` repository into a new repository:

```shell
$ git clone --depth 1 --origin source project-template new-project
```

note that "new-project" is the name of your new project. Name this accordingly.

Initialize the new project with Git:

```shell
$ cd new-project
$ git create new-project
```

Now a project based on the `project-template` is initialized. You can now `push` and `pull`.


## Initializing the Repository
To initialize your new repository with all modules required for the `project-template`, run:

```shell
npm install
```

This will copy all dependencies from the npm registry into the `node_modules` directory in your project.


## Initializing the Submodule

The resources for all Samsung.com projects are stored in a [submodule](http://git-scm.com/book/en/Git-Tools-Submodules) within every project based on this `project-template`. The submodule is in the `/us` directory at the root level of the project. This submodule must be initialized before working on a Samsung.com project:

```shell
git submodule update --init
```

## Build Process

There are two build tasks for projects based on the `project-template`.

### Development Build Task
To run the development build process:

```shell
grunt dev
```

This will accomplish the following:
* Remove existing `target` directory
* Copy (sync) all assets from the `src` and the `target` directory, including the `us` submodule
* Compile all scss files in the `src/assets/scss` directory into the `target/assets/css` directory using [compass](http://compass-style.org)
* Generate `<script>` tags for the files specified in `index.html`. See "Configuring File Blocks" below.

### Default Build Task
To run the production build process:

```shell
grunt
```

This will accomplish the same tasks as the `dev` task, with one exception: `scss` files will not be copies into the `target` directory.

#### Additional Default Grunt Task Behavior

#### [fileblocks](https://www.npmjs.org/package/grunt-file-blocks)
The `default` task will use `fileblocks` to remove the following script
```html
<script src="//localhost:35729/livereload.js"></script>
```
That is used in development to automatically refresh the browser tab when a file is changed.

#### [usemin](https://github.com/yeoman/grunt-usemin)

When the default `grunt` task is run, it will replace all of the script files within the `build:js` comment with a single `<script>` tag, referencing `app.js`.
```html
<!-- build:js assets/js/app.js -->
   ... all of the scripts for your project
<!-- endbuild -->
```

This file will contain the content of all of the scripts within the comment, [concatenated](https://github.com/gruntjs/grunt-contrib-concat) and [uglified](https://github.com/gruntjs/grunt-contrib-uglify).


## Including Your Own Version of jQuery

It may be necessary to include your own version of jQuery in a project. To accomplish this without creating conflicts with Samsung.com's jQuery:

### Ensure the following load order:
* jQuery
* Project-specific libraries or plugins
* Project scripts
* call noConflict

An example of this load order:

```html
<!-- build:js assets/js/app.js -->
  <!-- fileblock:js scripts -->
    <!-- jQuery -->
    <script src="assets/js/libs/jquery.js"></script>
    <!-- Project-specific libraries or plugins -->
    <script src="assets/js/libs/a.lib.js"></script>
    <!-- Project scripts -->
    <script src="assets/js/src/main.js"></script>
    <script src="assets/js/src/**/*.js"></script>
    <!-- call noConflict -->
    <script>
      window.jQr = $.noConflict(true);
    </script>
  <!-- endfileblock -->
<!-- endbuild -->
```

Please note that all scripts must be within the `fileblock:js scripts` comment, within the `build:js assets/js/app.js` comment.

### The Scripts Template
In the path `src/assets/js/src` there is a file `template.js`. If you included your own version of jQuery, you must use this template for all of your project's scripts.

##### Why?
After calling `$.noConflict` (above), the global jQuery version will be reset to the Samsung.com version. In order to ensure that all of your scripts use the version you loaded, you must trap a local reference to that version within a closure:

```javascript
(function ($) {
  
  // closure environment
 
})(jQuery);
```
Within this environment, `$` will reference your jQuery version.


## Configuring File Blocks

The grunt task [fileblocks](https://www.npmjs.org/package/grunt-file-blocks) is used to automatically generate `<script>` tags.

To configure `fileblocks` for a new project, open `index.html`. In here, locate the following comment:

```html
<!--You can load your own scripts with grunt by using script tags in globbing format here. -->
```

Specify the scripts you want to load within the `fileblock:js scripts` comment:

```html
<!-- fileblock:js scripts -->
<script src="assets/js/libs/a.lib.js"></script>
<script src="assets/js/libs/b.lib.js"></script>
<script src="assets/js/src/**/*.js"></script>
<!-- endfileblock -->
```

Note that globbing patterns can be used `**`, but that `script` tags will be generated in lexigraphic order based on the filename.

## Watching Files for Changes
After running `grunt dev`, you can enable `grunt` to watch your project files for changes and automatically recompile or copy files into the `target` directory.
```
grunt watch
```
This will accomplish the following on the fly:
* Keep assets synced between your `src` and `target` directory
* Compile `scss` files in `src` into `css` in `target`
* Automatically refresh the browser tab

## Configuring Compass

Compass can be configured from the `config.rb` file at the root level of your project. If your project requires different folder arrangement or hierarchy, this file must be updated.

## SCSS File Arrangement

Only one `css` file `main.css` is included into the `index.html` file. This file is located in `src/assets/scss/main.scss`, and is compiled into `target/assets/css/main.css` when one of the build tasks is run.

To add new `scss` files to your project, prefix their filenames with an `_`. This will prevent `compass` from converting these these files into their own `css` files:

```
_home.scss
_about.scss
```


Include all of your `scss` files in the desired order within the `main.scss` file:

```
@import home, about
```


