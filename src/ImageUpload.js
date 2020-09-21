import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import {storage} from './firebase';
import {db} from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';

const ImageUpload = ({username}) => {
    const[image,setImage]= useState(null);
    const[progress,setProgress]= useState(0);
    const[caption,setCaption]= useState('');

    const handleChange = (e) =>{
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    }

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) =>{
                const progress = Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                );
                setProgress(progress)
            },
            (error)=>{
                console.log(error);
                alert(error.message)
            },
            ()=>{
                storage
                  .ref("images")
                  .child(image.name)
                  .getDownloadURL()
                  .then(url=>{
                      db.collection("posts").add({
                          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                          caption:caption,
                          imageURL:url,
                          userName:username

                      });
                      setProgress(0);
                      setCaption('');
                      setImage(null);
                  })
            }

        )

    }


    return (
        <div className="image-upload" >
             <progress className="progress-bar" value={progress} max="100"></progress>
            <input placeholder="enter a caption" onChange={event=>setCaption(event.target.value)} value={caption} type="text" name="" id=""/>
            <input type="file" onChange={handleChange} name="" id=""/>
            <Button onClick={handleUpload}>
            Upload
            </Button>
        </div>
    );
};

export default ImageUpload;