import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { MovieCard } from "../../common";
import { CatalogHeader, Search } from "../Catalog/components";

import { smallMaxWidth } from "../../styles";
import { call, getWishList } from "../../services/ApiService";
import { BiSolidTrash } from "react-icons/bi";

const WishList = () => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useSearchParams();
  const { category } = useParams();

  const [wishList, setWishList] = useState([]);

  const searchQuery = query.get("search") || "";

  useEffect(() => {
    getWishList({ Email: localStorage.email }).then((response) => {
      setWishList(response.result);
    });
  }, [wishList]);

  useEffect(() => {
    setPage(1);
  }, [category, searchQuery]);

  function deleteMovie(index) {
    const MovieID = wishList[index].MovieID;
    call(`/WishListDelete/${localStorage.email}/${MovieID}`, "DELETE");
  }

  return (
    <>
      <CatalogHeader category="wishlist" />
      <section className={`${smallMaxWidth} h-screen`}>
        <Search setQuery={setQuery} />

        <div className="flex flex-wrap xs:gap-4 gap-[14px] justify-center">
          {wishList?.map((movie, index) => (
            <div
              key={index}
              className="flex flex-col xs:gap-4 gap-2 xs:max-w-[170px] max-w-[124px] rounded-lg lg:mb-6 md:mb-5 sm:mb-4 mb-[10px]"
            >
              <div
                className="absolute ml-36 mt-1 z-10 select-text opacity-90 bg-white rounded-full

"
              >
                <button
                  type="button"
                  onClick={() => deleteMovie(index)}
                  className="relative z-10 m-1"
                >
                  <BiSolidTrash className="text-gray-500 hover:text-rose-500" />
                </button>
              </div>
              <MovieCard movie={movie} category="wishlist" />
            </div>
          ))}
        </div>

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
      </section>
    </>
  );
};

export default WishList;
