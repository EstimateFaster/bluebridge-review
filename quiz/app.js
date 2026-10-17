/* =========================================
   蓝桥工作室 · 线上答题测试
   纯原生 JS，无依赖
   ========================================= */
'use strict';

const DATA_URL = 'questions.json';
const STORAGE_KEY = 'bb-quiz-progress-v1';

const state = {
  data: null,
  progress: loadProgress(),
  session: null,
  last: null,
  toastTimer: null,
};

/* ---------------- 工具 ---------------- */

function $(id) {
  return document.getElementById(id);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function format(text) {
  const escaped = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped.replace(/`([^`]+)`/g, '<code>$1</code>');
}

function catName(id) {
  if (!state.data) return '';
  const cat = state.data.categories.find((c) => c.id === id);
  return cat ? cat.name : id;
}

function passLine(level) {
  return Math.ceil(level.draw * level.pass);
}

function elapsedText(ms) {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m} 分 ${s} 秒`;
}

/* ---------------- 进度存储 ---------------- */

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { best: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.best) return { best: {} };
    return { best: parsed.best };
  } catch (e) {
    return { best: {} };
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ best: state.progress.best }));
  } catch (e) {
    /* 隐私模式等场景下静默失败 */
  }
}

function bestOf(level) {
  return state.progress.best[level.id];
}

function levelPassed(level) {
  const best = bestOf(level);
  return best !== undefined && best >= passLine(level);
}

function allPassed() {
  if (!state.data) return false;
  return state.data.levels.every((lv) => levelPassed(lv));
}

function isUnlocked(index) {
  if (index === 0) return true;
  return levelPassed(state.data.levels[index - 1]);
}

/* ---------------- 视图切换 / 轻提示 ---------------- */

function show(view) {
  ['home', 'quiz', 'result'].forEach((v) => {
    $('view-' + v).classList.toggle('hidden', v !== view);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toast(message) {
  const el = $('toast');
  el.textContent = message;
  el.classList.remove('hidden');
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => el.classList.add('hidden'), 2200);
}

function makeBtn(label, cls, onClick) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn ' + cls;
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  return btn;
}

/* ---------------- 首页 ---------------- */

function renderHome() {
  if (!state.data) return;

  const meta = state.data.meta || {};
  const total = state.data.questions.length;
  $('bank-meta').textContent =
    `题库 v${meta.version || '1.0.0'} · 共 ${total} 题 · 更新于 ${meta.updated || '—'}`;

  const wrap = $('level-cards');
  wrap.textContent = '';

  state.data.levels.forEach((level, index) => {
    const unlocked = isUnlocked(index);
    const passed = levelPassed(level);
    const best = bestOf(level);

    const card = document.createElement('div');
    card.className = 'level-card' + (unlocked ? '' : ' locked') + (passed ? ' passed' : '');

    const stateText = !unlocked ? '🔒 未解锁' : passed ? '✓ 已通过' : '可挑战';
    const bonus = best !== undefined
      ? `最佳成绩 ${best} / ${level.draw}`
      : `${level.draw} 题 · 答对 ${passLine(level)} 题通关`;

    card.innerHTML =
      `<div class="level-head">
         <span class="level-idx">第 ${index + 1} 关</span>
         <span class="level-state">${stateText}</span>
       </div>
       <h3>${level.name.replace(/^第.+关\s*·\s*/, '')}</h3>
       <p>${level.desc}</p>
       <p class="level-bonus">${bonus}</p>`;

    card.addEventListener('click', () => {
      if (unlocked) {
        startLevel(level.id);
      } else {
        toast('先通过上一关，再来挑战 🙌');
      }
    });

    wrap.appendChild(card);
  });

  const btn = $('btn-start');
  if (allPassed()) {
    btn.textContent = '全部通关 · 再挑战一次';
  } else if (Object.keys(state.progress.best).length > 0) {
    btn.textContent = '继续闯关';
  } else {
    btn.textContent = '开始闯关';
  }
}

function startNext() {
  const levels = state.data.levels;
  let target = levels.find((lv, i) => isUnlocked(i) && !levelPassed(lv));
  if (!target) target = levels[0]; // 全部通关后从头再挑战
  startLevel(target.id);
}

/* ---------------- 出题 ---------------- */

function prepareQuestion(question) {
  if (question.type === 'judge') {
    return {
      ...question,
      options: [
        { text: '正确', correct: question.answer === true },
        { text: '错误', correct: question.answer === false },
      ],
    };
  }
  const options = question.options.map((text, i) => ({
    text,
    correct: i === question.answer,
  }));
  shuffle(options);
  return { ...question, options };
}

function startLevel(levelId) {
  const level = state.data.levels.find((lv) => lv.id === levelId);
  if (!level) return;

  const pool = state.data.questions.filter((q) => q.level === levelId);
  const picked = shuffle(pool.slice()).slice(0, Math.min(level.draw, pool.length));
  const questions = picked.map(prepareQuestion);

  state.session = {
    level,
    questions,
    index: 0,
    answers: [],
    startTime: Date.now(),
  };

  renderQuestion();
  show('quiz');
}

/* ---------------- 答题 ---------------- */

function renderQuestion() {
  const s = state.session;
  if (!s) return;
  const question = s.questions[s.index];
  if (!question) return;

  $('quiz-level-name').textContent = s.level.name;
  $('quiz-progress-text').textContent = `第 ${s.index + 1} / ${s.questions.length} 题`;
  $('quiz-progress-bar').style.width = `${(s.index / s.questions.length) * 100}%`;

  $('q-cat').textContent = catName(question.cat);
  $('q-type').textContent = question.type === 'judge' ? '判断' : '单选';
  $('q-text').innerHTML = format(question.q);

  const box = $('q-options');
  box.textContent = '';
  question.options.forEach((option, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option';
    if (question.type === 'judge') {
      btn.innerHTML = `<span class="option-text">${format(option.text)}</span>`;
    } else {
      btn.innerHTML =
        `<span class="option-key">${String.fromCharCode(65 + i)}</span>` +
        `<span class="option-text">${format(option.text)}</span>`;
    }
    btn.addEventListener('click', () => answer(i));
    box.appendChild(btn);
  });

  const feedback = $('q-feedback');
  feedback.className = 'feedback hidden';
  $('q-feedback-title').textContent = '';
  $('q-explain').textContent = '';

  const next = $('btn-next');
  next.textContent = s.index === s.questions.length - 1 ? '查看结果' : '下一题';
  next.classList.add('hidden');
}

function answer(choice) {
  const s = state.session;
  if (!s) return;
  const question = s.questions[s.index];
  if (!question) return;
  if (s.answers[s.index]) return; // 已作答，忽略重复点击

  const correctIndex = question.options.findIndex((o) => o.correct);
  const isCorrect = choice === correctIndex;
  const chosen = question.options[choice];

  s.answers[s.index] = {
    question,
    chosenIndex: choice,
    chosenText: chosen ? chosen.text : '',
    correctIndex,
    correctText: question.options[correctIndex].text,
    correct: isCorrect,
  };

  const buttons = Array.from($('q-options').children);
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correctIndex) btn.classList.add('correct');
    else if (i === choice) btn.classList.add('wrong');
  });

  const feedback = $('q-feedback');
  feedback.className = 'feedback ' + (isCorrect ? 'ok' : 'bad');
  $('q-feedback-title').textContent = isCorrect ? '✓ 回答正确' : `✗ 回答错误，正确答案：${question.options[correctIndex].text}`;
  $('q-explain').textContent = question.explain || '';

  $('btn-next').classList.remove('hidden');
  $('quiz-progress-bar').style.width = `${((s.index + 1) / s.questions.length) * 100}%`;
}

function goNext() {
  const s = state.session;
  if (!s) return;
  if (!s.answers[s.index]) return;
  if (s.index >= s.questions.length - 1) {
    finishLevel();
    return;
  }
  s.index += 1;
  renderQuestion();
}

/* ---------------- 结算 ---------------- */

function finishLevel() {
  const s = state.session;
  const level = s.level;
  const total = s.questions.length;
  const score = s.answers.filter((a) => a && a.correct).length;
  const pass = passLine(level);
  const passed = score >= pass;
  const elapsed = Date.now() - s.startTime;

  const prev = bestOf(level);
  if (prev === undefined || score > prev) {
    state.progress.best[level.id] = score;
  }
  saveProgress();

  state.last = { level, score, total, passed, elapsed, session: s };
  renderResult();
  show('result');
}

function renderResult() {
  const last = state.last;
  if (!last) return;
  const { level, score, total, passed, elapsed, session } = last;
  const pass = passLine(level);
  const percent = Math.round((score / total) * 100);

  const ring = $('result-ring');
  const ringColor = passed ? '#16a34a' : '#ef4444';
  ring.style.background =
    `conic-gradient(${ringColor} 0%, ${ringColor} ${percent}%, #e2e8f0 ${percent}%)`;

  $('result-level').textContent = `${level.name} · 本关结果`;
  $('result-score').textContent = String(score);
  $('result-total').textContent = `/ ${total} 题`;
  $('result-time').textContent = `用时 ${elapsedText(elapsed)} · ${new Date().toLocaleString('zh-CN')}`;

  const isFinal = level.id === state.data.levels[state.data.levels.length - 1].id;
  const nextLevel = state.data.levels.find((lv) => lv.id === level.id + 1);
  const everythingPassed = allPassed();

  if (passed && everythingPassed) {
    $('result-title').textContent = '🎉 三关全部通关！';
    $('result-sub').textContent = `答对 ${score} / ${total} 题。三关全部通过，可以截图本页作为完成凭证。`;
  } else if (passed) {
    $('result-title').textContent = '本关通过！';
    $('result-sub').textContent =
      `答对 ${score} / ${total} 题，通关线为 ${pass} 题。` +
      (nextLevel ? `已解锁「${nextLevel.name}」。` : '');
  } else {
    $('result-title').textContent = '差一点，再来一次';
    $('result-sub').textContent =
      `答对 ${score} / ${total} 题，通关需要 ${pass} 题。重做时题目会重新随机抽取。`;
  }

  /* 分类统计 */
  const catStats = new Map();
  session.questions.forEach((question, i) => {
    const record = session.answers[i];
    if (!catStats.has(question.cat)) {
      catStats.set(question.cat, { total: 0, correct: 0 });
    }
    const entry = catStats.get(question.cat);
    entry.total += 1;
    if (record && record.correct) entry.correct += 1;
  });

  const catWrap = $('result-cats');
  catWrap.textContent = '';
  catStats.forEach((entry, catId) => {
    const width = Math.round((entry.correct / entry.total) * 100);
    const item = document.createElement('div');
    item.className = 'cat-stat';
    item.innerHTML =
      `<div class="cat-stat-head"><span>${catName(catId)}</span>` +
      `<span>${entry.correct} / ${entry.total}</span></div>` +
      `<div class="cat-stat-bar"><div class="cat-stat-fill" style="width:${width}%"></div></div>`;
    catWrap.appendChild(item);
  });

  /* 操作按钮 */
  const actions = $('result-actions');
  actions.textContent = '';

  if (passed) {
    if (nextLevel && !everythingPassed) {
      actions.appendChild(makeBtn('进入下一关 →', 'btn-primary', () => startLevel(nextLevel.id)));
    }
    if (everythingPassed) {
      actions.appendChild(makeBtn('返回首页', 'btn-primary', () => {
        renderHome();
        show('home');
      }));
    }
    actions.appendChild(makeBtn('重做本关', 'btn-ghost', () => startLevel(level.id)));
    if (!everythingPassed) {
      actions.appendChild(makeBtn('返回首页', 'btn-ghost', () => {
        renderHome();
        show('home');
      }));
    }
  } else {
    actions.appendChild(makeBtn('重做本关', 'btn-primary', () => startLevel(level.id)));
    actions.appendChild(makeBtn('返回首页', 'btn-ghost', () => {
      renderHome();
      show('home');
    }));
  }

  /* 错题回顾 */
  const reviewWrap = $('review-list');
  reviewWrap.textContent = '';
  const wrong = session.questions
    .map((question, i) => ({ question, record: session.answers[i] }))
    .filter((item) => item.record && !item.record.correct);

  if (wrong.length === 0) {
    const p = document.createElement('p');
    p.className = 'review-empty';
    p.textContent = '本关没有错题，太强了 🎉';
    reviewWrap.appendChild(p);
    $('review-card').classList.add('hidden');
  } else {
    $('review-card').classList.remove('hidden');
    wrong.forEach(({ question, record }) => {
      const item = document.createElement('div');
      item.className = 'review-item';
      item.innerHTML =
        `<p class="review-q">${format(question.q)}</p>` +
        `<p class="review-line">你的答案：<span class="bad-text">${format(record.chosenText)}</span></p>` +
        `<p class="review-line">正确答案：<span class="ok-text">${format(record.correctText)}</span></p>` +
        `<p class="review-explain">${format(question.explain || '')}</p>`;
      reviewWrap.appendChild(item);
    });
  }

  $('result-credential').textContent = `完成时间：${new Date().toLocaleString('zh-CN')} · 截图本页可作为完成凭证 · 蓝桥工作室`;
}

/* ---------------- 退出 / 重置 ---------------- */

function quitQuiz() {
  if (!state.session) {
    show('home');
    return;
  }
  if (window.confirm('退出后本关进度不会保存，确定退出吗？')) {
    state.session = null;
    renderHome();
    show('home');
  }
}

function resetProgress() {
  if (!window.confirm('确定清空本地闯关进度吗？此操作不可恢复。')) return;
  state.progress = { best: {} };
  state.session = null;
  state.last = null;
  saveProgress();
  renderHome();
  toast('进度已重置');
}

/* ---------------- 事件绑定 / 启动 ---------------- */

function bindEvents() {
  $('btn-start').addEventListener('click', startNext);
  $('btn-reset').addEventListener('click', resetProgress);
  $('btn-quit').addEventListener('click', quitQuiz);
  $('btn-next').addEventListener('click', goNext);

  document.addEventListener('keydown', (event) => {
    if ($('view-quiz').classList.contains('hidden')) return;
    const s = state.session;
    if (!s) return;
    const question = s.questions[s.index];
    if (!question) return;
    const answered = Boolean(s.answers[s.index]);

    if (!answered && /^[1-9]$/.test(event.key)) {
      const index = Number(event.key) - 1;
      if (index < question.options.length) {
        event.preventDefault();
        answer(index);
      }
    } else if (answered && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      goNext();
    }
  });
}

async function init() {
  try {
    const response = await fetch(DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    if (!data || !Array.isArray(data.levels) || !Array.isArray(data.questions) || data.questions.length === 0) {
      throw new Error('题库格式不正确');
    }
    state.data = data;
  } catch (error) {
    $('bank-meta').textContent =
      '题库加载失败：请通过 GitHub Pages 或本地 HTTP 服务打开本页面（直接双击 HTML 文件无法读取题库）。';
    $('level-cards').innerHTML =
      '<p class="review-empty">无法加载 questions.json，请检查网络或部署方式。</p>';
    $('btn-start').disabled = true;
    $('btn-reset').disabled = true;
    return;
  }

  renderHome();
  bindEvents();
}

init();
