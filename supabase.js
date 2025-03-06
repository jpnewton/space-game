// Supabase client initialization
let supabase;

function initSupabase() {
  try {
    supabase = supabaseClient.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client initialized');
    return true;
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
    return false;
  }
}

async function submitScore(initials, email, score) {
  try {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' };
    }
    
    // First, check if this is a high score for this email
    const { data: existingData, error: fetchError } = await supabase
      .from('leaderboard')
      .select('score, id')
      .eq('email', email)
      .order('score', { ascending: false })
      .limit(1);

    if (fetchError) throw fetchError;

    // If no previous score or new score is higher
    if (!existingData.length || score > existingData[0].score) {
      if (existingData.length) {
        // Update existing record if score is higher
        const { error: updateError } = await supabase
          .from('leaderboard')
          .update({ 
            initials: initials,
            score: score,
            updated_at: new Date()
          })
          .eq('id', existingData[0].id);
        
        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('leaderboard')
          .insert({ 
            initials: initials,
            email: email,
            score: score
          });
        
        if (insertError) throw insertError;
      }
      
      return { success: true };
    } else {
      return { success: true, message: 'Not a personal best.' };
    }
  } catch (error) {
    console.error('Error submitting score:', error);
    return { success: false, error: error.message };
  }
}

async function getTopScores(limit = 10) {
  try {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' };
    }
    
    const { data, error } = await supabase
      .from('leaderboard')
      .select('initials, email, score')
      .order('score', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    // Mask email addresses for privacy
    const maskedData = data.map(entry => ({
      ...entry,
      email: maskEmail(entry.email)
    }));
    
    return { success: true, data: maskedData };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return { success: false, error: error.message };
  }
}

function maskEmail(email) {
  if (!email) return '';
  
  const parts = email.split('@');
  if (parts.length !== 2) return email;
  
  const name = parts[0];
  const domain = parts[1];
  
  // Show first and last character of the name, mask the rest
  const maskedName = name.length <= 2 
    ? name 
    : `${name.charAt(0)}${'*'.repeat(name.length - 2)}${name.charAt(name.length - 1)}`;
  
  return `${maskedName}@${domain}`;
}

// Test if Supabase is properly configured
function testSupabaseConnection() {
  if (!supabase) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  return { success: true };
}