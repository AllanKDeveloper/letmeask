import NoQuestionImg from "../assets/images/empty-questions.svg";

type NoQuestionProps = {
  text: string;
};

export function NoQuestion(props: NoQuestionProps) {
  return (
    <div className="noquestion">
      <img src={NoQuestionImg} alt="Nenhuma pergunta" />
      <h3>Nenhuma pergunta por aqui...</h3>
      <p>{props.text}</p>
    </div>
  );
}
