// Modal.js
import { createPortal } from "react-dom";

const Modal = ({ children, isOpen, onClose, tittle }) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md shadow-md w-100 max-w-full p-6 border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;