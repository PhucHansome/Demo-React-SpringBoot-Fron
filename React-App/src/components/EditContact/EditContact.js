import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ContactService from "../../services/ContactService";
import FileService from "../../services/FileService";
import Spinner from "../Sprinner/Spinner";
import noAvartar from "../../asset/images/no-avatar.jpg";
import { toast } from "react-toastify";
import { Toast } from "bootstrap";

const EditContact = () => {
  const { id } = useParams();
  let current_avatar = "";
  const [state, setState] = useState({
    loading: false,
    contact: {
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

  useEffect(function () {
    try {
      setState({ ...state, loading: true });
      async function getData() {
        let restDataContact = await ContactService.getContactId(id);
        current_avatar = restDataContact.data.photoUrl;
        setState({
          ...state,
          contact: restDataContact.data,
          loading: false,
        });
      }
      getData();
    } catch (error) {
      setState({
        ...state,
        loading: false,
        errorMessage: error.message,
      });
    }
    return () => {
      if (contact.photoUrl !== current_avatar) {
        async function deledata() {
          let filename = current_avatar.split("/").pop().split(".")[0];
          await FileService.destroy(filename);
        }
        deledata();
      }
    };
  }, []);

  const handleChange = (e) => {
    setState({
      ...state,
      contact: {
        ...contact,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleUpload = () => {
    if(select.file){
      setSelect({...select, uploading:true});
      async function uploadAvatar() {
        let uploadResult = await FileService.upload(select.file);
        contact.photoUrl = uploadResult.data.url;
        setSelect({
          ...select,
          uploading: false,
        });
        toast.success("Avatar upload success")
      }
      uploadAvatar()
    } else{
      toast.info("Please select an avatar");
    }
  };

  const changeAvatar = (e) => {
    let select_file = e.target.files[0];
    let fakeAvatarUrl = URL.createObjectURL(select_file);
    contact.photoUrl = fakeAvatarUrl;
    setSelect({
      ...select,
      file: select_file,
    });
  };

  let navigate = useNavigate();

  const handleSubmit = async function (e) {
    e.preventDefault();
    try {
      setState({ ...state, loading: true });
      let resContact = await ContactService.doEditContact(contact);
      if (resContact.data) {
        toast.success("Contact update successfully");
        navigate("/", { replace: true });
      }
    } catch (error) {}
  };

  const { contact, loading, errorMessage } = state;
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
                      onChange={handleChange}
                      value={contact.name}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Mobile"
                      name="mobile"
                      onChange={handleChange}
                      value={contact.mobile}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      name="email"
                      onChange={handleChange}
                      value={contact.email}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Title"
                      name="title"
                      onChange={handleChange}
                      value={contact.title}
                    />
                  </div>
                  <div className="mb-3">
                    <button
                      type="submit"
                      className="btn btn-outline-success me-2"
                    >
                      Edit
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

export default EditContact;
