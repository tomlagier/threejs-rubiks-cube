# Project Template for Samsung.com

To set up a new project from this project template, first cd into your project directory:

```
$ cd documents/projects
```
* Note that the path `documents/projects` is arbitrary, and is wherever you keep your projects.

```
$ ls
SamsungProject1		SamsungProject2
```

If you have already cloned the `project-template` into this directory, skip to "Updating the Project Template"

## Cloning the Project Template

Clone the project template
```
$ git clone git@git.samsmk.com:samsung-com/project-template.git
```

If you see this error:

```
ssh: connect to host git.samsmk.com port 22: Connection refused
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

You are not connected to the `Rosetta VPN`. To connect, enable `Tunnelblick` and sign in. As you have already obtained the newest copy of the `project-template`, skip ahead to "Creating a New Project from the Template"

## Updating the Project Template
To update the project template to ensure you have the newest version:

```
$ cd project-template
$ git pull
```

## Creating a New Project from the Template
To create a new project from the template, first navigate to the `project-template`'s parent directory:

```
$ ls
SamsungProject1		SamsungProject2		project-template
```

Next, clone the `project-template` repository into a new repository:

```
$ git clone --depth 1 --origin source project-template new-project```
Cloning into 'new-project'...
done.
```

* note that "new-project" is the name of your new project. Name this accordingly.

Initialize the new project with Git:

```
$ cd new-project
$ git create new-project
```

Now a project based on the `project-template` is initialized. You can now `push` and `pull`.


## Initializing the Repository
To initialize your new repository with all modules required for the `project-template`, run:
```
npm install
```
This will copy all dependencies from the npm registry into the `node_modules` directory in your project.


## Initializing the US Submodule

The resources for all Samsung.com projects are stored in a [submodule](http://git-scm.com/book/en/Git-Tools-Submodules) within every project based on this `project-template`. The submodule is in the `/us` directory at the root level of the project. This submodule must be initialized before working on a Samsung.com project:

```
git submodule update --init
```

## Build Process

There are two build tasks for projects based on the `project-template`.





