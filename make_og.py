# 카카오톡·SNS 공유 카드용 og.png(1200x630)와 파비콘 icon.png(180x180)를 만드는 스크립트.
# 실제 플레이 화면을 캡처한 이미지에서 고양이 더미를 잘라 쓴다.
# 사용법: python make_og.py <390x844로 찍은 게임 스크린샷(2배율) 경로>
import sys
from PIL import Image, ImageDraw, ImageFont

SRC = sys.argv[1]
BG, FG, MUTED, ACCENT = '#fbf3e6', '#4a3326', '#a58b6f', '#ef7d57'

shot = Image.open(SRC).convert('RGB')
# 390x844 화면을 2배율로 찍은 것 기준. 캔버스 박스는 CSS (5,54)-(386,687) → 2배율로 환산.
BOARD = (10, 108, 772, 1374)
assert shot.size == (780, 1688), f'예상과 다른 캡처 크기: {shot.size}'

# --- og.png : 위쪽은 제목, 아래쪽은 고양이 더미 띠 ---
card = Image.new('RGB', (1200, 630), BG)
d = ImageDraw.Draw(card)

strip = shot.crop((BOARD[0], 1150, BOARD[2], BOARD[3]))        # 고양이가 쌓인 아랫부분만
sw, sh = strip.size
k = 1200 / sw
strip = strip.resize((1200, round(sh * k)), Image.LANCZOS)
card.paste(strip, (0, 630 - strip.height))

title = ImageFont.truetype(r'C:\Windows\Fonts\malgunbd.ttf', 128)
sub = ImageFont.truetype(r'C:\Windows\Fonts\malgun.ttf', 46)
tag = ImageFont.truetype(r'C:\Windows\Fonts\malgunbd.ttf', 34)

d.text((600, 112), '냥냥 머지', font=title, fill=FG, anchor='mm')
d.text((600, 200), '아깽이부터 고등어까지, 고양이 수박게임', font=sub, fill=MUTED, anchor='mm')
d.text((600, 258), '같은 고양이끼리 닿으면 합쳐져요', font=tag, fill=ACCENT, anchor='mm')

card.save('og.png', optimize=True)

# --- icon.png : 가장 큰 고양이 한 마리를 정사각형으로 ---
icon = shot.crop((303, 1175, 497, 1369)).resize((180, 180), Image.LANCZOS)
pad = Image.new('RGB', (180, 180), BG)
pad.paste(icon, (0, 0))
pad.save('icon.png', optimize=True)

print('og.png', Image.open('og.png').size, '/ icon.png', Image.open('icon.png').size)
