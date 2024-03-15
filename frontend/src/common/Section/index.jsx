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

  //페이지 숫자와 사이즈
  const pageSize = 10;
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [page3, setPage3] = useState(1);
  const [page4, setPage4] = useState(1);

  const isLoggedIn = !!localStorage.getItem("ACCESS_TOKEN");

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
    refetch: refetch1,
  } = useQuery({
    queryKey: ["movies", page1, pageSize],
    queryFn: () =>
      call(
        `/NowMovieSelectDESCReserveRate?page=${page1}&pageSize=${pageSize}`,
        "GET"
      ),
  });

  //높은 평점 순///////////////////////////////////////////////////////////////////////
  const {
    data: movieData2,
    isLoading: isLoading2,
    isError: isError2,
    error: error2,
    refetch: refetch2,
  } = useQuery({
    queryKey: ["movies2", page2, pageSize],
    queryFn: () =>
      call(`/MovieSelectDESCRating?page=${page2}&pageSize=${pageSize}`, "GET"),
  });
  /////////////////////////////////////////////////////////////////////////////////////////

  const {
    data: movieData3,
    isLoading: isLoading3,
    isError: isError3,
    error: error3,
    refetch: refetch3,
  } = useQuery({
    queryKey: ["movies3", page3, pageSize],
    queryFn: () =>
      call(
        `/MovieSelectByActor/${userInfo.Actors}?page=${page2}&pageSize=${pageSize}`,
        "GET"
      ),
    enabled: isLoggedIn && userInfoLoaded,
  });

  ////////////////////////////////////////////////////////////////////////////////////////
  const {
    data: movieData4,
    isLoading: isLoading4,
    isError: isError4,
    error: error4,
    refetch: refetch4,
  } = useQuery({
    queryKey: ["movies4", page4, pageSize],
    queryFn: () =>
      call(
        `/MovieSelectByGenre/${userInfo.Genre1}/${userInfo.Genre2}?page=${page4}&pageSize=${pageSize}`,
        "GET"
      ).then((response) => {
        return response;
      }),
    enabled: isLoggedIn && userInfoLoaded,
  });
  /////////////////////////////////////////////////////////////////////////////////////////
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

  /////////////////////////////////////////////////////////////////////////////////////
  // 페이지 증가/감소 함수
  const nextPage1 = () => {
    setPage1((prevPage1) => prevPage1 + 1);
    refetch1();
  };

  const prevPage1 = () => {
    setPage1((prevPage1) => Math.max(prevPage1 - 1, 1)); // 페이지 번호가 1 이하가 되지 않게
    refetch1();
  };
  ////
  const nextPage2 = () => {
    setPage2((prevPage2) => prevPage2 + 1);
    refetch2();
  };

  const prevPage2 = () => {
    setPage2((prevPage2) => Math.max(prevPage2 - 1, 1)); // 페이지 번호가 1 이하가 되지 않게
    refetch2();
  };
  ////
  const nextPage3 = () => {
    setPage3((prevPage3) => prevPage3 + 1);
    refetch3();
  };

  const prevPage3 = () => {
    setPage3((prevPage3) => Math.max(prevPage3 - 1, 1)); // 페이지 번호가 1 이하가 되지 않게
    refetch3();
  };
  ////
  const nextPage4 = () => {
    setPage4((prevPage4) => prevPage4 + 1);
    refetch4();
  };

  const prevPage4 = () => {
    setPage4((prevPage4) => Math.max(prevPage4 - 1, 1)); // 페이지 번호가 1 이하가 되지 않게
    refetch4();
  };
  ////
  /////////////////////////////////////////////////////////////////////////////////////////////////////

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
        className={`px-12 flex flex-row justify-between items-center mt-6 sm:mb-6 mb-[22.75px]`}
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
              nextPage={nextPage1}
              prevPage={prevPage1}
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
              nextPage={nextPage2}
              prevPage={prevPage2}
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
              nextPage={nextPage3}
              prevPage={prevPage3}
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
              nextPage={nextPage4}
              prevPage={prevPage4}
            />
          )
        )}
      </div>
    </section>
  );
};

export default memo(Section);
