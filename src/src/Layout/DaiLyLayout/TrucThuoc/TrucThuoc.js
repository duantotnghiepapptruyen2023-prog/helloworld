/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import "./TrucThuoc.scss";
import { Link } from "react-router-dom";
import {
  getFromsessionstorage,
  getFromlocalstorage,
} from "../../../component/MaHoaDuLieu";
import { useTranslation } from "react-i18next";
import { Loading } from "../../../component/Loading";

const TrucThuoc = () => {
  const userdata =
    JSON.parse(getFromsessionstorage("data_u")) ||
    JSON.parse(getFromlocalstorage("data_u"));
  const hasFetched = useRef(false);
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchdata = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/getf1/${userdata.id}`);
      const data = await response.json();
      if (response.ok) {
        setData(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userdata && !hasFetched.current) {
      fetchdata();
      hasFetched.current = true;
    }
  }, [userdata]);

  return (
    <div className="transaction-container">
      <div className="transaction-header">
        <Link to="/daily">
          <div className="ic-back">
            <img src="/back.png" alt="Back" />
          </div>
        </Link>
        <div className="transaction-text">F1</div>
        <div className="spacer"></div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr className="th-tructhuoc">
              <th>STT</th>
              <th>User</th>
              <th>{t("ngaygioithieu")}</th>
            </tr>
          </thead>
          <tbody className="container-bang">
            {data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.username}</td>
                <td>{item.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="box-height"></div>
      </div>
      <Loading isLoading={isLoading} />
    </div>
  );
};

export default TrucThuoc;
