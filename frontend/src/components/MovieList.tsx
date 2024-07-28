import React from "react";
import { isEmpty, isNil } from "lodash-es";
import useDeepCompareEffect from "use-deep-compare-effect";
import useMovie from "@/domain/useMovie";
import MoviePreview from "./MoviePreview";

const limit = 5;

function MovieList({ filters }) {
  const { searchVideo } = useMovie();

  const [page, setPage] = React.useState(0);
  const { data, error, isValidating, isLoading } = searchVideo({
    filters: { ...filters, page, limit },
  });

  const pages = Math.ceil(data?.data?.data?.total / limit);

  useDeepCompareEffect(() => {
    if (!isNil(filters.page)) {
      setPage(filters.page);
    }
  }, [filters]);

  if (isLoading) return <p className="article-preview">Loading movies...</p>;
  if (error) return <p className="article-preview">Loading movies failed :(</p>;
  if (isEmpty(data?.data?.data?.items))
    return <p className="article-preview">No movies are here... yet.</p>;

  return (
    <>
      {data?.data?.data?.items.map((movie) => (
        <MoviePreview movie={movie} />
      ))}
      {pages > 1 && (
        <nav>
          <ul className="pagination">
            {Array.from({ length: pages }, (_, i) => (
              <li
                className={page === i ? "page-item active" : "page-item"}
                key={i}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}

export default MovieList;
