
const params = new URLSearchParams(location.search);
const area = params.get("area");
const gender = params.get("gender");
const p1 = params.get("priority1");
const p2 = params.get("priority2");
const p3 = params.get("priority3");

function calcScore(staff) {
  let score = 0;
  let matches = [];
  if (staff.skills.includes(p1)) { score += 3; matches.push(p1); }
  if (staff.skills.includes(p2)) { score += 2; matches.push(p2); }
  if (staff.skills.includes(p3)) { score += 1; matches.push(p3); }
  return { ...staff, score, matches };
}

function skillLabel(code) {
  return {
    korini: "コリに的確",
    chikara: "力強い",
    sukkiri: "スッキリ"
  }[code] || code;
}

const container = document.getElementById("results");

fetch("staff.json")
  .then(response => response.json())
  .then(data => {
    const matched = data
      .filter(s => !gender || s.gender === gender)
      .filter(s => !area || s.area === area)
      .map(calcScore)
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score);

    if (matched.length === 0) {
      container.innerHTML = "<p>条件に合うスタッフが見つかりませんでした。</p>";
    } else {
      matched.forEach(s => {
        const div = document.createElement("div");
        div.innerHTML = `
          <h2>${s.name} さん</h2>
          <p>エリア：${s.area} / 性別：${s.gender}</p>
          <p>マッチスコア：${s.score}</p>
          <p>一致したスキル：${s.matches.map(skillLabel).join("・")}</p>
        `;
        container.appendChild(div);
      });
    }
  })
  .catch(err => {
    container.innerHTML = "<p>スタッフ情報の読み込みに失敗しました。</p>";
    console.error(err);
  });
