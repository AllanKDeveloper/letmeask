import { useState, useEffect } from "react";

import { useAuth } from "../hooks/useAuth";
import { database } from "../services/firebase";

type FirebaseQuestions = Record<
	string,
	{
		content: string;
		author: {
			username: string;
			avatar: string;
		};
		isHighlighted: boolean;
		isAnswered: boolean;
		likes: Record<string, { authorId: string }>;
	}
>;

type QuestionType = {
	id: string;
	content: string;
	author: {
		username: string;
		avatar: string;
	};
	isHighlighted: boolean;
	isAnswered: boolean;
	likeCount: number;
	likeId: string | undefined;
};

export function useRoom(roomId: string) {
	const { user } = useAuth();
	const [questions, setQuestions] = useState<QuestionType[]>([]);
	const [title, setTitle] = useState("");
	const [author, setAuthor] = useState("");

	useEffect(() => {
		const roomRef = database.ref(`/rooms/${roomId}`);

		roomRef.on("value", (room) => {
			const databaseRoom = room.val();
			const firebaseQuestions: FirebaseQuestions =
				databaseRoom.questions ?? {};
			const parsedQuestions = Object.entries(firebaseQuestions).map(
				([key, value]) => {
					return {
						id: key,
						content: value.content,
						author: value.author,
						isHighlighted: value.isHighlighted,
						isAnswered: value.isAnswered,
						likeCount: Object.values(value.likes ?? {}).length,
						likeId: Object.entries(value.likes ?? {}).find(
							([key, like]) => like.authorId === user?.id
						)?.[0],
					};
				}
			);

			setTitle(databaseRoom.title);
			setQuestions(parsedQuestions);
			if (databaseRoom.authorId === user?.id) {
				setAuthor(databaseRoom.authorId);
			}
		});

		return () => {
			roomRef.off("value");
		};
	}, [roomId, user?.id]);

	return { questions, title, author };
}
