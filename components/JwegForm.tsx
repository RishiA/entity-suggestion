import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import StateSelector from './StateSelector';

type FormData = {
  prospectName: string;
  numEmployees: number;
  fullTimeEmployees: number;
  partTimeEmployees: number;
  accountExecutive: string;
  statesOperationalIn: string[];
};

const JwegForm = () => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
    mode: 'onChange'
  });
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (selectedStates.length === 0) {
      alert('Please select at least one state');
      return;
    }

    // Convert string input to numbers for validation
  const totalEmployees = Number(data.numEmployees);
  const fullTimeEmployees = Number(data.fullTimeEmployees);
  const partTimeEmployees = Number(data.partTimeEmployees);
  
  if (fullTimeEmployees + partTimeEmployees !== totalEmployees) {
    alert('The sum of full-time and part-time employees must equal the total number of employees.');
    return;
  }

    data.statesOperationalIn = selectedStates;

    setIsLoading(true); // Start loading spinner

    fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(result => {
        // Stop loading spinner
        setIsLoading(false);
        // Redirect to the recommendation page with the result
        window.location.href = `/recommendation?name=${data.prospectName}&employees=${data.numEmployees}&states=${selectedStates.join(',')}&result=${result.recommendation}`;
      })
      .catch(() => {
        // Stop loading spinner
        setIsLoading(false);
        alert('Something went wrong while submitting the form. Please try again.');
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-center">
      <div>
        <label><strong>Prospect Name</strong></label>
        <input type="text" {...register('prospectName', { required: true })} />
        {errors.prospectName && <p>This field is required</p>}
      </div>

      <div>
        <label><strong>Account Executive</strong></label>
        <input type="text" {...register('accountExecutive', { required: true })} />
        {errors.accountExecutive && <p>This field is required</p>}
      </div>

      <div>
        <label><strong>Total employees</strong></label>
        <input type="number" {...register('numEmployees', { required: true, max: 100 })} />
        {errors.numEmployees && <p>Must be a number between 1 and 100</p>}
      </div>

      <div>
        <label><strong>Full-time Employees</strong></label>
        <input type="number" {...register('fullTimeEmployees', { required: true })} />
        {errors.fullTimeEmployees && <p>This field is required</p>}
      </div>

      <div>
        <label><strong>Part-time employees</strong></label>
        <input type="number" {...register('partTimeEmployees', { required: true })} />
        {errors.partTimeEmployees && <p>This field is required</p>}
      </div>

      <div>
        <label><strong>States Operational In</strong></label>
        <StateSelector selectedStates={selectedStates} setSelectedStates={setSelectedStates} />
      </div>

      <button type="submit" className="btn" disabled={!isValid || isLoading}>
        {isLoading ? (
          <span className="spinner"></span> // Show spinner when loading
        ) : (
          'Submit'
        )}
      </button>
    </form>
  );
};

export default JwegForm;
