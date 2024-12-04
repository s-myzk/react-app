import { useState } from "react";
import "./App.css";

// Todo型の定義
type Todo = {
  // タスクの内容
  value: string;
  // readonly key
  id: number;
  // タスク完了/未完了フラグ true:完了 false:未完了
  checked: boolean;
  // タスク削除/未削除フラグ true:削除 false:未削除
  removed: boolean;
};

// フィルターの状態の定義
type Filter = "all" | "checked" | "unchecked" | "removed";

function App() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");

  // textステートを更新する
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  // filterステートを更新する
  const handleFilter = (filter: Filter) => {
    setFilter(filter);
  };

  // todosステートを更新する
  const handleSubmit = () => {
    if (!text) return;

    // 新しいTodoを作成する
    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false,
    };

    // 更新前のtodosとnewTodoを加えた配列でステートを更新する
    setTodos((todos) => [newTodo, ...todos]);
    setText("");
  };

  // TODOを編集、完了済み、削除
  const handleUpdate = (
    id: number,
    updates: Partial<{ value: string; checked: boolean; removed: boolean }>,
  ) => {
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo.id === id) {
          // 更新対象のプロパティのみ変更
          return { ...todo, ...updates };
        }
        return todo;
      }),
    );
  };

  // filterステートの値に応じて異なる内容の配列を返す
  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "all":
        // 削除されていないもの
        return !todo.removed;
      case "checked":
        // 完了済かつ、削除されていないもの
        return todo.checked && !todo.removed;
      case "unchecked":
        // 未完了かつ、削除されていないもの
        return !todo.checked && !todo.removed;
      case "removed":
        // 削除済みのもの
        return todo.removed;
      default:
        return todo;
    }
  });

  // removedフラグがtrueの場合、todosステートから削除
  const handleEmpty = () => {
    setTodos((todos) => todos.filter((todo) => !todo.removed));
  };

  return (
    <div>
      {/* フィルタリング */}
      <select
        defaultValue="all"
        onChange={(e) => handleFilter(e.target.value as Filter)}
      >
        <option value="all">すべてのタスク</option>
        <option value="checked">完了したタスク</option>
        <option value="unchecked">現在のタスク</option>
        <option value="removed">ごみ箱</option>
      </select>

      {/* フィルターが removed のときは「ごみ箱を空にする」ボタンを表示 */}
      {filter === "removed" ? (
        <button
          onClick={handleEmpty}
          disabled={todos.filter((todo) => todo.removed).length === 0}
        >
          ごみ箱を空にする
        </button>
      ) : (
        // フィルターが checked でなければ Todo 入力フォームを表示
        filter !== "checked" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input type="text" value={text} onChange={(e) => handleChange(e)} />
            <input type="submit" value="追加" onSubmit={handleSubmit} />
          </form>
        )
      )}

      {/* タスク一覧 */}
      <ul>
        {filteredTodos.map((todo) => {
          return (
            <li key={todo.id}>
              <input
                type="checkbox"
                disabled={todo.removed}
                checked={todo.checked}
                onChange={() =>
                  handleUpdate(todo.id, { checked: !todo.checked })
                }
              />
              <input
                type="text"
                disabled={todo.checked || todo.removed}
                value={todo.value}
                onChange={(e) =>
                  handleUpdate(todo.id, { value: e.target.value })
                }
              />
              <button
                onClick={() =>
                  handleUpdate(todo.id, { removed: !todo.removed })
                }
              >
                {todo.removed ? "復元" : "削除"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
