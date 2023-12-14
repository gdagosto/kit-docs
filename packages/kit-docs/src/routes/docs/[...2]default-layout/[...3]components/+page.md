---
description: Guide to components that come with the default layout.
---

# Components

In this section, we'll look at the components that you can import and use when working with
the default layout.

## Social Link

<script>
import { SocialLink } from '$lib';
</script>

```js copy
import { SocialLink } from '@gdagosto/kit-docs';
```

```svelte copy
<SocialLink type="discord" href="#" />
<SocialLink type="twitter" href="#" />
<SocialLink type="gitHub" href="#" />
```

<div style="display: flex; justify-content: center;">
  <SocialLink type="discord" href="#" />
  <div style="margin: 0 1rem;" />
  <SocialLink type="twitter" href="#" />
  <div style="margin: 0 1rem;" />
  <SocialLink type="gitHub" href="#" />
</div>

## Tabbed Links

```js copy
import { TabbedLinks } from '@gdagosto/kit-docs';
```

```svelte copy
<TabbedLinks
  links={[
    { title: 'First Tab', href: '/first-tab-link' },
    { title: 'Second Tab', href: '/second-tab-link' },
  ]}
/>
```

<div style="display: flex; justify-content: center;">
  <TabbedLinks 
    links={[
      { title: 'First Tab', href: '/docs/default-layout/components' },
      { title: 'Second Tab', href: '#' },
    ]} 
  />
</div>

## Button

<script>
import { Button } from '$lib';
</script>

```js copy
import { Button } from '@gdagosto/kit-docs';
```

### Default

```svelte copy
<Button>Action</Button>
```

<div style="display: flex; justify-content: center;">
  <Button>Action</Button>
</div>

### Link

```svelte copy
<Button href="#">Action</Button>
```

<div style="display: flex; justify-content: center;">
  <Button href="#">Action</Button>
</div>

### Raised

```svelte copy
<Button primary type="raised">Action</Button>
<Button type="raised">Action</Button>
```

<div style="display: flex; justify-content: center;">
  <Button primary type="raised">Action</Button>
  <div style="margin: 0 8px;"></div>
  <Button type="raised">Action</Button>
</div>

### Arrow

```svelte copy
<Button arrow="left">Previous</Button>
<Button arrow="right">Next</Button>
```

<div style="display: flex; justify-content: center;">
  <Button arrow="left">Previous</Button>
  <div style="margin: 0 1.5rem;" />
  <Button arrow="right">Next</Button>
</div>

## Select

<script>
import { Select } from '$lib';
</script>

```svelte copy
<script>
  import { Select } from '@gdagosto/kit-docs';

  let options = ['Option A', 'Option B', 'Option C'];
  let value = options[0];
</script>

<Select title="Title" {options} bind:value />
```

<div style="display: flex; justify-content: center;">
  <Select title="Title" options={['Option A', 'Option B', 'Option C']} />
</div>

## Chip

<script>
import { Chip } from '$lib';
</script>

```js copy
import { Chip } from '@gdagosto/kit-docs';
```

```svelte copy
<Chip>Title</Chip>
```

<div style="display: flex; justify-content: center;">
  <Chip>Title</Chip>
</div>

## Color Scheme Toggle

<script>
import { ColorSchemeToggle } from '$lib';
</script>

```js copy
import { ColorSchemeToggle } from '@gdagosto/kit-docs';
```

```svelte copy
<ColorSchemeToggle />
```

<div style="display: flex; justify-content: center;">
  <ColorSchemeToggle />
</div>

## Menu

<script>
import { Menu, MenuItem } from '$lib';

let menuItems = ['Item 1', 'Item 2', 'Item 3'];
let currentMenuItem = menuItems[0];

function onMenuItemSelect(item) {
  currentMenuItem = item;
}
</script>

```svelte copy
<script>
  import { Menu, MenuItem } from '@gdagosto/kit-docs';

  let menuItems = ['Item 1', 'Item 2', 'Item 3'];
  let currentMenuItem = menuItems[0];
</script>

<Menu>
  <span slot="button">Menu</span>
  {#each menuItems as menuItem (menuItem)}
    <MenuItem
      selected={currentMenuItem === menuItem}
      on:select={() => (currentMenuItem = menuItem)}
    >
      {menuItem}
    </MenuItem>
  {/each}
</Menu>
```

<div style="display: flex; justify-content: center;">
  <Menu>
    <span slot="button">Menu</span>
    {#each menuItems as menuItem (menuItem)}
      <MenuItem selected={currentMenuItem === menuItem} on:select={() => onMenuItemSelect(menuItem)}>
        {menuItem}
      </MenuItem>
    {/each}
  </Menu>
</div>

## Popover

<script>
import { Popover } from '$lib';
</script>

```svelte copy
<script>
  import { Popover } from '@gdagosto/kit-docs';
</script>

<Popover overlay>
  <span slot="button">Popover</span>
  Content here.
</Popover>
```

<div style="display: flex; justify-content: center;">
  <Popover overlay>
    <span slot="button">Popover</span>
    Content here.
  </Popover>
</div>
