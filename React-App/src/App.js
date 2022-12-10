import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import ContactList from "./components/ContactList/ContactList";
import EditContact from "./components/EditContact/EditContact";
import AddContact from "./components/AddContact/AddContact";

function App() {
  return (
    <>
      <ToastContainer autoClose={2000} />
      <Navbar />
      <Routes>
        <Route path="/" element={<ContactList />} />
        <Route path="/contact/view/list" element={<ContactList />} />
        <Route path="/contact/edit/:id" element={<EditContact />} />
        <Route path="/contact/add" element={<AddContact />} />
      </Routes>
    </>
  );
}

export default App;
