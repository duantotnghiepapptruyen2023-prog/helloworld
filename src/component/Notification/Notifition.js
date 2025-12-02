import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './Notifition.scss';
import { useTranslation } from 'react-i18next';

const Notification = ({ message, isVisible, onClose }) => {
  const [progress, setProgress] = useState(0);
  const duration = 5000;
  const { t } = useTranslation();

  const handleClose = () => {
    setProgress(0);
    onClose();
  };

  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      let startTime = Date.now();

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progressValue = Math.min((elapsed / duration) * 100, 100);
        setProgress(progressValue);

        if (progressValue >= 100) {
          clearInterval(interval);
          setProgress(0);
          onClose();
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isVisible, duration, onClose]);

  // Render bằng Portal để thoát khỏi container-qrnaptien
  return ReactDOM.createPortal(
    <div className="notification-container">
      <div className={`notification ${isVisible ? 'show' : 'hidden'}`}>
        <img src="/assets/images/daily/iconinfor.png" alt="Info Icon" />
        <div className="divndnotification">
          <h3>{t("thongbao")}</h3>
          <p className="ndnotification">{message}</p>
        </div>
        <div className="close-notifi" onClick={handleClose}>
          x
        </div>
        <div className="thanhthoigian">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Notification;