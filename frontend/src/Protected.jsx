import {useState,useEffect} from 'react'

function Protected() {
     //create state to store our book list
     const [books, setBooks] = useState("------");

     useEffect(() => {
       async function loadBooks() {
         //fetch the book list
         (await fetch("http://localhost:3000/protected", {
            //use the authorization
            headers: {
              Authorization: "Bearer " + localStorage.getItem("@token"),
            },
          })).json().then(response => {
             setBooks(response);
         }).catch(error => {
           setBooks(error);
         });
   
       }
       loadBooks();
     }, []);
  return (
    <div>
        <h1>FETCH</h1>
        <p>books={JSON.stringify(books)}</p>
    </div>
  )
}

export default Protected
