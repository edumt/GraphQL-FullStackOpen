import { useApolloClient, useQuery } from "@apollo/client";
import { useState } from "react";

import Authors from "./components/Authors";
import Books from "./components/Books";
import LoginForm from "./components/LoginForm";
import NewBook from "./components/NewBook";
import Recommendations from "./components/Recommendations";
import { ME } from "./GraphQL/queries";

const App = () => {
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("authors");
  const me = useQuery(ME);
  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage("login");
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommendations")}>
              recommend
            </button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>log in</button>
        )}
      </div>

      {page === "authors" && <Authors loggedIn={!!token} />}

      {page === "books" && <Books />}

      {page === "add" && <NewBook />}

      {page === "login" && (
        <LogIn
          setToken={(token) => {
            setToken(token);
            setPage("add");
          }}
        />
      )}
      {page === "recommendations" && <Recommendations user={me?.data.me} />}
    </div>
  );
};

const LogIn = ({ setToken }) => {
  return (
    <div>
      {/* <Notify errorMessage={errorMessage} /> */}
      <h2>Login</h2>
      <LoginForm
        setToken={setToken}
        //  setError={notify}
      />
    </div>
  );
};

export default App;
