import type { ApiResponse, RequestURLSegments } from "@flare-city/core";
import { RoutePost } from "./post.route";
import { z } from "zod";

// Post Schema
const PostSchema = z.object({
  title: z.string(),
  description: z.string(),
});

// Segments
const PostApiSegmentsSchema = z.object({ id: z.string() });
export type PostApiSegments = z.infer<typeof PostApiSegmentsSchema>;

// GET Response & Params
const GetSinglePostApiResponseSchema = PostSchema.extend({ id: z.string() });
export type GetSinglePostApiResponse = ApiResponse<
  z.infer<typeof GetSinglePostApiResponseSchema>
>;

// GET All Response & Params
export type GetAllPostsApiResponse = ApiResponse<
  z.infer<typeof GetSinglePostApiResponseSchema>[]
>;
const GetAllPostsApiSearchParamsSchema = z.object({
  search: z.string().optional(),
  amount: z.coerce.number().optional(),
  type: z.union([z.literal("test-1"), z.literal("test-2")]).optional(),
});
export type GetAllPostsApiSearchParams = z.infer<
  typeof GetAllPostsApiSearchParamsSchema
>;

// POST & PUT Request
const CreateSinglePostApiRequestSchema = PostSchema;
export type CreateSinglePostApiRequest = z.infer<
  typeof CreateSinglePostApiRequestSchema
>;
export type CreateSinglePostApiResponse = GetSinglePostApiResponse;

/**
 * Get's all of the posts
 * @description GET /post
 */
RoutePost.get<
  GetAllPostsApiResponse,
  RequestURLSegments,
  GetAllPostsApiSearchParams
>({
  path: "",
  parse: {
    params: GetAllPostsApiSearchParamsSchema,
  },
  handler: async (req, env, context, res) => {
    return res({
      json: {
        data: [
          {
            id: "1",
            title: "post title",
            description: "post description",
          },
          {
            id: "2",
            title: "post title",
            description: "post description",
          },
        ],
      },
      status: 200,
    });
  },
});

/**
 * Get's a single post by ID
 * @description GET /post/:id
 */
RoutePost.get<GetSinglePostApiResponse, PostApiSegments>({
  path: "/:id",
  parse: {
    segments: PostApiSegmentsSchema,
  },
  handler: async (req, env, context, res) => {
    return res({
      json: {
        data: {
          id: context.segments.id,
          title: "post title",
          description: "post description",
        },
      },
      status: 200,
    });
  },
});

/**
 * Creates a new post
 * @description POST /post
 */
RoutePost.post<CreateSinglePostApiResponse, CreateSinglePostApiRequest>({
  path: "",
  parse: {
    body: CreateSinglePostApiRequestSchema,
  },
  handler: async (req, env, context, res) => {
    return res({
      json: {
        data: {
          id: "1",
          description: context.body.description,
          title: context.body.title,
        },
      },
      status: 200,
    });
  },
});

/**
 * Updates a post with the provided :id segment
 * @description PUT /post/:id
 */
RoutePost.put<CreateSinglePostApiResponse, CreateSinglePostApiRequest>({
  path: "/:id",
  parse: {
    segments: PostApiSegmentsSchema,
    body: CreateSinglePostApiRequestSchema,
  },
  handler: async (req, env, context, res) => {
    return res({
      json: {
        data: {
          id: context.segments.id,
          title: context.body.title,
          description: context.body.description,
        },
      },
      status: 200,
    });
  },
});

/**
 * Deletes a post with the provided :id segment
 * @description DELETE /post/:id
 */
RoutePost.delete({
  path: "/:id",
  parse: {
    segments: PostApiSegmentsSchema,
  },
  handler: async (req, env, context, res) => {
    return res({
      json: {
        data: {
          message: "Running the DELETE handler",
        },
      },
      status: 200,
    });
  },
});
