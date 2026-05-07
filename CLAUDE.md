# CLAUDE.md

## プロジェクト概要
就活・インターン活動向けの企業分析Webアプリ。HTML + CSS + 素のJavaScriptで構築。

## ファイル構成
```
index.html       # ホーム画面（企業名入力 + 分析済み企業一覧）
analysis.html    # 企業分析結果画面（技術スタック・マッチング・志望動機・メモ）
profile.html     # プロフィール設定画面（APIキー + 個人情報）
css/style.css    # 全画面共通スタイル（CSS変数でテーマ管理）
js/storage.js    # localStorage操作（api_key, user_profile, companies）
js/api.js        # Claude API呼び出し（analyzeCompany関数）
js/home.js       # index.html用スクリプト
js/analysis.js   # analysis.html用スクリプト
js/profile.js    # profile.html用スクリプト
```

## 技術スタック
- フロントエンド：HTML + CSS + 素のJavaScript（フレームワークなし）
- AI：Claude API (`claude-haiku-4-5-20251001`) + Web検索ツール (`web_search_20250305`)
- データ保存：localStorage（サーバーなし）
- 公開：GitHub Pages

## APIキーの扱い
- ユーザーが自分のAPIキーをプロフィール設定画面で入力
- localStorageに保存（サーバーには送らない）
- GitHub Pagesで公開可能

## ページ遷移
- `index.html` → `analysis.html?name=企業名`（新規分析）
- `index.html` → `analysis.html?id=xxx`（分析済み企業を表示）

## ビルド・起動
ビルド不要。ブラウザで`index.html`を直接開くか、GitHub Pagesに静的ファイルとして置くだけ。
