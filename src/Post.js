import React, { useEffect, useState } from 'react';
import './Post.css';
import Avatar from "@material-ui/core/Avatar";
import {db} from './firebase';
import firebase from 'firebase'
const Post = ({user,userName,caption,imageURL,postId}) => {
    const [comments,setComments] = useState([]);
    const [comment,setComment] = useState('');
    useEffect(()=>{
        let unsubscribe;
    if(postId){
        unsubscribe =db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp','desc')
        .onSnapshot((snapshot)=>{
            setComments(snapshot.docs.map((doc)=>doc.data()));
        })
    }
    return ()=>{
        unsubscribe();
    }
    },[postId])
    const postComment = (event) =>{
        event.preventDefault();
        db.collection("posts")
        .doc(postId)
        .collection("comments")
        .add({
            text: comment,
            userName:user.displayName,
            timestamp:firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
        
    }
    return (
        <div className="post" >
            <div className="post-header">
            <Avatar alt="Remy Sharp" src="/broken-image.jpg" className="post-avatar"/>
            <h3>{userName}</h3>
            </div>
            <img 
            className="post-image"
            src={imageURL} alt="post"></img>
            <h4 className="post-text"><strong>Username</strong>:{caption}</h4>
            {
                <div className="post-comments">
                {
                    comments.map((comment)=>(
                        <p>
                          <b>{comment.userName}</b> {comment.text}
                        </p>
                    ))
                }
                </div>
            }
            {user && (
                <form className="post-comment-box" >
            <input
              className="post-input"
              type="text"
              placeholder="add a comment"
              value={comment}
              onChange={(e)=>setComment(e.target.value)}
              />
            <button
              disabled={!comment}
              className="post-button"
              type="submit"
              onClick={postComment}
              >
              Post
              </button>
            </form>

            )}
            
        </div>
    );
};

export default Post;