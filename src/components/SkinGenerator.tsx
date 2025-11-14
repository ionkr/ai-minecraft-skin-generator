import { useState } from 'react';
import { generateSkinFromPrompt } from '../utils/skinGenerator';

interface SkinGeneratorProps {
  onSkinGenerated: (skinData: string, prompt: string) => void;
}

export function SkinGenerator({ onSkinGenerated }: SkinGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        useDemo: true, // For now, use demo generation
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
      <div className="prompt-input-section">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="원하는 스킨의 컨셉을 설명해주세요&#10;예: 스케이트를 타는 힙한 스트릿웨어의 남성"
          rows={4}
          disabled={isGenerating}
        />

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="generate-button"
        >
          {isGenerating ? '생성 중...' : '스킨 생성'}
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
