import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { prospectName, numEmployees, fullTimeEmployees, partTimeEmployees, statesOperationalIn } = req.body;

    // Fetch the ruleset from Supabase
    const { data: rules, error: rulesError } = await supabase
      .from('ruleset')
      .select('*');

    if (rulesError) {
      console.error('Error fetching ruleset:', rulesError);
      return res.status(500).json({ error: 'Failed to fetch ruleset' });
    }

    console.log('Fetched rules:', rules); // Log fetched rules for debugging

    let recommendation = 'JWEG 1'; // Default recommendation

    // Loop through the rules and apply conditions
    for (const rule of rules) {
      console.log('Evaluating rule:', rule); // Log each rule being evaluated

      if (rule.state && rule.state.includes('Florida') && partTimeEmployees > 0 && statesOperationalIn.includes('Florida')) {
        recommendation = rule.recommendation;
        console.log('Matched Florida with part-time employees. Recommendation:', recommendation);
        break;
      }
      if (rule.state && rule.state.includes('California') && statesOperationalIn.every((state: string) => state === 'California')) {
        recommendation = rule.recommendation;
        console.log('Matched all employees in California. Recommendation:', recommendation);
        break;
      }
      if (rule.state && (rule.state.includes('Illinois') || rule.state.includes('Georgia')) && 
          (statesOperationalIn.includes('Illinois') || statesOperationalIn.includes('Georgia'))) {
        recommendation = rule.recommendation;
        console.log('Matched Illinois or Georgia rule. Recommendation:', recommendation);
        break;
      }
    }

    // Log the final recommendation
    console.log('Final recommendation:', recommendation);

    // Insert form submission into Supabase
    const { data, error } = await supabase
      .from('form_submissions')
      .insert([
        {
          prospect_name: prospectName,
          num_employees: numEmployees,
          full_time_employees: fullTimeEmployees,
          part_time_employees: partTimeEmployees,
          states_operational_in: statesOperationalIn.join(', '),
          jweg_recommendation: recommendation,
        },
      ]);

    if (error) {
      console.error('Error saving data:', error);
      return res.status(500).json({ error: 'Failed to save form submission' });
    }

    res.status(200).json({ recommendation });
  } else {
    res.status(405).json({ message: 'Only POST requests allowed' });
  }
}
