import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Space } from "antd";
import Notify from "../Notify/Notify";
import axios from "axios";
import "./ModalOtp.scss";
import { useTranslation } from "react-i18next";

const ModalCapCha = ({ isOpen, onClose, Event, phone }) => {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [type, settype] = useState("error");
  const inputRefs = useRef([]);
  const { t } = useTranslation();
  const apiopt = process.env.REACT_APP_API_PHONE_OTP;
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (isOpen) {
      setOtpValues(["", "", "", "", "", ""]);
      setMessage("");
    }
  }, [isOpen]);

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${apiopt}/postcountotp`, {
        phone,
        token:
          "1b3531823a99948778f91690fb2b3fc535901bf527f270243308c1460c2a52d9",
      });
      if (res.status === 201) {
        settype("success");
        setMessage(t("daguithanhcong"));
        setCountdown(60);
      }
    } catch (err) {
      settype("error");

      setMessage(err.response?.data?.message || t("daguithatbai"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleConfirm = async () => {
    const otp = otpValues.join("");
    try {
      setLoading(true);
      const res = await axios.post(`${apiopt}/verifyotp`, { phone, otp });

      if (res.status === 200) {
        settype("success");
        setMessage(t("xacthucthanhcong"));
        Event();
        onClose();
      }
    } catch (err) {
      settype("error");
      setMessage(err.response?.data?.message || t("xacthucthatbai"));
    } finally {
      setLoading(false);
    }
  };
if (!isOpen) return null

  const handleCloseClick = () => {
    onClose()
  }
  return (
    <>
    <div className='modal-backdrop' onClick={handleCloseClick}></div>
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      className="otp-modal"
      wrapClassName="captcha"
      centered
    >
      <h2>{t("xacthucotp")}</h2>
      <p>{t('nhapotp')} {phone}</p>

      <div className="otp-input-group">
        {otpValues.map((val, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="otp-box"
            value={val}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        ))}
      </div>

      <Space
        direction="vertical"
        size="middle"
        style={{ width: "100%", marginTop: 24 }}
      >
        <Button
          type="default"
          block
          onClick={handleSendOtp}
          disabled={countdown > 0}
          className="resend-btn"
        >
          {countdown > 0 ? `${t("guilaisau")} ${countdown}s` : t("guilaima")}
        </Button>

        <Button
          type="primary"
          block
          onClick={handleConfirm}
          loading={loading}
          disabled={otpValues.join("").length !== 6}
        >
          {t("xacnhan")}
        </Button>

        {message && (
          <Notify message={message} type={type} setcontent={setMessage} />
        )}
      </Space>
    </Modal>
    </>
  );
};

export default ModalCapCha;
