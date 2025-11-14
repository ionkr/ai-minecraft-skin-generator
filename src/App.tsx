import { useState, useCallback, useEffect } from 'react';
import { SkinGenerator } from './components/SkinGenerator';
import { SkinEditor } from './components/SkinEditor';
import { SkinViewer3D } from './components/SkinViewer3D';
import { HistoryPanel } from './components/HistoryPanel';
import type { MinecraftSkin } from './types/skin';
import { skinStorage } from './utils/skinStorage';
import { exportSkinAsPNG, createBlankSkin } from './utils/skinExport';
import './App.css';

function App() {
  const [currentSkin, setCurrentSkin] = useState<MinecraftSkin | null>(null);

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
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎨 AI Minecraft Skin Generator</h1>
        <p>AI로 독특한 마인크래프트 스킨을 생성하고 편집하세요</p>
      </header>

      <div className="app-container">
        {/* Left Sidebar - History Panel */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h3>📚 히스토리</h3>
          </div>
          <HistoryPanel
            onSkinSelect={handleSkinSelect}
            currentSkinId={currentSkin?.id}
          />
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
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

          {/* Grid Layout for Components */}
          <div className="desktop-grid">
            {/* Left Column: Generator and Editor */}
            <div className="left-column">
              {/* AI Generator */}
              <div className="generator-section section-card">
                <h2>🤖 AI 스킨 생성</h2>
                <SkinGenerator onSkinGenerated={handleSkinGenerated} />
              </div>

              {/* Editor */}
              {currentSkin && (
                <div className="editor-section section-card">
                  <h2>✏️ 스킨 에디터</h2>
                  <SkinEditor
                    skinData={currentSkin.imageData}
                    onSkinChange={handleSkinChange}
                    scale={6}
                  />
                </div>
              )}
            </div>

            {/* Right Column: 3D Preview */}
            <div className="right-column">
              {currentSkin && (
                <div className="preview-section section-card">
                  <h2>👀 3D 프리뷰</h2>
                  <div className="preview-container">
                    <SkinViewer3D
                      skinData={currentSkin.imageData}
                      width={450}
                      height={450}
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
                  </div>
                </div>
              )}
            </div>
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
