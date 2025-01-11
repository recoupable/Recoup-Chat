interface Language {
  readonly name: string;
  readonly value: string;
}

interface LanguageSelectorProps {
  languages: readonly Language[];
  selectedLanguage: Language;
  onLanguageSelect: (language: Language) => void;
}

export function LanguageSelector({
  languages,
  selectedLanguage,
  onLanguageSelect,
}: LanguageSelectorProps) {
  return (
    <div className="flex gap-2 mb-4">
      {languages.map((lang) => (
        <button
          key={lang.value}
          onClick={() => onLanguageSelect(lang)}
          className={`px-4 py-2 rounded ${
            selectedLanguage.value === lang.value
              ? "bg-gray-800 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}
