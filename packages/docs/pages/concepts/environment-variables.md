# Environment Variables

## Overview

**Flare City** extends all of the existing conventions and processes that Cloudflare workers recommends for environment variables. It is recommended to follow the guidelines provided by Cloudflare [here](https://developers.cloudflare.com/workers/configuration/environment-variables/). These configurations ensure a secure and efficient setup for your API.

However, **Flare City** recommends that you use a specific convention established by workers to manage local development with environment variables and secrets.

## Local Development

### 1. Organizing Variables

To keep your environment variables and secrets organized, it is advisable to create a `.dev.vars` file adjacent to your project's `package.json` file. This file will store all the necessary configurations for your Cloudflare Workers project.

> The example below is an example of how we can secure Auth0 related environment variables.

```env
# /.dev.vars
API_AUTH0_DOMAIN==************************
API_AUTH0_CLIENT_ID=************************
API_AUTH0_AUDIENCE==************************
```

### 2. Example File

Additionally, create a `.dev.vars-example` file to serve as a template for your variables. This practice helps prevent accidental inclusion of sensitive information in source control. Always keep this example file up-to-date with the latest variable requirements.

```env
# /.dev.vars-example

API_AUTH0_DOMAIN=
API_AUTH0_CLIENT_ID=
API_AUTH0_AUDIENCE=
```

## Typing Variables

**Flare City** uses globally defined types to provide the basis for projects to use and extend using Typescript's **Module Augmentation** syntax. This is especially helpful when you need to add environment variables / secrets that are specific to your implementation of the Flare City framework. This could manifest itself as adding a database query string to supply to prisma to query a DB or it could be adding secrets to invoke a transactional mail api... Whatever the use case, you can easily extend the `Env` and `ExecutionContext` types by following the examples below.

To type your variables effectively, utilize module augmentation on the global scope. This allows you to extend the existing types with your custom variables.

To read more about the concepts behind module augmentation, you can follow each of the below resources.

- [Flare City's summary of module augmentation](./environment-variables/module-augmentation.md)
- [Typescript\'s Documentation on global augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#global-augmentation)

### Augmentation

Module augmentation is the process of extending or modifying existing types within a module. In the below examples, we use module augmentation to extend the `Env` and `ExecutionContext` types with custom variables relevant to our **Flare City** project.

By declaring these additions globally, you ensure that these types are available throughout your project, providing a structured and typed environment for your variables and execution context.

#### `Env`

Module augmentation is an excellent tool for typing environment variables in your **Flare City** project. Here's an example focusing specifically on the `Env` type:

```typescript
// Global declaration for Env type augmentation
declare global {
  interface Env {
    API_AUTH0_DOMAIN: string;
    API_AUTH0_CLIENT_ID: string;
    API_AUTH0_CLIENT_AUDIENCE: string;
    DATABASE_URL: string;
    HYPERDRIVE: Hyperdrive;
    MAILJET_PUBLIC_KEY: string;
    MAILJET_PRIVATE_KEY: string;
  }
}
```

1. **Consistency Across the Project:** - Declaring the `Env` type globally ensures that all parts of your project use the same structured environment variables.
2. **Readability and Maintenance:** - Developers can easily reference and understand the entire set of environment variables without searching through various files.
3. **Avoids Redundancy:** - You only need to declare the `Env` type once, avoiding redundancy and reducing the chance of inconsistencies.

#### `ExecutionContext`

The execution context is a context that is passed throughout the duration of the worker function that can carry
various helping variables / methods, etc... that are added at any stage of the execution process. In order to populate this, [`Middleware`](../reference/core/middleware.md) is most likely used to enhance the request context with information.

In the case below, segments and params are required, but Prisma and Auth are concepts that are local to our project and can be typed effectively.

```typescript
import type { User } from "@prisma/client";
import type { createPrismaClient } from "../lib";
import type {
  RequestURLSearchParams,
  RequestURLSegments,
} from "@flare-city/core";

declare global {
  interface ExecutionContext<
    T extends RequestURLSegments = RequestURLSegments,
    P extends RequestURLSearchParams = RequestURLSearchParams,
  > {
    segments: T;
    params: P;
    prisma: ReturnType<typeof createPrismaClient>;
    auth:
      | { authenticated: false }
      | {
          authenticated: true;
          user: User;
        };
  }
}
```

1. **Structured Execution Context:** - Augmenting the `ExecutionContext` type provides a structured way to define the context in which your API functions execute.
2. **Global Availability:** - By declaring globally, the `ExecutionContext` type is accessible throughout the project without the need for repeated imports.
3. **Clear Definition:** - Developers can easily understand and work with the execution context, knowing the expected structure and types.
