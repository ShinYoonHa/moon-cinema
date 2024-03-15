import { useState } from "react";
import { BsEyeSlash } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../../services/ApiService";

export default function Index() {
  const [showPassword, setShowPassword] = useState("password");
  const [loading, setLoading] = useState(false); // New state for loading
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) =>
      prevShowPassword === "password" ? "text" : "password"
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true); // Set loading to true when the signup process starts

    const data = new FormData(event.target);
    const email = data.get("email");
    const password = data.get("password");
    const username = data.get("username");
    const age = data.get("age");
    const gender = data.get("gender");
    const actors = data.get("actors");
    const genre1 = data.get("genre1");
    const genre2 = data.get("genre2");

    signup({
      email: email,
      password: password,
      username: username,
      age: age,
      gender: gender,
      actors: actors,
      genre1: genre1,
      genre2: genre2,
    })
      .then((response) => {
        setLoading(false); // Set loading to false when the signup is successful
        alert("인증메일을 전송하였습니다.");
        navigate("/login");
      })
      .catch((error) => {
        setLoading(false); // Set loading to false when there's an error
        if (error.error === "Duplicated Email") {
          alert("이미 등록된 이메일입니다.");
        }
      });
  };
  //
  var options = (
    <>
      <option value="없음">없음</option>
      <option value="액션">액션</option>
      <option value="어드벤쳐">어드벤쳐</option>
      <option value="애니메이션">애니메이션</option>
      <option value="코미디">코미디</option>
      <option value="범죄">범죄</option>
      <option value="다큐멘터리">다큐멘터리</option>
      <option value="드라마">드라마</option>
      <option value="가족">가족</option>
      <option value="판타지">판타지</option>
      <option value="역사">역사</option>
      <option value="공포">공포</option>
      <option value="음악">음악</option>
      <option value="미스터리">미스터리</option>
      <option value="로맨스">로맨스</option>
      <option value="SF">SF</option>
      <option value="TV영화">TV영화</option>
      <option value="스릴러">스릴러</option>
      <option value="전쟁">전쟁</option>
      <option value="서부극">서부극</option>
    </>
  );

  return (
    <div className="flex h-screen justify-center items-center dark:text-white mt-4">
      <div className="w-10/12 border border-gray-300 p-4 rounded-lg">
        <div className="flex flex-col items-center">
          <FaUserPlus color="#CA3A31" className="text-6xl ml-4" />
          <p className="mt-2 text-2xl font-bold">회원가입</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-4 flex flex-col items-center">
            <div className="flex flex-row items-center">
              <div className="text-lg font-bold m-2">이메일</div>
              <input
                className="pl-2 text-gray-700 border-red-600 dark:text-white dark:bg-black border-2 rounded-lg "
                type="email"
                placeholder="이메일 입력"
                required
                name="email"
              />
            </div>
            <div className="flex flex-row items-center">
              <div className="text-lg font-bold m-2 -ml-5">패스워드</div>
              <input
                className="pl-2 text-gray-700 border-red-600 dark:text-white dark:bg-black border-2 rounded-lg"
                type={showPassword}
                placeholder="패스워드 입력"
                name="password"
              />
              <button
                className="-ml-6"
                type="button"
                onClick={handleShowPassword}
              >
                <BsEyeSlash />
              </button>
            </div>
            <div className="flex flex-row items-center">
              <div className="text-lg font-bold m-2 ml-6">성명</div>
              <input
                className="pl-2 text-gray-700 border-red-600 dark:text-white dark:bg-black
                  border-2 rounded-lg"
                type="text"
                required
                placeholder="이름 입력"
                name="username"
              />
            </div>
            <div className="flex flex-row items-center">
              <div className="text-lg font-bold m-2 -ml-10">성별</div>
              <div className="flex items-center rounded">
                <input
                  id="manRadio"
                  className="peer/manRadio w-6 h-5 accent-red-500"
                  type="radio"
                  name="gender"
                  value="1"
                  defaultChecked
                />
                <label
                  htmlFor="manRadio"
                  className="peer-checked/manRadio:text-red-500 pl-2 peer-checked/manRadio:font-bold"
                >
                  남자
                </label>
              </div>

              <div className="flex items-center pl-4 rounded">
                <input
                  id="womanRadio"
                  className="peer/womanRadio w-6 h-5 accent-red-500 "
                  type="radio"
                  name="gender"
                  value="2"
                />
                <label
                  htmlFor="womanRadio"
                  className="peer-checked/womanRadio:text-red-500 pl-2 peer-checked/womanRadio:font-bold"
                >
                  여자
                </label>
              </div>
            </div>
            <div className="flex flex-row items-center">
              <div className="text-lg font-bold m-2 ml-4">나이</div>
              <input
                className="pl-2 text-gray-700 border-red-600 dark:text-white dark:bg-black border-2 rounded-lg"
                type="text"
                placeholder="나이 입력"
                required
                name="age"
              />
            </div>
            <div className="flex flex-row items-center">
              <div className="text-lg font-bold m-2 -ml-8">선호 장르</div>
              <select
                className="pl-2 dark:text-white dark:bg-black
                border-2 border-red-500 rounded-lg w-24"
                name="genre1"
              >
                {options}
              </select>
              &nbsp;
              <select
                className="pl-2 dark:text-white dark:bg-black border-2 border-red-500 rounded-lg w-24"
                name="genre2"
              >
                {options}
              </select>
            </div>
            <div className="flex flex-row items-center">
              <div className="text-lg font-bold m-2 -ml-6">선호 배우</div>
              <input
                className="pl-2 text-gray-700 border-red-600 dark:text-white dark:bg-black border-2 rounded-lg"
                type="text"
                placeholder="선호 배우 입력"
                required
                name="actors"
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <button
              type="submit"
              className="mt-4 dark:text-white hover:cursor-pointer bg-red-600 rounded-md
              p-2 w-1/2 font-bold max-w-[40%] "
              disabled={loading} // Disable the button when loading is true
            >
              {loading ? "이메일 전송 중..." : "회원가입"}
            </button>
            <Link
              to="/login"
              className="mt-4 text-red-600 hover:cursor-pointer font-bold"
            >
              계정이 이미 있습니까? 여기서 로그인하세요
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
