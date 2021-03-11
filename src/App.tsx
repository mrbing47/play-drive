import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { gapi } from "gapi-script";
import useAuth from "./Hooks/useAuth";
import Home from "./Pages/Home/Home";
function App() {
	const signIn = useAuth();

	const handleSignIn = () => {
		gapi.auth2.getAuthInstance().signIn();
	};

	const handleSignOut = () => {
		gapi.auth2.getAuthInstance().signOut();
	};

	return (
		<div className="App">
			{!signIn.status ? (
				<button onClick={handleSignIn}>Connect with Google Drive</button>
			) : (
				<Home handleSignOut={handleSignOut} />
			)}
		</div>
	);
}

export default App;
