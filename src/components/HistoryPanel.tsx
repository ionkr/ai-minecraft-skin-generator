import { useState, useEffect } from 'react';
import { skinStorage } from '../utils/skinStorage';
import type { SkinHistoryItem } from '../types/skin';

interface HistoryPanelProps {
  onSkinSelect: (skinData: string) => void;
  currentSkinId?: string;
}

export function HistoryPanel({ onSkinSelect, currentSkinId }: HistoryPanelProps) {
  const [history, setHistory] = useState<SkinHistoryItem[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Load history on mount and when storage changes
  useEffect(() => {
    loadHistory();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadHistory();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadHistory = () => {
    const items = skinStorage.getHistoryItems();
    setHistory(items);
  };

  const handleSkinClick = (id: string) => {
    const skin = skinStorage.getSkinById(id);
    if (skin) {
      onSkinSelect(skin.imageData);
    }
  };

  const handleDelete = (id: string) => {
    skinStorage.deleteSkin(id);
    loadHistory();
    setShowDeleteConfirm(null);
  };

  const handleClearAll = () => {
    if (window.confirm('모든 히스토리를 삭제하시겠습니까?')) {
      skinStorage.clearHistory();
      loadHistory();
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="history-panel">
      <div className="history-header">
        <h3>히스토리 ({history.length})</h3>
        {history.length > 0 && (
          <button onClick={handleClearAll} className="clear-all-button" title="모두 삭제">
            🗑️
          </button>
        )}
      </div>

      <div className="history-list">
        {history.length === 0 ? (
          <div className="empty-history">
            <p>저장된 스킨이 없습니다.</p>
            <p>스킨을 생성하거나 편집하면 자동으로 저장됩니다.</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className={`history-item ${currentSkinId === item.id ? 'active' : ''}`}
            >
              <div
                className="history-thumbnail"
                onClick={() => handleSkinClick(item.id)}
                title="클릭하여 불러오기"
              >
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>

              <div className="history-info">
                <div className="history-name" title={item.name}>
                  {item.name}
                </div>
                {item.prompt && (
                  <div className="history-prompt" title={item.prompt}>
                    {item.prompt}
                  </div>
                )}
                <div className="history-date">{formatDate(item.createdAt)}</div>
              </div>

              <div className="history-actions">
                {showDeleteConfirm === item.id ? (
                  <div className="delete-confirm">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="confirm-delete"
                      title="삭제 확인"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="cancel-delete"
                      title="취소"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(item.id)}
                    className="delete-button"
                    title="삭제"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
