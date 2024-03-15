import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { Header, SideBar, VideoModal, ScrollToTop, Loader } from "./common";

import "react-loading-skeleton/dist/skeleton.css";
import "swiper/css";

const Catalog = lazy(() => import("./pages/Catalog"));
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Signup = lazy(() => import("./pages/Auth/Signup"));
const MyPage = lazy(() => import("./pages/MyPage"));
const Edit = lazy(() => import("./pages/Edit"));
const MyComment = lazy(() => import("./pages/MyComment"));
const WishList = lazy(() => import("./pages/WishList"));
const WatchHistory = lazy(() => import("./pages/WatchHistory"));
const Detail = lazy(() => import("./pages/Detail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  return (
    <>
      <VideoModal />
      <SideBar />
      <Header />
      <main className="dark:bg-black bg-mainColor lg:pb-14 md:pb-4 sm:pb-2 xs:pb-1 pb-0">
        <ScrollToTop>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login/*" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="*" element={<NotFound />} />
              <Route path="/:category/:type/:param" element={<Detail />} />
              <Route path="/:category/:option" element={<Catalog />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/edit" element={<Edit />} />
              <Route path="/comment" element={<MyComment />} />
              <Route path="/wishlist" element={<WishList />} />
              <Route path="/watchhistory" element={<WatchHistory />} />
            </Routes>
          </Suspense>
        </ScrollToTop>
      </main>
    </>
  );
};

export default App;
