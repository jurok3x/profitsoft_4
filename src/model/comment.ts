import { Document, Schema, model } from 'mongoose';
import { isNotBlank, validateArticleId } from 'src/validator/commentValidator';

export interface IComment extends Document {
	text: string;
    author: string;
    articleId: string;
	createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

const commentSchema = new Schema<IComment>({
    text: { type: String,
            required: true,
            validate: {
                validator: (value: string) => isNotBlank(value),
                message: props => `${props.value} should not be empty`
            }
        },
    author: { type: String,
            required: true,
            validate: {
                validator: (value: string) => isNotBlank(value),
                message: props => `${props.value} should not be empty`
            }
            },
    articleId: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) => validateArticleId(value),
            message: props => `${props.value} is not a valid UUID`
        }
    },
    deletedAt: { type: Date, required: false, default: null },
},
{
    timestamps: true,
},
);

const Comment = model<IComment>('Comment', commentSchema);
export default Comment;