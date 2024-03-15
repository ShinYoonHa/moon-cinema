import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsPersonCircle, BsFillPencilFill } from "react-icons/bs";
import Modal from "react-modal";
import { getUserInfo, remove, signout } from "../../services/ApiService";

Modal.setAppElement("#root");

export default function Index() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    // 페이지가 처음 렌더링될 때 실행되는 부분
    getUserInfo({
      email: localStorage.getItem("email"),
    }) // getUserInfo 함수를 호출하여 사용자 정보를 받아옵니다.
      .then((response) => {
        // 받아온 사용자 정보를 상태에 저장합니다.
        setUserInfo(response.result);
      })
      .catch((error) => {
        // 에러가 발생할 경우 처리
        console.error("사용자 정보를 불러오는 중 에러 발생:", error);
      });
  }, []);
  const handleRemove = () => {
    setShowModal(true);
  };

  const confirmRemove = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const password = data.get("password");
    //ApiService의 회원탈퇴 함수 호출
    remove({
      email: localStorage.getItem("email"),
      password: password,
    }).then((response) => {
      //홈 화면으로 이동
      navigate("/");
    });
  };
  return (
    <div className="flex flex-col h-screen justify-center items-center dark:text-white">
      <div className="mt-12 w-8/12 border border-gray-300 p-4 rounded-lg">
        <div className="flex flex-col items-center">
          <div className="flex justify-end w-full">
            <Link to="/edit" className="text-2xl">
              <BsFillPencilFill />
            </Link>
          </div>
          <BsPersonCircle className="text-6xl" />
          <p className="mt-2 text-2xl font-bold">{userInfo.UserName}</p>
          <p className="text-lg text-gray-500">{userInfo.Email}</p>
        </div>
        <div className="flex justify-between mt-4 pt-2 border-t-2 px-4">
          <Link
            to="/wishlist"
            className="p-2 w-full mx-2 border-b-2 border-transparent hover:border-red-500"
          >
            <div className="flex flex-col items-center">
              <p className="text-gray-600 dark:text-white">찜</p>
            </div>
          </Link>
          <Link
            to="/comment"
            className="p-2 w-full mx-2 border-b-2 border-transparent hover:border-red-500"
          >
            <div className="flex flex-col items-center">
              <p className="text-gray-600 dark:text-white">코멘트</p>
            </div>
          </Link>
          <Link
            to="/watchhistory"
            className="p-2 w-full mx-2 border-b-2 border-transparent hover:border-red-500"
          >
            <div className="flex flex-col items-center">
              <p className="text-gray-600 dark:text-white text-center">
                살펴본 영화
              </p>
            </div>
          </Link>
        </div>
        <div className="my-4">
          <div className="text-lg font-bold mb-2">선호 배우</div>
          <ul className="list-disc list-inside pl-5 text-gray-700 dark:text-white">
            <li>{userInfo.Actors}</li>
          </ul>
          <div className="text-lg font-bold mt-4 mb-2">선호 장르</div>
          <ul className="list-disc list-inside pl-5 text-gray-700 dark:text-white">
            <li>{userInfo.Genre1}</li>
            <li>{userInfo.Genre2}</li>
          </ul>
        </div>
        <div className="flex flex-col items-start border-t-2">
          <button
            onClick={() => signout(localStorage.ACCESS_TOKEN)}
            className="mt-4 hover:cursor-pointer"
          >
            로그아웃
          </button>
          <button
            onClick={handleRemove}
            className="mt-4 text-red-600 hover:cursor-pointer"
          >
            탈퇴하기
          </button>
          <Modal
            className="flex items-center justify-center w-full h-full bg-gray-900 bg-opacity-50"
            isOpen={showModal}
            onRequestClose={() => setShowModal(false)}
            contentLabel="탈퇴 확인"
          >
            <div className="bg-white rounded-lg w-1/3 py-2 min-w-min">
              <div className="flex flex-col items-start p-4">
                <div className="flex flex-col items-center w-full">
                  <div className="text-gray-900 font-bold text-lg w-full text-center">
                    정말 탈퇴하시겠습니까?
                  </div>
                  <form noValidate onSubmit={confirmRemove} id="form1">
                    <div className="flex justify-center">
                      <input
                        className="border-2 border-black pl-2 py-1 mt-2"
                        placeholder="비밀번호 확인"
                        type="password"
                        name="password"
                      ></input>
                    </div>
                    <div className="flex justify-center gap-5 items-center w-full mt-4">
                      <button
                        form="form1"
                        type="submit"
                        className="w-28 mr-2 px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
                      >
                        확인
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        className="w-28 px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded hover:bg-gray-600"
                      >
                        취소
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}
