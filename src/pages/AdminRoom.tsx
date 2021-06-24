import { useState } from "react";
import { useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";

import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

import LogoImg from "../assets/images/logo.svg";

import "../styles/room.scss";

type RoomParams = {
	id: string;
};

export function AdminRoom() {
	const { user } = useAuth();
	const params = useParams<RoomParams>();
	const roomId = params.id;
	const [newQuestion, setNewQuestion] = useState("");

	const { questions, title } = useRoom(roomId);

	return (
		<div id="page-room">
			<Toaster position="top-center" reverseOrder={false} />
			<header>
				<div className="content">
					<img src={LogoImg} alt="Letmeask" />
					<div>
						<RoomCode code={roomId} />
						<Button isOutlined>Encerrar sala</Button>
					</div>
				</div>
			</header>

			<main>
				<div className="room-title">
					<h1>Sala {title}</h1>
					{questions.length > 0 && (
						<span>{questions.length} pergunta(s)</span>
					)}
				</div>

				<div className="question-list">
					{questions.map((question) => {
						return (
							<Question
								key={question.id}
								content={question.content}
								author={question.author}
							/>
						);
					})}
				</div>
			</main>
		</div>
	);
}
