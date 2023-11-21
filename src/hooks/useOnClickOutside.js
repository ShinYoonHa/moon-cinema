import { useEffect, useRef } from "react";

export const useOnClickOutside = (action, listenCapturing = true) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        e.stopPropagation();
        action();
      }
    };
    //
    document.addEventListener("click", handleClick, listenCapturing);

    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [action, listenCapturing]);

  return { ref };
};
