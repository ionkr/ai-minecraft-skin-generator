import { useState, useCallback, useEffect } from 'react';
import { SkinGenerator } from './components/SkinGenerator';
import { SkinEditor } from './components/SkinEditor';
import { SkinViewer3D } from './components/SkinViewer3D';
import { HistoryPanel } from './components/HistoryPanel';
import type { MinecraftSkin } from './types/skin';
import { skinStorage } from './utils/skinStorage';
import { exportSkinAsPNG, createBlankSkin } from './utils/skinExport';
import './App.css';

type ViewMode = 'generator' | 'editor' | 'preview';

function App() {
  const [currentSkin, setCurrentSkin] = useState<MinecraftSkin | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('generator');
  const [showHistory, setShowHistory] = useState(false);

  // Initialize with a blank skin
  useEffect(() => {
    const blankSkin = createBlankSkin();
    setCurrentSkin({
      id: generateId(),
      name: 'Blank Skin',
      imageData: blankSkin,
      createdAt: Date.now(),
    });
  }, []);

  const handleSkinGenerated = useCallback((skinData: string, prompt: string) => {
    const newSkin: MinecraftSkin = {
      id: generateId(),
      name: generateSkinName(prompt),
      imageData: skinData,
      createdAt: Date.now(),
      prompt,
    };

    setCurrentSkin(newSkin);
    skinStorage.saveSkin(newSkin);
    setViewMode('preview');
  }, []);

  const handleSkinChange = useCallback((newSkinData: string) => {
    if (!currentSkin) return;

    const updatedSkin: MinecraftSkin = {
      ...currentSkin,
      imageData: newSkinData,
      createdAt: Date.now(),
    };

    setCurrentSkin(updatedSkin);
    skinStorage.saveSkin(updatedSkin);
  }, [currentSkin]);

  const handleSkinSelect = useCallback((skinData: string) => {
    // Find the skin in history
    const history = skinStorage.getHistory();
    const skin = history.find(s => s.imageData === skinData);

    if (skin) {
      setCurrentSkin(skin);
      setViewMode('preview');
    }
  }, []);

  const handleExport = useCallback(() => {
    if (!currentSkin) return;

    const filename = `${currentSkin.name.replace(/\s+/g, '_')}.png`;
    exportSkinAsPNG(currentSkin.imageData, filename);
  }, [currentSkin]);

  const handleNewSkin = useCallback(() => {
    const blankSkin = createBlankSkin();
    const newSkin: MinecraftSkin = {
      id: generateId(),
      name: 'New Skin',
      imageData: blankSkin,
      createdAt: Date.now(),
    };

    setCurrentSkin(newSkin);
    setViewMode('editor');
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎨 AI Minecraft Skin Generator</h1>
        <p>AI로 독특한 마인크래프트 스킨을 생성하고 편집하세요</p>
      </header>

      <div className="app-container">
        {/* Sidebar */}
        <aside className={`sidebar ${showHistory ? 'show' : ''}`}>
          <button
            className="toggle-history"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? '◀' : '▶'} 히스토리
          </button>
          {showHistory && (
            <HistoryPanel
              onSkinSelect={handleSkinSelect}
              currentSkinId={currentSkin?.id}
            />
          )}
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* View Mode Tabs */}
          <div className="view-tabs">
            <button
              className={viewMode === 'generator' ? 'active' : ''}
              onClick={() => setViewMode('generator')}
            >
              🤖 AI 생성
            </button>
            <button
              className={viewMode === 'editor' ? 'active' : ''}
              onClick={() => setViewMode('editor')}
            >
              ✏️ 에디터
            </button>
            <button
              className={viewMode === 'preview' ? 'active' : ''}
              onClick={() => setViewMode('preview')}
            >
              👀 3D 프리뷰
            </button>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={handleNewSkin} className="action-button">
              📄 새 스킨
            </button>
            <button
              onClick={handleExport}
              className="action-button primary"
              disabled={!currentSkin}
            >
              💾 PNG 저장
            </button>
          </div>

          {/* Content Area */}
          <div className="content-area">
            {viewMode === 'generator' && (
              <SkinGenerator onSkinGenerated={handleSkinGenerated} />
            )}

            {viewMode === 'editor' && currentSkin && (
              <div className="editor-view">
                <SkinEditor
                  skinData={currentSkin.imageData}
                  onSkinChange={handleSkinChange}
                  scale={8}
                />
              </div>
            )}

            {viewMode === 'preview' && currentSkin && (
              <div className="preview-view">
                <div className="preview-container">
                  <SkinViewer3D
                    skinData={currentSkin.imageData}
                    width={600}
                    height={600}
                    autoRotate={true}
                  />
                </div>
                <div className="preview-info">
                  <h3>{currentSkin.name}</h3>
                  {currentSkin.prompt && (
                    <p className="skin-prompt">
                      <strong>프롬프트:</strong> {currentSkin.prompt}
                    </p>
                  )}
                  <p className="skin-date">
                    생성일: {new Date(currentSkin.createdAt).toLocaleString('ko-KR')}
                  </p>
                  <div className="preview-actions">
                    <button onClick={() => setViewMode('editor')} className="edit-button">
                      ✏️ 편집하기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="app-footer">
        <p>
          마우스로 3D 뷰어를 회전하고 줌할 수 있습니다 • 에디터에서 픽셀 단위로 편집
          가능 • 모든 스킨은 로컬 브라우저에 저장됩니다
        </p>
      </footer>
    </div>
  );
}

// Helper functions
function generateId(): string {
  return `skin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateSkinName(prompt: string): string {
  const truncated = prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt;
  return truncated || 'Custom Skin';
}

export default App;
