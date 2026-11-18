import React, { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

/* ─────────────────────────────────────────────
   DESIGN TOKENS — identiques à ClientsList
───────────────────────────────────────────── */
const tk = {
  ink:        '#171614',
  ink80:      '#26231e',
  surface:    '#faf8f5',
  surf2:      '#f5efe6',
  border:     '#e9e1d5',
  accent:     '#a77b28',
  accentDark: '#8a6520',
  emerald:    '#059669',
  amber:      '#d97706',
  rose:       '#dc2626',
  purple:     '#7c3aed',
  textSec:    '#4b5a6e',
  textMut:    '#8494a9',
};

const inputStyle = {
  width: '100%', padding: '10px 14px 10px 38px', borderRadius: 10,
  background: '#fff', color: tk.ink, fontSize: 14,
  border: `1.5px solid ${tk.border}`, outline: 'none',
  fontFamily: "'DM Sans', sans-serif", transition: 'border .18s',
};

const DataTable = ({
  columns = [],
  data,
  onRowClick,
  onSort,
  onSearch,
  pagination = true,
  pageSize = 10,
  loading = false,
  emptyMessage = "Aucune donnée disponible",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const safeData = Array.isArray(data) ? data : [];

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
    if (onSort) onSort(key, direction);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    if (onSearch) onSearch(value);
  };

  const totalPages = Math.ceil(safeData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = pagination ? safeData.slice(startIndex, endIndex) : safeData;

  return (
    <div style={{
      background: '#fff', borderRadius: 20,
      border: `1.5px solid ${tk.border}`,
      boxShadow: '0 2px 8px rgba(23,22,20,.05)',
      overflow: 'hidden',
    }}>
      {/* Barre de recherche */}
      {onSearch && (
        <div style={{
          padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
        }}>
          <div style={{ position: 'relative', maxWidth: 320 }}>
            <MagnifyingGlassIcon style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
              width: 16, height: 16, color: tk.textMut,
            }} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>
      )}

      {/* Tableau */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontSize: 11, fontWeight: 600, color: tk.textMut,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}>
                  {column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 11, fontWeight: 600, color: tk.textMut,
                        padding: 0, transition: 'color .15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = tk.accent; }}
                      onMouseLeave={e => { e.currentTarget.style.color = tk.textMut; }}
                    >
                      {column.label}
                      {sortConfig.key === column.key && (
                        sortConfig.direction === 'asc'
                          ? <ChevronUpIcon style={{ width: 12, height: 12 }} />
                          : <ChevronDownIcon style={{ width: 12, height: 12 }} />
                      )}
                    </button>
                  ) : column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '48px 24px' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', margin: '0 auto',
                    border: `3px solid ${tk.border}`, borderTopColor: tk.accent,
                    animation: 'spin 0.8s linear infinite',
                  }} />
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((row, index) => (
                <tr
                  key={row._id || row.id || index}
                  onClick={() => onRowClick && onRowClick(row)}
                  style={{
                    borderBottom: `1px solid ${tk.border}`,
                    transition: 'background 0.15s',
                    cursor: onRowClick ? 'pointer' : 'default',
                    background: '#fff',
                  }}
                  onMouseEnter={e => {
                    if (onRowClick) e.currentTarget.style.background = tk.surface;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#fff';
                  }}
                >
                  {columns.map((column) => (
                    <td key={column.key} style={{
                      padding: '14px 16px',
                      fontSize: 13, color: tk.ink,
                      whiteSpace: 'nowrap',
                    }}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : (row[column.key] ?? <span style={{ color: tk.textMut }}>—</span>)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{
                  textAlign: 'center', padding: '48px 24px',
                  fontSize: 13, color: tk.textMut,
                }}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div style={{
          padding: '12px 20px', background: tk.surface, borderTop: `1px solid ${tk.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ fontSize: 12, color: tk.textMut }}>
            {startIndex + 1}–{Math.min(endIndex, safeData.length)} sur {safeData.length} résultats
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              style={{
                width: 32, height: 32, borderRadius: 8,
                border: `1.5px solid ${tk.border}`, background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.4 : 1,
                transition: 'all .15s',
              }}
            >
              <ChevronLeftIcon style={{ width: 14, height: 14, color: tk.textSec }} />
            </button>
            <span style={{ fontSize: 13, color: tk.textSec }}>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                width: 32, height: 32, borderRadius: 8,
                border: `1.5px solid ${tk.border}`, background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.4 : 1,
                transition: 'all .15s',
              }}
            >
              <ChevronRightIcon style={{ width: 14, height: 14, color: tk.textSec }} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default DataTable;