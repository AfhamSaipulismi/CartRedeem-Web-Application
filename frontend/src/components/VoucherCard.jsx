/**
 * @param {{
 *   image: string,
 *   imageAlt: string,
 *   badge: 'VALID' | 'EXPIRING',
 *   title: string,
 *   description: string,
 *   icon: string,
 *   onExplore: () => void,
 * }} props
 */
const VoucherCard = ({ image, imageAlt, badge, title, description, icon, onExplore }) => {
  const badgeClass =
    badge === 'VALID'
      ? 'voucher-card__badge voucher-card__badge--valid'
      : 'voucher-card__badge voucher-card__badge--expiring';

  return (
    <div className="voucher-card">
      {/* Card image */}
      <div className="voucher-card__image-wrap">
        <img src={image} alt={imageAlt} className="voucher-card__image" />
        <div className={badgeClass}>{badge}</div>
      </div>

      {/* Card body with ticket-notch effect */}
      <div className="voucher-card__body">
        <div className="voucher-card__header">
          <h3 className="voucher-card__title">{title}</h3>
          <span className="material-symbols-outlined voucher-card__icon">{icon}</span>
        </div>
        <p className="voucher-card__desc">{description}</p>
        <button className="voucher-card__cta" onClick={onExplore}>
          Explore{' '}
          <span className="material-symbols-outlined">open_in_new</span>
        </button>
      </div>
    </div>
  );
};

export default VoucherCard;
