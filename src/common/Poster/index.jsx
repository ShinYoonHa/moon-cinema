import { memo } from "react";
import { m } from "framer-motion";

import Image from "../Image";
import { zoomIn } from "../../utils/motion";
//
const Poster = ({ posterPath, title, className }) => {
  return (
    <m.div
      variants={zoomIn(0.6, 0.8)}
      initial="hidden"
      animate="show"
      className={`${className} md:block hidden h-[380px] w-[254px]`}
    >
      <Image
        width={254}
        height={380}
        src={`https://image.tmdb.org/t/p/original/${posterPath}`}
        alt={title}
        className="h-[430px] w-[270px] object-cover rounded-xl  shadow-lg transition-all duration-300"
      />
    </m.div>
  );
};

export default memo(Poster);
