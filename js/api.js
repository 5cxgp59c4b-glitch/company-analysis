async function callClaude(prompt, useWebSearch, apiKey) {
  const headers = {
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
    'anthropic-dangerous-direct-browser-access': 'true'
  };

  const body = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  };

  if (useWebSearch) {
    headers['anthropic-beta'] = 'web-search-2025-03-05';
    body.tools = [{ type: 'web_search_20250305', name: 'web_search' }];
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `APIエラー (${res.status})`);
  }

  const data = await res.json();
  return data.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');
}

function buildPrompt(companyName, userProfile) {
  const p = userProfile;
  const hasProfile = p.skills || p.strengths || p.experiences || p.goals;

  const profileSection = hasProfile
    ? `\nユーザープロフィール（マッチング分析・志望動機生成に使用）：
- スキル・技術: ${p.skills || '未設定'}
- 強み・やりたいこと: ${p.strengths || '未設定'}
- 経験・実績: ${p.experiences || '未設定'}
- 目標・志望: ${p.goals || '未設定'}\n`
    : '';

  const matchingVal = hasProfile
    ? 'ユーザープロフィールと企業の共通点・入社後に活かせるスキル・アピールすべき強み（具体的に）'
    : 'プロフィールを設定すると自動分析されます';

  const motivationVal = hasProfile
    ? '志望動機ドラフト（250〜300文字、敬体、そのままコピペして使える形）'
    : 'プロフィールを設定すると志望動機が生成されます';

  const selfPRVal = hasProfile
    ? '自己PRドラフト（200〜250文字、敬体、強みと具体的エピソードを盛り込みそのまま使える形）'
    : 'プロフィールを設定すると自己PRが生成されます';

  return `「${companyName}」を調査し、以下のJSON形式のみで回答してください。
${profileSection}
{
  "techStack": "使用言語・FW・インフラ等の技術スタック",
  "businessSummary": "主要事業・サービス・市場ポジションの概要",
  "culture": "企業文化・社風・エンジニア環境の特徴",
  "matching": "${matchingVal}",
  "motivation": "${motivationVal}",
  "selfPR": "${selfPRVal}"
}`;
}

async function analyzeCompany(companyName, userProfile, apiKey) {
  const prompt = buildPrompt(companyName, userProfile);
  let text;

  try {
    text = await callClaude(prompt, true, apiKey);
  } catch {
    // Web検索が使えない場合は通常モードで再試行
    text = await callClaude(prompt, false, apiKey);
  }

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('レスポンスのパースに失敗しました。もう一度お試しください。');

  return JSON.parse(match[0]);
}
