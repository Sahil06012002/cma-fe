interface ModalProps {
    onClose: () => void;
    children: React.ReactNode;
  }
  
const Modal = ({ onClose, children }: ModalProps) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-4 rounded shadow-md max-w-lg w-full">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
          >
            X
          </button>
          <div>{children}</div>
        </div>
      </div>
    );
  };

export default Modal;
  