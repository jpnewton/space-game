const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get GitHub token from environment variable
const githubToken = process.env.GITHUB_TOKEN;

if (!githubToken) {
  console.error('Error: GitHub token not found!');
  console.error('Please set your token with: GITHUB_TOKEN=your_token node upload-to-github.js');
  process.exit(1);
}

// Repository settings - MODIFY THESE
const repoName = 'ai-space-defender';
const repoDescription = 'A space shooter game with custom sprites and global leaderboard';

// Check if .git directory exists
const isGitRepo = fs.existsSync(path.join(process.cwd(), '.git'));

try {
  if (!isGitRepo) {
    console.log('Initializing Git repository...');
    execSync('git init', { stdio: 'inherit' });
  }

  console.log('Adding all files...');
  execSync('git add .', { stdio: 'inherit' });

  console.log('Creating commit...');
  execSync('git commit -m "Initial commit of AI Space Defender game"', { stdio: 'inherit' });

  if (!isGitRepo) {
    console.log(`Creating GitHub repository: ${repoName}...`);
    
    // Create repository using GitHub API
    execSync(`curl -X POST -H "Authorization: token ${githubToken}" -H "Accept: application/vnd.github.v3+json" https://api.github.com/user/repos -d "{\\\"name\\\":\\\"${repoName}\\\",\\\"description\\\":\\\"${repoDescription}\\\",\\\"private\\\":false}"`, { stdio: 'inherit' });

    console.log('Getting GitHub username...');
    const username = execSync(`curl -s -H "Authorization: token ${githubToken}" https://api.github.com/user | node -e "const stdin=fs.readFileSync(0, 'utf-8'); const user = JSON.parse(stdin); console.log(user.login);"`).toString().trim();

    console.log(`Adding remote origin: https://github.com/${username}/${repoName}.git`);
    execSync(`git remote add origin https://github.com/${username}/${repoName}.git`, { stdio: 'inherit' });
  }

  console.log('Pushing to GitHub...');
  // Use token with HTTPS URL
  execSync(`git push -u origin master`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      GIT_TERMINAL_PROMPT: '0',
      // Set the credential helper to use the token
      GIT_ASKPASS: 'echo',
      GIT_USERNAME: 'x-access-token',
      GIT_PASSWORD: githubToken
    }
  });

  console.log('✅ Successfully uploaded to GitHub!');
  console.log(`Your repository is now available at: https://github.com/${execSync(`git config --get remote.origin.url`).toString().trim().match(/github\.com\/([^\/]+\/[^\.]+)\.git/)[1]}`);

} catch (error) {
  console.error('Error occurred:');
  console.error(error.message);
  console.error('\nTroubleshooting tips:');
  console.error('1. Make sure your GitHub token has the correct permissions (repo)');
  console.error('2. Check that git is installed and in your PATH');
  console.error('3. Ensure you have no uncommitted changes with git status');
  process.exit(1);
}