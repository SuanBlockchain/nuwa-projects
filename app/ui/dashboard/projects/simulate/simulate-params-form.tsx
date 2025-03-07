'use client';

import { useState } from 'react';
import { PopulationResult, Event } from '@/app/lib/definitions';
import BarChartCO2 from '../bar-chart-co2-production';



export default function SimulateParamsFormClient({
    projectId,
  speciesList = [],
  initialPopulationTable = []
}: {
    projectId: string;
  speciesList: string[] | undefined;
  initialPopulationTable?: PopulationResult[];
}) {
  const [events, setEvents] = useState([{ year: '', percentage: '' }]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [populationTable, setPopulationTable] = useState<PopulationResult[]>(initialPopulationTable);
  const [activeTab, setActiveTab] = useState<'table' | 'chart'>('chart');

  const addEvent = () => {
    setEvents([...events, { year: '', percentage: '' }]);
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const handleEventChange = (index: number, field: keyof Event, value: string) => {
    const newEvents = [...events];
    newEvents[index][field] = value;
    setEvents(newEvents);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: {
        projectId: string;
      species: string;
      startDate: string;
      endDate: string;
      events: { year: string; percentage: string }[];
    } = {
        projectId: projectId,
      species: e.currentTarget.species.value,
      startDate: e.currentTarget.startDate.value,
      endDate: e.currentTarget.endDate.value,
      events: events
    };

    try {
      // Call API route to generate population table
      const response = await fetch('/api/generate-population', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to generate population table');

      const newPopulationTable: PopulationResult[] = await response.json();
      setPopulationTable(newPopulationTable);
    } catch (error) {
      console.error('Error generating population table:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  // Generate array of years between start and end dates
  const getYearOptions = () => {
    if (!startDate || !endDate) return [];
    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year.toString());
    }
    return years;
  };

  const yearOptions = getYearOptions();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <div className="grid gap-4 p-4 rounded-md border">
        <h1 className="text-2xl font-bold mb-4">Simulate Growth for the project</h1>
        <div className="w-full overflow-x-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="species" className="block mb-1">Species:</label>
              <select
                id="species"
                name="species"
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Select a species</option>
                {speciesList.map((species) => (
                  <option key={species} value={species}>
                    {species}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="startDate" className="block mb-1">Start Date:</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                className="w-full p-2 border rounded"
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block mb-1">End Date:</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                required
                className="w-full p-2 border rounded"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Thinning Harvest Events</h2>
              {events.map((event, index) => (
                <div key={index} className="flex gap-2 mb-2 items-end">
                  <div>
                    <label className="block mb-1">Year:</label>
                    <select
                      value={event.year}
                      onChange={(e) => handleEventChange(index, 'year', e.target.value)}
                      required
                      className="p-2 border rounded"
                      disabled={!startDate || !endDate}
                    >
                      <option value="">Select year</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1">Percentage (%):</label>
                    <input
                      type="number"
                      value={event.percentage}
                      onChange={(e) => handleEventChange(index, 'percentage', e.target.value)}
                      min="0"
                      max="100"
                      required
                      className="p-2 border rounded w-24"
                    />
                  </div>
                  {events.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEvent(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addEvent}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Thinning Harvest Event
              </button>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit
            </button>
            </form>
        </div>
      </div>
      {populationTable.length > 0 && (
        <div className="grid gap-4 p-4 rounded-md border">
            <h2 className="text-xl font-semibold mb-2">Population Table</h2>
          <div className="w-full overflow-x-auto">
            <button
            onClick={() => setActiveTab('chart')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'chart' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
            }`}
            >
            Graph
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'table' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
            }`}
          >
            Table
          </button>
          {activeTab === 'chart' && (
            <div className="w-full overflow-x-auto">
              <BarChartCO2 data={populationTable} />
            </div>
          )}
          {activeTab === 'table' && (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white dark:bg-zinc-900">
                  <th className="border p-2 text-center">Period</th>
                  <th className="border p-2 text-center">Population</th>
                  <th className="border p-2 text-center">Co2eq (Tonnes)</th>
                  <th className="border p-2 text-center">Co2eq Accumulated</th>
                </tr>
              </thead>
              <tbody>
                {populationTable.map((row) => (
                  <tr key={row.period}>
                    <td className="border p-2 text-center">{row.period} </td>
                    <td className="border p-2 text-center">{row.population}</td>
                    <td className="border p-2 text-center">{row.co2eq_tonnes}</td>
                    <td className="border p-2 text-center">{row.co2eq_accumulated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          </div>
        </div>
      )}

    </div>
  );
}