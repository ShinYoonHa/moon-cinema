import React from "react";
import { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
//
const Image = ({
  src,
  className,
  width,
  alt,
  height,
  zoomInEffect = false,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <LazyLoadImage
      src={src}
      alt={alt}
      height={height}
      width={width}
      className={`${
        !isImageLoaded
          ? `opacity-0 ${zoomInEffect ? "scale-95" : ""}`
          : `opacity-100 ${zoomInEffect ? "scale-100" : ""}`
      } ${className}`}
      afterLoad={handleLoad}
    />
  );
};

export default Image;
