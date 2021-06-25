import { useState } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Modal from "react-modal";

import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";
import { Question } from "../components/Question";
import { NoQuestion } from "../components/NoQuestion";

import { useAuth } from "../hooks/useAuth";
import { useRoom } from "../hooks/useRoom";
import { database } from "../services/firebase";

import LogoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import deleteModalImg from "../assets/images/delete-modal.svg";

import "../styles/room.scss";
import "../styles/modal.scss";

type RoomParams = {
	id: string;
};

export function AdminRoom() {
	const history = useHistory();
	const { user } = useAuth();
	const params = useParams<RoomParams>();
	const roomId = params.id;
	const [newQuestion, setNewQuestion] = useState("");
	const { questions, title } = useRoom(roomId);
	const [questionIdModalOpen, setQuestionIdModalOpen] = useState<
		string | undefined
	>();
	const [roomIdModalOpen, setRoomIdModalOpen] = useState<
		string | undefined
	>();

	async function handleEndRoom() {
		database.ref(`rooms/${roomId}`).update({
			closedAt: new Date(),
		});
		setRoomIdModalOpen(undefined);

		history.push("/");
	}

	async function handleDeleteQuestion(questionId: string | undefined) {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
		setQuestionIdModalOpen(undefined);
		toast.success("Pergunta deletada com sucesso!");
	}

	return (
		<div id="page-room">
			<Toaster position="top-center" reverseOrder={false} />

			<Modal
				isOpen={questionIdModalOpen !== undefined}
				onRequestClose={() => setQuestionIdModalOpen(undefined)}
				className="modal"
				overlayClassName="modal-overlay"
				appElement={document.getElementById("root") as HTMLElement}
			>
				<img src={deleteModalImg} alt="Deletar Modal" />
				<h2>Encerrar sala</h2>
				<p>Tem certeza que você deseja deletar esta pergunta?</p>
				<div className="modal-butons">
					<button
						className="button close"
						onClick={() => setQuestionIdModalOpen(undefined)}
					>
						Cancelar
					</button>
					<button
						className="button confirm"
						onClick={() =>
							handleDeleteQuestion(questionIdModalOpen)
						}
					>
						Sim, excluir
					</button>
				</div>
			</Modal>

			<Modal
				isOpen={roomIdModalOpen !== undefined}
				onRequestClose={() => setRoomIdModalOpen(undefined)}
				className="modal"
				overlayClassName="modal-overlay"
				appElement={document.getElementById("root") as HTMLElement}
			>
				<img src={deleteModalImg} alt="Deletar Modal" />
				<h2>Encerrar sala</h2>
				<p>Tem certeza que você deseja encerrar esta sala?</p>
				<div className="modal-butons">
					<button
						className="button close"
						onClick={() => setRoomIdModalOpen(undefined)}
					>
						Cancelar
					</button>
					<button
						className="button confirm"
						onClick={() => handleEndRoom()}
					>
						Sim, encerrar
					</button>
				</div>
			</Modal>

			<header>
				<div className="content">
					<img src={LogoImg} alt="Letmeask" />
					<div>
						<RoomCode code={roomId} />
						<Button
							isOutlined
							onClick={() => setRoomIdModalOpen(roomId)}
						>
							Encerrar sala
						</Button>
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
							>
								<button
									className="delete-button"
									type="button"
									onClick={() =>
										setQuestionIdModalOpen(question.id)
									}
								>
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M3 5.99988H5H21"
											stroke="#737380"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z"
											stroke="#737380"
											strokeWidth="1.5"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
								</button>
							</Question>
						);
					})}
					{questions.length == 0 && (
						<NoQuestion
							text={
								"Envie o código desta sala para seus amigos e comece a responder perguntas!"
							}
						/>
					)}
				</div>
			</main>
		</div>
	);
}
