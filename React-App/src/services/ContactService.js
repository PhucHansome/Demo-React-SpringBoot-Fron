import axios from "axios";
import { CONTACT_URL } from "./Commont";

class ContactService {
  static getContact() {
    return axios.get(CONTACT_URL);
  }
  static getContactId(id) {
    return axios.get(`${CONTACT_URL}/${id}`);
  }
  static doCreateContact(user) {
    return axios.post(CONTACT_URL, user);
  }
  static doRemoveContact(id) {
    return axios.delete(`${CONTACT_URL}/${id}`);
  }
  static doEditContact(user){
    return axios.put(`${CONTACT_URL}`,user)
  }
}


export default ContactService;