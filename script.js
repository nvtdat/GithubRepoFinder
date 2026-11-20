const languages = [
  { title: 'JavaScript', value: 'javascript' },
  { title: 'Python', value: 'python' },
  { title: 'Java', value: 'java' },
  { title: 'TypeScript', value: 'typescript' },
  { title: 'C#', value: 'c%23' },
  { title: 'C++', value: 'c%2B%2B' },
  { title: 'Go', value: 'go' },
  { title: 'Rust', value: 'rust' },
  { title: 'PHP', value: 'php' },
  { title: 'Ruby', value: 'ruby' },
];

async function fetchRepositories(language) {
  searchResult.innerHTML = '';
  searchResult.textContent = 'Loading, please wait...';

  try {
    const response = await fetch (
      `https://api.github.com/search/repositories?q=language:${language}&sort=stars&order=desc&per_page=10`
    );
    const data = await response.json();
    if(!response.ok) {
      throw new Error(data.message || 'Failed to fetch repositories');
    }
    if(data.items.length === 0) {
      searchResult.textContent = 'No repositories found for the selected language.';
      return;
    }

    const randomRepos = data.items[Math.floor(Math.random() * data.items.length)];
    searchResult.innerHTML = `
      <div class="repo-info">
        <h2 class="repo-name">${randomRepos.name}</h2>
        <p class="repo-desc">${randomRepos.description || 'No description available.'}</p>
        <p class="repo-stats">⭐ ${randomRepos.stargazers_count} | 🍴 ${randomRepos.forks_count} | ⚠ ${randomRepos.open_issues_count}</p>
        <a class="view-btn" href="${randomRepos.html_url}" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          View on GitHub
        </a>
      </div>
    `;
    showButton();

  } catch (error) {
    console.error('Error fetching repositories:', error);
    searchResult.textContent = 'Error fetching Repositories.';
    showButton('Click to Retry');
  }
}

function showButton(label = 'Refresh') {
  //Clear các nút để không bị trùng nút
  searchRefresh.innerHTML = '';
  const button = document.createElement('button');
  button.textContent = label;
  button.className = label === 'Click to Retry' ? 'retry-button' : 'refresh-button';

  button.addEventListener('click', () => fetchRepositories(select.value));
  searchRefresh.appendChild(button);
}

const select = document.getElementById('language-select');

languages.forEach(language => {
    const option = document.createElement('option');
    option.value = language.value;
    option.textContent = language.title;
    //Tạo xong thì phải append vào select
    select.appendChild(option);
})

const searchResult = document.getElementById('search-result-content');
searchResult.textContent = 'Please select a language.';
const searchRefresh = document.getElementById('search-refresh');
select.addEventListener('change', (event) => {
  const language = event.target.value;
  if(!language) {
    searchResult.textContent = 'Please select a language.';
    searchRefresh.innerHTML = '';
    return;
  }
  fetchRepositories(language);
});




