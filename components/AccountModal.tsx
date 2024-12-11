"use client";

import Modal from "./Modal";
import { useUserProvider } from "@/providers/UserProvder";
import Account from "./Account";

const AccountModal = () => {
  const { isModalOpen, toggleModal } = useUserProvider();

  return (
    <>
      {isModalOpen && (
        <Modal onClose={toggleModal}>
          <Account />
        </Modal>
      )}
    </>
  );
};

export default AccountModal;
