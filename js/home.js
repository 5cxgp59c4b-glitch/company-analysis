document.addEventListener('DOMContentLoaded', () => {
  if (!Storage.getApiKey()) {
    document.getElementById('alert-area').style.display = 'block';
  }

  renderList();

  const input = document.getElementById('company-input');
  const btn = document.getElementById('analyze-btn');

  btn.addEventListener('click', go);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });

  function go() {
    const name = input.value.trim();
    if (!name) { input.focus(); return; }
    if (!Storage.getApiKey()) {
      alert('APIキーが未設定です。プロフィール設定画面から登録してください。');
      return;
    }
    location.href = `analysis.html?name=${encodeURIComponent(name)}`;
  }

  function renderList() {
    const companies = Storage.getCompanies();
    document.getElementById('company-count').textContent = `${companies.length}件`;

    const list = document.getElementById('company-list');
    if (companies.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🏢</span>
          <p>まだ分析した企業はありません<br>上の検索窓から企業名を入力してください</p>
        </div>`;
      return;
    }

    list.innerHTML = companies.map(c => `
      <a href="analysis.html?id=${c.id}" class="company-card">
        <div>
          <div class="name">${esc(c.name)}</div>
          <div class="date">${fmtDate(c.analyzedAt)}</div>
        </div>
        <span class="arrow">›</span>
      </a>
    `).join('');
  }

  function fmtDate(iso) {
    const d = new Date(iso);
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日に分析`;
  }

  function esc(s) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
});
