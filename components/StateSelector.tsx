import { useState } from 'react';

const allStates: string[] = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

type StateSelectorProps = {
  selectedStates: string[];
  setSelectedStates: React.Dispatch<React.SetStateAction<string[]>>;
};

const StateSelector: React.FC<StateSelectorProps> = ({ selectedStates, setSelectedStates }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredStates = allStates.filter(state =>
    state.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedStates.includes(state)
  );

  const handleStateClick = (state: string) => {
    setSelectedStates([...selectedStates, state]);
    setSearchTerm('');
  };

  const removeState = (stateToRemove: string) => {
    setSelectedStates(selectedStates.filter(state => state !== stateToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedStates.map((state: string) => (
          <span key={state} className="badge">
            {state}
            <button onClick={() => removeState(state)}>&times;</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type to search states..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      
      {/* Only show dropdown when typing */}
      {searchTerm && (
        <div className="dropdown-list">
          {filteredStates.length > 0 ? (
            filteredStates.map((state: string) => (
              <button
                key={state}
                className="dropdown-item"  // Add the dropdown-item class here
                onClick={() => handleStateClick(state)}
              >
                {state}
              </button>
            ))
          ) : (
            <div>No states found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default StateSelector;
