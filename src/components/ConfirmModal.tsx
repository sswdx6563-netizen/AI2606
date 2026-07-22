import { Icon } from "./Icon";

interface ConfirmModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "primary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  description,
  confirmLabel,
  cancelLabel = "계속 풀기",
  tone = "primary",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onCancel}>
      <section
        className="modal-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="icon-button modal-close" onClick={onCancel} aria-label="닫기">
          <Icon name="close" />
        </button>
        <p className="eyebrow">확인</p>
        <h2 id="modal-title">{title}</h2>
        <p id="modal-description">{description}</p>
        <div className="modal-actions">
          <button className="button secondary" onClick={onCancel}>{cancelLabel}</button>
          <button className={`button ${tone === "danger" ? "danger" : "primary"}`} onClick={onConfirm} autoFocus>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}
