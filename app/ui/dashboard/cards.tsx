import { lusitana } from '@/app/ui/fonts';
import { fetchCardData, fetchProjectById } from '@/app/lib/queries/queries';
import PerformanceCard from './projects/performance-card';
import Breadcrumbs from '../breadcrumbs';
import { Breadcrumb } from '@/app/lib/definitions';

export default async function CardWrapper({ projectId }: { projectId?: string }) {
  let data;
  if (projectId) {
    data = await fetchProjectById(projectId);
  } else {
    data = await fetchCardData();
  }

  const { totalImpact, totalInvestment, totalBankableInvestment, totalIncome, landNumber, totalco2, area, averageCo2Total, sumCo2Total, projectName } = data;
  const performanceData = {
    totalImpact,
    totalInvestment,
    totalBankableInvestment,
    totalIncome,
    landNumber,
    totalco2,
    area,
    averageCo2Total,
    sumCo2Total,
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'All Projects', href: '/dashboard' },
          projectId ? { label: projectName, href: `/dashboard/project/${projectId}`, active: true } : null
        ].filter((breadcrumb): breadcrumb is Breadcrumb => breadcrumb !== null)}
      />
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl p-4`}>
            {projectName}
      </h1>
      <div className="grid gap-6 p-4">
        <PerformanceCard data={performanceData} />
      </div>  

    </main>
  );
}