import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  ChartData,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Gender } from '../utils/constants';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Candidate() {
  const [breakdown, setBreakdown] = useState<any>(null);
  const params = useParams();

  const genderOptions: any = useMemo(() => {
    if (!breakdown) return null;

    return {};
  }, [breakdown]);

  const genderData: any = useMemo(() => {
    if (!breakdown) return null;

    return {
      labels: Object.keys(breakdown.genderBreakdown).map((k) => Gender[k] || 'Unknown'),
      datasets: [
        {
          label: '# of voters',
          data: Object.values(breakdown.genderBreakdown),
          backgroundColor: ['red', 'green', 'blue', 'orange'],
        },
      ],
    };
  }, [breakdown]);

  const ageOptions: any = useMemo(() => {
    if (!breakdown) return null;

    return {};
  }, [breakdown]);

  const ageData: any = useMemo(() => {
    if (!breakdown) return null;

    return {
      labels: Object.keys(breakdown.ageBreakdown),
      datasets: [
        {
          label: '# of voters',
          data: Object.values(breakdown.ageBreakdown),
          backgroundColor: ['red', 'green', 'blue', 'orange'],
        },
      ],
    };
  }, [breakdown]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`http://localhost:5000/candidate/${params.id}/breakdown`, {
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
      <h1>{breakdown.name}</h1>
      <div>
        <h2>Gender</h2>
        <Doughnut options={genderOptions} data={genderData} />
      </div>
      <div>
        <h2>Age</h2>
        <Bar options={ageOptions} data={ageData} />
      </div>
    </div>
  );
}
