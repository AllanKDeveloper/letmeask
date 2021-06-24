import { ReactNode, createContext, useState, useEffect } from "react";

import { firebase, auth } from "../services/firebase";

type User = {
	id: string;
	username: string;
	avatar: string;
};

type AuthContextType = {
	user: User | undefined;
	signInWithGoogle: () => Promise<void>;
	signInWithGithub: () => Promise<void>;
};

type AuthContextProviderProps = {
	children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
	const [user, setUser] = useState<User>();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				const { displayName, photoURL, uid } = user;

				if (!displayName || !photoURL) {
					throw new Error(
						"Informações de usuário não preenchidas na conta Google."
					);
				}

				setUser({
					id: uid,
					username: displayName,
					avatar: photoURL,
				});
			}
		});

		return () => {
			unsubscribe();
		};
	}, []);

	async function signInWithGoogle() {
		const provider = new firebase.auth.GoogleAuthProvider();

		const result = await auth.signInWithPopup(provider);

		if (result.user) {
			const { displayName, photoURL, uid } = result.user;

			if (!displayName || !photoURL) {
				throw new Error(
					"Informações de usuário não preenchidas na conta Google."
				);
			}

			setUser({
				id: uid,
				username: displayName,
				avatar: photoURL,
			});
		}
	}

	async function signInWithGithub() {
		const provider = new firebase.auth.GithubAuthProvider();

		const result = await auth.signInWithPopup(provider);

		if (result.user) {
			const { displayName, photoURL, uid } = result.user;

			if (!displayName || !photoURL) {
				throw new Error(
					"Informações de usuário não preenchidas na conta Github."
				);
			}

			setUser({
				id: uid,
				username: displayName,
				avatar: photoURL,
			});
		}
	}

	return (
		<AuthContext.Provider
			value={{ user, signInWithGoogle, signInWithGithub }}
		>
			{props.children}
		</AuthContext.Provider>
	);
}
