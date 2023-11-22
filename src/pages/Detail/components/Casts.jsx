import { memo } from "react";
import { m } from "framer-motion";

import { fadeDown, staggerContainer } from "../../../utils/motion";
//
const Casts = ({ cast }) => {
  return (
    <m.div
      variants={staggerContainer(0.2, 1)}
      initial="hidden"
      animate="show"
      className="flex flex-wrap md:gap-4 sm:gap-[14px] gap-2  sm:-mt-2 xs:-mt-[6px] -mt-1"
    >
      <m.figure
        variants={fadeDown}
        className="flex flex-col justify-start gap-2"
      >
        <h4>{cast}</h4>
      </m.figure>
    </m.div>
  );
};

export default memo(Casts, (prevProps, newProps) => {
  return prevProps.cast[0].id === newProps.cast[0].id;
});
