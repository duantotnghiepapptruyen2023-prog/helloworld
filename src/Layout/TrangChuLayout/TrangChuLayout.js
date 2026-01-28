/* eslint-disable react-hooks/exhaustive-deps */
import { useTranslation } from "react-i18next";
import Carousel from "./Carousel/Carousel";
import { useState, useEffect } from "react";
import "./TrangChuLayout.scss";
import Wallet from './Wallet/Wallet'
// import CustomScroll from './TheThao3/CustomScroll'
import MatchCardList from "./MatchCardList/MatchCardList";
import { LuckyWheel } from "./LuckyWheel";
import { Modal } from "antd";
import {
  getFromlocalstorage,
  getFromsessionstorage,
} from "../../component/MaHoaDuLieu";
import Sidebar from "./Sidebar/Sidebar";
import XoSo from "./XoSo/XoSo";
import DaGa from "./DaGa/DaGa";
import TheThao from "./TheThao/TheThao";
import NoHu from "./NoHu/NoHu";
import Casino from "./Casino/Casino";
import { Link, Navigate } from "react-router-dom";

// import { useNavigate } from 'react-router-dom'
function TrangChuLayout() {
  // const navigate = useNavigate()
  const [imageList, setimageList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const [tab, settab] = useState(t('casino'));

  const data_user =
    JSON.parse(getFromlocalstorage("data_u")) ||
    JSON.parse(getFromsessionstorage("data_u"));
  const [result, setResult] = useState(null);

  const apiUrl = process.env.REACT_APP_API_URL;

  const fetcimage = async (req, res) => {
    try {
      const response = await fetch(`${apiUrl}/${t("bannertrangchu123")}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setimageList(data);
      }
    } catch (error) {
      console.error("Lỗi: ", error);
    }
  };
  useEffect(() => {
    fetcimage();
  }, [t]);

  const showModal = () => {
    if (data_user) {
      setIsModalOpen(true);
    } else {
      Navigate("/login");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setResult(null);
  };

  return (
    <div className="trangchu_container">
      <Carousel images={imageList} />
      <Wallet/>
      <div className="home_globby">
        <Sidebar tab={tab} settab={settab} />
        {tab === "Phản Tỷ Số" && <MatchCardList />}
        {tab === t("thethao") && <TheThao />}
        {tab === t('casino') && <Casino />}
        {tab === t('slot') && <NoHu />}
        {tab === t('daga') && <DaGa />}
        {tab === t('lode') && <XoSo />}
      </div>
      {/* <Link to="/cskh" className="vongquay-wrapper">
        <img src="/vongquay.png" alt="" className="imgvongquay" />
      </Link> */}

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        width={600}
        className="modal_wheel"
      >
        <LuckyWheel
          userId={data_user?._id}
          apiUrl={apiUrl}
          result={result}
          setResult={setResult}
        />
      </Modal>
      <div style={{ height: "100px" }}></div>
    </div>
  );
}

export default TrangChuLayout;
