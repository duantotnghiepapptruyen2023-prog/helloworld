import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import './QrNapTien.scss'
import CountdownTimer from '../../../component/CountDownTimer/CountDownTimer'
import { useTranslation } from 'react-i18next'
// import axios from "axios";
// import ModalSuccess from "./ModalSuccess/ModalSuccess";
import { useSearchParams } from 'react-router-dom'

import Notify from '../../../component/Notify/Notify'
const QrNapTien = () => {
  const [notification, setNotification] = useState('')
  const { amount } = useParams()
  // const location = useLocation()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const referralCode = searchParams.get('code')

  // const [transactionVerified, setTransactionVerified] = useState(false);

  // const getQueryParam = param => {
  //   const searchParams = new URLSearchParams(location.search)
  //   return searchParams.get(param)
  // }

  // const depositCode = getQueryParam('code')

  const copyToClipboard = text => {
    navigator.clipboard.writeText(text)
    setNotification(t('dacopy'))
  }

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     const checkTransaction = async () => {
  //       try {
  //         const response = await axios.post(
  //           "https://api.ae8.club/transactions",
  //           {
  //             username: "25905194THINHLV",
  //             password: "@Nguyenvietanh1",
  //             accountNumber: "8640056119",
  //           }
  //         );
  //         const transactionsFromAPI = response.data.data.data.items;

  //         const matchedTransaction = transactionsFromAPI.find(
  //           (apiTrans) =>
  //             apiTrans.content && apiTrans.content.includes(depositCode)
  //         );

  //         if (matchedTransaction) {
  //           setTransactionVerified(true);
  //           clearInterval(intervalId);
  //         } else {
  //           setTransactionVerified(false);
  //         }
  //       } catch (error) {
  //         console.error("Lỗi khi kiểm tra giao dịch:", error);
  //       }
  //     };

  //     checkTransaction();
  //   }, 7000);

  //   return () => clearInterval(intervalId);
  // }, [depositCode]);

  return (
    <div className='container-qrnaptien'>
      {notification && (
        <Notify
          message={notification}
          setcontent={setNotification}
          type='success'
        />
      )}
      <div className='setting-header'>
        <Link to='/member/deposit'>
          <div className='setting-ic-back'>
            <img src='/back.png' alt='Back' />
          </div>
        </Link>
        <div className='setting-text'>{t('xacnhannaptien')}</div>
        <CountdownTimer initialTime={300} />
      </div>
      <div className='body-qr'>
        <div className='maqr'>
          <h4>{t('quetmadeck')}</h4>
          {/* <img src={`${bankjson.qrImageUrl}`} alt='QR Code' /> */}

          <div className='uniform'>
            <p>
              {t('nganhang')}: <b>SCB</b>
            </p>
            <p
              className='usdt-address'
              style={{ marginBottom: '10px', marginTop: '10px' }}
            >
              {t('stk')}: <b>{'3392815339'}</b>
              <img
                src='/copy.png'
                className='icon-copy'
                onClick={() => copyToClipboard(`${'3392815339'}`)}
                alt='Copy'
              />
            </p>

            <p>{t('chutaikhoan')}:</p>
            <p
              className='usdt-address'
              style={{ marginBottom: '10px', marginTop: '10px' }}
            >
              <b>{'Klap Ma Ruay Wood Pallet Co., Ltd.'}</b>
              <img
                src='/copy.png'
                className='icon-copy'
                onClick={() =>
                  copyToClipboard(`${'Klap Ma Ruay Wood Pallet Co., Ltd.'}`)
                }
                alt='Copy'
              />
            </p>
            <p>
              {t('sotien')}: <b>{parseInt(amount).toLocaleString()} Baht</b>
            </p>
            <p
              className='usdt-address'
              style={{ marginBottom: '10px', marginTop: '10px' }}
            >
              {t('noidung')}: <b>{`Deposit ${referralCode}`}</b>
              <img
                src='/copy.png'
                className='icon-copy'
                onClick={() => copyToClipboard(`Deposit ${referralCode}`)}
                alt='Copy'
              />
            </p>
          </div>
        </div>
        <div className='btnnapproceed'>
          <div className='btn-proceed-nap'>
            <Link to='/member/transactionhistory'>{t('xacnhan')}</Link>
          </div>
        </div>
      </div>
      {/* <ModalSuccess
        isOpen={transactionVerified}
        OnClose={() => setTransactionVerified(false)}
      /> */}
    </div>
  )
}

export default QrNapTien
