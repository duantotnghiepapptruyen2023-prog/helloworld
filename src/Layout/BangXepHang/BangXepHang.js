/* eslint-disable react-hooks/exhaustive-deps */
import "./BangXepHang.scss";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import axios from "axios";

function BangXepHang({userId}) {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [yourRank, setYourRank] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/getbangxephang/${userId}`);
        setLeaderboard(res.data.top10);
        setYourRank(res.data.yourRank);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [userId]);

  const isInTop10 = leaderboard.some(
    (player) => player.username === yourRank?.username
  );

  return (
    <div className="leaderboard">
      <div className="leaderboard-title">{t("bxh")}</div>
      <div className="leaderboard-list-container">
        <ul className="leaderboard-list">
          <li className="leaderboard-item">
            <span className="col-rank">{t("rank")}</span>
            <span className="col-medal"></span>
            <span className="col-username">{t("nguoidung")}</span>
          </li>

          {leaderboard.map((player, index) => {
            const isCurrentUser = player.username === yourRank?.username;
            return (
              <li
                key={index}
                className={`leaderboard-item rank-${index + 1} ${
                  isCurrentUser ? "highlight_ranking" : ""
                }`}
              >
                <span className="col-rank">{player.rank}</span>
                <span className="col-medal">
                  <img
                    src={
                      index === 0
                        ? "/bxh/top1.png"
                        : index === 1
                        ? "/bxh/top2.png"
                        : index === 2
                        ? "/bxh/top3.png"
                        : "/bxh/topcuoi.png"
                    }
                    alt=""
                  />
                </span>
                <span className="col-username">{player.username}</span>
                {/* <span className='col-score'>{player.totalBonus}</span> */}
              </li>
            );
          })}
        </ul>

        {!isInTop10 && yourRank && (
          <div className="your-rank">
            <div>#{yourRank.rank}</div>
            {/* <div style={{ display: "flex", alignItems: "center" }}>
              {yourRank.totalBonus}
              <img
                src="/coin.png"
                alt=""
                style={{ width: "30px", height: "30px" }}
              />
            </div> */}
            <div>{yourRank.username}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BangXepHang;
