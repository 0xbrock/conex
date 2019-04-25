
[![Waffle.io - Columns and their card count](https://badge.waffle.io/kesselborn/conex.svg?columns=all)](https://waffle.io/kesselborn/conex)

<!-- TOC -->

- [Conex](#conex)
    - [Differences to tabgroups](#differences-to-tabgroups)
    - [Compatibility](#compatibility)
    - [Installation](#installation)
    - [Getting back my last tab group session](#getting-back-my-last-tab-group-session)
    - [Necessary addon permissions](#necessary-addon-permissions)

<!-- /TOC -->

# Conex
This addon tries to replace some functionality from the discontinued *TabGroups* with some differences:

## Differences to tabgroups

- it lacks the big "Manage my TabGroups" overview window
- conex uses containers for grouping tabs
- the quick search contains thumbnail of the results
- the quick search optionally includes bookmarks and history

## Installation

Just install from the [official mozilla addons page](https://addons.mozilla.org/en-us/firefox/addon/conex)

## Getting back my last tab group session

So: Firefox Quantum rolled in, tab groups doesn't work anymore and you would like to get back
your last tab groups session? Here is a way you can get a tab groups backup which again you
can import to Conex (note: only tested it briefly, but it's worth a try):

- download [the latest Firefox version](https://ftp.mozilla.org/pub/firefox/releases/) that you successfully used TagGroups with ... the latest version that fully supported TagGroups (including the settings page) should be [v56](https://ftp.mozilla.org/pub/firefox/releases/56.0.2/) (using [Firefox ESR can cause problems](https://github.com/kesselborn/conex/issues/151))
- close Firefox Quantum
- open the old Firefox
- if you see tab groups in your addon section but it is disabled, please do the following:
    - open the url `about:config` and acknowledge the warning. Change the following settings:

            xpinstall.signatures.required: false

- if you are lucky, your old session is restored and you can just open tab-groups and create a manual backup which you can use as an import for Conex
- if your session is not restored, all hope is not lost:
  - go to tab-groups preferences and open the 'Backup / Restore' section
  - click the 'Load Groups and Tabs From ...' button and select 'Previous Session'
  - once imported, create the manual backup now

## Necessary addon permissions

| permission           | reason                                                   |
|----------------------|----------------------------------------------------------|
| <all_url>            | for taking screenshots for the thumbnails during search  |
| bookmarks            | for searching in bookmarks                               |
| contextMenus         | for context menu for moving tab to a different container |
| contextualIdentities | for working with tab containers                          |
| cookies              | for working with tab containers                          |
| history              | for showing history results in quick search              |
| menus                | for creating context menus when moving tabs              |
| notifications        | to show a warning if the tabhiding is not activated      |
| storage              | for storing thumbnails                                   |
| tabs                 | for tab handling                                         |
| tabHide              | for hiding and showing tabs                              |
| webNavigation        | for intercepting and reacting on new tabs                |
| webRequestBlocking   | for intercepting and reacting on external links          |
  webRequest           | for intercepting and reacting on external links          |
