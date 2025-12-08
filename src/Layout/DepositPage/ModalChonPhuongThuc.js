import React from "react";
import "./ModalChonPhuongThuc.scss";
import { useNavigate } from "react-router-dom";
import CheckCrypto from "../../component/CheckCrypto/CheckCrypto";

export default function ModalChonPhuongThuc({ isOpen, onSelect,page }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-ptnap">
      <div className="modal-method">
        <div className="modal-header">
          <div className="modal-title">NẠP/RÚT TIỀN</div>
          <div
            className="modal-close"
            onClick={() => navigate('/')}
          >
            ✕
          </div>
        </div>

        <div className="modal-subtitle">Nhanh – An toàn – Tiện lợi</div>

        {/* NGÂN HÀNG */}
        <div className="method-item" onClick={() => onSelect("qr")}>
          <div className="method-icon">
            <img src="/vnd.webp" alt="bank" />
          </div>
          <div className="method-info">
            <div className="method-name">NGÂN HÀNG</div>
            <div className="method-desc">Dễ dàng thanh toán</div>
          </div>
        </div>

        {/* BEP-20 */}
        <div className="method-item" onClick={() => {
    if (page === "withdraw") {
        CheckCrypto(navigate, () => onSelect("usdt"));
    } else {
        onSelect("usdt");
    }
}}>
          <div className="method-icon">
            <img src="/usdt.webp" alt="bep20" />
          </div>
          <div className="method-info">
            <div className="method-name">BEP-20</div>
            <div className="method-desc">An toàn bảo mật</div>
          </div>
        </div>
      </div>
    </div>
  );
}
