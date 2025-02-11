'use client';
import { useState, useEffect } from 'react';

export default function GrowthParamsForm({
  onSubmit,
}: {
  onSubmit: (species: string) => void;
}) {
  const [selectedSpecies, setSelectedSpecies] = useState<string>('');
  const [speciesOptions, setSpeciesOptions] = useState<string[]>([]);
  
    // Fetch species options from the database
    useEffect(() => {
      async function fetchSpecies() {
        try {
          const response = await fetch('/api/getSpecies');
          if (!response.ok) {
            throw new Error('Failed to fetch species options.');
          }
  
          const speciesList = await response.json();
          setSpeciesOptions(speciesList);
        } catch (error) {
          console.error('Error fetching species options:', error);
        }
      }
  
      fetchSpecies();
    }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(selectedSpecies);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="species" className="mb-2 block text-sm font-medium">
            Select a Species
          </label>
          <select
            id="species"
            name="species"
            className="block w-full rounded-md border border-gray-200 py-2 pl-3 pr-10 text-sm focus:ring-2"
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
          >
            <option value="" disabled>
              Select a species
            </option>
            {speciesOptions.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
