import { useQuery } from "@apollo/client";
import { useState } from "react";
import { ALL_BOOKS, ALL_GENRES } from "../GraphQL/queries";

const Books = () => {
  const [genre, setGenre] = useState("");
  const result = useQuery(ALL_BOOKS, { variables: { genre } });
  const genres = useQuery(ALL_GENRES)

  if (result.loading || genres.loading) {
    return <div>loading books...</div>;
  }

  return (
    <div>
      <h2>Books</h2>
      in genre <strong>{genre || genres.data.allGenres.join(", ")}</strong>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {result.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.data.allGenres.map((genre) => (
        <button key={genre} onClick={() => setGenre(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setGenre("")}>all genres</button>
    </div>
  );
};

export default Books;
