"use client";

import { useEffect, useState } from "react";
import AuthUserModel from "../components/modals/AuthUserModel";
import CreateAgentModal from "../components/modals/CreateAgentModal";
import CreateUsernameModel from "../components/modals/CreateUsernameModel";



export const  ModalProvider = () => {
  const [isMounted, setIsmounted] = useState(false);

  useEffect(() => {
    setIsmounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
    <AuthUserModel />
    <CreateAgentModal />
    <CreateUsernameModel />
    </>
  );
};