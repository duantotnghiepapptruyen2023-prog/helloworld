import { t } from 'i18next'
import './ModalKetQua.scss'

function ModalKetQua ({ ketqua, luotquay, onClose, onSpinAgain }) {
  return (
    <div className='modal-ketqua-overlay'>
      <div
        className='modal-ketqua-container'
        onClick={e => e.stopPropagation()}
      >
        <div className='modal-ketqua-confetti'></div>
        <h2 className='modal-ketqua-title'>🎉 {t('chucmung')}</h2>
        <p className='modal-ketqua-content'>
          {t('chucmung')}: <strong>{ketqua} points</strong>
        </p>
        <p className='modal-ketqua-content'>
          {luotquay > 0 ? (
            <>
              {t('banvancon')}: <strong>{luotquay}</strong>{' '}
              {t('luotquaymienphi')}
            </>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <div>{t('hetluot')}</div>
              <div>{t('moibanben3')}</div>
            </div>
          )}
        </p>

        <div className='modal-ketqua-buttons'>
          {luotquay > 0 && (
            <button className='modal-ketqua-tiep' onClick={onSpinAgain}>
              {t('quaytiep')}
            </button>
          )}
          <button className='modal-ketqua-button' onClick={onClose}>
            {t('dong')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalKetQua
