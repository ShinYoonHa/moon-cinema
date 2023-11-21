import { Swiper, SwiperSlide } from "swiper/react";
import MovieCard from "../MovieCard";

const MoviesSlides = ({ movies, category, condition }) => {
  return (
    <Swiper slidesPerView="auto" spaceBetween={15} className="mySwiper">
      {Array.isArray(movies?.result) && movies.result.length > 0 ? (
        movies.result.map((movie) => (
          <SwiperSlide
            key={movie.MovieID}
            className="flex flex-col xs:gap-[14px] gap-2 max-w-[170px]  rounded-lg"
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
  );
};

export default MoviesSlides;
