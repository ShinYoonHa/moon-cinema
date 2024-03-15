import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { MovieCard, SkelatonLoader } from "../../common";
import { CatalogHeader, Search } from "./components";
import { smallMaxWidth } from "../../styles";
import {
  getActorRecommendMovie,
  getGenreRecommendMovie,
  getSearchedMovies,
  getTopRatedMovie,
  getTopReservationMovie,
  getUserInfo,
} from "../../services/ApiService";

const Catalog = () => {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [movieList, setMovieList] = useState([]);
  const [prevMovies, setPrevMovies] = useState([]); // New state to store previously loaded movies
  const [isCategoryChanged, setIsCategoryChanged] = useState(false);
  const [query, setQuery] = useSearchParams();
  const [actor, setActor] = useState(null);
  const [genres, setGenres] = useState([]);
  const [pageTitle, setPageTitle] = useState();
  const [userInfoLoaded, setUserInfoLoaded] = useState(false);
  const { category } = useParams();
  const { option } = useParams();

  const searchQuery = query.get("search") || "";
  const moviesPerPage = 10 + (page - 1) * 10;

  useEffect(() => {
    getUserInfo({
      email: localStorage.getItem("email"),
    })
      .then((response) => {
        setActor(response.result.Actors);
        setGenres([response.result.Genre1, response.result.Genre2]);
        setUserInfoLoaded(true);
      })
      .catch((error) => {
        console.error("Error while Getting UserInfo:", error);
      });
  }, []);

  useEffect(() => {
    if (userInfoLoaded) {
      setIsCategoryChanged(true);

      if (option === "top_rated") {
        getTopRatedMovie(page, pageSize).then((response) => {
          // On the first load, set both prevMovies and movieList
          if (page === 1) {
            setPrevMovies(response.result);
            setMovieList(response.result);
          } else {
            // On subsequent loads, update movieList with the new movies
            setMovieList((prevList) => [...prevList, ...response.result]);
          }
        });
        setPageTitle("top_rated");
      } else if (option === "top_reservation") {
        getTopReservationMovie(page, pageSize).then((response) => {
          if (page === 1) {
            setPrevMovies(response.result);
            setMovieList(response.result);
          } else {
            setMovieList((prevList) => [...prevList, ...response.result]);
          }
        });
        setPageTitle("top_reservation");
      } else if (option === "genre_recommend") {
        getGenreRecommendMovie(genres[0], genres[1], page, pageSize).then(
          (response) => {
            if (page === 1) {
              setPrevMovies(response.result);
              setMovieList(response.result);
            } else {
              setMovieList((prevList) => [...prevList, ...response.result]);
            }
          }
        );
        setPageTitle("genre_recommend");
      } else if (option === "actors_recommend") {
        getActorRecommendMovie(actor, page, pageSize).then((response) => {
          if (page === 1) {
            setPrevMovies(response.result);
            setMovieList(response.result);
          } else {
            setMovieList((prevList) => [...prevList, ...response.result]);
          }
        });
        setPageTitle("actors_recommend");
      }
    }
  }, [actor, genres, option, userInfoLoaded, page, moviesPerPage]);

  useEffect(() => {
    setPage(1);
    setIsCategoryChanged(true);

    if (searchQuery.trim() !== "") {
      getSearchedMovies(searchQuery)
        .then((response) => {
          setPrevMovies(response.result); // Set prevMovies on search
          setMovieList(response.result);
          setPageTitle("search_results");
        })
        .catch((error) => {
          console.error("Error while getting searched movies:", error);
        });
    }
  }, [category, searchQuery]);

  return (
    <>
      <CatalogHeader category={pageTitle} />
      <section className={`${smallMaxWidth} h-screen`}>
        <Search setQuery={setQuery} />

        <div className="flex flex-wrap xs:gap-4 gap-[14px] justify-center">
          {movieList.slice(0, moviesPerPage).map((movie, index) => (
            <div
              key={index}
              className="flex flex-col xs:gap-4 gap-2 xs:max-w-[170px] max-w-[124px] rounded-lg lg:mb-6 md:mb-5 sm:mb-4 mb-[10px]"
            >
              <MovieCard movie={movie} category={pageTitle} />
            </div>
          ))}
        </div>

        {!isCategoryChanged ? (
          <SkelatonLoader
            isMoviesSliderLoader={false}
            className="md:pt-8 sm:pt-7 pt-6"
          />
        ) : (
          <div className="w-full flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setPage(page + 1);
              }}
              className="sm:py-2 xs:py-[6px] py-1 sm:px-4 xs:px-3 px-[10.75px] bg-[#ff0000] text-gray-50 rounded-full md:text-[15.25px] sm:text-[14.75px] xs:text-[14px] text-[12.75px] shadow-md hover:-translate-y-1 transition-all duration-300 font-medium font-nunito lg:my-8 my-7"
            >
              더보기
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default Catalog;
