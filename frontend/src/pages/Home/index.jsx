import { Section } from "../../common";
import React, { useEffect, useState, useMemo } from "react";
import { maxWidth } from "../../styles";
import { getUserInfo } from "../../services/ApiService";

const Home = () => {
  const [userInfo, setUserInfo] = useState({});
  const isLoggedIn = !!localStorage.getItem("ACCESS_TOKEN");

  const sections = useMemo(() => {
    const baseSections = [
      {
        title: "높은 평점 순",
        category: "movie",
        type: "top_rated",
      },
      {
        title: "높은 예매율 순",
        category: "movie",
        type: "top_reservation",
      },
    ];

    if (isLoggedIn) {
      baseSections.push(
        {
          title: `${userInfo.Genre1}, ${userInfo.Genre2} 장르`,
          category: "movie",
          type: "genre_recommend",
        },
        {
          title: `${userInfo.Actors} 출연작`,
          category: "movie",
          type: "actors_recommend",
        }
      );
    }

    return baseSections;
  }, [isLoggedIn, userInfo]);

  const filteredSections = useMemo(() => {
    return sections.filter((section) => {
      if (isLoggedIn) {
        return true;
      } else {
        return (
          section.title === "높은 평점 순" || section.title === "높은 예매율 순"
        );
      }
    });
  }, [isLoggedIn, sections]);

  useEffect(() => {
    if (isLoggedIn) {
      getUserInfo({
        email: localStorage.getItem("email"),
      })
        .then((response) => {
          setUserInfo(response.result);
        })
        .catch((error) => {
          console.error("사용자 정보를 불러오는 중 에러 발생:", error);
        });
    }
  }, [isLoggedIn]);

  return (
    <>
      <div
        className={`${maxWidth} lg:mt-12 md:mt-8 sm:mt-6 xs:mt-4 mt-2 h-screen`}
      >
        {filteredSections.map(({ title, category, type }) => (
          <Section title={title} category={category} type={type} key={title} />
        ))}
      </div>
    </>
  );
};

export default Home;
