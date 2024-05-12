import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { API_URL, COLORS, Gender } from '../utils/constants';
import { DemographicBreakdown } from '../types/DemographicBreakdown';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Candidate() {
  const [breakdown, setBreakdown] = useState<DemographicBreakdown | null>(null);
  const params = useParams();

  const genderOptions: any = useMemo(() => {
    if (!breakdown) return null;

    return {};
  }, [breakdown]);

  const genderData: any = useMemo(() => {
    if (!breakdown) return null;

    return {
      labels: Object.keys(breakdown.genderBreakdown).map(
        (k) => Gender[k] || 'Unknown'
      ),
      datasets: [
        {
          label: '# of voters',
          data: Object.values(breakdown.genderBreakdown),
          backgroundColor: COLORS,
        },
      ],
    };
  }, [breakdown]);

  const ageOptions: any = useMemo(() => {
    if (!breakdown) return null;

    return {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Age (in years)',
          },
        },
      },
    };
  }, [breakdown]);

  const ageData: any = useMemo(() => {
    if (!breakdown) return null;

    return {
      labels: Object.keys(breakdown.ageBreakdown),
      datasets: [
        {
          label: '# of voters',
          data: Object.values(breakdown.ageBreakdown),
          backgroundColor: [...COLORS].reverse(),
          maxBarThickness: 40,
          borderRadius: { topLeft: 5, topRight: 5 },
        },
      ],
    };
  }, [breakdown]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/candidate/${params.id}/breakdown`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then(setBreakdown)
      .catch((err) => {
        if (err.name !== 'AbortError') throw err;
      });

    return () => controller.abort();
  }, [params.id]);

  if (!breakdown) return;

  return (
    <div>
      <h1 className="text-3xl sm:text-5xl mb-2">{breakdown.name}</h1>
      <p>
        {breakdown.count} votes | {breakdown.party} Group
      </p>
      {breakdown.count > 0 && (
        <div className="sm:flex flex-nowrap -mx-4 mt-5">
          <div className="sm:w-1/3 px-4">
            <h2 className="mb-3 font-semibold text-lg">Gender</h2>
            <Doughnut options={genderOptions} data={genderData} />
          </div>
          <div className="flex-1 px-4">
            <h2 className="mb-3 font-semibold text-lg">Age</h2>
            <Bar options={ageOptions} data={ageData} />
          </div>
        </div>
      )}
    </div>
  );
}
