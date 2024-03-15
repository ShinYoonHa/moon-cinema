import React, { useEffect, useState } from "react";
import { m } from "framer-motion";
import { useLocation, useParams } from "react-router-dom";
import { BsPersonCircle, BsFillPencilFill, BsCheckLg } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { Poster, Loader, Error, MovieCard, SkelatonLoader } from "../../common";
import { Casts, Genre } from "./components";
import { mainHeading, maxWidth, paragraph } from "../../styles";
import { staggerContainer, fadeDown } from "../../utils/motion";
import { AiFillHeart } from "react-icons/ai";
import { Rating } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  call,
  call_var,
  commentDelete,
  commentInsert,
  commentUpdate,
  deleteWishList,
  getSimilarRecommendMovie,
  insertWishList,
} from "../../services/ApiService";
import { Swiper, SwiperSlide } from "swiper/react";
import { createBrowserHistory } from "history";

const Detail = () => {
  const { param } = useParams(); //App.jsx의 path에 ":변수명" 과 일치
  const { type } = useParams(); //App.jsx의 path에 ":변수명" 과 일치
  const location = useLocation();
  const movieId = location.state.MovieID;

  const [show, setShow] = useState(false);
  const [like, setLike] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(2.5);
  const [rating, setRating] = useState(2.5);
  const [recommendMovies, setRecommendMovies] = useState([]);
  const [recLoad, setRecLoad] = useState(true);
  const history = createBrowserHistory();

  useEffect(() => {
    const unlistenHistoryEvent = history.listen(({ action }) => {
      if (action === "POP") {
        window.location.reload();
      }
    });

    return unlistenHistoryEvent;
  }, []);

  useEffect(() => {
    call_var(`/WishListSelect/${localStorage.email}/${movieId}`, "GET")
      .then((response) => response.json())
      .then((data) => {
        setLike(data);
      });
  }, [movieId]);

  const {
    data: movieData,
    isError,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["movie"],
    queryFn: async () => {
      if (type === "now") {
        return await call(`/MovieSelectByTitle/${param}`, "GET");
      } else {
        return await call(`/MovieSelectByTitle/${param}`, "GET");
      }
    },
  });

  useEffect(() => {
    if (movieData) {
      setRecLoad(true); // 데이터를 불러오는 동안 recLoad를 true로 설정합니다.
      getSimilarRecommendMovie(movieData.result[0].Title)
        .then((response) => {
          setRecommendMovies(response);
          setRecLoad(false); // 데이터를 성공적으로 받아오면 recLoad를 false로 설정합니다.
        })
        .then(() => {
          setRecLoad(false);
        })
        .catch((error) => {
          console.log(error);
          setRecLoad(false); // 에러가 발생하면 recLoad를 false로 설정합니다.
        });
    }
  }, [movieData, movieId]);

  const {
    data: commentsData,
    isError: commentsError,
    isFetching: isFetchingComments,
    isLoading: isLoadingComments,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => await call(`/CommentSelectAllM/${param}`, "GET"),

    staleTime: 0,
  });

  const toggleShow = () => setShow((prev) => !prev);
  const toggleLike = () => {
    setLike(!like);

    if (like === false) {
      insertWishList({
        Email: localStorage.getItem("email"),
        MovieID: movieData.result[0].MovieID,
        Title: movieData.result[0].Title,
      });
    } else {
      deleteWishList({
        Email: localStorage.getItem("email"),
        MovieID: movieData.result[0].MovieID,
      });
    }
  };

  const handleRatingChange = (newValue) => {
    if (newValue !== null) {
      setRating(newValue);
    }
  };

  const queryClient = useQueryClient();

  const handleAdd = async (e) => {
    e.preventDefault();
    const reviewTextarea = document.getElementById("review");
    const commentContent = reviewTextarea.value;

    if (!commentContent.trim()) {
      return;
    }

    const commentData = {
      UserID: localStorage.getItem("userid"),
      MovieID: movieData.result[0].MovieID,
      Content: commentContent,
      Rating: rating * 2,
      Title: movieData.result[0].Title,
    };

    await commentInsert(commentData);
    queryClient.invalidateQueries(["comments", movieId]);

    reviewTextarea.value = "";
  };

  const handleEdit = (commentId) => {
    setEditingCommentId(commentId);
    const existingComment = commentsData.result.find(
      (comment) => comment.CommentID === commentId
    );
    setEditedComment(existingComment ? existingComment.Content : "");
    setEditedRating(existingComment ? existingComment.Rating / 2 : 2.5);
  };

  const handleSave = async (commentId) => {
    const editedData = {
      UserID: localStorage.getItem("userid"),
      MovieID: movieData.result[0].MovieID,
      CommentID: commentId,
      Content: editedComment,
      Rating: editedRating * 2,
    };

    await commentUpdate(editedData);
    queryClient.invalidateQueries(["comments", movieId]);

    setEditingCommentId(null);
    setEditedComment("");
    setEditedRating(2.5);
  };

  const handleDelete = async (commentId) => {
    await commentDelete(commentId);
    queryClient.invalidateQueries(["comments", movieId]);
  };

  if (isLoading || isFetching || isLoadingComments || isFetchingComments) {
    return <Loader />;
  }

  if (isError || commentsError) {
    return <Error error="Something went wrong!" />;
  }

  const {
    Actors,
    Director,
    Genre1: genre1,
    Genre2: genre2,
    ImgURL,
    Rating: rate,
    ReservationRate,
    Synopsis,
    Title,
  } = movieData.result[0];

  const backgroundStyle = {
    backgroundImage: `linear-gradient(to top, rgba(0,0,0), rgba(0,0,0,0.98),rgba(0,0,0,0.8) ,rgba(0,0,0,0.4)),url('https://image.tmdb.org/t/p/original/${ImgURL}'`,
    backgroundPosition: "top",
    backgroundSize: "cover",
  };

  return (
    <>
      <section className="w-full h-screen" style={backgroundStyle}>
        <div
          className={`${maxWidth} lg:py-36 sm:py-[136px] sm:pb-28 xs:py-28 xs:pb-12 pt-24 pb-8 flex flex-row lg:gap-12 md:gap-10 gap-8 justify-center `}
        >
          <Poster title={Title} posterPath={ImgURL} />

          <m.div
            variants={staggerContainer(0.2, 0.4)}
            initial="hidden"
            animate="show"
            className="text-gray-300 sm:max-w-[80vw] max-w-[90vw]  md:max-w-[500px] font-nunito flex flex-col lg:gap-5 sm:gap-4 xs:gap-[14px] gap-3 mb-8 flex-1"
          >
            <div className="flex flex-row">
              <m.h2
                variants={fadeDown}
                className={`${mainHeading} md:max-w-[500px]`}
              >
                {Title}
              </m.h2>
              <m.h2 variants={fadeDown}>
                <button>
                  <AiFillHeart
                    className="ml-5 mt-2"
                    size="25px"
                    color={like ? "red" : "white"}
                    onClick={toggleLike}
                  />
                </button>
              </m.h2>
            </div>

            <m.ul
              variants={fadeDown}
              className="flex flex-row items-center md:gap-4 sm:gap-[14px] xs:gap-3 gap-[6px] flex-wrap"
            >
              <m.li className="flex gap-1">
                <Genre name={genre1} />
                {genre2 && <Genre name={genre2} />}
              </m.li>
              {ReservationRate !== undefined && ReservationRate !== 0 && (
                <m.li>예매율 {ReservationRate}% </m.li>
              )}

              <m.li className="text-white">
                평점 {rate !== 0 ? rate : "미계수"}
              </m.li>
            </m.ul>

            <m.h3
              variants={fadeDown}
              className="text-secColor font-bold md:text-[15px] sm:text-[14.75px] xs:text-[13.75px] text-[12.75px]"
            >
              감독
            </m.h3>
            <m.figure
              variants={fadeDown}
              className="flex flex-col justify-start gap-2"
            >
              {Director}
            </m.figure>

            <m.h3
              variants={fadeDown}
              className="text-secColor font-bold md:text-[15px] sm:text-[14.75px] xs:text-[13.75px] text-[12.75px]"
            >
              주연 배우
            </m.h3>

            <Casts cast={Actors} />

            <m.h3
              variants={fadeDown}
              className="text-secColor font-bold md:text-[15px] sm:text-[14.75px] xs:text-[13.75px] text-[12.75px]"
            >
              줄거리
            </m.h3>

            <m.p variants={fadeDown} className={paragraph}>
              <span>
                {Synopsis.length > 250
                  ? `${show ? Synopsis : `${Synopsis.slice(0, 250)}...`}`
                  : Synopsis}
              </span>
              <button
                type="button"
                className={`${
                  Synopsis.length > 250 ? "inline-block" : "hidden"
                } font-bold ml-1 hover:underline transition-all duration-300`}
                onClick={toggleShow}
              >
                {!show ? "더보기" : "간략히"}
              </button>
            </m.p>
          </m.div>
        </div>
      </section>
      <div />

      <div className={`${maxWidth} lg:mt-8 md:mt-8 sm:mt-6 xs:mt-4 mt-2`}>
        <div className="text-3xl mb-2 dark:text-white">관련 영화</div>
        <div className="swiper swiper-horizontal swiper-pointer-events mySwiper">
          <div className="swiper-wrapper">
            {recLoad ? (
              <SkelatonLoader />
            ) : (
              <Swiper
                slidesPerView="auto"
                spaceBetween={15}
                className="mySwiper"
              >
                {recommendMovies.map((movie) => (
                  <SwiperSlide
                    key={movie.MovieID}
                    className="flex flex-col xs:gap-[14px] gap-2 max-w-[170px]  rounded-lg"
                  >
                    <MovieCard
                      movie={movie}
                      category="movie"
                      condition="recommend"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>

      <form className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-10 dark:text-white">
        <fieldset className="mb-4">
          <legend className="text-xl font-semibold mb-2">코멘트 작성</legend>
          <div className="flex items-center">
            <Rating
              name="half-rating"
              size="large"
              value={rating}
              precision={0.5}
              onChange={(event, newValue) => {
                handleRatingChange(newValue);
              }}
            />
            <p className="ml-2 mt-1 text-md text-gray-600 dark:text-white">
              {rating * 2}
            </p>
          </div>
        </fieldset>
        <div className="mb-4">
          <textarea
            className="w-full h-24 px-3 py-2 border rounded shadow appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="review"
            id="review"
            placeholder="코멘트를 입력해주세요."
          ></textarea>
        </div>
        <div className="mb-4">
          <button
            onClick={handleAdd}
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            등록
          </button>
        </div>
      </form>
      <section className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto py-4 dark:text-white">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          코멘트 {commentsData.result.length}
        </h2>
        <ul className="space-y-4">
          {commentsData.result.map((comment) => (
            <li key={comment.CommentID} className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BsPersonCircle className="mb-1 text-2xl mr-2" />
                  <p className="font-semibold text-lg text-gray-800 dark:text-white">
                    {comment.UserName}
                  </p>
                  {editingCommentId === comment.CommentID ? (
                    <Rating
                      className="ml-3"
                      name="half-rating"
                      size="large"
                      value={editedRating}
                      precision={0.5}
                      onChange={(event, newValue) => {
                        setEditedRating(newValue || 0);
                      }}
                    />
                  ) : (
                    <p className="ml-2 mt-1 font-semibold">
                      평점 : {comment.Rating}
                    </p>
                  )}
                  <p className="ml-4 mt-1.5 text-sm">
                    {new Date(comment.TimeStamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {editingCommentId === comment.CommentID ? (
                    <>
                      <button onClick={() => handleSave(comment.CommentID)}>
                        <BsCheckLg className="text-2xl hover:scale-125" />
                      </button>
                    </>
                  ) : (
                    comment.UserID ===
                      parseInt(localStorage.getItem("userid")) && (
                      <>
                        <button onClick={() => handleEdit(comment.CommentID)}>
                          <BsFillPencilFill className="text-lg hover:scale-125" />
                        </button>
                        <button onClick={() => handleDelete(comment.CommentID)}>
                          <AiFillDelete className="text-2xl hover:scale-125" />
                        </button>
                      </>
                    )
                  )}
                </div>
              </div>
              {editingCommentId === comment.CommentID ? (
                <textarea
                  className="m-2 p-2 dark:text-black border-2 rounded-md dark:border-0"
                  cols={70}
                  id="edited"
                  name="edited"
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                ></textarea>
              ) : (
                <p className="text-gray-600 mt-2 dark:text-white">
                  {comment.Content}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Detail;
