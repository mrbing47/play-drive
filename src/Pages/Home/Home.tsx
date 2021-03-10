import { useState, useEffect } from "react";
import useAuth from "../../Hooks/useAuth";
import { gapi } from "gapi-script";
import * as mm from "music-metadata-browser";
export default function Home() {
	const signIn = useAuth();
	const [files, setFiles] = useState<Array<any>>();

	useEffect(() => {
		gapi.client.drive.files
			.list({
				q: "mimeType='audio/mpeg' or mimeType='audio/flac'",
				// q:"mimeType='application/vnd.google-apps.folder'",
				fields: "files(id,name,webContentLink,size,fileExtension,mimeType)",
				//fields: "*",
			})
			.then(async function (response: any) {
				console.log(response.result.files);

				let files: Array<any> = response.result.files;
				const params = files[0].webContentLink.split("/").slice(-1);
				console.log("params", params);
				const metadata = await mm.fetchFromUrl(params);
				console.log("metadata here", metadata);

				console.log(files);
				setFiles(files);
			});
	}, []);

	return (
		<div>
			<pre>{JSON.stringify(files, null, 4)}</pre>
			{files?.map(({ webContentLink: src, mimeType, name }, i) => {
				return (
					<>
						<div>{name}</div>
						<audio controls id="audioTag">
							<source id="audioSource" src={src} type="audio/mpeg" />
						</audio>
						<br />
					</>
				);
			})}
		</div>
	);
}
