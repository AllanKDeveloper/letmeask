import React, { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

import IlustrationImg from "../assets/images/illustration.svg";
import LogoImg from "../assets/images/logo.svg";
import GoogleIcon from "../assets/images/google-icon.svg";
import GithubIcon from "../assets/images/github-icon.png";
import LogInImg from "../assets/images/log-in.svg";

import "../styles/auth.scss";

export function Home() {
	const history = useHistory();
	const { user, signInWithGoogle, signInWithGithub } = useAuth();
	const [roomCode, setRoomCode] = useState("");

	async function handleCreateRoom(channel = "google") {
		if (!user) {
			if (channel === "google") {
				await signInWithGoogle();
			}
			if (channel === "github") {
				await signInWithGithub();
			}
		}

		history.push("/rooms/new");
	}

	async function handleJoinRoom(event: FormEvent) {
		event.preventDefault();

		if (roomCode.trim() === "") {
			return;
		}

		const roomRef = await database.ref(`/rooms/${roomCode}`).get();
		if (!roomRef.exists()) {
			toast.error("A sala informada não existe.");
			return;
		}

		if (roomRef.val().closedAt) {
			toast.error("A sala foi fechada.");
			return;
		}

		history.push(`/rooms/${roomCode}`);
	}

	return (
		<div id="page-auth">
			<Toaster position="bottom-center" reverseOrder={false} />
			<aside>
				<img
					src={IlustrationImg}
					alt="ilustação simbolizando perguntas e respostas"
				/>
				<h1>Toda pergunta tem uma resposta.</h1>
				<p>Aprenda e compartilhe conhecimento com outras pessoas</p>
			</aside>

			<main>
				<div className="main-content">
					<img src={LogoImg} alt="Letmeask" />
					{!user ? (
						<React.Fragment>
							<Button
								onClick={() => handleCreateRoom("google")}
								className="create-room"
							>
								<img src={GoogleIcon} alt="Logo do Google" />
								Crie sua sala com o Google
							</Button>
							<Button
								onClick={() => handleCreateRoom("github")}
								className="create-room-github"
							>
								<img src={GithubIcon} alt="Logo do Github" />
								Crie sua sala com o Github
							</Button>
						</React.Fragment>
					) : (
						<Button
							onClick={() => handleCreateRoom()}
							className="create-room-logged"
						>
							Crie sua sala
						</Button>
					)}
					<div className="separator">ou entre em uma sala</div>
					<form onSubmit={handleJoinRoom}>
						<input
							type="text"
							placeholder="Digite o código da sala"
							required
							onChange={(event) =>
								setRoomCode(event.target.value)
							}
							value={roomCode}
						/>
						<Button type="submit">
							<img src={LogInImg} alt="Clique aqui para entrar" />
							Entrar na sala
						</Button>
					</form>
				</div>
			</main>
		</div>
	);
}
