import { useState } from "react";
import ContactInfo from "./contactInfo";

import NewContact from "./NewContact";
import DialogBox from "./DialogBox";


const ContactList = ({ contacts }) => {
  let [open, setOpen] = useState(false);
  let [id, setID] = useState("");

  const ContactUpdate = (id) => {
    setID(id);
    setOpen(true);
  };

  const DialogHandle = () => {
    setOpen((current) => !current);
  };
  return (
    <div className="flex flex-col mx-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {contacts &&
          contacts.map((contact) => (
            <ContactInfo
              key={contact.id}
              contact={contact}
              onContactUpdate={ContactUpdate}
            />
          ))}

        {open && (
          <DialogBox open={open} OnDialogHandle={DialogHandle}>
            <NewContact id={id} />
          </DialogBox>
        )}
      </div>
    </div>
  );
};

export default ContactList;
