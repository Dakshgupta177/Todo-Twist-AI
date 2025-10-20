"use client";
import Link from "next/link";
import { Navbar } from "../components/Navbar";
import { ListTodo, Zap } from "lucide-react";
import { useTodoStore } from "@/store/useAppStore";
import { useEffect } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
export default function App() {
  const { setNormalTodo, setChallengingTodo, normalTodos, challengingTodos } =
    useTodoStore();
  const fetchTodos = async () => {
    try {
      const res = await axios.get("/api/getalltodos");
      console.log(res);
      toast.success("Fetching Todo Successful", {
        description: res.data.message || "Added to database",
        action: {
          label: "Got It",
          onClick: () => {},
        },
      });
      setNormalTodo(res.data.normalTodos.length);
      setChallengingTodo(res.data.challengingTodos.length);
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error("Fetching Todo failed", {
        description: axiosError.message || "Something went wrong",
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-6xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {/* Your Todo Circle */}
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-purple-500 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <Link
                  href="/your-todos"
                  className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex flex-col items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300"
                >
                  <ListTodo
                    className="w-16 h-16 text-white mb-4"
                    strokeWidth={1.5}
                  />
                  <h2 className="text-white text-center px-8">Your Todo</h2>
                  <div className="mt-4 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <p className="text-white/90">{normalTodos} tasks</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Challenging Todo Circle */}
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <Link
                  href="/your-challenging-todos"
                  className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-orange-500 via-rose-500 to-pink-600 flex flex-col items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300"
                >
                  <Zap
                    className="w-16 h-16 text-white mb-4"
                    strokeWidth={1.5}
                  />
                  <h2 className="text-white text-center px-8">
                    Challenging Todo
                  </h2>
                  <div className="mt-4 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <p className="text-white/90">{challengingTodos} tasks</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
// "use client";
// import { Navbar } from "../components/Navbar";
// import { TodoInterface } from "../components/TodoInterface";
// import { ArrowLeft } from "lucide-react";
// import { Button } from "../components/ui/button";

// export default function App() {
//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
//       <Navbar />

//       <main className="flex-1 p-4 sm:p-6 lg:p-8">
//         <div className="max-w-6xl mx-auto">
//           <Button variant="ghost" className="mb-6 hover:bg-white/60">
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Home
//           </Button>
//           <TodoInterface />
//         </div>
//       </main>
//     </div>
//   );
// }
