import { BiSolidUserCircle } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useState } from "react";
import { BsEyeSlash } from "react-icons/bs";
import { signin, resetPassword } from "../../../services/ApiService";

export default function Index() {
  const [showPassword, setShowPassword] = useState("password");
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");
  const [emailNotFound, setEmailNotFound] = useState(false);

  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) =>
      prevShowPassword === "password" ? "text" : "password"
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const email = data.get("email");
    const password = data.get("password");
    // ApiService의 signin 메소드를 사용해 로그인
    signin({ email: email, password: password });
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();

    const email = {
      Email: emailForReset,
    };

    resetPassword(email)
      .then(() => {
        setEmailNotFound(true);
        alert("이메일을 발송하였습니다.");
      })
      .catch(() => {
        setEmailNotFound(false);
        setResetModalOpen(false);
      });
  };

  return (
    <div className="flex h-screen justify-center items-center dark:text-white">
      <div className="w-10/12 border border-gray-300 p-4 rounded-lg">
        <div className="flex flex-col items-center">
          <BiSolidUserCircle color="#CA3A31" className="text-6xl" />
          <p className="mt-2 text-2xl font-bold">로그인</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-4 flex flex-col items-center">
            <div className="flex flex-row items-center">
              <div className="text-lg font-bold m-2">이메일</div>
              <input
                className="pl-5 text-gray-700 dark:text-white dark:bg-black border-2 border-red-500 rounded-lg "
                type="email"
                placeholder="이메일 입력"
                name="email"
                required
              />
            </div>
            <div className="flex flex-row items-center">
              <div className="text-lg font-bold m-2 -ml-5">패스워드</div>
              <input
                className="pl-5 text-gray-700 dark:text-white dark:bg-black
                  border-2 border-red-500 rounded-lg"
                type={showPassword}
                placeholder="패스워드 입력"
                name="password"
                required
              />
              <button
                className="-ml-6"
                type="button"
                onClick={handleShowPassword}
              >
                <BsEyeSlash />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <button
              type="submit"
              className="mt-4 dark:text-white hover:cursor-pointer bg-red-600 rounded-md
              p-2 w-1/2 font-bold max-w-[40%]   "
            >
              로그인
            </button>
          </div>
        </form>
        <div className="flex gap-2 items-center justify-center">
          <button
            onClick={() => setResetModalOpen(true)}
            className="mt-4 text-red-600 hover:cursor-pointer font-bold"
          >
            비밀번호 찾기
          </button>
          <p className="mt-4 text-red-600 hover:cursor-pointer font-bold">|</p>
          <Link
            to="/signup"
            className="mt-4 text-red-600 hover:cursor-pointer font-bold"
          >
            계정이 없습니까? 여기서 가입하세요
          </Link>
        </div>
      </div>

      {resetModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-4 rounded-md">
            <h2 className="text-lg font-semibold mb-4 dark:text-black">
              비밀번호 재설정
            </h2>
            <form onSubmit={handleResetSubmit}>
              <div className="flex items-center dark:text-black">
                <label className="text-lg font-bold my-2 mr-2">이메일</label>
                <input
                  className={`pl-2 py-1 text-gray-700 dark:text-black dark:bg-white border-2 rounded-lg ${
                    emailNotFound ? "border-red-500" : ""
                  }`}
                  type="email"
                  placeholder="이메일 입력"
                  value={emailForReset}
                  onChange={(e) => {
                    setEmailForReset(e.target.value);
                    setEmailNotFound(false); // Clear the error when the user modifies the email
                  }}
                  required
                />
              </div>
              {emailNotFound && (
                <p className="text-red-500 text-sm mt-2">
                  이메일이 존재하지 않습니다.
                </p>
              )}
              <div className="flex items-center justify-between mt-4">
                <button
                  type="submit"
                  className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:shadow-outline"
                >
                  전송
                </button>
                <button
                  onClick={() => setResetModalOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  닫기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
