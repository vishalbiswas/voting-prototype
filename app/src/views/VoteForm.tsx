import { useCallback, useEffect, useId, useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { Gender } from '../utils/constants';
import clsx from 'clsx';

export default function VoteForm() {
  const [candidates, setCandidates] = useState<Array<any>>([]);
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
      fetch(`http://localhost:5000/candidate/${data.candidate.value}/vote`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then(() => navigate('/'));
    },
    [navigate]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetch('http://localhost:5000/candidate', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) =>
        setCandidates(
          data.map((c: any) => ({
            ...c,
            label: c.name,
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
      <div>
        <label>Candidate*</label>
        <Controller
          control={control}
          name="candidate"
          rules={{ required: true }}
          render={({ field }) => (
            <Select
              options={candidates}
              components={{
                Option: ({ innerProps, data }) => (
                  <div
                    {...innerProps}
                    className={clsx('p-3 cursor-pointer', innerProps.className)}
                  >
                    {data.name}
                  </div>
                ),
              }}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: 'hotpink',
                  primary: 'black',
                  neutral0: 'black',
                },
              })}
            />
          )}
        />
      </div>

      <div>
        <label>Voter ID*</label>
        <input type="text" {...register('voter_id', { required: true })} />
      </div>

      <div>
        <label>Gender</label>
        <div>
          {Object.entries(Gender).map(([k, v]) => (
            <div>
              <input
                type="radio"
                id={baseId + '-gender-' + k}
                {...register('gender')}
              />
              <label htmlFor={baseId + '-gender-' + k}>{v}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label>Age</label>
        <input type="number" {...register('age', { min: 18 })} />
      </div>

      <button type="submit">Vote</button>
    </form>
  );
}
