import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const characters = [
  {
    name: '桜庭 つむぎ',
    role: 'Threads学園 2年A組',
    description: '春風のようにやさしく、言葉でみんなをつなぐクラスの人気者。',
  },
  {
    name: '青葉 りく',
    role: '新聞部 編集長',
    description: '真実を追いかけるまっすぐな瞳で、物語の謎に迫っていく。',
  },
  {
    name: '白石 ひより',
    role: '園芸委員',
    description: '散らない桜の秘密を知る、少し不思議な雰囲気の転校生。',
  },
];

function h(type, props, ...children) {
  return React.createElement(type, props, ...children);
}

function App() {
  return h(
    'main',
    { className: 'page-shell' },
    h(
      'section',
      { className: 'hero', 'aria-labelledby': 'hero-title' },
      h('p', { className: 'eyebrow' }, 'Threads Academy Love Story'),
      h('h1', { id: 'hero-title' }, 'Threads学園 恋物語'),
      h('p', { className: 'subtitle' }, '〜桜の散らない春〜'),
      h(
        'p',
        { className: 'lead' },
        'いつまでも桜が舞い続ける学園で、未投稿の想いが少しずつほどけていく。',
        '甘くて切ない青春恋愛ノベル、開幕。',
      ),
      h('a', { className: 'cta', href: '#characters' }, '登場人物を見る'),
    ),
    h(
      'section',
      { id: 'characters', className: 'characters', 'aria-labelledby': 'characters-title' },
      h('p', { className: 'section-kicker' }, 'Characters'),
      h('h2', { id: 'characters-title' }, '春を彩るキャラクター'),
      h(
        'div',
        { className: 'character-grid' },
        characters.map((character) =>
          h(
            'article',
            { className: 'character-card', key: character.name },
            h('h3', null, character.name),
            h('p', { className: 'role' }, character.role),
            h('p', null, character.description),
          ),
        ),
      ),
    ),
  );
}

createRoot(document.getElementById('root')).render(
  h(React.StrictMode, null, h(App)),
);
