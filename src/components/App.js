import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    let isMounted = true;

    fetch('http://localhost:4000/questions')
    .then((response) => response.json())
    .then((data) => {
      if (isMounted) {
        setQuestions(data);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  function addQuestion(formData) {
    fetch('http://localhost:4000/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setQuestions([...questions, data]);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  function deleteQuestion(questionId) {
    fetch(`http://localhost:4000/questions/${questionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Success:', response);
      const updatedQuestions = questions.filter(question => question.id !== questionId);
      setQuestions(updatedQuestions);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  function updateQuestion(questionId, value) {
    fetch(`http://localhost:4000/questions/${questionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"correctIndex": value})
    })
    .then(response => response.json())
    .then(updatedData => {
      console.log('Success:', updatedData);
      const updatedQuestions = questions.map(question => {
        if (question.id === questionId) {
          return {
            ...question,
            ...updatedData
          };
        } else {
          return question;
        }
      });
      setQuestions(updatedQuestions);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  
  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? <QuestionForm addQuestion={addQuestion} /> : <QuestionList questions={questions} updateQuestion={updateQuestion} deleteQuestion={deleteQuestion}/>}
    </main>
  );
}

export default App;
