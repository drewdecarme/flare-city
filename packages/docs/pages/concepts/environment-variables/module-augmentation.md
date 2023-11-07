# Environment Variables - Module Augmentation

Module augmentation is a TypeScript feature that allows you to extend or modify existing types in a module without directly altering the original source code. In the context of your Cloudflare Workers API framework, this has several advantages:

## Advantages

### 1. Global Typing

By declaring your augmented types globally, you make them accessible throughout your project. This means you can use these types in any file without the need to import or duplicate declarations. It promotes consistency and a unified approach to typing.

### 2. Ease of Use

Module augmentation simplifies the process of adding custom types. Without it, you might need to import and manage types in multiple files, potentially leading to redundancy and confusion. With module augmentation, you declare your types once, and they become available project-wide.

### 3. Readability and Maintainability

Keeping all type augmentations in one global declaration (as opposed to scattering them across files) improves code readability and maintainability. Developers can easily understand the entire set of custom types by referring to the global declaration.

### 4. Avoiding Build System Complexity

One of the significant advantages of module augmentation is that it doesn't require complex build configurations. Unlike some advanced TypeScript features that may need additional build steps or tools, module augmentation works seamlessly within the TypeScript compiler, making it accessible and easy to adopt without a steep learning curve.

## Practical Example

In your Flare City project, the augmented types `Env` and `ExecutionContext` provide a structured way to define environment variables and execution context. This not only helps in documentation but also ensures that these variables are used consistently across your project.

```ts
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
