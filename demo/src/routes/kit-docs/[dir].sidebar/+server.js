import { createSidebarRequestHandler, kebabToTitleCase } from '@gdagosto/kit-docs/node';

/** @type {import('./$types').RequestHandler} */
export const GET = createSidebarRequestHandler({
  formatCategoryName: (dirname) => kebabToTitleCase(dirname).replace('Api', 'API'),
});
