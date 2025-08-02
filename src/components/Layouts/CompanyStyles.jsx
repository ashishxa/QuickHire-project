import React from 'react';

export default function CompanyStyles() {
  return (
    <style>
      {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap');
        
        /* Base Styles */
        .company-portal {
          font-family: 'Inter', sans-serif;
        }
        
        .company-portal h1, .company-portal h2, .company-portal h3, .company-portal h4 {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
        }
        
        /* Hero Section Styling */
        .company-hero {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
          padding: 80px 0 60px;
          position: relative;
          overflow: hidden;
        }
        
        .company-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.3;
        }
        
        .company-hero h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          margin-bottom: 1rem;
        }
        
        .company-hero .custom-breadcrumbs {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 25px;
          padding: 0.5rem 1.5rem;
          display: inline-block;
          backdrop-filter: blur(10px);
        }
        
        .company-hero .custom-breadcrumbs a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .company-hero .custom-breadcrumbs a:hover {
          color: white;
        }
        
        /* Content Card Styling */
        .content-card {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(59, 130, 246, 0.1);
          overflow: hidden;
          margin-bottom: 2rem;
        }
        
        .content-card .card-header {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
          padding: 1.5rem;
        }
        
        .content-card .card-header h4 {
          color: #1e293b;
          font-weight: 600;
          margin: 0;
        }
        
        .content-card .card-body {
          padding: 1.5rem;
        }
        
        /* Table Styling */
        .table {
          border-radius: 10px;
          overflow: hidden;
        }
        
        .table thead th {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: none;
          color: #374151;
          font-weight: 600;
          padding: 1rem;
        }
        
        .table tbody td {
          padding: 1rem;
          border: none;
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
          vertical-align: middle;
        }
        
        .table tbody tr:hover {
          background: rgba(59, 130, 246, 0.05);
        }
        
        /* Button Styling */
        .btn-modern {
          border-radius: 10px;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          transition: all 0.3s ease;
          border: none;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .btn-modern:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          text-decoration: none;
        }
        
        .btn-primary-modern {
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          color: white;
        }
        
        .btn-info-modern {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }
        
        .btn-warning-modern {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
        }
        
        .btn-success-modern {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
        }
        
        .btn-danger-modern {
          background: linear-gradient(135deg, #ef4444, #b91c1c);
          color: white;
        }
        
        /* Form Styling */
        .form-control {
          border-radius: 10px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          padding: 0.75rem 1rem;
          transition: all 0.3s ease;
        }
        
        .form-control:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
        }
        
        .form-label {
          font-weight: 500;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }
        
        /* Status Badge Styling */
        .status-badge {
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
          display: inline-block;
        }
        
        .status-active {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        
        .status-pending {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }
        
        .status-rejected {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }
      `}
    </style>
  );
}