import { Document, Schema, model } from 'mongoose';
import { isNotBlank, validateArticleId } from 'src/validator/commentValidator';

export interface IComment extends Document {
	text: string;
    author: string;
    articleId: string;
	date: Date;
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
    date: { type: Date, required: true, default: Date.now },
},
{
    timestamps: true,
},
);

const Comment = model<IComment>('Comment', commentSchema);
export default Comment;