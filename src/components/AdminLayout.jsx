'use client';

import styles from './AdminLayout.module.css';
import Link from 'next/link';

const AdminTableWrap = ({ children, className, ...props }) => {
  return (
    <div className={`${styles['adm-table-wrap']} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};
AdminTableWrap.displayName = 'AdminLayout.AdminTableWrap';

const AdminTable = ({ children, className, ...props }) => {
  return (
    <table className={`${styles['adm-table']} ${className || ''}`} {...props}>
      {children}
    </table>
  );
};
AdminTable.displayName = 'AdminLayout.AdminTable';

const AdminTableDiv = ({ children, className, ...props }) => {
  return (
    <div className={`${styles['adm-table']} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};
AdminTableDiv.displayName = 'AdminLayout.AdminTableDiv';

const AdminColBoolWide = ({ className, ...props }) => {
  return <col className={`${styles['adm-col-bool-wide']} ${className || ''}`} {...props} />;
};
AdminColBoolWide.displayName = 'AdminLayout.AdminColBoolWide';

const AdminPanel = ({ children, className, ...props }) => {
  return (
    <div className={`${styles['adm-panel']} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};
AdminPanel.displayName = 'AdminLayout.AdminPanel';

const AdminSection = ({ children, className, ...props }) => {
  return (
    <div className={`${styles['adm-section']} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};
AdminSection.displayName = 'AdminLayout.AdminSection';

const AdminFlex = ({ children, className, ...props }) => {
  return (
    <div className={`${styles['adm-flex']} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};
AdminFlex.displayName = 'AdminLayout.AdminFlex';

const AdminPre = ({ children, className, ...props }) => {
  return (
    <pre className={`${styles['adm-pre']} ${className || ''}`} {...props}>
      {children}
    </pre>
  );
};
AdminPre.displayName = 'AdminLayout.AdminPre';

const AdminActions = ({ children, className, ...props }) => {
  return (
    <div className={`${styles['adm-actions']} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};
AdminActions.displayName = 'AdminLayout.AdminActions';

const AdminInput = ({ className, ...props }) => {
  return <input className={`${styles['adm-input']} ${className || ''}`} {...props} />;
};
AdminInput.displayName = 'AdminLayout.AdminInput';

const AdminButton = ({ children, className, ...props }) => {
  return (
    <button className={`${styles['adm-button']} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};
AdminButton.displayName = 'AdminLayout.AdminButton';

const AdminButtonDanger = ({ children, className, ...props }) => {
  return (
    <button className={`${styles['adm-button-danger']} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};
AdminButtonDanger.displayName = 'AdminLayout.AdminButtonDanger';

const AdminLinkButton = ({ children, className, ...props }) => {
  return (
    <Link className={`${styles['adm-button']} ${className || ''}`} {...props}>
      {children}
    </Link>
  );
};
AdminLinkButton.displayName = 'AdminLayout.AdminLinkButton';

const AdminTextarea = ({ children, className, ...props }) => {
  return (
    <textarea className={`${styles['adm-input']} ${className || ''}`} {...props}>
      {children}
    </textarea>
  );
};
AdminTextarea.displayName = 'AdminLayout.AdminTextarea';

const AdminSelect = ({ children, className, ...props }) => {
  return (
    <select className={`${styles['adm-select']} ${className || ''}`} {...props}>
      {children}
    </select>
  );
};
AdminSelect.displayName = 'AdminLayout.AdminSelect';

const AdminSelectBool = ({ children, className, ...props }) => {
  return (
    <select
      className={`${styles['adm-select']} ${styles['adm-select-bool']} ${className || ''}`}
      {...props}
    >
      {children}
    </select>
  );
};
AdminSelectBool.displayName = 'AdminLayout.AdminSelectBool';

const AdminSelectBoolWide = ({ children, className, ...props }) => {
  return (
    <select
      className={`${styles['adm-select']} ${styles['adm-select-bool-wide']} ${className || ''}`}
      {...props}
    >
      {children}
    </select>
  );
};
AdminSelectBoolWide.displayName = 'AdminLayout.AdminSelectBoolWide';

const AdminModalOverlay = ({ children, className, ...props }) => {
  return (
    <div className={`${styles['adm-modal-overlay']} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};
AdminModalOverlay.displayName = 'AdminLayout.AdminModalOverlay';

const AdminModalCard = ({ children, className, ...props }) => {
  return (
    <div className={`${styles['adm-modal-card']} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};
AdminModalCard.displayName = 'AdminLayout.AdminModalCard';

const AdminPageList = ({ children, className, ...props }) => {
  return (
    <div className={`${styles['adm-page-list']} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};
AdminPageList.displayName = 'AdminLayout.AdminPageList';

const AdminPageCard = ({ children, className, title, href, ...props }) => {
  return (
    <Link
      className={`${styles['adm-page-card']} ${className || ''}`}
      href={href}
      title={title}
      {...props}
    >
      {children}
    </Link>
  );
};
AdminPageCard.displayName = 'AdminLayout.AdminPageCard';

const AdminPageCardContent = ({ children, className, ...props }) => {
  return (
    <div className={`${styles['adm-page-card-content']} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};
AdminPageCardContent.displayName = 'AdminLayout.AdminPageCardContent';

export {
  AdminTableWrap,
  AdminTable,
  AdminTableDiv,
  AdminColBoolWide,
  AdminPanel,
  AdminSection,
  AdminFlex,
  AdminPre,
  AdminActions,
  AdminInput,
  AdminButton,
  AdminButtonDanger,
  AdminLinkButton,
  AdminTextarea,
  AdminSelect,
  AdminSelectBool,
  AdminSelectBoolWide,
  AdminModalOverlay,
  AdminModalCard,
  AdminPageList,
  AdminPageCard,
  AdminPageCardContent,
};
