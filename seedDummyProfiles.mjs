import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// 1. Manually parse .env.local so we don't need any extra libraries
const envFile = fs.readFileSync('.env.local', 'utf8');
let SUPABASE_URL = '';
let SUPABASE_ANON_KEY = '';

envFile.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) SUPABASE_URL = line.split('=')[1].trim();
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) SUPABASE_ANON_KEY = line.split('=')[1].trim();
});

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const dummyProfiles = [
  {
    email: 'john.doe@example.com',
    password: 'password123',
    role: 'alumni',
    full_name: 'John Doe',
    bio: 'Software Engineer with a focus on web technologies. Happy to mentor students looking to break into frontend.',
    current_company: 'Google',
    job_title: 'Frontend Engineer',
    graduation_year: 2019,
    skills: ['React', 'Next.js', 'UI/UX Design']
  },
  {
    email: 'jane.smith@example.com',
    password: 'password123',
    role: 'alumni',
    full_name: 'Jane Smith',
    bio: 'Passionate about data and scalable systems. Currently working on cloud infrastructure.',
    current_company: 'Amazon',
    job_title: 'Backend Engineer',
    graduation_year: 2018,
    skills: ['AWS', 'Node.js', 'Java']
  },
  {
    email: 'emily.chen@example.com',
    password: 'password123',
    role: 'alumni',
    full_name: 'Emily Chen',
    bio: 'Product Manager with backgrounds in CS to Business. Connect with me if you need resume reviews!',
    current_company: 'Meta',
    job_title: 'Product Manager',
    graduation_year: 2021,
    skills: ['Product Management', 'Figma']
  },
  {
    email: 'david.lee@example.com',
    password: 'password123',
    role: 'student',
    full_name: 'David Lee',
    bio: 'Senior CS student seeking new grad roles in Machine Learning or Data Science.',
    current_company: '',
    job_title: '',
    graduation_year: 2025,
    skills: ['Python', 'Machine Learning']
  },
  {
    email: 'sarah.williams@example.com',
    password: 'password123',
    role: 'student',
    full_name: 'Sarah Williams',
    bio: 'Junior year student. Just learning the ropes of fullstack development.',
    current_company: '',
    job_title: '',
    graduation_year: 2026,
    skills: ['React', 'Node.js']
  }
];

async function seed() {
  console.log('Fetching available skills from the DB...');
  const { data: dbSkills, error: skillsError } = await supabase.from('skills').select('*');
  
  if (skillsError || !dbSkills) {
    console.error('Failed to fetch skills. Make sure you ran supabase_setup.sql!');
    return;
  }

  const skillNameToId = {};
  dbSkills.forEach(s => { skillNameToId[s.name] = s.id });

  console.log('Starting dummy user creation...');

  for (const user of dummyProfiles) {
    console.log(`\nCreating user: ${user.full_name} (${user.email})...`);
    
    // 1. Sign Up the User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user.email,
      password: user.password
    });

    if (authError) {
      console.error(`  -> Failed to sign up ${user.email}:`, authError.message);
      continue;
    }

    if (!authData.user) {
      console.error(`  -> No user returned for ${user.email}.`);
      continue;
    }

    const userId = authData.user.id;
    const avatarUrl = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(user.full_name)}`;

    // 2. Insert into the public.profiles table
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: userId,
        role: user.role,
        full_name: user.full_name,
        email: user.email,
        avatar_url: avatarUrl,
        bio: user.bio,
        current_company: user.current_company,
        job_title: user.job_title,
        graduation_year: user.graduation_year
      }
    ]);

    if (profileError) {
      console.error(`  -> Profile insert failed for ${user.email}:`, profileError.message);
      continue; // Skip skills if profile failed
    }

    console.log(`  -> Profile created successfully.`);

    // 3. Insert their skills!
    if (user.skills && user.skills.length > 0) {
      const skillsToInsert = [];
      for (const skillName of user.skills) {
        if (skillNameToId[skillName]) {
          skillsToInsert.push({ profile_id: userId, skill_id: skillNameToId[skillName] });
        }
      }

      if (skillsToInsert.length > 0) {
        const { error: skillInsertError } = await supabase.from('profile_skills').insert(skillsToInsert);
        if (skillInsertError) {
          console.error(`  -> Error attaching skills:`, skillInsertError.message);
        } else {
          console.log(`  -> Added ${skillsToInsert.length} skills successfully.`);
        }
      }
    }
  }

  console.log('\n✅ Seeding complete! You can now log into your web app with any of these emails (Password for all is: password123)');
}

seed();
