import { useState } from "react";
import {
  DraggableList,
  DragHandle,
  type RenderItemParams,
} from "../../dragAndDropList/components/DraggableListReusableContainer";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

// ─── Todo Row ────────────────────────────────────────────────────────────────

function TodoRow({
  item,
  isDragging,
  dragHandleProps,
  onToggle,
  onDelete,
}: RenderItemParams<TodoItem> & {
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div
      className={[
        "h-full flex items-center gap-3 px-4 rounded-xl border transition-all duration-200",
        isDragging
          ? "bg-slate-800 border-slate-600 shadow-2xl scale-[1.02]"
          : "bg-slate-900 border-slate-800 hover:border-slate-700",
      ].join(" ")}
    >
      {/* Drag Handle */}
      <DragHandle
        dragHandleProps={dragHandleProps}
        className="text-slate-500 hover:text-slate-300"
      />

      {/* Checkbox */}
      <button
        onClick={() => onToggle(item.id)}
        className={[
          "w-5 h-5 rounded border flex items-center justify-center transition-colors",
          item.completed
            ? "bg-emerald-500 border-emerald-500"
            : "border-slate-600",
        ].join(" ")}
      >
        {item.completed && (
          <span className="text-[10px] text-white">✓</span>
        )}
      </button>

      {/* Todo Text */}
      <p
        className={[
          "flex-1 text-sm transition-all",
          item.completed
            ? "text-slate-500 line-through"
            : "text-slate-200",
        ].join(" ")}
      >
        {item.text}
      </p>

      {/* Delete */}
      <button
        onClick={() => onDelete(item.id)}
        className="text-xs text-red-400 hover:text-red-300 transition-colors"
      >
        Delete
      </button>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TodoListPage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState("");

  // Add Todo
  const addTodo = () => {
    const trimmed = input.trim();

    if (!trimmed) return;

    const newTodo: TodoItem = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    };

    setTodos((prev) => [newTodo, ...prev]);
    setInput("");
  };

  // Toggle Complete
  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  // Delete Todo
  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 mb-1">
            Productivity
          </p>

          <h1 className="text-2xl font-bold text-white tracking-tight">
            Todo List
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            {todos.length} Tasks
          </p>
        </div>

        {/* Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Write a task and press Enter..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTodo();
              }
            }}
            className="w-full h-12 px-4 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 outline-none focus:border-slate-600 transition-colors"
          />
        </div>

        {/* Draggable Todo List */}
        <DraggableList<TodoItem>
          items={todos}
          onReorder={setTodos}
          itemHeight={64}
          height={420}
          className="rounded-xl"
          renderItem={(params) => (
            <TodoRow
              {...params}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          )}
        />

        {todos.length === 0 && (
          <div className="mt-6 text-center text-sm text-slate-600">
            No tasks added yet
          </div>
        )}
      </div>
    </div>
  );
}