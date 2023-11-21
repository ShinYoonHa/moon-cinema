import { memo, useRef, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import MoviesSlides from "./MoviesSlides";
import { SkelatonLoader } from "../Loader";
import Error from "../Error";

import { useTheme } from "../../context/themeContext";

import { getErrorMessage } from "../../utils/helper";
import { call, getUserInfo } from "../../services/ApiService";
import { useQuery } from "@tanstack/react-query";

const Section = ({ title, category, className, type, showSimilarShows }) => {
  const ref = useRef(null);
  const { theme } = useTheme();
  const [userInfo, setUserInfo] = useState({});
  const [userInfoLoaded, setUserInfoLoaded] = useState(false);

  const isLoggedIn = localStorage.getItem("ACCESS_TOKEN") !== "null";

  useEffect(() => {
    if (isLoggedIn) {
      getUserInfo({
        email: localStorage.getItem("email"),
      })
        .then((response) => {
          setUserInfo(response.result);
          setUserInfoLoaded(true);
        })
        .catch((error) => {
          console.error("사용자 정보를 불러오는 중 에러 발생:", error);
        });
    }
  }, [isLoggedIn]);

  //높은 예매율 순
  const {
    data: movieData,
    isLoading: isLoading1,
    isError: isError1,
    error: error1,
  } = useQuery({
    queryKey: ["movies"],
    queryFn: () => call("/NowMovieSelectDESCReserveRate", "GET"),
  });

  //높은 평점 순
  const {
    data: movieData2,
    isLoading: isLoading2,
    isError: isError2,
    error: error2,
  } = useQuery({
    queryKey: ["movies2"],
    queryFn: () => call("/MovieSelectDESCRating", "GET"),
  });

  const {
    data: movieData3,
    isLoading: isLoading3,
    isError: isError3,
    error: error3,
  } = useQuery({
    queryKey: ["movies3"],
    queryFn: () => call(`/MovieSelectByActor/${userInfo.Actors}`, "GET"),
    enabled: isLoggedIn && userInfoLoaded,
  });

  const {
    data: movieData4,
    isLoading: isLoading4,
    isError: isError4,
    error: error4,
  } = useQuery({
    queryKey: ["movies4"],
    queryFn: () =>
      call(
        `/MovieSelectByGenre/${userInfo.Genre1}/${userInfo.Genre2}`,
        "GET"
      ).then((response) => {
        return response;
      }),
    enabled: isLoggedIn && userInfoLoaded,
  });

  useEffect(() => {
    const observerHandler = (entries, observer) => {
      const entry = entries[0];
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
    };

    const observer = new IntersectionObserver(observerHandler, {
      root: null,
      rootMargin: "580px",
      threshold: 0.1,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const errorMessage1 = useMemo(
    () => (isError1 ? getErrorMessage(error1) : ""),
    [error1, isError1]
  );
  const errorMessage2 = useMemo(
    () => (isError2 ? getErrorMessage(error2) : ""),
    [error2, isError2]
  );
  const errorMessage3 = useMemo(
    () => (isError3 ? getErrorMessage(error3) : ""),
    [error3, isError3]
  );
  const errorMessage4 = useMemo(
    () => (isError4 ? getErrorMessage(error4) : ""),
    [error4, isError4]
  );

  const sectionStyle = `sm:py-[20px] xs:py-[18.75px] py-[16.75px] font-nunito ${className}`;
  const linkStyle = `sm:py-1 py-[2px] sm:text-[14px] xs:text-[12.75px] text-[12px] sm:px-4 px-3 rounded-full ${
    theme === "Dark" ? "view-all-btn--dark" : "view-all-btn--light"
  } dark:text-gray-300 hover:-translate-y-1 transition-all duration-300`;

  return (
    <section className={sectionStyle} ref={ref}>
      <div
        className={`flex flex-row justify-between items-center mt-6 sm:mb-6 mb-[22.75px]`}
      >
        <h3 className="sm:text-[22.25px] xs:text-[20px] text-[18.75px] dark:text-gray-50 sm:font-bold font-semibold relative">
          <span>{title}</span>
          <div className="line" />
        </h3>
        {!showSimilarShows && (
          <Link to={`/${category}/${type}`} className={linkStyle}>
            모두보기
          </Link>
        )}
      </div>
      <div className="xs:min-h-[250px] min-h-[216px]">
        {isLoading1 ? (
          <SkelatonLoader />
        ) : isError1 ? (
          <Error
            error={String(errorMessage1)}
            className="xs:h-[250px] h-[216px] text-[18px]"
          />
        ) : (
          type === "top_reservation" && (
            <MoviesSlides
              movies={movieData}
              category={category}
              condition="now"
            />
          )
        )}
        {isLoading2 ? (
          <SkelatonLoader />
        ) : isError2 ? (
          <Error
            error={String(errorMessage2)}
            className="xs:h-[250px] h-[216px] text-[18px]"
          />
        ) : (
          type === "top_rated" && (
            <MoviesSlides
              movies={movieData2}
              category={category}
              condition="all"
            />
          )
        )}
        {isLoading3 ? (
          <SkelatonLoader />
        ) : isError3 ? (
          <Error
            error={String(errorMessage3)}
            className="xs:h-[250px] h-[216px] text-[18px]"
          />
        ) : (
          type === "actors_recommend" && (
            <MoviesSlides
              movies={movieData3}
              category={category}
              condition="all"
            />
          )
        )}
        {isLoading4 ? (
          <SkelatonLoader />
        ) : isError4 ? (
          <Error
            error={String(errorMessage4)}
            className="xs:h-[250px] h-[216px] text-[18px]"
          />
        ) : (
          type === "genre_recommend" && (
            <MoviesSlides
              movies={movieData4}
              category={category}
              condition="all"
            />
          )
        )}
      </div>
    </section>
  );
};

export default memo(Section);
