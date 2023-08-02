import { useEffect, useState } from "react";
import { useAuth } from "../../providers/supabase-auth-provider";
import { toast, ToastContainer } from "react-toastify";
import CommentItem from "./CommentItem";
type CommentSectionProps = {
  trainer_id: string;
  rating: string;
};

const CommentSection: React.FC<CommentSectionProps> = ({ rating, trainer_id }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth(); // Assuming useAuth is a custom hook that gets user data

  const fetchComments = async () => {
    const response = await fetch(`/api/comments/${trainer_id}`);
    if (response.status === 200) {
      const data = await response.json();
      setComments(data);
    } else {
      toast.error("Error fetching comments");
    }
  };
  const handleUpdate = async (comment_id: string, newComment: string) => {
    const response = await fetch(`/api/comments/${trainer_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment_id, comment: newComment }),
    });
    if (response.status === 200) {
      // Refresh comments after successful update
      fetchComments();
    } else if (response.status == 401) {
      return response.text().then((message) => {
        toast.error(message); // Display the "Please be nicer" message
      });
    } else {
      toast.error("Error updating comment");
    }
  };

  // Fetch comments when component mounts
  useEffect(() => {
    fetchComments();
  }, [trainer_id]);
  const handleDelete = async (comment_id: string) => {
    const response = await fetch(`/api/comments/${trainer_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment_id }),
    });
    if (response.status === 200) {
      // Refresh comments after successful deletion
      fetchComments();
    } else {
      toast.error("Error deleting comment");
    }
  };
  // Handle submit of new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to comment");
      return;
    }
    const response = await fetch(`/api/comments/${trainer_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: newComment }),
    });
    if (response.status === 200) {
      // Refresh comments after successful submit
      fetchComments();
      setNewComment("");
    } else if (response.status == 401) {
      return response.text().then((message) => {
        toast.error(message); // Display the "Please be nicer" message
      });
    } else {
      toast.error("Error submitting comment");
    }
  };

  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          trainer_id={trainer_id}
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          key={comment.comment_id}
          comment={comment}
          ratingProps={rating}
        />
      ))}
      { user &&
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 mb-3 text-black border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
          placeholder="Type your comment here..."
          rows={3}
        />
        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition duration-200 ease-in"
        >
          Submit Comment
        </button>
      </form>
    }
    </div>
  );
};

export default CommentSection;
