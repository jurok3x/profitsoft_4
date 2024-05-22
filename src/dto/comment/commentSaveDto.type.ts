import type { CommentDto } from "./commentDto.type";

export type CommentSaveDto  = Omit<CommentDto, '_id' | 'createdAt' | 'updatedAt' | 'deletedAt'>