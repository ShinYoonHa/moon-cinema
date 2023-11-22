import { useState } from "react";
import { BsCheckLg, BsFillPencilFill } from "react-icons/bs";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidCameraMovie } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { call, commentDelete, commentUpdate } from "../../services/ApiService";
import { Error, Loader } from "../../common";
import { Rating } from "@mui/material";

const MyComment = () => {
  const navigate = useNavigate();

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [editedRating, setEditedRating] = useState(2.5);

  const userid = localStorage.getItem("userid");
  const queryClient = useQueryClient();

  const {
    data: commentsData,
    isError,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => await call(`/CommentSelectAllU/${userid}`, "GET"),
  });

  const handleEdit = (commentId) => {
    setEditingCommentId(commentId);
    const existingComment = commentsData.result.find(
      (comment) => comment.CommentID === commentId
    );
    setEditedComment(existingComment ? existingComment.Content : "");
    setEditedRating(existingComment ? existingComment.Rating / 2 : 2.5);
  };

  const handleSave = async (commentId, movieId, rating) => {
    const editedData = {
      UserID: localStorage.getItem("userid"),
      MovieID: movieId,
      CommentID: commentId,
      Content: editedComment,
      Rating: editedRating * 2,
    };

    await commentUpdate(editedData);
    queryClient.invalidateQueries(["comments", movieId]);

    setEditingCommentId(null);
    setEditedComment("");
    setEditedRating(2.5);
  };

  const handleDelete = async (commentId, movieId) => {
    await commentDelete(commentId);
    queryClient.invalidateQueries(["comments", movieId]);
  };

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (isError) {
    return <Error error="Something went wrong!" />;
  }

  return (
    <>
      <section className="h-screen mt-14 max-w-md md:max-w-2xl lg:max-w-4xl mx-auto py-4 dark:text-white">
        <h2 className="text-2xl mt-10 font-bold mb-4 text-gray-800 dark:text-white">
          내 코멘트 {commentsData.result.length}
        </h2>
        <ul className="space-y-4">
          {commentsData.result.map((comment) => (
            <li key={comment.CommentID} className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex">
                  <button className="flex">
                    <BiSolidCameraMovie
                      className="text-2xl mr-2 mb-1"
                      color="#CA3A31"
                    />
                    <p className="font-semibold text-lg text-gray-800 dark:text-white">
                      '{comment.Title}'
                    </p>
                  </button>
                  {editingCommentId === comment.CommentID ? (
                    <Rating
                      className="ml-3"
                      name="half-rating"
                      size="large"
                      value={editedRating}
                      precision={0.5}
                      onChange={(event, newValue) => {
                        setEditedRating(newValue || 0);
                      }}
                    />
                  ) : (
                    <p className="ml-2 mt-1 font-semibold">
                      평점 : {comment.Rating}
                    </p>
                  )}
                  <p className="ml-4 mt-1.5 text-sm">
                    {new Date(comment.TimeStamp).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {editingCommentId === comment.CommentID ? (
                    <>
                      <button
                        onClick={() =>
                          handleSave(
                            comment.CommentID,
                            comment.MovieID,
                            comment.Rating
                          )
                        }
                      >
                        <BsCheckLg className="text-2xl hover:scale-125" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(comment.CommentID)}>
                        <BsFillPencilFill className="text-lg hover:scale-125" />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(comment.CommentID, comment.MovieID)
                        }
                      >
                        <AiFillDelete className="text-2xl hover:scale-125" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              {editingCommentId === comment.CommentID ? (
                <textarea
                  className="m-2 p-2 dark:text-black border-2 rounded-md dark:border-0"
                  cols={70}
                  id="edited"
                  name="edited"
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                ></textarea>
              ) : (
                <p className="text-gray-600 mt-2 dark:text-white">
                  {comment.Content}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default MyComment;
