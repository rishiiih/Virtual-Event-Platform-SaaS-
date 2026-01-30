const Modal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', confirmColor = 'primary' }) => {
  if (!isOpen) return null;

  const colorClasses = {
    primary: 'bg-primary hover:bg-primary/90',
    red: 'bg-red-500 hover:bg-red-600',
    accent: 'bg-accent hover:bg-accent/90',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-primary-dark mb-4">{title}</h3>
        <p className="text-primary-dark/70 mb-8">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-primary/30 text-primary-dark rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-3 text-white rounded-lg transition-colors font-medium ${colorClasses[confirmColor]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
