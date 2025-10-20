import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Plus,
  Trash2,
  ListTodo,
  Circle,
  CheckCircle2,
  Edit,
} from "lucide-react";
import { Card } from "./ui/card";
import { useTodoStore } from "@/store/useAppStore";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

interface Todo {
  _id: string;
  content: string;
  isCompleted: boolean;
}

export function TodoInterface() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { addNormalTodo, deleteNormalTodo, setNormalTodo } = useTodoStore();
  const fetchTodos = async () => {
    try {
      const res = await axios.get("/api/getalltodos");
      console.log(res);
      toast.success("Fetching Todo Successful", {
        description: res.data.message || "Fetched to database",
        action: {
          label: "Got It",
          onClick: () => {},
        },
      });
      setTodos(res.data.normalTodos);
      console.log(todos);

      setNormalTodo(res.data.normalTodos.length);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error("Fetching Todo failed", {
        description:
          axiosError.response?.data.message || "Something went wrong",
        action: {
          label: "Try Again",
          onClick: () => {},
        },
      });
    }
  };
  const addTodo = async () => {
    try {
      const response = await axios.post("/api/normal-todo/addtodo", {
        content: inputValue,
      });
      toast.success("Adding Todo Successful", {
        description: response.data.message || "Added to database",
        action: {
          label: "Got It",
          onClick: () => {},
        },
      });
      console.log(response);
      setTodos([
        ...todos,
        {
          _id: response.data.data.normalTodos[todos.length]._id,
          content: inputValue,
          isCompleted: false,
        },
      ]);
      addNormalTodo();
      setInputValue("");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error("Adding Todo failed", {
        description:
          axiosError.response?.data.message || "Something went wrong",
        action: {
          label: "Try Again",
          onClick: () => {},
        },
      });
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      console.log(id);
      const response = await axios.post("/api/normal-todo/toggletodo", {
        todoId: id,
      });
      toast.success("Toggle Todo Successful", {
        description: response.data.message || "Updated to database",
        action: {
          label: "Got It",
          onClick: () => {},
        },
      });
      setTodos(
        todos.map((todo) =>
          todo._id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
        )
      );
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error("Toggle Todo failed", {
        description:
          axiosError.response?.data.message || "Something went wrong",
        action: {
          label: "Try Again",
          onClick: () => {},
        },
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await axios.post("/api/normal-todo/deletetodo", {
        todoId: id,
      });
      setTodos(todos.filter((todo) => todo._id !== id));
      deleteNormalTodo();
      toast.success("Todo Deleted Successful", {
        description: response.data.message || "Deleted from database",
        action: {
          label: "Got It",
          onClick: () => {},
        },
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error("Todo Deletion failed", {
        description:
          axiosError.response?.data.message || "Something went wrong",
        action: {
          label: "Try Again",
          onClick: () => {},
        },
      });
    }
  };
  const editTodo = async (id: string) => {
    try {
      await axios.post("/api/normal-todo/deletetodo", {
        todoId: id,
      });
      setTodos(todos.filter((todo) => todo._id !== id));
      deleteNormalTodo();
      const todo = todos.filter((todo) => todo._id === id);
      setInputValue(todo[0].content);
    } catch (error) {
      console.log(error);
      toast.error("Editing failed", {
        description: "Something went wrong",
        action: {
          label: "Try Again",
          onClick: () => {},
        },
      });
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);
  return (
    <div className="space-y-4">
      <div className="w-full flex justify-center items-center bg-gradient-to-r from-purple-500 to-pink-500 h-16 rounded-4xl">
        <h2 className="font-bold text-2xl text-white">YOUR TODOS</h2>
      </div>
      {/* Add Todo Input */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-2">
        <div className="flex gap-2 max-sm:flex-col">
          <div className="relative flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTodo();
                }
              }}
              placeholder={`Add a task...`}
              className="pr-4 border-2 focus:border-transparent"
            />
          </div>
          <Button
            onClick={() => addTodo()}
            className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white border-0 shadow-md transition-all`}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add
          </Button>
        </div>
      </Card>

      {/* Todo List */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4`}
            >
              <ListTodo className="w-8 h-8 text-white" />
            </div>
            <p>No tasks yet. Add one to get started!</p>
          </div>
        ) : (
          todos.map((todo) => (
            <Card
              key={todo._id}
              className={`group p-4 bg-white/80 backdrop-blur-sm hover:shadow-md transition-all border-l-4 border-l-purple-500`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTodo(todo._id)}
                  className="flex-shrink-0 transition-transform hover:scale-110"
                >
                  {todo.isCompleted ? (
                    <CheckCircle2
                      className={`w-6 h-6 
                          
                            text-purple-500
                            
                        `}
                    />
                  ) : (
                    <Circle
                      className={`w-6 h-6 
                          
                            text-purple-300
                            
                        `}
                    />
                  )}
                </button>

                <span
                  className={`flex-1 ${
                    todo.isCompleted
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {todo.content}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editTodo(todo._id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodo(todo._id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Stats */}
      {todos.length > 0 && (
        <Card className="p-4 bg-white/60 backdrop-blur-sm border">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {todos.filter((t) => t.isCompleted).length} of {todos.length}{" "}
              Completed
            </span>
            <div
              className={`px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white`}
            >
              {Math.round(
                (todos.filter((t) => t.isCompleted).length / todos.length) * 100
              )}
              %
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
