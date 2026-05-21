import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";

const EditPost = ({ posts, handleEdit }) => {

    const { id } = useParams();

    // FIND CURRENT POST
    const post = posts.find(
        (post) => post.id.toString() === id
    );

    // STATE
    const [editTitle, setEditTitle] = useState("");
    const [editBody, setEditBody] = useState("");

    // LOAD POST DATA INTO INPUTS
    useEffect(() => {

        if (post) {
            setEditTitle(post.title);
            setEditBody(post.body);
        }

    }, [post]);

    // SUBMIT EDIT
    const submitForm = async (e) => {

        e.preventDefault();

        const datetime = format(
            new Date(),
            "MMMM dd, yyyy pp"
        );

        const updatedPost = {
            id: Number(id),
            title: editTitle,
            datetime,
            body: editBody
        };

        await handleEdit(id, updatedPost);
    };

    return (

        <main className="NewPost">

            {post ? (

                <>
                    <h2>Edit Post</h2>

                    <form
                        className="newPostForm"
                        onSubmit={submitForm}
                    >

                        <label htmlFor="postTitle">
                            Title:
                        </label>

                        <input
                            id="postTitle"
                            type="text"
                            required
                            value={editTitle}
                            onChange={(e) =>
                                setEditTitle(e.target.value)
                            }
                        />

                        <label htmlFor="postBody">
                            Post:
                        </label>

                        <textarea
                            id="postBody"
                            required
                            value={editBody}
                            onChange={(e) =>
                                setEditBody(e.target.value)
                            }
                        />

                        <button type="submit">
                            Update Post
                        </button>

                    </form>
                </>

            ) : (

                <>
                    <h2>Post Not Found</h2>

                    <p>
                        Well, that's disappointing.
                    </p>

                    <p>
                        <Link to="/">
                            Visit Our Homepage
                        </Link>
                    </p>
                </>

            )}

        </main>
    );
};

export default EditPost;