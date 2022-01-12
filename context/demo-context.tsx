import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

/*
https://blog.logrocket.com/how-to-use-react-context-with-typescript/
*/

interface ITodo {
  id?: number;
  title: string;
  status?: boolean;
}

type ContextType = {
  todos: ITodo[];
  saveTodo: (todo: ITodo) => void;
  updateTodo: (id: number) => void;
};

export const DemoContext = createContext<ContextType | null>(null);

const DemoContextProvider: React.FC = ({ children }) => {
  const [todos, setTodos] = useState<ITodo[]>([
    {
      id: 1,
      title: "HL",
      status: false,
    },
  ]);

  const saveTodo = useCallback(
    (todo: ITodo) => {
      const newTodo: ITodo = {
        id: Math.random(), // not really unique - but fine for this example
        title: todo.title,
        status: false,
      };
      setTodos([...todos, newTodo]);
    },
    [todos]
  );

  const updateTodo = useCallback(
    (id: number) => {
      todos.filter((todo: ITodo) => {
        if (todo.id === id) {
          todo.status = true;
          setTodos([...todos]);
        }
      });
    },
    [todos]
  );

  const value = useMemo(
    () => ({ todos, saveTodo, updateTodo }),
    [todos, saveTodo, updateTodo]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
};

const useDemoContext = () => {
  return useContext(DemoContext) as ContextType;
};

export { DemoContextProvider, useDemoContext };
