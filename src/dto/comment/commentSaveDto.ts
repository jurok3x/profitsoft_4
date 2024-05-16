import type { CommentDto } from "./commentDto";

export type CommentSaveDto  = Omit<CommentDto, '_id' | 'date'>