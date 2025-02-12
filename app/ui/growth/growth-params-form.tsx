'use client';
import { useState, useEffect } from 'react';

export default function GrowthParamsForm({
  onSubmit,
}: {
  onSubmit: (species: string[], year: number) => void; // Updated to accept an array of species and a year
}) {
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]); // Array to hold multiple selections
  const [speciesOptions, setSpeciesOptions] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(5); // Default to 5 years

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

  const handleSpeciesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedSpecies(selectedOptions); // Update state with selected options
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value)); // Update state with selected year
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(selectedSpecies, selectedYear); // Pass the array of selected species and the selected year to the parent component
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="species" className="mb-2 block text-sm font-medium">
            Select Species (Multiple)
          </label>
          <select
            id="species"
            name="species"
            multiple // Enable multiple selection
            className="block w-full rounded-md border border-gray-200 py-2 pl-3 pr-10 text-sm focus:ring-2"
            value={selectedSpecies} // Bind to array state
            onChange={handleSpeciesChange} // Update state on selection
          >
            {speciesOptions.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-500">Hold CTRL (or CMD) to select multiple options.</p>
        </div>

        <div className="mb-4">
          <label htmlFor="year" className="mb-2 block text-sm font-medium">
            Select Year
          </label>
          <select
            id="year"
            name="year"
            className="block w-full rounded-md border border-gray-200 py-2 pl-3 pr-10 text-sm focus:ring-2"
            value={selectedYear} // Bind to state
            onChange={handleYearChange} // Update state on selection
          >
            {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((year) => (
              <option key={year} value={year}>
                {year} years
              </option>
            ))}
          </select>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Generate trend
          </button>
        </div>
      </div>
    </form>
  );
}
