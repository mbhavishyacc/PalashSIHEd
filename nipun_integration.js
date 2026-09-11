/* PALASH NIPUN Bharat integration
   Add this script after your existing script.js.
   It creates the curriculum panel dynamically, so you do not need to redesign
   your existing HTML first.
*/
(() => {
  const state = { data: null };

  const css = `
    .nipun-panel{margin:24px 0;padding:20px;border:1px solid rgba(0,0,0,.10);border-radius:18px;background:#fff}
    .nipun-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
    .nipun-panel label{display:block;font-weight:600;font-size:13px;margin-bottom:6px}
    .nipun-panel select,.nipun-panel input,.nipun-panel textarea{width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #ddd;border-radius:10px;background:#fff}
    .nipun-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
    .nipun-btn{border:0;border-radius:10px;padding:10px 14px;cursor:pointer;font-weight:600}
    .nipun-result{margin-top:18px;padding:16px;border-radius:14px;background:#f7f7f7}
    .nipun-card{padding:12px;margin-top:10px;border:1px solid #e5e5e5;border-radius:12px;background:#fff}
    .nipun-card small{opacity:.7}
    .nipun-columns{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    @media(max-width:700px){.nipun-columns{grid-template-columns:1fr}}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  function escapeHtml(v) {
    const d = document.createElement("div");
    d.textContent = v ?? "";
    return d.innerHTML;
  }

  function buildPanel() {
    if (document.querySelector("#nipunPanel")) return;
    const host = document.querySelector("#worksheetDialog")?.parentElement
      || document.querySelector("main")
      || document.body;

    const panel = document.createElement("section");
    panel.id = "nipunPanel";
    panel.className = "nipun-panel";
    panel.innerHTML = `
      <h2>NIPUN Bharat · Lesson Builder</h2>
      <p>Select a foundational literacy/numeracy competency and generate a bilingual teacher-ready activity.</p>
      <div class="nipun-grid">
        <div><label for="nipunGrade">Grade</label><select id="nipunGrade"></select></div>
        <div><label for="nipunDomain">Domain</label><select id="nipunDomain"><option value="literacy">Literacy</option><option value="numeracy">Numeracy</option></select></div>
        <div><label for="nipunCompetency">Competency</label><select id="nipunCompetency"></select></div>
        <div><label for="nipunTopic">Topic</label><input id="nipunTopic" placeholder="e.g. counting seeds, a village story"></div>
      </div>
      <div class="nipun-actions">
        <button class="nipun-btn" id="nipunGenerate" type="button">Generate lesson</button>
        <button class="nipun-btn" id="nipunWorksheet" type="button">Create worksheet</button>
      </div>
      <div id="nipunResult" class="nipun-result" hidden></div>
    `;
    host.appendChild(panel);

    const grade = panel.querySelector("#nipunGrade");
    state.data.grades.forEach(g => grade.add(new Option(g.label, g.id)));

    panel.querySelector("#nipunDomain").addEventListener("change", refreshCompetencies);
    grade.addEventListener("change", refreshCompetencies);
    panel.querySelector("#nipunGenerate").addEventListener("click", () => generate(false));
    panel.querySelector("#nipunWorksheet").addEventListener("click", () => generate(true));
    refreshCompetencies();
  }

  function currentSelection() {
    const grade = document.querySelector("#nipunGrade").value;
    const domain = document.querySelector("#nipunDomain").value;
    const g = state.data.grades.find(x => x.id === grade);
    const c = g?.competencies.find(x => x.domain === domain && x.id === document.querySelector("#nipunCompetency").value)
      || g?.competencies.find(x => x.domain === domain);
    return { g, c, topic: document.querySelector("#nipunTopic").value.trim() };
  }

  function refreshCompetencies() {
    const { g } = currentSelection();
    const domain = document.querySelector("#nipunDomain").value;
    const select = document.querySelector("#nipunCompetency");
    select.innerHTML = "";
    (g?.competencies || []).filter(c => c.domain === domain).forEach(c => select.add(new Option(`${c.id} · ${c.title}`, c.id)));
  }

  async function generate(worksheet) {
    const { g, c, topic } = currentSelection();
    if (!g || !c) return;
    const result = document.querySelector("#nipunResult");
    result.hidden = false;
    result.innerHTML = "Generating…";

    try {
      const response = await fetch("http://localhost:8000/nipun/generate", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          grade: g.id,
          domain: c.domain,
          competency_id: c.id,
          topic: topic || c.title,
          worksheet
        })
      });
      if (!response.ok) throw new Error("NIPUN API unavailable");
      const data = await response.json();
      renderResult(data);
    } catch (e) {
      // Offline fallback: still gives the teacher a usable activity without the API.
      renderResult({
        grade: g.label,
        domain: c.domain,
        competency: c,
        lesson: {
          objective: c.outcomes[0],
          teacher_steps: [
            "Introduce the topic using a familiar local example.",
            "Present the key Hindi words and their Santali equivalents.",
            "Let learners perform the task with concrete/local materials.",
            "Ask one short oral question to check understanding."
          ],
          bilingual_prompts: [
            "Hindi: " + (topic || c.title),
            "Santali: Use the classroom phrase bank / translation tool for the selected topic."
          ],
          assessment: state.data.activity_templates.assessment
        },
        worksheet: worksheet ? {
          title: `${g.label} · ${c.title}`,
          items: [
            "1. Match or identify the key word.",
            "2. Complete one simple task using the topic.",
            "3. Explain or answer one question orally."
          ]
        } : null,
        offline: true
      });
    }
  }

  function renderResult(data) {
    const c = data.competency || {};
    const lesson = data.lesson || {};
    const r = document.querySelector("#nipunResult");
    r.innerHTML = `
      <div class="nipun-columns">
        <div>
          <small>${escapeHtml(data.grade)} · ${escapeHtml(data.domain)} · ${escapeHtml(c.id || "")}</small>
          <h3>${escapeHtml(c.title || "Lesson")}</h3>
          <p><b>Learning outcome:</b> ${escapeHtml(c.outcomes?.[0] || lesson.objective || "")}</p>
          <h4>Teacher steps</h4>
          <ol>${(lesson.teacher_steps || []).map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ol>
        </div>
        <div>
          <h4>Bilingual prompts</h4>
          ${(lesson.bilingual_prompts || []).map(x => `<div class="nipun-card">${escapeHtml(x)}</div>`).join("")}
          <h4>Assessment</h4>
          <div class="nipun-card">${escapeHtml(lesson.assessment || "")}</div>
        </div>
      </div>
      ${data.worksheet ? `<div class="nipun-card"><h3>${escapeHtml(data.worksheet.title)}</h3>${data.worksheet.items.map(x=>`<p>${escapeHtml(x)}</p>`).join("")}</div>` : ""}
      ${data.offline ? `<small>Offline fallback used. Connect the local PALASH backend for richer generation.</small>` : ""}
    `;
  }

  fetch("http://localhost:8000/nipun/catalog")
    .then(r => r.json())
    .then(data => { state.data = data; buildPanel(); })
    .catch(() => {
      // Local copy is loaded when the backend is unavailable.
      fetch("./nipun_curriculum.json")
        .then(r => r.json())
        .then(data => { state.data = data; buildPanel(); })
        .catch(err => console.error("NIPUN catalog unavailable", err));
    });
})();
