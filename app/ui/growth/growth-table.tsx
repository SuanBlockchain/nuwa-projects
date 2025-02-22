import React from 'react';
import { useTheme } from 'next-themes';

interface GrowthTableProps {
  data: {
    id: string;
    data: { x: number; y: number }[];
  }[];
  currentPage: number;
}

const GrowthTable: React.FC<GrowthTableProps> = ({ data, currentPage }) => {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#fff' : '#000';

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500">No data available</p>;
  }

  const recordsPerPage = 20;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedData = data.flatMap((item) =>
    item.data.map((record) => ({
      species: item.id,
      year: record.x,
      co2eq: record.y,
    }))
  ).slice(startIndex, endIndex);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Mobile-friendly version */}
          <div className="md:hidden">
            {paginatedData.map((record, index) => (
              <div
                key={`${record.species}-${index}`}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-sm font-medium" style={{ color: textColor }}>Species</p>
                    <p className="text-sm text-gray-500">{record.species}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="text-sm font-medium" style={{ color: textColor }}>Year</p>
                    <p className="text-sm text-gray-500">{record.year}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <p className="text-sm font-medium" style={{ color: textColor }}>CO2eq (kg)</p>
                    <p className="text-sm text-gray-500">{record.co2eq.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop version */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6" style={{ color: textColor }}>
                  Species
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6" style={{ color: textColor }}>
                  Year
                </th>
                <th scope="col" className="px-3 py-5 font-medium" style={{ color: textColor }}>
                  CO2eq (kg)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {paginatedData.map((record, index) => (
                <tr
                  key={`${record.species}-${index}`}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p style={{ color: textColor }}>{record.species}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3" style={{ color: textColor }}>
                    {record.year}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3" style={{ color: textColor }}>
                    {record.co2eq.toFixed(2)} {/* Round CO2eq value to 2 decimal places */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GrowthTable;