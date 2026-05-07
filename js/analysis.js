document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const idParam = params.get('id');
  const nameParam = params.get('name');

  let current = null;

  const views = {
    loading: document.getElementById('view-loading'),
    error: document.getElementById('view-error'),
    result: document.getElementById('view-result')
  };

  function show(v) {
    Object.values(views).forEach(el => el.style.display = 'none');
    views[v].style.display = 'block';
  }

  function setTitle(name) {
    document.getElementById('company-title').textContent = name;
    document.title = `${name} - 企業分析ツール`;
  }

  function showError(msg) {
    show('error');
    document.getElementById('error-msg').innerHTML = `⚠️ ${msg}`;
  }

  function setLoadingMsg(msg) {
    document.getElementById('loading-msg').textContent = msg;
  }

  // ロード済みデータを表示、または新規分析を開始
  if (idParam) {
    current = Storage.getCompanyById(idParam);
    if (current) {
      setTitle(current.name);
      renderResult(current);
      document.getElementById('reanalyze-btn').style.display = 'flex';
    } else {
      showError('企業データが見つかりませんでした。<a href="index.html">ホームへ戻る</a>');
    }
  } else if (nameParam) {
    setTitle(nameParam);
    const cached = Storage.getCompanyByName(nameParam);
    if (cached) {
      current = cached;
      const url = new URL(location.href);
      url.searchParams.delete('name');
      url.searchParams.set('id', cached.id);
      history.replaceState(null, '', url);
      renderResult(cached);
      document.getElementById('reanalyze-btn').style.display = 'flex';
    } else {
      await runAnalysis(nameParam);
    }
  } else {
    location.href = 'index.html';
  }

  // 再分析ボタン
  document.getElementById('reanalyze-btn').addEventListener('click', () => {
    if (current) runAnalysis(current.name);
  });

  // リトライボタン
  document.getElementById('retry-btn').addEventListener('click', () => {
    const name = current?.name || nameParam;
    if (name) runAnalysis(name);
  });

  async function runAnalysis(name) {
    const apiKey = Storage.getApiKey();
    if (!apiKey) {
      showError('APIキーが未設定です。<a href="profile.html">プロフィール設定</a>から登録してください。');
      return;
    }

    show('loading');

    const msgs = [
      '企業情報を収集中...',
      'ウェブを検索しています...',
      '技術スタックを分析中...',
      'プロフィールと照合中...',
      '志望動機を生成中...'
    ];
    let i = 0;
    const timer = setInterval(() => {
      i = (i + 1) % msgs.length;
      setLoadingMsg(msgs[i]);
    }, 2500);

    try {
      const profile = Storage.getProfile();
      const result = await analyzeCompany(name, profile, apiKey);

      clearInterval(timer);

      const company = {
        id: current?.id || String(Date.now()),
        name,
        analyzedAt: new Date().toISOString(),
        techStack: result.techStack,
        businessSummary: result.businessSummary,
        culture: result.culture,
        matching: result.matching,
        motivation: result.motivation,
        selfPR: result.selfPR,
        notes: current?.notes || []
      };

      Storage.saveCompany(company);
      current = company;

      // URLをIDベースに更新
      const url = new URL(location.href);
      url.searchParams.delete('name');
      url.searchParams.set('id', company.id);
      history.replaceState(null, '', url);

      document.getElementById('reanalyze-btn').style.display = 'flex';
      renderResult(company);

    } catch (err) {
      clearInterval(timer);
      showError(err.message);
    }
  }

  function renderResult(c) {
    show('result');
    document.getElementById('r-tech').textContent = c.techStack || '-';
    document.getElementById('r-biz').textContent = c.businessSummary || '-';
    document.getElementById('r-culture').textContent = c.culture || '-';
    document.getElementById('r-matching').textContent = c.matching || '-';
    document.getElementById('r-motivation').textContent = c.motivation || '-';
    document.getElementById('r-selfpr').textContent = c.selfPR || '-';
    renderNotes(c.notes || []);
  }

  // コピーボタン
  document.getElementById('copy-btn').addEventListener('click', () => {
    const text = document.getElementById('r-motivation').textContent;
    navigator.clipboard.writeText(text).then(() => toast('コピーしました！'));
  });

  document.getElementById('copy-selfpr-btn').addEventListener('click', () => {
    const text = document.getElementById('r-selfpr').textContent;
    navigator.clipboard.writeText(text).then(() => toast('コピーしました！'));
  });

  // メモ
  function renderNotes(notes) {
    const list = document.getElementById('notes-list');
    if (notes.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:0.5rem">メモはまだありません</p>';
      return;
    }
    list.innerHTML = notes.map((n, i) => `
      <div class="note-item">
        <span class="note-text">${esc(n)}</span>
        <button class="note-delete" data-i="${i}" title="削除">✕</button>
      </div>
    `).join('');
    list.querySelectorAll('.note-delete').forEach(btn => {
      btn.addEventListener('click', () => deleteNote(+btn.dataset.i));
    });
  }

  document.getElementById('add-note-btn').addEventListener('click', addNote);
  document.getElementById('note-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') addNote();
  });

  function addNote() {
    const input = document.getElementById('note-input');
    const text = input.value.trim();
    if (!text || !current) return;
    current.notes = current.notes || [];
    current.notes.push(text);
    Storage.saveCompany(current);
    renderNotes(current.notes);
    input.value = '';
  }

  function deleteNote(index) {
    if (!current) return;
    current.notes.splice(index, 1);
    Storage.saveCompany(current);
    renderNotes(current.notes);
  }

  function esc(s) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function toast(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }
});
