import React from "react";

function QuestionItem({ props, question,updateQuestion, deleteQuestion }) {
  const { id, prompt, answers, correctIndex } = question;

  const options = answers
    ? answers.map((answer, index) => (
        <option key={index} value={index}>
          {answer}
        </option>
      ))
    : null;

    function handleDelete(questionId) {
      fetch(`/api/questions/${questionId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        if (response.ok) {
          // If the question was successfully deleted, you can update your UI accordingly
          // For example, you could remove the question from your local state
          deleteQuestion(questionId);
        } else {
          // If the server responds with an error, handle the error appropriately
          throw new Error("Failed to delete question from server");
        }
      })
      .catch(error => {
        // Handle any network errors or errors thrown in the promise chain
        console.error(error);
      });
    }
    

  function handleUpdate(questionId, value) {
    updateQuestion(questionId, Number(value));
  }

  return (
    <li>
      <h4>Question {id}</h4>
      <h5>Prompt: {prompt}</h5>
      <label>
        Correct Answer:
        <select
          onChange={(event) => handleUpdate(id, event.target.value)}
          defaultValue={correctIndex}
        >
          {options}
        </select>
      </label>
      <button onClick={() => handleDelete(id)}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;
