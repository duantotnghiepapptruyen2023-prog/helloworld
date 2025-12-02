import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./KhuyenMaiLayout.scss";
import { useTranslation } from "react-i18next";

const KhuyenMaiLayout = () => {
  const [promotions, setPromotions] = useState([]);
  const { t, i18n } = useTranslation();
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${apiUrl}/${t("apikhuyenmai")}`)
      .then((response) => {
        setPromotions(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách khuyến mãi:", error);
      });
  }, [i18n.language]);

  return (
    <div className="container-khuyenmai">
      <div className="setting-header">
        <Link to="/">
          <div className="setting-ic-back">
            <img src="/back.png" alt="Back" />
          </div>
        </Link>
        <div className="setting-text">{t("khuyenmai")}</div>
      </div>

      <div className="container-khuyenmai2">
        <div className="all-promotions">{t("allkhuyenmai")}</div>
        <div className="promotion-list">
          {promotions.map((promo) => (
            <div className="promotion-card" key={promo.id}>
              <Link to={`/khuyenmai/${promo.id}`} state={promo.photo}>
                <img src={`${apiUrl}/${promo.banner}`} alt={promo.name} />
              </Link>
            </div>
          ))}
        </div>
        <div className="box-height"></div>
      </div>
    </div>
  );
};

export default KhuyenMaiLayout;
