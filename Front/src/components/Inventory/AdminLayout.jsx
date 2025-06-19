import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styles from '../../styles/Inventory/AdminDashboard.module.css';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isBloomTagModalOpen, setIsBloomTagModalOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <div className={styles.dashboardWrapper}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Admin Panel</h2>
        <nav className={styles.navList}>
          <button
            onClick={() => navigate('/admin')}
            className={isActive('/admin') ? styles.active : ''}
          >
            🧑‍💼 Admin Dashboard
          </button>
          <button
            onClick={() => navigate('/admin/city')}
            className={isActive('/admin/city') ? styles.active : ''}
          >
            🏙 City Edit
          </button>
          <button
            onClick={() => navigate('/admin/payment')}
            className={isActive('/admin/payment') ? styles.active : ''}
          >
            💳 Payment Status
          </button>
          <button
            onClick={() => navigate('/admin/delivery')}
            className={isActive('/admin/delivery') ? styles.active : ''}
          >
            👤 Assign Delivery
          </button>
          <button
            onClick={() => navigate('/admin/faq')}
            className={isActive('/admin/faq') ? styles.active : ''}
          >
            ❓ FAQ
          </button>
          <button
            onClick={() => navigate('/admin/banner')}
            className={isActive('/admin/banner') ? styles.active : ''}
          >
            🖼 Add Banner
          </button>
          <button
            onClick={() => navigate('/admin/form')}
            className={isActive('/admin/form') ? styles.active : ''}
          >
            ➕ Add New Item
          </button>
          <button
            onClick={() => navigate('/admin/customization')}
            className={isActive('/admin/customization') ? styles.active : ''}
          >
            🌸 Customization
          </button>
          <button
            onClick={() => setIsBloomTagModalOpen(true)}
            className={isBloomTagModalOpen ? styles.active : ''}
          >
            🏷 Manage Bloom Tags
          </button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
