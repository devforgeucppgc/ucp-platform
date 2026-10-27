import Modal from "./Modal";

export default function ConfirmDialog({ open, title = "Confirm", message, onCancel, onConfirm }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}