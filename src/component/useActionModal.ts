import { useCallback, useState } from "react";

type Variant = "success" | "error";

export default function useActionModal() {
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalVariant, setModalVariant] = useState<Variant>("success");

  const showSuccess = useCallback((message: string) => {
    setModalVariant("success");
    setModalMessage(message);
  }, []);

  const showError = useCallback((message: string) => {
    setModalVariant("error");
    setModalMessage(message);
  }, []);

  const closeModal = useCallback(() => {
    setModalMessage(null);
  }, []);

  return {
    modalMessage,
    modalVariant,
    showSuccess,
    showError,
    closeModal,
  };
}
