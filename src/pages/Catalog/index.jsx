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
//
const Catalog = () => {
  const [page, setPage] = useState(1);
  const [movieList, setMovieList] = useState([]);
  const [isCategoryChanged, setIsCategoryChanged] = useState(false);
  const [query, setQuery] = useSearchParams();
  const [actor, setActor] = useState(null);
  const [genres, setGenres] = useState([]);
  const [pageTitle, setPageTitle] = useState();
  const [userInfoLoaded, setUserInfoLoaded] = useState(false);
  const { category } = useParams();
  const { option } = useParams(); //어떤 걸 select할지 구분하는 변수

  const searchQuery = query.get("search") || "";

  const moviesPerPage = 8 + (page - 1) * 8;

  useEffect(() => {
    // 사용자 정보를 가져오는 API 호출
    getUserInfo({
      email: localStorage.getItem("email"), // 예시: 이메일을 통해 사용자 정보를 가져옴
    })
      .then((response) => {
        setActor(response.result.Actors); // actor 정보를 상태에 저장
        setGenres([response.result.Genre1, response.result.Genre2]); // genres 정보를 상태에 저장
        setUserInfoLoaded(true); // 사용자 정보가 로드되었음을 표시
      })
      .catch((error) => {
        console.error("Error while Getting UserInfo:", error);
      });
  }, []);

  useEffect(() => {
    if (userInfoLoaded) {
      // 사용자 정보가 로드되었을 때만 실행
      //높은 평점
      if (option === "top_rated") {
        getTopRatedMovie().then((response) => {
          setMovieList(response.result); // 받아온 top_rated 영화 정보 저장
        });
        setPageTitle("top_rated");
      }
      //높은 예매율
      else if (option === "top_reservation") {
        getTopReservationMovie().then((response) => {
          setMovieList(response.result); // 받아온 top_reservation 영화 정보 저장
        });
        setPageTitle("top_reservation");
      }
      //선호 장르
      else if (option === "genre_recommend") {
        genres &&
          getGenreRecommendMovie(genres).then((response) => {
            setMovieList(response.result); // 받아온 선호 장르 영화 정보 저장
          });
        setPageTitle("genre_recommend");
      }
      //선호 배우
      else if (option === "actors_recommend") {
        actor &&
          getActorRecommendMovie(actor).then((response) => {
            setMovieList(response.result);
          });
        setPageTitle("actors_recommend");
      }
    }
  }, [actor, genres, option, userInfoLoaded]);

  useEffect(() => {
    setPage(1);
    setIsCategoryChanged(true);

    if (searchQuery.trim() !== "") {
      getSearchedMovies(searchQuery)
        .then((response) => {
          setMovieList(response.result);
          setPageTitle("search_results");
        })
        .catch((error) => {
          console.error("Error while getting searched movies:", error);
        });
    }
  }, [category, searchQuery]);

  console.log(searchQuery);
  console.log(movieList);

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
