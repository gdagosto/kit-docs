---
description: Getting up and running with KitDocs.
---

# Quickstart

In this section we'll get you up and running with KitDocs.

## Quick Installation

The following command will scaffold a new SvelteKit application and add all the KitDocs boilerplate
for you.

```bash copy
npm init @gdagosto/kit-docs mydocs
```

<script>
import KitInitSkeleton from '$img/kit-init-skeleton.png';
</script>

<img src={KitInitSkeleton} alt="Arrow pointing at Skeleton template option when initializing SvelteKit." />

Once your application is ready you can skip over to the [next steps](#home-page).

## Manual Installation

:::admonition type="tip"
See our [demo](https://github.com/gdagosto/kit-docs/tree/main/demo) directory on GitHub if
you'd like a reference to use as you follow along with the steps below.
:::

:::steps

!!!step title="Create SvelteKit App"|description="Create a new SvelteKit application from your terminal (skip this step if you have one). Pick the Skeleton option template."

```bash copySteps
npm create svelte mydocs
cd mydocs
npm i
```

!!!

!!!step title="Install Dependencies"|description="Install KitDocs and all dependencies via NPM."

```bash copy
npm i @gdagosto/kit-docs @iconify-json/ri unplugin-icons clsx shiki -D
```

!!!

!!!step title="Update Svelte Config"|(slot=description)=Add the `.md` file extension to be processed by Svelte.

```js title=svelte.config.js{5}|copy
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  kit: {
    adapter: adapter(),
  },
};

export default config;
```

!!!

!!!step title="Update Vite Config"|(slot=description)=Update your `vite.config.js` file to match.

```js title=vite.config.js|copy
import { sveltekit } from '@sveltejs/kit/vite';
import icons from 'unplugin-icons/vite';
import kitDocs from '@gdagosto/kit-docs/node';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [icons({ compiler: 'svelte' }), kitDocs(), sveltekit()],
};

export default config;
```

!!!

!!!step title="Add Global Types"|(slot=description)=Add the global TypeScript types to your `app.d.ts` file.

```ts title=src/app.d.ts|copyHighlight{2}
/// <reference types="@sveltejs/kit" />
/// <reference types="@gdagosto/kit-docs/globals" />
// ...
```

!!!

!!!step title="Create KitDocs Endpoints"|description="Create the KitDocs endpoints that handle markdown meta and sidebar requests."

```
src
└─ routes
   └─ kit-docs
      ├─ [dir].sidebar
         ├─ +server.js
      ├─ [slug].meta
         ├─ +server.js
```

```js title=routes/kit-docs/[slug].meta/+server.js|copy
import { createMetaRequestHandler } from '@gdagosto/kit-docs/node';

export const GET = createMetaRequestHandler();
```

```js title=routes/kit-docs/[dir].sidebar/+server.js|copy
import { createSidebarRequestHandler } from '@gdagosto/kit-docs/node';

export const GET = createSidebarRequestHandler();
```

!!!

!!!step title="Create Layout Files"|(slot=description)=Create your layout files. You can change the `/docs` directory, but remember to update the `sidebar` loader setting.

```
src
└─ routes
   ├─ +layout.svelte
   ├─ +layout.js
```

```svelte title=routes/+layout.svelte|copy
<script>
  import { page } from '$app/stores';

  import { KitDocs, createKitDocsLoader, createSidebarContext } from '@gdagosto/kit-docs';

  /** @type {import('@gdagosto/kit-docs').MarkdownMeta | null} */
  export let meta = null;

  /** @type {import('@gdagosto/kit-docs').ResolvedSidebarConfig | null} */
  export let sidebar = null;

  const { activeCategory } = createSidebarContext(sidebar);

  $: category = $activeCategory ? `${$activeCategory}: ` : '';
  $: title = meta ? `${category}${meta.title} | KitDocs` : null;
  $: description = meta?.description;
</script>

<svelte:head>
  {#key $page.url.pathname}
    {#if title}
      <title>{title}</title>
    {/if}
    {#if description}
      <meta name="description" content={description} />
    {/if}
  {/key}
</svelte:head>

<KitDocs {meta}>
  <slot />
</KitDocs>
```

```js title=routes/+layout.js|copy
import { createKitDocsLoader } from '@gdagosto/kit-docs';

export const prerender = true;

/** @type {import('./$types').LayoutLoad} */
export const load = createKitDocsLoader({
  sidebar: {
    '/': null,
    '/docs': '/docs',
  },
});
```

!!!

!!!step title="Create Markdown File"|description="Create your first category and markdown file."

```
src
└─ routes
   ├─ __layout-kit-docs.svelte
   └─ docs
      ├─ __layout@kit-docs.svelte
      └─ [...1]first-category
         ├─ [...1]hello-world.md
```

```svelte title=[...1]hello-world.md|copy
---
description: My first markdown file.
---

# Hello World

{$frontmatter.description}

<script>
  console.log('Markdown files are Svelte components!');
</script>
```

!!!

:::

You should now be able to start your dev server by running `npm run dev`. Visit
[`/docs/first-category/hello-world`](http://localhost:3000/docs/first-category/hello-world)
to see the Markdown content. Open the developer console and confirm that the string `'Markdown files are Svelte components!'`
has logged.

Congratulations, core setup is done :tada:

## Home Page

You can create a Markdown (`routes/+page.md`) or Svelte (`routes/+page.svelte`)
file at the root of your `routes` directory if you'd like to include a home page.

### Redirecting

In some cases you might want to use the first page of your docs as the home page. You can achieve
this by creating a `+page.svelte` file at the root of your `routes` directory with the following
content:

```
src
└─ routes
   ├─ +page.js <-
```

```js title=routes/+page.js|copy
import { redirect } from '@sveltejs/kit';

export const prerender = true;

/** @type {import('./$types').PageLoad} */
export function load() {
  throw redirect(307, '/docs/first-category/first-page');
}
```

## Tailwind

You'll need to do the following if you're using Tailwind and don't plan on using the default theme
to ensure default markdown rules (e.g., `CodeFence`, `Admonition`, `Steps`) work as expected.

First, add the default markdown components to your content config:

```js title=tailwind.config.cjs|copyHighlight{2-5}
module.exports = {
  content: [
    './src/**/*.{html,svelte}',
    './node_modules/@gdagosto/kit-docs/client/kit-docs/**/*.svelte',
  ],
};
```

Finally, copy and adjust our [theme](https://github.com/gdagosto/kit-docs/blob/main/packages/kit-docs/tailwind.config.cjs#L14-L51)
and [variants plugin](https://github.com/gdagosto/kit-docs/blob/main/packages/kit-docs/tailwind.config.cjs#L64-L77)
settings into your `tailwind.config.cjs` file. Refer to our
[CSS variables file](https://github.com/gdagosto/kit-docs/blob/main/packages/kit-docs/src/lib/styles/vars.css)
to get any values.

## Meta Endpoint

The `kit-docs/[slug].meta/+server.js` endpoint will match the `slug` parameter to a Markdown
file in `routes/`, parse it and return Markdown metadata such as the title, description, frontmatter,
headings, etc. **This endpoint is required.**

```
src
└─ routes
   └─ kit-docs
      ├─ [slug].meta
         ├─ +server.js <-
```

### Resolving

You can override the default slug resolver which handles mapping a slug to a markdown file
in the `routes` directory like so:

```js title=kit-docs/[slug].meta/+server.js|copy
import { createMetaRequestHandler } from '@gdagosto/kit-docs/node';

export const GET = createMetaRequestHandler({
  // map slug to absolute or relative file path to `routes` directory.
  // returning `null` or `undefined` will fallback to default resolver.
  // `resolve` helper will return default value.
  resolve: (slug, { resolve }) => resolve(slug),

  // you can provide an array and first to resolve will be accepted.
  resolve: [(slug) => ``, null, undefined, false, async (slug) => null],
});
```

### Transforming

You can transform the meta object before it's returned like so:

```js title=kit-docs/[slug].meta/+server.js|copy
import { createMetaRequestHandler } from '@gdagosto/kit-docs/node';

export const GET = createMetaRequestHandler({
  transform: ({ slug, filePath, meta, html, links }) => {
    meta.title = '...';
    meta.description = '...';
    meta.frontmatter.prop = '...';
    meta.headers = [
      ...meta.headers,
      { level: 2, title: 'Custom Heading', slug: '#custom-heading' },
      // ...
    ];
  },

  // you can provide an array and they will all be called.
  transform: [({ slug }) => {}, null, undefined, false, async () => {}],
});
```

You can also return a transformer when resolving a slug like so:

```js title=kit-docs/[slug].meta/+server.js|copy
import { createMetaRequestHandler } from '@gdagosto/kit-docs/node';

export const GET = createMetaRequestHandler({
  resolve: (slug, { resolve }) => {
    return {
      file: resolve(slug),
      // this can also be an array of transformers.
      transform: ({ slug, filePath, meta }) => {
        // ...
      },
    };
  },
});
```

### Filtering

You can configure which files are included and excluded like so:

```js title=kit-docs/[slug].meta/+server.js|copy
import { createMetaRequestHandler } from '@gdagosto/kit-docs/node';

export const GET = createMetaRequestHandler({
  // These are Rollup filter patterns.
  // Filters match against file paths relative to `src/routes` dir.
  // Paths are cleaned. No rest params `[...1]` or layout id `@...`.
  include: /\.md/,
  exclude: ['/docs/**/file.md', /some-regex/, '**/ignored-dir'],
});
```

For reference, here's the `FilterPattern` type:

```ts
/**
 * A valid `picomatch` glob pattern, or array of patterns.
 */
export type FilterPattern = ReadonlyArray<string | RegExp> | string | RegExp | null;
```

### Handler

You can call the meta request handler and handle the result yourself like so:

```js title=kit-docs/[slug].meta/+server.js|copy
import {
  handleMetaRequest,
  paramToSlug,
} from '@gdagosto/kit-docs/node';

/** @type {import('@sveltejs/kit').RequestHandler} */
export function get({ params }) {
  try {
    const slug = paramToSlug(params.slug);
    const parserResult = await handleMetaRequest(slug);
    return { body: parserResult.meta };
  } catch (e) {
    // no-op
  }

  return { body: null };
}
```

## Sidebar Endpoint

The `kit-docs/[dir].sidebar/+server.js` endpoint will match the `dir` parameter to a directory in
`routes/`, read all the files inside and return a sidebar config object. You can skip this
endpoint and [create the sidebar manually](../default-layout/configuration.md#links-1).

```
src
└─ routes
   └─ kit-docs
      ├─ [dir].sidebar
         ├─ +server.js <-
```

The loaded sidebar config object looks something like this:

```js
const sidebar = {
  links: {
    'First Category': [
      { title: 'First Page', slug: '/docs/first-category/first-page' },
      { title: 'Second Page', slug: '/docs/first-category/second-page' },
    ],
    'Second Category': [
      // ...
    ],
  },
};
```

### Page Ordering

SvelteKit rest parameters are 'non-greedy' and can be used to match 0 or more route segments. We
can use them with KitDocs to order our routes so that the sidebar configuration is built in the
right order. Here's an example of how you can use rest params to organise your docs:

```
src
└─ routes
   └─ docs
      └─ [...1]first-category
         ├─ [...1]first-page.md
         ├─ [...2]second-page.md
      └─ [...2]second-category
         ├─ [...1]first-page.md
         ├─ [...2]second-page.md
```

Based on the directory structure above, the sidebar endpoint will return the following slugs:

- `/docs/first-category/first-page`
- `/docs/first-category/second-page`
- `/docs/second-category/first-page`
- `/docs/second-category/second-page`

### Deep Match

Deep matching is useful when you have nested paths that belong to a single sidebar item. For example,
the Tailwind docs has a page at [`/docs/installation`](https://tailwindcss.com/docs/installation)
that contains tabbed links to various installation types such as:

- `/docs/installation/using-postcss`
- `/docs/installation/framework-guides`
- `/docs/installation/play-cdn`

You can achieve this structure like so:

```
src
└─ routes
   └─ docs
      └─ [...1]getting-started
         └─ [...1_deep]installation <- Deep match.
            ├─ index.md
            ├─ using-postcss.md
            ├─ framework-guides.md
            ├─ play-cdn.md
```

The sidebar will now include a single entry at `Getting Started > Installation`. Keep in mind that
a deep match means all nested files other than `index.md` will be ignored.

### Resolving

You can override any of the default resolvers like so:

```js title=kit-docs/[dir].sidebar/+server.js|copy
import { createSidebarRequestHandler } from '@gdagosto/kit-docs/node';

export const GET = createSidebarRequestHandler({
  // `data` includes file paths, frontmatter, file content and more.
  // returning `null` or `undefined` will fallback to default resolver.
  // the `resolve` helper will return the default value.
  resolveTitle: (data) => ``,
  resolveCategory: (data) => ``,
  resolveSlug: ({ resolve }) => resolve(),
});
```

### Sidebar Title

The sidebar title is inferred in the following order:

1. Check if `resolveTitle` option returns value.
2. Check for a `sidebar_title` frontmatter property.
3. Check for a `title` frontmatter property.
4. Try to extract a heading `# Heading`.
5. Map the filename from kebab-case to title-case (e.g., `my-file` -> `My File` ).

```md
---
sidebar_title: Custom Sidebar Title
---
```

### Filtering

You can configure which files are included and excluded like so:

```js title=kit-docs/[dir].sidebar/+server.js|copy
import { createSidebarRequestHandler } from '@gdagosto/kit-docs/node';

export const GET = createSidebarRequestHandler({
  // These are Rollup filter patterns.
  // Filters match against file paths relative to `src/routes` dir.
  // Paths are cleaned. No rest params `[...1]` or layout id `@...`.
  include: /\.md/,
  exclude: ['/docs/**/file.md', /some-regex/, '**/ignored-dir'],
});
```

For reference, here's the `FilterPattern` type:

```ts
/**
 * A valid `picomatch` glob pattern, or array of patterns.
 */
export type FilterPattern = ReadonlyArray<string | RegExp> | string | RegExp | null;
```

### Category Names

You can control how the category names are formatted like so:

```js title=kit-docs/[dir].sidebar+server.js|copy
import { createSidebarRequestHandler } from '@gdagosto/kit-docs/node';

export const GET = createSidebarRequestHandler({
  // Default formatter maps `kebab-case` to `Title Case`.
  formatCategoryName: (name, { format }) => format(name),
});
```

### Handler

You can call the sidebar request handler and handle the result yourself like so:

```js title=kit-docs/[dir].sidebar/+server.js|copy
import {
  handleSidebarRequest,
  paramToDir,
} from '@gdagosto/kit-docs/node';

/** @type {import('@sveltejs/kit').RequestHandler} */
export function get({ params }) {
  try {
    const dir = paramToDir(params.dir);
    const sidebar = await handleSidebarRequest(dir, {
      filter: (id) => id.endsWith('.md')
    });
    return { body: sidebar };
  } catch (e) {
    // no-op
  }

  return { body: null };
}
```

## Loaders

We provide a SvelteKit loader for your convenience to simplify loading Markdown related data
into your application.

```svelte{4}
<script context="module">
  import { createKitDocsLoader } from '@gdagosto/kit-docs';

  export const load = createKitDocsLoader({ sidebar: '/docs' });
</script>
```

### Sidebar Config

The `sidebar` configuration option should point to a directory relative to `src/routes`. You can
provide either a string as shown above, or a multi-path config like so:

```svelte
<script context="module">
  import { createKitDocsLoader } from '@gdagosto/kit-docs';

  export const load = createKitDocsLoader({
    sidebar: {
      '/': null,
      '/docs': '/docs',
      '/docs/faq': '/faq',
    }
  });
</script>
```

A multi-path configuration will try to match the key to the current path. If matched, the sidebar
will be built from the matching directory. For example, the `routes/faq` directory will be
used to build the sidebar if the path starts with `/docs/faq`.

### Loader Functions

You can load the data yourself if required like so:

```svelte title=Page.svelte|copy
<script context="module">
  import { loadKitDocsMeta, loadKitDocsSidebar } from '@gdagosto/kit-docs';

  /** @type {import('@sveltejs/kit').Load} */
  export async function load({ url, fetch }) {
    const meta = await loadKitDocsMeta(url.pathname, { fetch });
    const sidebar = await loadKitDocsSidebar('/docs', { url, fetch });
    return {
      props: {
        meta,
        sidebar,
      }
    }
  }
</script>
```

## Frontmatter

Any Markdown file that contains a YAML frontmatter block will be processed by
[gray-matter](https://github.com/jonschlinkert/gray-matter). The frontmatter must be at the top
of the Markdown file, and must take the form of valid YAML set between triple-dashed lines.

```md
---
title: Page Title
description: Page description.
---

# {$frontmatter.title}

{$frontmatter.description}

...
```

## Stores

You can import the `kitDocs` or `frontmatter` stores for accessing Markdown metadata like so:

```svelte
<script>
  import { kitDocs, frontmatter } from '@gdagosto/kit-docs';

  $: console.log($kitDocs.meta);

  // shorthand for $kitDocs.meta.frontmatter
  $: console.log($frontmatter);
</script>
```

## Global Components

KitDocs will import components in the `src/kit-docs` directory into every single Markdown file and
also map them to markdown containers.

```
src
└─ kit-docs <- Components in this directory are "global".
   ├─ Button.svelte
```

Now, inside any markdown file you can use the `<Button>` component like so:

```svelte title=Component.md
<!-- Use the component as-is. -->
<Button />

<!-- Or, use a markdown container. -->
:::button propA="valueA"|propB=10
Default slot content here.
:::

<!-- You can pass in dynamic slot elements! -->
<!-- If you omit `tag`, it'll default to `<p>`. -->
:::button (tag=h1&slot=title)=Title
Default slot content here.
:::
```

:::admonition type="tip"
You can [change the global components directory](../markdown/components#change-directory) in your plugin settings.
:::
