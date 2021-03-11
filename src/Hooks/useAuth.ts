import React, { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import creds from "../credentials.json";

export default function useAuth() {
	const API_KEY = creds.web.api_key;
	const CLIENT_ID = creds.web.client_id;
	const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
	const SCOPES = "https://www.googleapis.com/auth/drive.metadata.readonly";

	const [signIn, setSignIn] = useState({ status: false, contact: {} });
	useEffect(() => {
		gapi.load("client:auth2", initClient);
	});
	const initClient = () => {
		gapi.client
			.init({
				apiKey: API_KEY,
				clientId: CLIENT_ID,
				discoveryDocs: DISCOVERY_DOCS,
				scope: SCOPES,
			})
			.then(() => {
				gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
				updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
			});
	};

	const updateSigninStatus = (isSignedIn: boolean) => {
		if (isSignedIn) {
			setSignIn({ status: true, contact: gapi.auth2.getAuthInstance().currentUser.le.wt });
			console.log(gapi.auth2.getAuthInstance().currentUser.le.wt);
			console.trace();
		} else {
			setSignIn({ status: false, contact: {} });
		}
	};

	return signIn;
}
