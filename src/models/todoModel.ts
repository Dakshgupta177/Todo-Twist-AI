import mongoose, { Document, Schema } from "mongoose";

export interface todoItem extends Document {
  id: string,
  content: string,
  isCompleted: boolean,
}

interface Todo extends Document {
  userId: string;
  normalTodos: todoItem[];
  challengingTodos: todoItem[];
}
const todoItemSchema: Schema<todoItem> = new mongoose.Schema<todoItem>({
  content: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});
const todoSchema: Schema<Todo> = new mongoose.Schema<Todo>({
  userId: {
    type: String,
  },
  challengingTodos: [todoItemSchema],
  normalTodos: [todoItemSchema],
});

const Todo =
  (mongoose.models.Todo as mongoose.Model<Todo>) ||
  mongoose.model<Todo>("Todo", todoSchema);
export default Todo;
