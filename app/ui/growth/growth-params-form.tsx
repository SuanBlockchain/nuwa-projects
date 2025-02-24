'use client';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"

export default function GrowthParamsForm({
  onSubmit,
}: {
  onSubmit: (species: string[], year: number) => void; // Updated to accept an array of species and a year
}) {
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]); // Array to hold multiple selections
  const [speciesOptions, setSpeciesOptions] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(5); // Default to 5 years
  const [error, setError] = useState<string | null>(null); // State to hold error message

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
    if (selectedSpecies.length === 0) {
      setError('Please select at least one species.');
      return;
    }
    if (!selectedYear) {
      setError('Please select a year.');
      return;
    }
    setError(null); // Clear any previous error
    onSubmit(selectedSpecies, selectedYear); // Pass the array of selected species and the selected year to the parent component
  };

  return (
    <div className="grid gap-6 p-4">
      <div className="grid gap-6 p-4 rounded-md border bg-gray-50 dark:bg-zinc-900">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="rounded-md bg-gray-50 p-4 md:p-6 dark:bg-zinc-900">
            <div className="mb-4">
              <label htmlFor="species" className="mb-2 block text-sm font-medium">
                Select Species (Multiple)
              </label>
              <select
                id="species"
                name="species"
                multiple // Enable multiple selection
                className="block w-full rounded-md border py-2 pl-3 pr-10 text-sm focus:ring-2"
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
                className="block w-full rounded-md border py-2 pl-3 pr-10 text-sm focus:ring-2"
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
            {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message if any */}
            <div className="mt-6 flex justify-end gap-4">
              <Button variant="destructive" type="submit"
                className="bg-gray-300 text-gray-700 hover:bg-gray-700 hover:text-white rounded-md border px-3 py-2 text-sm font-medium"
              >
                Generate trend
              </Button>
            </div>
          </div>
        </form>

      </div>

    </div>
  );
}
