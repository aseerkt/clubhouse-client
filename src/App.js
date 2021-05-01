import React,{useState,useEffect} from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import io from "socket.io-client";
import AuthPage from "./components/Public/AuthPage"
import Navbar from "./components/General/Navbar"
import Home from "./components/Private/Home";
import AuthCheck from "./components/Public/AuthCheck"
import Thread from "./components/Private/Thread"
import Profile from "./components/Private/Profile"
function App() {
  const [socket,setSocket]=useState(null);
  
  function ProtectedRoute({ publicR, comp, privateR }) {
    return localStorage.getItem("hackathon") !== null ? (
      <>
        <Navbar />
        {comp}
      </>
    ) : (
      <Redirect replace to={publicR} />
    );
  }
  function PublicRoute({ privateR }) {
    return localStorage.getItem("hackathon") !== null ? (
      <Redirect to="/Home" />
    ) : (
      <AuthPage/>
    );
  }
  return (
    <div className="App">
     <Router>
      <AuthCheck/>
      <Switch>
        <Route path="/" exact>
          <PublicRoute />
          </Route>
          
        <Route path="/home" exact>
            <ProtectedRoute publicR="/" comp={<Home/>}/>
        </Route>
        <Route path="/profile" exact>
            <ProtectedRoute publicR="/" comp={<Profile/>}/>
        </Route>
        <Route path="/thread/:tid" exact>
            <ProtectedRoute publicR="/" comp={<Thread socket={socket}/>}/>
        </Route>


    
      </Switch>
    </Router>
    </div>
  );
}

export default App;
