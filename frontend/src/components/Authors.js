import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

import { ALL_AUTHORS, EDIT_AUTHOR } from "../GraphQL/queries";

const Authors = ({ loggedIn }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const result = useQuery(ALL_AUTHORS);

  useEffect(() => {
    setName(result.data?.allAuthors[0].name);
  }, [result.data]);

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (result.loading) {
    return <div>loading authors...</div>;
  }

  const handleClick = () => {
    if (!name || !born) return;

    editAuthor({
      variables: {
        name,
        born,
      },
    });

    setName("");
    setBorn("");
  };
  
  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loggedIn && (
        <>
          <h3>Set birthyear</h3>
          <p>
            <label>
              name
              <select onChange={(e) => setName(e.target.value)}>
                {result.data.allAuthors.map((author) => (
                  <option key={author.name} value={author.name}>
                    {author.name}
                  </option>
                ))}
              </select>
            </label>
          </p>
          <p>
            <label>
              born
              <input type="number" onChange={(e) => setBorn(+e.target.value)} />
            </label>
          </p>
          <button onClick={handleClick}>update author</button>
        </>
      )}
    </div>
  );
};

export default Authors;
