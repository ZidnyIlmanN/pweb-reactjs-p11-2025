import React, { useState } from 'react';
import { Input } from './input';
import { Label } from './label'; // Import Label component

interface GenreInputProps {
  label: string; // Add label prop
  genres: string[];
  selectedGenres: string[];
  onChange: (selectedGenres: string[]) => void;
  error?: string; // Add error prop
  placeholder?: string; // Add placeholder prop
}

const GenreInput: React.FC<GenreInputProps> = ({ label, genres, selectedGenres, onChange, error, placeholder }) => {
  const [newGenre, setNewGenre] = useState('');

  const handleSelectGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onChange(selectedGenres.filter((g) => g !== genre));
    } else {
      onChange([...selectedGenres, genre]);
    }
  };

  const handleAddGenre = () => {
    if (newGenre && !genres.includes(newGenre) && !selectedGenres.includes(newGenre)) {
      onChange([...selectedGenres, newGenre]);
      setNewGenre('');
    }
  };

  return (
    <div>
      <Label>{label}</Label> {/* Render label */}
      <div className="flex flex-wrap gap-2 mt-2">
        {genres.map((genre) => (
          <button
            key={genre}
            type="button"
            className={`px-3 py-2 rounded-md border border-gray-300 text-sm font-medium transition-colors ${
              selectedGenres.includes(genre)
                ? 'bg-[var(--dark-blue)] text-white border-[var(--dark-blue)]'
                : 'bg-white text-gray-700 hover:bg-[var(--dark-blue)] hover:text-white hover:border-[var(--dark-blue)]'
            }`}
            onClick={() => handleSelectGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Input
          type="text"
          value={newGenre}
          onChange={(e) => setNewGenre(e.target.value)}
          placeholder={placeholder || "Add new genre"}
        />
        <button
          type="button"
          className="px-4 py-2 bg-[var(--dark-blue)] text-white rounded-md hover:bg-[var(--dark-blue)]/90 transition-colors"
          onClick={handleAddGenre}
        >
          Add
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>} {/* Display error message */}
    </div>
  );
};

export default GenreInput;