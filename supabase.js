// Supabase client configuration
let supabaseClient = null;

// Make sure we're exposing these functions globally
window.initSupabase = initSupabase;
window.getTopScores = getTopScores;
window.submitScore = submitScore;

function initSupabase() {
  try {
    console.log("Initializing Supabase client...");
    
    // Check if the required Supabase scripts are loaded
    if (typeof supabase === 'undefined') {
      console.error('Supabase client library not loaded!');
      return false;
    }

    // Check if config variables are defined
    if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_KEY === 'undefined') {
      console.error('Supabase credentials not found in config.js!');
      return false;
    }
    
    console.log("Using Supabase URL:", SUPABASE_URL);
    console.log("Anon Key available:", SUPABASE_KEY ? "Yes" : "No");
    
    // Skip initialization if using placeholder values
    if (SUPABASE_URL === 'https://your-project-url.supabase.co' || 
        SUPABASE_KEY === 'your-anon-key') {
      console.log('Using placeholder Supabase credentials - running in local mode');
      return false;
    }
    
    // Create the client
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client initialized successfully:', supabaseClient ? "Success" : "Failed");
    return true;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    return false;
  }
}

async function getTopScores() {
  if (!supabaseClient) {
    console.log('Supabase not configured - using mock leaderboard data');
    // Return mock data when Supabase isn't configured
    return {
      success: true,
      data: [
        { initials: 'AAA', email: 'player1@example.com', score: 500 },
        { initials: 'BBB', email: 'player2@example.com', score: 400 },
        { initials: 'CCC', email: 'player3@example.com', score: 300 },
        { initials: 'DDD', email: 'player4@example.com', score: 250 },
        { initials: 'EEE', email: 'player5@example.com', score: 200 }
      ]
    };
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching top scores:', error);
    return { success: false, error: error.message };
  }
}

async function submitScore(initials, email, score) {
  if (!supabaseClient) {
    console.log('Supabase not configured - using mock submission');
    return { 
      success: true, 
      message: 'Score submitted (demo mode)' 
    };
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('scores')
      .insert([
        { initials, email, score }
      ]);
      
    if (error) throw error;
    
    return { 
      success: true, 
      message: 'Score submitted successfully!' 
    };
  } catch (error) {
    console.error('Error submitting score:', error);
    return { success: false, error: error.message };
  }
}

// Auto-initialize on script load
console.log("Supabase.js loaded, waiting for DOM...");
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM loaded, initializing Supabase...");
  initSupabase();
});