import { useState, useEffect } from "react";
import useAuth from "../../Hooks/useAuth";
import { gapi } from "gapi-script";
import * as mm from "music-metadata-browser";
import styles from "./home.module.css";

interface Metadata {
	title: string | undefined;
	duration: number | undefined;
	album: string | undefined;
	albumartist: string | undefined;
	artists: Array<string> | undefined;
	genre: Array<string> | undefined;
	year: number | undefined;
	cover?: Uint8Array | undefined | any;
	lossless: boolean | undefined;
	webContentLink: string;
	id: string;
	size: number;
	image?: any;
}

interface Props {
	handleSignOut: () => void;
}

export default function Home({ handleSignOut }: Props) {
	const [mdata, setMdata] = useState<Array<Metadata>>([]);
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
				console.log(files);
				setFiles(files);

				const temp: Array<Metadata> = [];

				for (let file of files) {
					const params = file.webContentLink.split("/").slice(-1);
					console.log("params", params);
					const metadata = await mm.fetchFromUrl(params);
					console.log("metadata here", metadata);

					const songdata: Metadata = {
						title: metadata.common.title,
						duration: metadata.format.duration,
						album: metadata.common.album,
						albumartist: metadata.common.albumartist,
						artists: metadata.common.artists,
						genre: metadata.common.genre,
						year: metadata.common.year,
						lossless: metadata.format.lossless,
						cover: metadata.common.picture,
						webContentLink: params,
						id: file.id,
						size: file.size,
					};

					songdata.image = URL.createObjectURL(
						new Blob([songdata.cover["0"].data], { type: "image/png" } /* (1) */)
					);

					temp.push(songdata);
				}

				setMdata(temp);
			});
	}, []);

	return (
		<div className={styles.home}>
			<button>Sign Out</button>
			<div className={styles.card_container}>
				{/* <pre>{JSON.stringify(files, null, 4)}</pre> */}
				{files?.map(({ webContentLink: src, name: title }, i) => {
					return (
						<div className={styles.card}>
							<img src="" alt="" className={styles.cover} />
							<div className={styles.title}>{title}</div>
							<audio controls id="audioTag" className={styles.playback}>
								<source id="audioSource" src={src} type="audio/mpeg" />
							</audio>
							<div className="controls">
								<div className="play-pause"></div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
