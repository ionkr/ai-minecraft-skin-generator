import { useState } from 'react';
import { generateSkinFromPrompt } from '../utils/skinGenerator';

interface SkinGeneratorProps {
  onSkinGenerated: (skinData: string, prompt: string) => void;
}

export function SkinGenerator({ onSkinGenerated }: SkinGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useAI, setUseAI] = useState(false);

  // Check if API key is available
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  const hasApiKey = apiKey && apiKey !== 'your_api_key_here';

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('프롬프트를 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const skinData = await generateSkinFromPrompt({
        prompt,
        apiKey: hasApiKey && useAI ? apiKey : undefined,
        useDemo: !hasApiKey || !useAI,
      });

      onSkinGenerated(skinData, prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : '스킨 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const examplePrompts = [
    '스케이트를 타는 힙한 스트릿웨어의 남성',
    'Red hoodie with blue jeans',
    '검은색 정장을 입은 비즈니스맨',
    'Purple wizard with a hat',
    '초록색 군복을 입은 군인',
    'Casual gamer with glasses',
  ];

  return (
    <div className="skin-generator">
      <h2>AI 스킨 생성</h2>

      <div className="prompt-input-section">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="원하는 스킨의 컨셉을 설명해주세요&#10;예: 스케이트를 타는 힙한 스트릿웨어의 남성"
          rows={4}
          disabled={isGenerating}
        />

        {hasApiKey && (
          <div className="ai-toggle">
            <label>
              <input
                type="checkbox"
                checked={useAI}
                onChange={(e) => setUseAI(e.target.checked)}
                disabled={isGenerating}
              />
              <span>AI 모드 사용 (Claude Haiku 4.5)</span>
            </label>
            {useAI && (
              <small style={{ color: '#888', marginLeft: '10px' }}>
                더 디테일하고 정확한 스킨이 생성됩니다
              </small>
            )}
          </div>
        )}

        {!hasApiKey && (
          <div className="api-key-notice" style={{
            background: '#fff3cd',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '10px',
            fontSize: '14px'
          }}>
            ⚠️ AI 모드를 사용하려면 <code>.env</code> 파일에 <code>VITE_ANTHROPIC_API_KEY</code>를 설정하세요.
            <br />
            현재는 데모 모드로 기본 스킨이 생성됩니다.
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="generate-button"
        >
          {isGenerating ? '생성 중...' : useAI && hasApiKey ? '🤖 AI로 스킨 생성' : '스킨 생성'}
        </button>

        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="example-prompts">
        <h3>예시 프롬프트:</h3>
        <div className="example-buttons">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              className="example-button"
              disabled={isGenerating}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h3>💡 팁</h3>
        <ul>
          <li>색상, 의상, 액세서리 등을 구체적으로 설명하면 더 좋은 결과를 얻을 수 있습니다.</li>
          <li>한국어와 영어 모두 지원됩니다.</li>
          <li>생성된 스킨은 에디터에서 자유롭게 수정할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
