import React from "react";
import { Link } from "react-router-dom";
import "./Setting.scss";
import { useTranslation } from "react-i18next";



const Setting = () => {
  const { t } = useTranslation();

  const menuItems = [
    { title: t('vechungtoi'), path: "/member/setting/aboutme" },
    { title: t('chinhsachbaomat'), path: "/member/setting/policy" },
    { title: t('trogiup'), path: "/member/setting/help" },
  ];
  return (
    <div className="setting-container">
      <div className="setting-header">
        <Link to="/member">
          <div className="setting-ic-back">
            <img src="/back.png" alt="Back" />
          </div>
        </Link>
        <div className="setting-text">{t('caidat')}</div>
      </div>

      <div className="setting-menu">
        {menuItems.map((item, index) => (
          <Link to={item.path} key={index}>
            <div className="setting-menu-item">
              <div className="setting-item-title">{item.title}</div>
              <div className="setting-ic">
                <img src="/next.png" alt="Next" />
              </div>
            </div>
          </Link>
        ))}

        <div className="setting-menu-item">
          <div className="setting-item-title">{t('phienbanso')}</div>
          <div className="setting-item-version">1.0.0</div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
