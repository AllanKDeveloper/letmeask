import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import { Button } from "../components/Button";
import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

import IlustrationImg from "../assets/images/illustration.svg";
import LogoImg from "../assets/images/logo.svg";

import "../styles/auth.scss";

export function NewRoom() {
	const history = useHistory();
	const { user } = useAuth();
	const [newRoom, setNewRoom] = useState("");

	async function handleCreateRoom(event: FormEvent) {
		event.preventDefault();

		if (newRoom.trim() === "") {
			return;
		}

		const roomRef = database.ref("rooms");
		const firebaseRoom = await roomRef.push({
			title: newRoom,
			authorId: user?.id,
		});

		history.push(`/rooms/${firebaseRoom.key}`);
	}

	return (
		<div id="page-auth">
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
					<h2>Criar uma nova sala</h2>
					<form onSubmit={handleCreateRoom}>
						<input
							type="text"
							placeholder="Nome da sala"
							required
							onChange={(event) => setNewRoom(event.target.value)}
							value={newRoom}
						/>
						<Button type="submit">Criar sala</Button>
					</form>
					<p>
						Quer entrar em uma sala já existente?{" "}
						<Link to="/">Clique aqui</Link>
					</p>
				</div>
			</main>
		</div>
	);
}
