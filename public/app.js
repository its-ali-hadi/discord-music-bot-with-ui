async function api(url, opts = {}) {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
  
  // Index page
  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    const resultsEl = document.getElementById('results');
    searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const q = document.getElementById('query').value.trim();
      const guildId = document.getElementById('guildId').value.trim();
      const voiceChannelId = document.getElementById('voiceChannelId').value.trim();
  
      resultsEl.innerHTML = '<p>جاري البحث...</p>';
      try {
        // if it's a full URL, skip search and show direct play
        if (/^https?:\/\//.test(q)) {
          resultsEl.innerHTML = `
            <div class="result-card">
              <div class="info">
                <div class="title">تشغيل مباشر من الرابط</div>
                <div class="meta">${q}</div>
                <button id="play-direct">تشغيل</button>
              </div>
            </div>`;
          document.getElementById('play-direct').onclick = async () => {
            const resp = await api('/api/play', {
              method: 'POST',
              body: JSON.stringify({ guildId, voiceChannelId, urlOrQuery: q })
            });
            alert('تم التشغيل');
          };
          return;
        }
  
        const data = await api(`/api/search?q=${encodeURIComponent(q)}`);
        resultsEl.innerHTML = '';
        data.results.forEach(item => {
          const div = document.createElement('div');
          div.className = 'result-card';
          div.innerHTML = `
            <img src="${item.thumbnail || ''}" alt="">
            <div class="info">
              <div class="title">${item.title}</div>
              <div class="meta">${item.channel} • ${item.duration}</div>
              <button class="play-btn" data-url="${item.url}">تشغيل</button>
            </div>
          `;
          resultsEl.appendChild(div);
        });
  
        document.querySelectorAll('.play-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const url = btn.getAttribute('data-url');
            await api('/api/play', {
              method: 'POST',
              body: JSON.stringify({ guildId, voiceChannelId, urlOrQuery: url })
            });
            alert('تم التشغيل/الإضافة للقائمة');
          });
        });
      } catch (err) {
        resultsEl.innerHTML = `<p>خطأ: ${err.message}</p>`;
      }
    });
  }
  
  // Now playing page
  const btnStatus = document.getElementById('btn-status');
  const npEl = document.getElementById('nowplaying');
  const btnPause = document.getElementById('btn-pause');
  const btnResume = document.getElementById('btn-resume');
  const btnStop = document.getElementById('btn-stop');
  
  function npGuildPrompt() {
    return '1114338679780028449'
  }
  
  async function renderNowPlaying(guildId) {
    try {
      const data = await api(`/api/status?guildId=${encodeURIComponent(guildId)}`);
      const status = data.status;
      const meta = status?.current;
      if (!meta) {
        npEl.innerHTML = `<p>لا يوجد شيء قيد التشغيل.</p>`;
        return;
      }
      npEl.innerHTML = `
        <img src="${meta.thumbnail || ''}" alt="">
        <div>
          <h3 class="np-title">${meta.title}</h3>
          <p class="np-meta">${meta.channel} • ${meta.duration}</p>
        </div>
      `;
    } catch (e) {
      npEl.innerHTML = `<p>خطأ: ${e.message}</p>`;
    }
  }
  
  if (btnStatus) {
    btnStatus.onclick = async () => {
      const guildId = npGuildPrompt();
      if (guildId) await renderNowPlaying(guildId);
    };
  }
  if (btnPause) {
    btnPause.onclick = async () => {
      const guildId = npGuildPrompt();
      if (!guildId) return;
      await api('/api/pause', { method: 'POST', body: JSON.stringify({ guildId }) });
      await renderNowPlaying(guildId);
    };
  }
  if (btnResume) {
    btnResume.onclick = async () => {
      const guildId = npGuildPrompt();
      if (!guildId) return;
      await api('/api/resume', { method: 'POST', body: JSON.stringify({ guildId }) });
      await renderNowPlaying(guildId);
    };
  }
  if (btnStop) {
    btnStop.onclick = async () => {
      const guildId = npGuildPrompt();
      if (!guildId) return;
      await api('/api/stop', { method: 'POST', body: JSON.stringify({ guildId }) });
      await renderNowPlaying(guildId);
    };
  }