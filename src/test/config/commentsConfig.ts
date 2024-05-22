import log4js from 'log4js';
import { ObjectId } from "mongodb";
import Comment from "src/model/comment";

export const comments = [
    new Comment({
        _id: new ObjectId(),
        text: "Great!",
        author: "John Doe",
        articleId: "7f94d3da-a46a-4a90-a3d3-edbe4311dd83",
        deletedAt: null,
    }),
    new Comment({
        _id: new ObjectId(),
        text: "Nice!",
        author: "Keanu Reeves",
        articleId: "7f94d3da-a46a-4a90-a3d3-edbe4311dd83",
        deletedAt: null,
    }),
];

export const seed = async () => {
    try {
        await Promise.all(comments.map(comment => comment.save()));
        log4js.getLogger().info("All comments have been seeded successfully.");
    } catch (error) {
        log4js.getLogger().error("Error seeding comments:", error);
    }
};
