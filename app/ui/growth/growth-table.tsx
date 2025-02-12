import React from 'react';

interface GrowthTableProps {
  data: {
    id: string;
    data: { x: number; y: number }[];
  }[];
  currentPage: number;
}
    
const GrowthTable: React.FC<GrowthTableProps> = ({ data, currentPage }) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-gray-500">No data available</p>;
    }

  const recordsPerPage = 10;
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
          {/* <div className="md:hidden">
            {invoices?.map((invoice) => (
              <div
                key={invoice.id}
                className="mb-2 w-full rounded-md bg-white p-4"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <div className="mb-2 flex items-center">
                      <Image
                        src={invoice.image_url}
                        className="mr-2 rounded-full"
                        width={28}
                        height={28}
                        alt={`${invoice.name}'s profile picture`}
                      />
                      <p>{invoice.name}</p>
                    </div>
                    <p className="text-sm text-gray-500">{invoice.email}</p>
                  </div>
                  <InvoiceStatus status={invoice.status} />
                </div>
                <div className="flex w-full items-center justify-between pt-4">
                  <div>
                    <p className="text-xl font-medium">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p>{formatDateToLocal(invoice.date)}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateInvoice id={invoice.id} />
                    <DeleteInvoice id={invoice.id} />
                  </div>
                </div>
              </div>
            ))}
          </div> */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Species
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Year
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  CO2eq (kg)
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
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
                        <p>{record.species}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {record.year}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
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