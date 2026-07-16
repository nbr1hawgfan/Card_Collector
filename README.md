# Rookie Vault Mobile Button Fix

This fixes two likely mobile problems:

1. iPhone/Android native browser button styling showing through.
2. Phones loading new HTML while retaining an older cached CSS file.

## A. Append CSS

Open `css/app.css` and paste the contents of:

`css/mobile-button-fix.css`

at the very bottom.

## B. Cache-bust index.html

In `index.html`, change:

```html
<link rel="stylesheet" href="./css/app.css">
```

to:

```html
<link rel="stylesheet" href="./css/app.css?v=4">
```

Also change:

```html
<script type="module" src="./js/app.js"></script>
```

to:

```html
<script type="module" src="./js/app.js?v=4"></script>
```

## C. Replace sw.js

Replace the repository `sw.js` with the included `sw.js`.

## D. Commit

Suggested commit message:

`Fix mobile filter buttons and stale PWA cache`

After GitHub Pages deploys:

1. Fully close the installed PWA/browser tab on each phone.
2. Reopen it.
3. If still stale, remove Rookie Vault from the home screen once, open the website in the browser, refresh, and reinstall it.
