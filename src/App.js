import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './Post';
import {db} from './firebase';
import { Button, Input, makeStyles, Modal } from '@material-ui/core';
import { auth } from './firebase'
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  
  const [posts,setPosts] = useState([]);
  const [open,setOpen]  = useState(false);
  const [openSignIn,setOpenSignIn] = useState(false);
  const [userName,setUserName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const[user,setUser] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        console.log(authUser);
        setUser(authUser);
        if(authUser.displayName){

        }
        else{
          return authUser.updateProfile({
            displayName:userName,
          })
        }
      }
      else{
        setUser(null)

      }
    })
    return () => {
      unsubscribe();
    }
  },[user,userName])

  useEffect(()=>{
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>({
        id:doc.id,
        post:doc.data()

      })));
    })
  },[])
  const signUp = (event) =>{
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      return authUser.user.updateProfile({
        displayName:userName,
      })
    })
    .catch((error)=>alert(error.message))

    setOpen(false);
  }
  const signIn = (event) =>{
    event.preventDefault();

    auth.signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message))
    setOpenSignIn(false)
  }
  return (
    <div className="App">
    
    <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
      >
      <div style={modalStyle} className={classes.paper}>
      <form className="app-signup" >
      <center>
      <img className="app-header-image"
      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
      alt="instagram-logo"></img>
      </center>
      <Input
        placeholder="email"
        type="text"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />
      <Input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />
      <Button type="submit" onClick={signIn}>Sign In</Button>
      
      
      </form>
      
      </div>
      </Modal>
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
      <div style={modalStyle} className={classes.paper}>
      <form className="app-signup" >
      <center>
      <img className="app-header-image"
      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
      alt="instagram-logo"></img>
      </center>

      <Input
        placeholder="username"
        type="text"
        value={userName}
        onChange={(e)=>setUserName(e.target.value)}
      />
      <Input
        placeholder="email"
        type="text"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />
      <Input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />
      <Button type="submit" onClick={signUp}>Sign Up</Button>
      
      
      </form>
      
      </div>
      </Modal>
    <div className="app-header">
    <img className="app-header-image"
    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
    alt="instagram-logo"></img>
    {
      user?(
        <Button onClick={()=>auth.signOut()}>Log Out</Button>
      ):
      (
        <div className="app-login-container">
        <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
        <Button onClick={()=>setOpen(true)}>Sign Up</Button>
        </div>
      )
    }
    </div>

    <div className="app-posts">
    <div className="app-post-left">
    {
      posts.map(({id,post})=>(
        <Post user={user} key={id} postId={id} timestamp={post.timestamp} userName={post.userName} caption={post.caption} imageURL={post.imageURL}></Post>
      ))
    }
    </div>
    <div className="app-post-right">
    <InstagramEmbed
    url='https://www.instagram.com/p/BSjlJhrAgFg/?utm_source=ig_embed&amp;utm_campaign=loading'
    maxWidth={320}
    hideCaption={false}
    containerTagName='div'
    protocol=''
    injectScript
    onLoading={() => {}}
    onSuccess={() => {}}
    onAfterRender={() => {}}
    onFailure={() => {}}
    />
    </div>
   
    
    </div>
   
   
   
    {user?.displayName ?
      (<ImageUpload username={user.displayName} ></ImageUpload>)
      :
      <h3 style={{display:'none'}}>sorry</h3>
    }
    </div>
  );
}

export default App;
