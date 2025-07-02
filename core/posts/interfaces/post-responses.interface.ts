import { ExceptionResponse } from '@/core/interfaces';
import { Post } from './post.interface';

export type GetPostsResponse = Post[] | ExceptionResponse;
export type GetPostResponse = Post | ExceptionResponse;
export type CreatePostResponse = Post | ExceptionResponse;
export type UpdatePostResponse = Post | ExceptionResponse;
export type DeletePostResponse = Post | ExceptionResponse;
