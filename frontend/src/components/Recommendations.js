import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../GraphQL/queries";

const Recommendations = ({user}) => {
  const result = useQuery(ALL_BOOKS, { variables: { genre: user.favouriteGenre } });

  if (result.loading) {
    return <div>loading books...</div>;
  }
  
  return (
    <div>
      <h2>Books</h2>
      books in your favorite genre <strong>{user.favouriteGenre}</strong>
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
    </div>
  );
};

export default Recommendations;
