import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ContactService from "./../../services/ContactService";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import FileService from "./../../services/FileService";
import Spinner from "./../Sprinner/Spinner";

function ContactList() {
  const [state, setState] = useState({
    loading: false,
    contacts: [],
    errorMessage: "",
  });

  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    try {
      setState({ ...state, loading: true });
      async function getData() {
        let contactRes = await ContactService.getContact();
        setState({
          ...state,
          contacts: contactRes.data,
          loading: false,
        });
        console.log(contactRes.data);
      }
      getData();
    } catch (error) {
      setState({
        ...state,
        loading: false,
        errorMessage: error.message,
      });
    }
  }, []);

  const handleRemove = (contact) => {
    confirmAlert({
      title: "Remove Contact!",
      message: "Are You Sure?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            try {
              async function removeData() {
                setState({ ...state, loading: true });
                let RemoveResutl = await ContactService.doRemoveContact(
                  contact.id
                );
                let ContactRes = await ContactService.getContact();
                setState({
                  ...state,
                  contacts: ContactRes.data,
                });
                toast.success("Contact Remove success.");
              }
              removeData();
            } catch (error) {
              toast.error(error.message);
              setState({
                ...state,
                loading: false,
                errorMessage: error.message,
              });
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(e);
    setState({ ...state, loading: false });
    let valueSearch = document.getElementById("searchValue");
    if (valueSearch.value.length > 0) {
      async function getData() {
        let resData = await ContactService.getContact();
        setState({
          ...state,
          contacts: resData.data.filter((contact) =>
            contact.name.toLowerCase().includes(keyword.toLocaleLowerCase())
          ),
          loading: false,
        });
      }
      getData();
    }
    if (valueSearch.value.length === 0) {
      async function data() {
        let resData = await ContactService.getContact();
        setState({
          ...state,
          contacts: resData.data,
          loading: false,
        });
        console.log(resData.data);
      }
      data();
    }
  };

  const { loading, contacts, errorMessage } = state;
  return (
    <>
      <section className="add-contact-area my 3">
        <div className="container">
          <div className="d-flex align-items-center">
            <h3 className="fw-bolder">Employee Manager</h3>
            <Link to={"/contact/add"} className="btn btn-primary btn-sm ms-2">
              <i className="fa fa-plus-circle me-2"></i>
              New
            </Link>
          </div>
          <div>
            <p className="fst-italic">
              Ea do esse elit qui enim laborum ea nulla consectetur est pariatur
              ex. Id et do laboris mollit ullamco laboris. Mollit consequat
              eiusmod nulla exercitation quis reprehenderit officia tempor.
              Voluptate fugiat tempor ullamco occaecat nostrud eiusmod cillum
              nostrud et commodo ex occaecat deserunt. Elit veniam proident esse
              ad laboris nostrud excepteur do.
            </p>
            <div className="d-flex w-25">
              <form className="d-flex" onInput={handleSearch}>
                <input
                  id="searchValue"
                  type="search"
                  className="form-control"
                  onInput={(e) => setKeyword(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-outline-secondary btn-sm ms-2"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <section className="contact-list">
        <div className="container">
          <div className="row">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th className="text-center align-middle">IMG</th>
                  <th className="text-center align-middle">#</th>
                  <th className="text-center align-middle">NAME</th>
                  <th className="text-center align-middle">TITLE</th>
                  <th className="text-center align-middle">EMAIL</th>
                  <th className="text-center align-middle">MOBILE</th>
                  <th className="text-center align-middle" colSpan="3">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <Spinner />
                ) : (
                  contacts.length > 0 &&
                  contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td className="text-center align-middle">
                        <img
                          src={contact.photoUrl}
                          width="80px"
                          height="80px"
                        />
                      </td>
                      <td className="text-center align-middle">{contact.id}</td>
                      <td className="text-center align-middle">
                        {contact.name}
                      </td>
                      <td className="text-center align-middle">
                        {contact.title}
                      </td>
                      <td className="text-center align-middle">
                        {contact.email}
                      </td>
                      <td className="text-center align-middle">
                        {contact.mobile}
                      </td>
                      <td className="text-center align-middle">
                        <Link
                          to={`/contact/edit/${contact.id}`}
                          className="btn btn-success"
                        >
                          <i className="fa fa-edit"></i>
                        </Link>
                      </td>
                      <td className="text-center align-middle">
                        <button
                          className="btn btn-danger btm-sm"
                          onClick={() => handleRemove(contact)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                      <td className="text-center align-middle"></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactList;
