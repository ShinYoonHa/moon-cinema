import bgImg from "./../../../assets/images/footer-bg.webp";

const CatalogHeader = ({ category }) => {
  let categoryText;

  if (category === "movie") {
    categoryText = "movie";
  } else if (category === "wishlist") {
    categoryText = "찜한 영화";
  } else if (category === "watchhistory") {
    categoryText = "살펴본 영화";
  } else if (category === "top_rated") {
    categoryText = "높은 평점 순";
  } else if (category === "top_reservation") {
    categoryText = "높은 예매율 순";
  } else if (category === "genre_recommend") {
    categoryText = "선호 장르";
    //추후 사용자 맞춤 장르로 변경
  } else if (category === "actors_recommend") {
    categoryText = "선호 배우 출연작";
    //추후 사용자 선호 배우로 변경
  }
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.075), rgba(0,0,0,0.075)), url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="lg:h-[140px] md:h-[132px] sm:h-[114px] h-[96px] relative"
    >
      <h2 className="text-white font-nunito capitalize font-semibold md:text-xl sm:text-lg absolute md:top-[70%] sm:top-[65%] xs:top-[60%] top-[57.75%]  left-1/2 -translate-x-1/2  ">
        {categoryText}
      </h2>
    </div>
  );
}; //

export default CatalogHeader;
