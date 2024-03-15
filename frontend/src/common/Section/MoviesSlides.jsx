import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import MovieCard from "../MovieCard";

const MoviesSlides = ({ movies, category, condition, nextPage, prevPage }) => {
  return (
    <div className="flex flex-row items-center">
      <button onClick={prevPage}>
        <IoIosArrowBack className="dark:text-white text-5xl mb-[100%] hover:scale-110 pr-2" />
      </button>
      <Swiper slidesPerView="auto" spaceBetween={15} className="mySwiper">
        {Array.isArray(movies?.result) && movies.result.length > 0 ? (
          movies.result.map((movie) => (
            <SwiperSlide
              key={movie.MovieID}
              className="flex flex-col xs:gap-[14px] gap-2 max-w-[170px] rounded-lg"
            >
              <MovieCard
                movie={movie}
                category={category}
                condition={condition}
              />
            </SwiperSlide>
          ))
        ) : (
          <p className="dark:text-white">No movies to display.</p>
        )}
      </Swiper>

      <button onClick={nextPage}>
        <IoIosArrowForward className="dark:text-white text-5xl mb-[100%] hover:scale-110 pl-2" />
      </button>
    </div>
  );
};

export default MoviesSlides;
