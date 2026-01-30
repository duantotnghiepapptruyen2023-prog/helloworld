import React from "react";
import "./ModalChonPhuongThuc.scss";
import { useNavigate } from "react-router-dom";
import CheckCrypto from "../../component/CheckCrypto/CheckCrypto";
import { useTranslation } from "react-i18next";

export default function ModalChonPhuongThuc({ isOpen, onSelect, page }) {
  const navigate = useNavigate();
  const { t } = useTranslation()
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-ptnap">
      <div className="modal-method">
        <div className="modal-header">
          <div className="modal-title">{t('naprut')}</div>
          <div
            className="modal-close"
            onClick={() => navigate('/')}
          >
            ✕
          </div>
        </div>

        <div className="modal-subtitle">รวดเร็ว ปลอดภัย สะดวกสบาย</div>

        {/* NGÂN HÀNG */}
        <div className="method-item" onClick={() => onSelect("qr")}>
          <div className="method-icon">
            <img src="/logobankqr.png" alt="bank" />
          </div>
          <div className="method-info">
            <div className="method-name">ACERPAY</div>
            <div className="method-desc">{t('dedang')}</div>
          </div>
        </div>
        {/* chờ api */}
        {/* <div
  className="method-item"
  onClick={() => onSelect("bank_transfer")}
>
  <div className="method-icon">
    <img src="/logobankqr.png" alt="bank-transfer" />
  </div>
  <div className="method-info">
    <div className="method-name">CHUYỂN KHOẢN</div>
    <div className="method-desc">Chuyển khoản thủ công</div>
  </div>
</div> */}
        {/* BEP-20 */}
        <div className="method-item" onClick={() => {
          if (page === "withdraw") {
            CheckCrypto(navigate, () => onSelect("usdt"));
          } else {
            onSelect("usdt");
          }
        }}>
          <div className="method-icon-1">
            <img src="/usdt.webp" alt="bep20" />
          </div>
          <div className="method-info">
            <div className="method-name">BEP-20</div>
            <div className="method-desc">{t('antoan')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
