document.addEventListener('DOMContentLoaded', () => {
  const keyInput = document.getElementById('api-key-input');
  const keyStatus = document.getElementById('key-status');

  // 保存済みデータを読み込む
  const savedKey = Storage.getApiKey();
  const savedProfile = Storage.getProfile();

  if (savedKey) keyInput.value = savedKey;
  document.getElementById('skills').value = savedProfile.skills || '';
  document.getElementById('strengths').value = savedProfile.strengths || '';
  document.getElementById('experiences').value = savedProfile.experiences || '';
  document.getElementById('goals').value = savedProfile.goals || '';

  renderKeyStatus(!!savedKey);

  // APIキー表示切り替え
  document.getElementById('toggle-vis-btn').addEventListener('click', function () {
    const isHidden = keyInput.type === 'password';
    keyInput.type = isHidden ? 'text' : 'password';
    this.textContent = isHidden ? '非表示' : '表示';
  });

  // APIキー保存
  document.getElementById('save-key-btn').addEventListener('click', () => {
    const key = keyInput.value.trim();
    if (!key) { alert('APIキーを入力してください'); return; }
    if (!key.startsWith('sk-ant-')) {
      if (!confirm('APIキーの形式が「sk-ant-」で始まっていません。このまま保存しますか？')) return;
    }
    Storage.setApiKey(key);
    renderKeyStatus(true);
    toast('APIキーを保存しました');
  });

  // プロフィール保存
  document.getElementById('save-profile-btn').addEventListener('click', () => {
    Storage.setProfile({
      skills: document.getElementById('skills').value.trim(),
      strengths: document.getElementById('strengths').value.trim(),
      experiences: document.getElementById('experiences').value.trim(),
      goals: document.getElementById('goals').value.trim()
    });
    toast('プロフィールを保存しました');
  });

  function renderKeyStatus(isSet) {
    keyStatus.innerHTML = isSet
      ? '<span class="status-badge status-ok">✓ APIキーが設定されています</span>'
      : '<span class="status-badge status-ng">✗ APIキーが未設定です</span>';
  }

  function toast(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }
});
