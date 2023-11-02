import type { ZodType } from "zod";
import type {
  RequestURLSearchParams,
  RequestURLSegments,
  Middleware,
  Env,
  ApiResponse,
} from "../utils";

export type RouteHandlerResponse<T extends Record<string, unknown>> = (
  params: { json: T } & { status?: 200 | 301 }
) => Promise<Response>;

export type RouteMethods = "GET" | "POST";

/**
 * the GET Route definition
 */
export type RouteGET<
  R extends ApiResponse<unknown> = ApiResponse<unknown>,
  S extends RequestURLSegments = RequestURLSegments,
  P extends RequestURLSearchParams = RequestURLSearchParams,
> = {
  path: string;
  method: "GET";
  middleware?: Middleware[];
  parse?: {
    segments?: ZodType<S>;
    params?: ZodType<P>;
  };
  handler: RouteGETHandler<R, S, P>;
};

export type RouteGETHandler<
  R extends Record<string, unknown> = Record<string, unknown>,
  S extends RequestURLSegments = RequestURLSegments,
  P extends RequestURLSearchParams = RequestURLSearchParams,
> = (
  request: Request,
  env: Env,
  ctx: ExecutionContext<S, P>,
  res: RouteHandlerResponse<R>
) => Promise<Response>;

/**
 * the POST route definition
 */
export type RoutePOST<
  R extends ApiResponse<unknown> = ApiResponse<unknown>,
  B extends Record<string, unknown> = Record<string, unknown>,
  S extends RequestURLSegments = RequestURLSegments,
  P extends RequestURLSearchParams = RequestURLSearchParams,
> = {
  path: string;
  middleware?: Middleware[];
  method: "POST";
  parse?: {
    body: ZodType<B>;
    segments?: ZodType<S>;
    params?: ZodType<P>;
  };
  handler: RoutePOSTHandler<R, B, S, P>;
};

export type RoutePOSTHandler<
  R extends Record<string, unknown> = Record<string, unknown>,
  B extends Record<string, unknown> = Record<string, unknown>,
  S extends RequestURLSegments = RequestURLSegments,
  P extends RequestURLSearchParams = RequestURLSearchParams,
> = (
  request: Request,
  env: Env,
  ctx: ExecutionContext<S, P, B>,
  res: RouteHandlerResponse<R>
) => Promise<Response>;

/**
 * the POST route definition
 */
export type RoutePUT<
  R extends ApiResponse<unknown> = ApiResponse<unknown>,
  B extends Record<string, unknown> = Record<string, unknown>,
  S extends RequestURLSegments = RequestURLSegments,
  P extends RequestURLSearchParams = RequestURLSearchParams,
> = {
  path: string;
  method: "PUT";
  middleware?: Middleware[];
  parse?: {
    body: ZodType<B>;
    segments?: ZodType<S>;
    params?: ZodType<P>;
  };
  handler: RoutePUTHandler<R, B, S, P>;
};

export type RoutePUTHandler<
  R extends Record<string, unknown> = Record<string, unknown>,
  B extends Record<string, unknown> = Record<string, unknown>,
  S extends RequestURLSegments = RequestURLSegments,
  P extends RequestURLSearchParams = RequestURLSearchParams,
> = (
  request: Request,
  env: Env,
  ctx: ExecutionContext<S, P, B>,
  res: RouteHandlerResponse<R>
) => Promise<Response>;

/**
 * the DELETE route definition
 */
export type RouteDELETE<
  S extends RequestURLSegments = RequestURLSegments,
  P extends RequestURLSearchParams = RequestURLSearchParams,
> = {
  path: string;
  method: "DELETE";
  middleware?: Middleware[];
  parse?: {
    segments?: ZodType<S>;
    params?: ZodType<P>;
  };
  handler: RouteDELETEHandler<S, P>;
};

export type RouteDELETEHandler<
  S extends RequestURLSegments = RequestURLSegments,
  P extends RequestURLSearchParams = RequestURLSearchParams,
> = (
  request: Request,
  env: Env,
  ctx: ExecutionContext<S, P>,
  res: RouteHandlerResponse<ApiResponse<{ message: string }>>
) => Promise<Response>;

/**
 * the CRUD route definition
 */
export type RouteCRUD<
  R extends ApiResponse<unknown> = ApiResponse<unknown>,
  B extends Record<string, unknown> = Record<string, unknown>,
  S extends RequestURLSegments = RequestURLSegments,
  P extends RequestURLSearchParams = RequestURLSearchParams,
> = {
  path: string;
  middleware?: Middleware[];
  parse?: {
    body: ZodType<B>;
    segments?: ZodType<S>;
    params?: ZodType<P>;
  };
  handlers: {
    post: RoutePOSTHandler<R, B, S, P>;
    get: RouteGETHandler<R, S, P>;
    delete: RouteDELETEHandler<S, P>;
    put: RoutePUTHandler<R, B, S, P>;
  };
};

export type RouteDefinition = RouteGET | RoutePOST | RoutePUT | RouteDELETE;

export type RouteMatch = {
  route: RouteDefinition;
  pattern: URLPatternURLPatternResult;
};
