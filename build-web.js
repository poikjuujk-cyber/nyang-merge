// 아티팩트 소스(cat-merge.html)를 웹 배포본(index.html)으로 변환하는 빌드 스크립트.
// 아티팩트는 발행할 때 클로드가 doctype/html/head 골격을 씌워 주지만,
// GitHub Pages는 파일을 날것으로 내보내므로 골격이 없으면 '쿼크 모드'로 렌더링된다.
// 쿼크 모드는 브라우저마다 동작이 가장 제각각인 경로라, 여기서 표준 모드로 못 박고
// 카카오톡·SNS 공유 카드용 메타 태그도 함께 끼워 넣는다.
const fs = require('fs');

const SRC = 'cat-merge.html';
const OUT = 'index.html';
const BASE = 'https://poikjuujk-cyber.github.io/nyang-merge/';
const DESC = '같은 고양이를 합쳐서 더 큰 고양이로! 아깽이부터 고등어까지 합치는 고양이 수박게임.';

let s = fs.readFileSync(SRC, 'utf8');

// 아티팩트 소스는 doctype 없이 <meta charset>으로 시작해야 한다.
// 이미 골격이 있으면 이 스크립트를 두 번 돌린 것이므로 멈춘다.
if (/^\s*<!doctype/i.test(s)) { console.error('X 입력에 이미 doctype이 있다 — 아티팩트 소스가 아니다'); process.exit(1); }

const TITLE = '<title>냥냥 머지</title>';
if (s.split(TITLE).length - 1 !== 1) { console.error('X <title> 앵커를 찾지 못했다'); process.exit(1); }

// 카카오톡은 og:* 와 title/description만 읽는다. twitter:* 는 X·기타 메신저용.
const META = [
  '<meta name="description" content="' + DESC + ' 한 손으로 즐기고 최고 점수에 도전해 보세요.">',
  '<link rel="canonical" href="' + BASE + '">',
  '<meta property="og:type" content="website">',
  '<meta property="og:site_name" content="냥냥 머지">',
  '<meta property="og:locale" content="ko_KR">',
  '<meta property="og:title" content="냥냥 머지">',
  '<meta property="og:description" content="' + DESC + '">',
  '<meta property="og:url" content="' + BASE + '">',   // 끝 슬래시 필수(없으면 301이고 캐시 키도 다르다)
  '<meta property="og:image" content="' + BASE + 'og.png?v=1">',
  '<meta property="og:image:secure_url" content="' + BASE + 'og.png?v=1">',
  '<meta property="og:image:type" content="image/png">',
  '<meta property="og:image:width" content="1200">',
  '<meta property="og:image:height" content="630">',
  '<meta property="og:image:alt" content="냥냥 머지 플레이 화면">',
  '<meta name="twitter:card" content="summary_large_image">',
  '<meta name="twitter:title" content="냥냥 머지">',
  '<meta name="twitter:description" content="' + DESC + '">',
  '<meta name="twitter:image" content="' + BASE + 'og.png?v=1">',
  '<meta name="theme-color" content="#fbf3e6" media="(prefers-color-scheme: light)">',
  '<meta name="theme-color" content="#241c15" media="(prefers-color-scheme: dark)">',
  '<link rel="icon" href="icon.png" type="image/png">',
  '<link rel="apple-touch-icon" href="icon.png">',
].join('\n');

s = s.replace(TITLE, TITLE + '\n' + META);
// head/body 여는 태그는 HTML5에서 생략 가능하다. doctype과 lang만 있으면 표준 모드 + 한국어 문서가 된다.
s = '<!doctype html>\n<html lang="ko">\n' + s + '\n</html>\n';

fs.writeFileSync(OUT, s);
console.log('OK ' + OUT + ' 생성 — doctype(표준 모드) + 공유 카드 메타 ' + META.split('\n').length + '줄');
