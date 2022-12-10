import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ContactService from "../../services/ContactService";
import Spinner from "../Sprinner/Spinner";
import noAvartar from "../../asset/images/no-avatar.jpg";
import FileService from "../../services/FileService";

const AddContact = () => {
  const [state, setState] = useState({
    loading: false,
    contact: {
      id: 0,
      name: "",
      mobile: "",
      email: "",
      photoUrl: "",
      title: "",
    },
    errorMessage: "",
  });

  const [select, setSelect] = useState({
    uploading: false,
    file: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      setState({ ...state, loading: true });
      async function postData() {
        console.log(contact);
        let result = await ContactService.doCreateContact(contact);
        if (result.data) {
          toast.success("Contact created successfully.");
          setState({ ...state, loading: false });
          navigate("/", { replace: true });
        }
      }
      postData();
    } catch (error) {
      setState({
        ...state,
        loading: false,
        errorMessage: error.message,
      });
      toast.error(error.message);
    }
  };

  const handleInputValue = (e) => {
    setState({
      ...state,
      contact: {
        ...contact,
        [e.target.name]: e.target.value,
      },
    });
  };

  const changeAvatar = (e) => {
    let seclet_file = e.target.files[0];
    let fakeAvatarUrl = URL.createObjectURL(seclet_file);
    contact.photoUrl = fakeAvatarUrl;
    setSelect({
      ...select,
      file: seclet_file,
    });
  };

  const handleUpload = () => {
    if (select.file) {
      setSelect({ ...select, uploading: true });
      async function uploadAvatar() {
        let uploadResult = await FileService.upload(select.file);
        console.log(uploadResult.data);
        contact.photoUrl = uploadResult.data.url;
        setSelect({
          ...select,
          uploading: false,
        });
        toast.success("Avatar uploaded success");
      }
      uploadAvatar();
    } else {
      toast.info("Please select an Avatar");
    }
  };

  const { loading, contact } = state;
  return (
    <>
      <section className="create-contact-info">
        <div className="container">
          <h3 className="fw-bolder text-success">Create Employee</h3>
          <p className="fst-italic">
            Anim id aliqua cillum duis. Amet consequat incididunt culpa non.
            Aute ea tempor officia elit ut. Cupidatat proident amet est dolore
            exercitation nisi reprehenderit deserunt laboris labore consectetur
            excepteur veniam.
          </p>
        </div>
      </section>
      <section className="create-contact">
        {loading ? (
          <Spinner />
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      name="name"
                      onInput={handleInputValue}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Mobile"
                      name="mobile"
                      onInput={handleInputValue}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      name="email"
                      onInput={handleInputValue}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Title"
                      name="title"
                      onInput={handleInputValue}
                    />
                  </div>
                  <div className="mb-3">
                    <button
                      type="submit"
                      className="btn btn-outline-success me-2"
                    >
                      Create
                    </button>
                    <Link className="btn btn-danger" to={"/"}>
                      Close
                    </Link>
                  </div>
                </form>
              </div>
              <div className="col-4">
                <div className="d-flex flex-column align-items-center avartar">
                  <img
                    className="avartar-sm"
                    src={contact.photoUrl || noAvartar}
                    onClick={() => {
                      document.querySelector("#fileAvatar").click();
                    }}
                    height="100px"
                  />
                  <span className="select-avatar">Select an Avatar</span>
                  <input
                    className="form-control d-none"
                    accept="image/*"
                    type="file"
                    id="fileAvatar"
                    onChange={changeAvatar}
                  />
                  {select.uploading ? (
                    <button className="btn btn-primary" type="button" disabled>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      >
                        ...
                      </span>
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary mt-2"
                      onClick={handleUpload}
                    >
                      Upload
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default AddContact;
