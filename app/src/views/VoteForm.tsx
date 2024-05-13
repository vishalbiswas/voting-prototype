import { useCallback, useEffect, useId, useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { API_URL, Gender } from '../utils/constants';
import { Candidate } from '../types/Candidate';
import FormGroup from '../components/FormGroup';
import TextInput from '../components/TextInput';

export default function VoteForm() {
  const [candidates, setCandidates] = useState<Array<Candidate>>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm();
  const baseId = useId();

  const vote = useCallback(
    (data: any) => {
      if (!data.age) {
        delete data.age;
      }
      if (!data.gender) {
        delete data.gender;
      }
      fetch(`${API_URL}/candidate/${data.candidate.value}/vote`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        },
      }).then(async (res) => {
        if (res.ok) {
          navigate('/');
        } else {
          let error = { message: null };
          try {
            error = await res.json();
          } catch (err) {
            console.log(err);
          }
          setError(error?.message || 'Something went wrong!');
        }
      });
    },
    [navigate]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/candidate`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) =>
        setCandidates(
          data.map((c: any) => ({
            ...c,
            label: `${c.name} (${c.party})`,
            value: c.id,
            party: c.party,
          }))
        )
      )
      .catch((err) => {
        if (err.name !== 'AbortError') throw err;
      });

    return () => controller.abort();
  }, []);

  return (
    <form onSubmit={handleSubmit(vote)}>
      {error && (
        <p className="bg-red-400 text-white rounded px-3 py-2 mb-3">{error}</p>
      )}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <FormGroup error={errors.candidate}>
          <label>
            Candidate<sup className="text-red-600">*</sup>
          </label>
          <Controller
            control={control}
            name="candidate"
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                options={candidates}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormGroup>

        <FormGroup error={errors.voter_id}>
          <label>
            Voter ID<sup className="text-red-600">*</sup>
          </label>
          <TextInput
            type="text"
            maxLength={10}
            {...register('voter_id', { required: true, maxLength: 10 })}
          />
        </FormGroup>

        <FormGroup error={errors.gender}>
          <label>Gender</label>
          <div className="flex">
            {Object.entries(Gender).map(([k, v]) => (
              <div key={k} className="flex-1">
                <input
                  type="radio"
                  id={baseId + '-gender-' + k}
                  value={k}
                  {...register('gender')}
                />
                <label
                  className="inline-block ms-1"
                  htmlFor={baseId + '-gender-' + k}
                >
                  {v}
                </label>
              </div>
            ))}
          </div>
        </FormGroup>

        <FormGroup error={errors.age}>
          <label>Age (in years)</label>
          <TextInput
            type="number"
            {...register('age', { min: 18, max: 150 })}
          />
        </FormGroup>
      </div>

      <div className="text-center mt-5">
        <button type="submit">Vote</button>
      </div>
    </form>
  );
}
