import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import StateSelector from './StateSelector'; // Import the StateSelector component

type FormData = {
  prospectName: string;
  numEmployees: number;
  fullTimeEmployees: number;
  partTimeEmployees: number;
  statesOperationalIn: string[];
};

const JwegForm = () => {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
    mode: 'onChange',
  });

  const [selectedStates, setSelectedStates] = useState<string[]>([]); 
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (selectedStates.length === 0) {
      alert('Please select at least one state');
      return;
    }

    const totalEmployees = Number(data.numEmployees);
    const fullTimeEmployees = Number(data.fullTimeEmployees);
    const partTimeEmployees = Number(data.partTimeEmployees);

    if (fullTimeEmployees + partTimeEmployees !== totalEmployees) {
      alert('Total number of employees cannot be less than sum of full time and part time employees.');
      return;
    }

    data.statesOperationalIn = selectedStates;
    setIsLoading(true);

    fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        setIsLoading(false);
        window.location.href = `/recommendation?name=${data.prospectName}&employees=${data.numEmployees}&states=${selectedStates.join(',')}&result=${result.recommendation}`;
      })
      .catch(() => {
        setIsLoading(false);
        alert('Something went wrong while submitting the form. Please try again.');
      });
  };

  return (
    <div className="container max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Prospect Name Field */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">Prospect Name</label>
          <input
            type="text"
            className={`w-full p-3 border rounded-md transition-colors ${
              errors.prospectName ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            {...register('prospectName', { required: true })}
          />
          {errors.prospectName && <p className="mt-1 text-sm text-red-500">This field is required</p>}
        </div>

        {/* Total Employees Field */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Employees</label>
          <input
            type="number"
            className={`w-full p-3 border rounded-md transition-colors ${
              errors.numEmployees ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            {...register('numEmployees', { required: true, max: 100 })}
          />
          {errors.numEmployees && <p className="mt-1 text-sm text-red-500">Must be between 1 and 100</p>}
        </div>

        {/* Full-time and Part-time Employee Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full-time Employees</label>
            <input
              type="number"
              className={`w-full p-3 border rounded-md transition-colors ${
                errors.fullTimeEmployees ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              {...register('fullTimeEmployees', { required: true })}
            />
            {errors.fullTimeEmployees && <p className="mt-1 text-sm text-red-500">This field is required</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-2">Part-time Employees</label>
            <input
              type="number"
              className={`w-full p-3 border rounded-md transition-colors ${
                errors.partTimeEmployees ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              {...register('partTimeEmployees', { required: true })}
            />
            {errors.partTimeEmployees && <p className="mt-1 text-sm text-red-500">This field is required</p>}
          </div>
        </div>

        {/* StateSelector Component */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-2">States Operational In</label>
          <StateSelector selectedStates={selectedStates} setSelectedStates={setSelectedStates} />
        </div>
              <br></br>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="w-full py-4 px-4 bg-green-600 text-white rounded-md font-medium transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
   >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="spinner mr-2"></div>
              <span>Submitting...</span>
            </div>
          ) : (
            'Submit'
          )}
        </button>
      </form>
    </div>
  );
};

export default JwegForm;
