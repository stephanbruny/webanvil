# WebAnvil

A webservice for static page generation based on handlebars templates.

## API

- `/api/html/<id>`
    - GET: Renders the template specified by `id`
    - POST: Create/Overwrite template specified by `id`

- `/api/partial/<id>?<params>`
    - GET: Renders the partial specified by `id` with applied parameters
    - POST: Create/Overwrite partial specified by `id`

- `/api/data/<namespace>/<id>`
    - GET: Returns data specified by `id` from given namespace
    - POST: Creates/Overwrites specified data (JSON)

- `/api/acc/<namespace>/<id>`
    - GET: Returns the address of the webservice of the accumulator
    - POST: Creates/Overwrites accumulator

## Accumulator

You can connect webservices as data source instead of static data.
An accumulator will replace the data (located at `namespace:id`) with the target webservice response.
