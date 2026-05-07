# 企業分析ツール

ClaudeCode で作成された企業分析用のシンプルなWebサイトです。

## 概要

- 企業名を入力すると、Claude API を使って企業の技術スタック、事業内容、企業文化、マッチング分析、志望動機ドラフトを自動生成します。
- 生成結果はローカルストレージに保存され、過去に分析した企業を一覧で確認できます。
- プロフィールを登録すると、マッチング分析と志望動機生成に反映されます。

## フォルダ構成

- `index.html` - ホーム画面（企業検索・過去分析一覧）
- `analysis.html` - 企業分析結果画面
- `profile.html` - APIキーとプロフィール設定画面
- `css/style.css` - 共通スタイル
- `js/home.js` - ホーム画面の動作
- `js/analysis.js` - 分析結果画面の動作
- `js/profile.js` - プロフィール画面の動作
- `js/api.js` - Claude API 呼び出しとプロンプト生成
- `js/storage.js` - localStorage 管理

## 準備

1. `profile.html` を開く
2. Claude API キーを取得する
   - `https://console.anthropic.com/settings/keys`
3. API キーを入力して保存する
4. プロフィール（スキル、強み、経験、目標）を入力して保存する

## 使い方

1. `index.html` を開く
2. 企業名を入力して「分析する」をクリック
3. `analysis.html` に遷移し、AI が生成した分析結果を確認
4. 志望動機をコピーしたり、メモを保存したりできます

## 注意点

- このアプリは Claude API (`anthropic.com`) への接続が必要です。
- API キーはブラウザの `localStorage` に保存されます。
- API 使用料は Claude の利用プランに従います。
- GitHub Pages に公開する場合は、静的サイトとしてそのままデプロイできます。

## 変更・カスタマイズ

- `js/api.js` の `model` や `web_search` オプションを変更して、API の挙動を調整できます。
- `css/style.css` を編集してデザインを変更できます。
- `profile.html` のプロフィール項目は追加・編集が可能です。

## ライセンス

- このリポジトリは独自に作成された静的サイトです。
- 使用素材や API 利用規約に従ってください。
