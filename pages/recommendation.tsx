import { useRouter } from 'next/router';
import Link from 'next/link';

const Recommendation = () => {
  const router = useRouter();
  const { name, employees, states, result } = router.query;

  return (
    <div className="container">
      <h1>Recommendation</h1>

      <br /><br /> 

      <div><strong>Prospect Name:</strong> {name}</div>
      <br /> 
      
      <div><strong>No. of employees:</strong> {employees}</div>
      <br />

      <div><strong>States operational in:</strong> {states}</div>
      <br /><br /> 

      <h2>JWEG Recommendation</h2><br />
      <p style={{ color: 'red', fontWeight: 'bold' }}>{result}</p> 

      {/* Add a button to go back to the form */}
      <Link href="/">
        <button style={{ marginTop: '20px', padding: '10px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Another Entry
        </button>
      </Link>
    </div>
  );
};

export default Recommendation;
