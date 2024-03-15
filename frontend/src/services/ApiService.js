import { API_BASE_URL } from "../app-config";

export async function call(api, method, request) {
  let headers = new Headers({
    "Content-Type": "application/json",
  });
  const accessToken = localStorage.getItem("ACCESS_TOKEN");

  if (accessToken) {
    headers.append("Authorization", "Bearer " + accessToken);
  }

  let options = {
    headers: headers,
    url: API_BASE_URL + api,
    method: method,
  };

  if (request) {
    options.body = JSON.stringify(request);
  }
  return fetch(options.url, options)
    .then((response) =>
      response.json().then((json) => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        return json;
      })
    )
    .catch((error) => {
      console.log(error);
      if (error.status === 403) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    });
}

export function call_var(api, method, request) {
  let headers = new Headers({
    "Content-Type": "application/json",
  });

  const accessToken = localStorage.getItem("ACCESS_TOKEN");
  if (accessToken) {
    headers.append("Authorization", "Bearer " + accessToken);
  }

  let options = {
    headers: headers,
    url: API_BASE_URL + api,
    method: method,
  };

  if (method === "PUT" || method === "POST") {
    options.body = JSON.stringify(request);
  }

  return fetch(options.url, options);
}

//회원 가입
export async function signup(userDTO) {
  //백엔드 API 엔드포인트를 사용해서 회원가입 정보를 보내도록 설정
  return call("/auth/signup", "POST", userDTO)
    .then((response) => {
      if (response.id) {
        window.location.href = "/"; //가입 시 홈화면으로 이동
      }
    })
    .catch((error) => {
      console.log("signup 함수 에러");
      if (error.status === 403) {
        //권한에 맞지않는 접근
        window.location.href = "/auth/signup"; //회원가입 페이지로 이동
      }
      return Promise.reject(error);
    });
}

//회원 정보 수정
export async function edit(userDTO) {
  //info edit
  return call_var("/auth/edit", "PUT", userDTO).then(() => {
    //로컬 스토리지에 토큰 삭제
    localStorage.removeItem("ACCESS_TOKEN");
    //로컬 스토리지에 email 삭제
    localStorage.removeItem("email");
    //로컬 스토리지에 userid 삭제
    localStorage.removeItem("userid");
    window.location.href = "/";
  });
}

//회원 탈퇴
export async function remove(userDTO) {
  return call("/auth/remove", "POST", userDTO).then((response) => {
    //로컬 스토리지에 토큰 삭제
    localStorage.removeItem("ACCESS_TOKEN");
    //로컬 스토리지에 email 삭제
    localStorage.removeItem("email");
    //로컬 스토리지에 userid 삭제
    localStorage.removeItem("userid");
    if (response.id) {
      window.location.href = "/";
    }
  });
}

//로그인
export async function signin(userDTO) {
  return call("/auth/signin", "POST", userDTO)
    .then((response) => {
      if (response.accessToken) {
        //로컬 스토리지에 토큰 저장
        localStorage.setItem("ACCESS_TOKEN", response.accessToken);
        //로컬 스토리지에 email 저장
        localStorage.setItem("email", response.email);
        //로컬 스토리지에 userId 저장
        localStorage.setItem("userid", response.userId);
        window.location.href = "/";
      }
    })
    .catch((e) => {
      if (e.error === "Login failed") {
        console.log(e);
        window.location.href = "/login";
      }
    });
}
//로그아웃
export function signout(token) {
  call("/auth/signout", "POST", token)
    .then(() => {
      //로컬 스토리지에 토큰 삭제
      localStorage.removeItem("ACCESS_TOKEN");
      //로컬 스토리지에 email 삭제
      localStorage.removeItem("email");
      //로컬 스토리지에 userid 삭제
      localStorage.removeItem("userid");

      window.location.href = "/";
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function resetPassword(email) {
  const resetEndpoint = "/auth/forgot";

  return call_var(resetEndpoint, "POST", email)
    .then((response) => {
      if (response.ok) {
        window.location.href = "/login";
      }
    })
    .catch(console.error);
}

// 사용자 정보 가져오기
export async function getUserInfo(userDTO) {
  // 백엔드 API 엔드포인트를 사용해서 사용자 정보를 가져오도록 설정
  const apiEndpoint = `/UserSelect/${userDTO.email}`;
  // 사용자 정보를 가져오는 GET 요청 설정
  return call_var(apiEndpoint, "GET")
    .then((response) => {
      return response.json(); // 반환된 response를 json 형태로 변환
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      return Promise.reject(error);
    });
}

//살펴본 영화
export async function insertHistory(info) {
  // 사용자 정보를 가져오는 GET 요청 설정
  return call_var("/W_HistoryInsertOrUpdate", "POST", info)
    .then((response) => {
      return response.json(); // 반환된 데이터를 처리하거나 사용합니다.
    })
    .then((data) => {
      return data; // 반환된 데이터를 처리하거나 사용합니다.
    })
    .catch((error) => {
      console.error("살펴본 영화에 등록 중 오류 발생:", error);
      return Promise.reject(error);
    });
}

//살펴본 영화 get
export async function getHistory(req) {
  // 사용자 정보를 가져오는 GET 요청 설정
  return call_var(`/W_HistorySelectAllU/${req.Email}`, "GET", req)
    .then((response) => {
      return response.json(); // 반환된 데이터를 처리하거나 사용합니다.
    })
    .then((data) => {
      return data; // 반환된 데이터를 처리하거나 사용합니다.
    })
    .catch((error) => {
      console.error("살펴본 영화를 가져올 때 오류 발생:", error);
      return Promise.reject(error);
    });
}

export async function commentInsert(commentData) {
  try {
    const response = await call_var("/CommentInsert", "POST", commentData);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error while inserting comment:", error);
    return Promise.reject(error);
  }
}

export async function commentDelete(commentID) {
  return call_var(`/CommentDelete/${commentID}`, "DELETE")
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error while deleting comment:", error);
      return Promise.reject(error);
    });
}

export async function commentUpdate(commentData) {
  return call_var("/CommentUpdate", "PUT", commentData)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error while updating comment:", error);
      return Promise.reject(error);
    });
}

export async function getMyComments(userID) {
  return call_var(`/CommentSelectAllU/${userID}`, "GET")
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error while fetching comments for a user:", error);
      return Promise.reject(error);
    });
}
//상세 페이지(Detail)에서 찜 등록
export async function insertWishList(data) {
  return call_var(`/WishListInsert`, "POST", data)
    .then((response) => {
      response.json();
    })

    .catch((error) => {
      console.log("Error while Inserting WhishList", error);
      return Promise.reject(error);
    });
}

//상세 페이지(Detail)에서 찜 취소
export async function deleteWishList(data) {
  return call_var(
    `/WishListDelete/${data.Email}/${data.MovieID}`,
    "DELETE"
  ).catch((error) => {
    console.log("Error while Deleting WhishList", error);
    return Promise.reject(error);
  });
}

//마이페이지 - 찜 리스트 Get
export async function getWishList(req) {
  // 사용자 정보를 가져오는 GET 요청 설정
  return call_var(`/WishListSelectAllU/${req.Email}`, "GET", req)
    .then((response) => {
      return response.json(); // 반환된 데이터를 처리하거나 사용합니다.
    })
    .catch((error) => {
      console.error("Error while Selecting WatchHistory:", error);
      return Promise.reject(error);
    });
}
// 높은 평점 순 영화 조회 (모든 영화)
export async function getTopRatedMovie(page, pageSize) {
  return call_var(
    `/MovieSelectDESCRating?page=${page}&pageSize=${pageSize}`,
    "GET"
  )
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Error while Selecting DESC Rating:", error);
      return Promise.reject(error);
    });
}
// 높은 예매율 순 영화 조회 (현재 상영작)
export async function getTopReservationMovie(page, pageSize) {
  return call_var(
    `/NowMovieSelectDESCReserveRate?page=${page}&pageSize=${pageSize}`
  )
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Error while Selecting DESCReserveRate:", error);
      return Promise.reject(error);
    });
}
// 선호 장르 영화 조회 (모든 영화)
export async function getGenreRecommendMovie(genre1, genre2, page, pageSize) {
  return call_var(
    `/MovieSelectByGenre/${genre1}/${genre2}?page=${page}&pageSize=${pageSize}`,
    "GET"
  )
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Error while Selecting MovieSelectByGenre:", error);
      return Promise.reject(error);
    });
}

// 선호 배우 출연작 조회 (모든 영화)
export async function getActorRecommendMovie(actor, page, pageSize) {
  return call_var(
    `/MovieSelectByActor/${actor}?page=${page}&pageSize=${pageSize}`,
    "GET"
  )
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Error while Selecting MovieSelectByActor:", error);
      return Promise.reject(error);
    });
}

export async function getSearchedMovies(title) {
  return call_var(`/MovieSelect/${title}`, "GET")
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      console.error("Error while Selecting MovieSelectByActor:", error);
      return Promise.reject(error);
    });
}

// 비슷한 줄거리 추천영화 조회
export async function getSimilarRecommendMovie(info) {
  return call(`/recommend/${info}`, "GET")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error while Selecting getSimilarRecommendMovie:", error);
      return Promise.reject(error);
    });
}
