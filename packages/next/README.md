# Next.js Utilities / @kit/next

This package provides utilities for working with Next.js.

## Server Actions

The `enhanceAction` function allows you to wrap a Next.js Server Action with additional functionality.

```ts
import { enhanceAction } from '@kit/next/actions';

export const myServerAction = enhanceAction(async (data, user) => {
  // "data" has been parsed with the schema
  // and will correctly be typed as the schema type
  // in the case below, data will be of type { id: number }
  
  // "user" is the user object from the session
  
  // if "captcha" is true, the action will require a captcha
}, {
  captcha: true,
  schema: z.object({
    id: z.number()
  }),
});
```

The `enhanceAction` function takes two arguments:
1. The action function
2. An options object

The options object can contain the following properties:
- `captcha` - If true, the action will require a captcha to be passed to the body as `captchaToken`
- `schema` - A zod schema that the data will be validated against
- `captureException` - If true, the action will capture exceptions and report them to the configured provider. It is `true` by default.

When successfully called, the action will return the result of the action function.

1. The user will be automatically authenticated and the result will be passed as the second argument to the action function.
2. The data will be parsed/validated with the schema and passed as the first argument to the action function.
3. If the `captcha` option is true, the action will require a `captchaToken` to be passed in the body.

The consumer can call the action like so:

```ts
import { myServerAction } from 'path/to/myServerAction';

const result = await myServerAction({ id: 1 });
```

or with an optional captcha token:

```ts
import { myServerAction } from 'path/to/myServerAction';

const result = await myServerAction({ id: 1, captchaToken: 'captchaToken' });
```

## Route Handlers

The function `enhanceRouteHandler` allows you to wrap a Next.js API Route Handler with additional functionality.

```ts
import { enhanceRouteHandler } from '@kit/next/routes';

export const POST = enhanceRouteHandler(({ request, body, user }) => {
  // "body" has been parsed with the schema
  // and will correctly be typed as the schema type
  // in the case below, data will be of type { id: number }

  // "user" is the user object from the session
  
  // "request" is the raw request object passed by POST
  // if "captcha" is true, the action will require a captcha
  // if "captureException" is true, the action will capture exceptions and report them to the configured provider
}, {
  captcha: true,
  captureException: true,
  schema: z.object({
    id: z.number()
  }),
});
```

When using a Captcha, the consumer will pass an header `x-captcha-token` with the captcha token.