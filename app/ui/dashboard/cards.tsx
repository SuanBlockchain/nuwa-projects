import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData, fetchProjectById } from '@/app/lib/queries/queries';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  bankable: InboxIcon,
};

export default async function CardWrapper({ projectId }: { projectId?: string }) {
  let data;
  if (projectId) {
    data = await fetchProjectById(projectId);
  } else {
    data = await fetchCardData();
  }

  const { totalImpact, totalInvestment, totalBankableInvestment, totalIncome, projectName } = data;

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
            {projectName}
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

      <Card title="Impact" value={totalImpact} units="TonCO2eq" type="collected" />
      <Card title="Investment" value={totalInvestment} units="USD" type="pending" />
      <Card title="Bankable" value={totalBankableInvestment} units="USD" type="bankable" />
      <Card title="Income" value={totalIncome} units="USD" type="customers"/>
      </div>

    </main>
  );
}

export function Card({
  title,
  value,
  units,
  type,
}: {
  title: string;
  value: number | string;
  units?: string;
  type: 'bankable' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  // Remove non-numeric characters and convert to number
  const numericValue = typeof value === 'string' ? Number(value.replace(/[^0-9.-]+/g, '')) : value;

  // Format value as currency if units are "USD"
  const formattedValue = units === "USD"
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numericValue)
    : new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(numericValue);

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <div className='flex justify-between w-full'>
          <h3 className="ml-2 text-sm font-medium">{title}</h3>
          <h3 className="ml-2 text-sm font-medium">{units}</h3>
        </div>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {formattedValue}
      </p>
    </div>
  );
}