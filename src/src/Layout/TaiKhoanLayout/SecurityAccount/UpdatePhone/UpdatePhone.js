/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import "./UpdatePhone.scss";
import { Link } from "react-router-dom";
import { ModalCapCha } from "../../../../component/ModalCapCha";
import { Loading } from "../../../../component/Loading";
import {
  getFromsessionstorage,
  getFromlocalstorage,
} from "../../../../component/MaHoaDuLieu";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../../component/UserProvider/UserProvider";
import { Notify } from "../../../../component/Notify";
const UpdatePhone = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [modalCapcha, setModalCapcha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Message, setMessage] = useState("");
  const [typenoti, settypenoti] = useState("error");
  const data =
    JSON.parse(getFromsessionstorage("data_u")) ||
    JSON.parse(getFromlocalstorage("data_u"));
  const { t } = useTranslation();
  const hasFetched = useRef(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const { user, fetchUser } = useUser();

  useEffect(() => {
    if (data && !hasFetched.current) {
      fetchUser(data._id);
      hasFetched.current = true;
    }
  }, [data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber) {
      setMessage(t("vuilongnhapsdt"));
      settypenoti("error");
      return;
    }
    setModalCapcha(true);
  };

  const handleUpdatePhone = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/postphone/${data._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(t("capnhatthanhcong"));
        settypenoti("success");
      } else {
        setMessage(result.message || t("capnhatthatbaicryto"));
        settypenoti("error");
      }
    } catch (error) {
      setMessage(t("loiketnoi"));
      settypenoti("error");
    } finally {
      setLoading(false);
      setModalCapcha(false);
    }
  };

  useEffect(() => {
    if (user?.phone) {
      setPhoneNumber(user.phone);
    }
  }, [user]);

  return (
    <>
      <div className="security-phone-container">
        <div className="setting-header">
          <Link to="/member">
            <div className="setting-ic-back">
              <img src="/back.png" alt="Back" />
            </div>
          </Link>
          <div className="setting-text">{t("thaydoisdt")}</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="security-phone-form">
            <div className="phone-form-group">
              <div className="tcapnhat">
                {t("capnhatsdt")} (<span>*</span>)
              </div>
              <input
                type="tel"
                id="phone-number"
                placeholder={t("nhapsdtcuaban")}
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <button type="submit" className="phone-submit-button">
              {t("capnhat")}
            </button>
          </div>
        </form>
      </div>

      {Message && (
        <Notify message={Message} type={typenoti} setcontent={setMessage} />
      )}

      <ModalCapCha
        isOpen={modalCapcha}
        onClose={() => setModalCapcha(false)}
        loading={loading}
        setLoading={setLoading}
        Event={handleUpdatePhone}
      />

      <Loading isLoading={loading} />
    </>
  );
};

export default UpdatePhone;
