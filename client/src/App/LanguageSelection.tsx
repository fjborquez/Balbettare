import React from 'react';
import './LanguageSelection.css';

interface LanguageSelectionProps {
  onSelect: (language: string) => void;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ onSelect }) => {
  const handleLanguageSelect = (language: string) => {
    onSelect(language);
  };

  return (
    <div className="language-selection">
      <button className="select-language-button" onClick={() => handleLanguageSelect('italian')}>
        🇮🇹 Italian
      </button>
      <button className="select-language-button" onClick={() => handleLanguageSelect('spanish')}>
        🇪🇸 Spanish
      </button>
    </div>
  );
};

export default LanguageSelection;
