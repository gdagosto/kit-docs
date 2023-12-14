---
description: Installing the default layout.
---

# Installation

Want something that just "looks good?" The next steps will get the default layout set up for you.

## Quick Installation

The [quick install option](../getting-started/quickstart.md) will offer to scaffold the default
layout for you. Feel free to skip to the [next section](#tailwind) if you've already set up your application.

## Manual Installation

:::steps

!!!step title="Add Color Scheme Script"|(slot=description)=Add the following script inside the `<head>` tag of your `app.html` file.

```html title=src/app.html|copyHighlight{3-12}
<head>
  <!-- ... -->
  <script>
    const key = 'gdagosto::color-scheme';
    const scheme = localStorage[key];
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (scheme === 'dark' || (scheme !== 'light' && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  </script>
</head>
```

!!!

!!!step title="Copy Font Files"|description="Copy the theme font files to your lib folder."

```bash copy
cp -R node_modules/@gdagosto/kit-docs/client/fonts src/fonts
```

!!!

!!!step title="Import Assets"|description="Import theme polyfills and styles into your layout file."

```svelte title=routes/__layout-kit-docs.svelte|copyHighlight{2-6}
<script>
  import '@gdagosto/kit-docs/client/polyfills/index.js';
  import '@gdagosto/kit-docs/client/styles/normalize.css';
  import '@gdagosto/kit-docs/client/styles/fonts.css';
  import '@gdagosto/kit-docs/client/styles/theme.css';
  import '@gdagosto/kit-docs/client/styles/vars.css';
</script>
```

!!!

!!!step title="Add Default Layout"|(slot=description)=Import `KitDocsLayout` and add it to your layout markup.

```svelte title=routes/__layout-kit-docs.svelte|copySteps{2,6-9,13-15}
<script>
  import { KitDocsLayout } from '@gdagosto/kit-docs';

  // ...

  /** @type {import('@gdagosto/kit-docs').NavbarConfig} */
  const navbar = {
    links: [{ title: 'Documentation', slug: '/docs', match: /\/docs/ }],
  };
</script>

<KitDocs>
  <KitDocsLayout {navbar} {sidebar}>
    <slot />
  </KitDocsLayout>
</KitDocs>
```

!!!

!!!step title="Set Brand Colors"|description="Set your brand colors using RGB. You can play around in the browser to find what works."

```svelte title=routes/docs/__layout.svelte|copy
<style>
  :global(:root) {
    --kd-color-brand: 255 64 0;
  }

  :global(:root.dark) {
    --kd-color-brand: 255 83 26;
  }
</style>
```

!!!

:::

## Tailwind

The default layout is built with Tailwind. If you're also using Tailwind in your project, we
recommend removing certain CSS files so you don't end up with duplicate utility classes.

1. First, remove the following CSS imports from your layout file:

```diff title=routes/__layout-kit-docs.svelte
- import '@gdagosto/kit-docs/client/styles/normalize.css';
- import '@gdagosto/kit-docs/client/styles/theme.css';
```

2. Next, add our client files to your Tailwind `contents` config:

```js title=tailwind.config.cjs|copyHighlight{2}
module.exports = {
  content: ['./src/**/*.{html,svelte}', './node_modules/@gdagosto/kit-docs/client/**/*.svelte'],
};
```

3. Finally, copy over our [Tailwind config](https://github.com/gdagosto/kit-docs/blob/main/packages/kit-docs/tailwind.config.cjs)
   file from GitHub and adjust values as desired. Ignore the `corePlugins` and `fontFamily` settings.
