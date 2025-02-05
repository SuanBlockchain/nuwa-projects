import {
    BanknotesIcon,
    ClockIcon,
    UserGroupIcon,
    InboxIcon,
  } from '@heroicons/react/24/outline';
  import { lusitana } from '@/app/ui/fonts';
  import { fetchCardData } from '@/app/lib/queries/queries';
  
  const iconMap = {
    collected: BanknotesIcon,
    customers: UserGroupIcon,
    pending: ClockIcon,
    invoices: InboxIcon,
  };

  export default async function CardWrapper() {
    const { totalImpact, totalInvestment, totalBankableInvestment, totalIncome } = await fetchCardData();
    return (
      <>
        <Card title="Impact" value={totalImpact} units="TonCO2eq" type="collected" />
        <Card title="Total Investment" value={totalInvestment} units="USD" type="pending" />
        <Card title="Bankable Investment" value={totalBankableInvestment} units="USD" type="invoices" />
        <Card title="Income" value={totalIncome} units="USD" type="customers"/>
      </>
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
    type: 'invoices' | 'customers' | 'pending' | 'collected';
  }) {
    const Icon = iconMap[type];
  
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
          {value}
        </p>
      </div>
    );
  }