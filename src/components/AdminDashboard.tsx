import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { SystemAnalytics } from '../types';
import { ShieldCheck, Users, Stethoscope, Calendar, DollarSign, Activity, CheckCircle, XCircle } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, logsRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/audit-logs')
      ]);
      setAnalytics(analyticsRes.data.data);
      setAuditLogs(logsRes.data.data || []);
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldCheck color="var(--primary)" /> Executive Platform Dashboard
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading system telemetry...</div>
      ) : (
        <>
          {/* Analytics Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#ccfbf1', padding: '0.75rem', borderRadius: '12px', color: 'var(--primary-dark)' }}>
                <Users size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Registered Users</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{analytics?.totalRegisteredUsers || 0}</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '12px', color: '#b45309' }}>
                <Stethoscope size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Verified Doctors</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{analytics?.totalVerifiedDoctors || 0}</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#e0f2fe', padding: '0.75rem', borderRadius: '12px', color: '#0369a1' }}>
                <Calendar size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Total Consultations</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{analytics?.totalConsultationsBooked || 0}</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: '12px', color: '#15803d' }}>
                <DollarSign size={28} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Platform Revenue</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>₹{analytics?.totalPlatformRevenue || 0}</span>
              </div>
            </div>
          </div>

          {/* Compliance Audit Trail Table */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Activity size={20} color="var(--primary)" /> Immutable Compliance Audit Logs
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-light)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Timestamp</th>
                    <th style={{ padding: '0.75rem' }}>Action</th>
                    <th style={{ padding: '0.75rem' }}>Resource</th>
                    <th style={{ padding: '0.75rem' }}>User Email</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>No audit logs recorded yet.</td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                          {log.action}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          <span className="badge badge-info">{log.resource}</span>
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          {log.user?.email || 'System Operation'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
