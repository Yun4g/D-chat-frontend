import { motion, AnimatePresence } from "framer-motion";
import { MdCheckCircle, MdError } from "react-icons/md";

interface SlideDownModalProps {
  open: boolean;
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

const SlideDownModal = ({
  open,
  type,
  message,
  onClose,
}: SlideDownModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50
            px-6 py-3 rounded-xl shadow-lg flex items-center gap-3
            ${type === "success" ? "bg-green-500" : "bg-red-500"}
          `}
        >
          {type === "success" ? (
            <MdCheckCircle size={22} className="text-white" />
          ) : (
            <MdError size={22} className="text-white" />
          )}

          <p className="text-white text-sm font-medium">{message}</p>

          <button
            onClick={onClose}
            className="ml-4 text-white text-lg leading-none"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlideDownModal;
