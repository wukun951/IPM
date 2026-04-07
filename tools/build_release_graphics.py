from __future__ import annotations

from pathlib import Path
from typing import Tuple

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(r"E:\AIGC\promptagent\ImproveMAX")
ASSET_DIR = ROOT / "assets" / "github"
OUTPUT_DIR = ASSET_DIR


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        Path(r"C:\Windows\Fonts\msyhbd.ttc") if bold else Path(r"C:\Windows\Fonts\msyh.ttc"),
        Path(r"C:\Windows\Fonts\msyhbd.ttf") if bold else Path(r"C:\Windows\Fonts\msyh.ttf"),
        Path(r"C:\Windows\Fonts\segoeuib.ttf") if bold else Path(r"C:\Windows\Fonts\segoeui.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def rounded_panel(
    canvas: Image.Image,
    box: Tuple[int, int, int, int],
    radius: int,
    fill: Tuple[int, int, int, int],
    outline: Tuple[int, int, int, int] | None = None,
    outline_width: int = 1,
) -> None:
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=outline_width)
    canvas.alpha_composite(overlay)


def add_shadowed_image(
    canvas: Image.Image,
    source_path: Path,
    box: Tuple[int, int, int, int],
    radius: int = 30,
    shadow_offset: Tuple[int, int] = (0, 18),
    shadow_blur: int = 38,
) -> None:
    image = Image.open(source_path).convert("RGBA")
    target_w = box[2] - box[0]
    target_h = box[3] - box[1]
    image.thumbnail((target_w, target_h))

    framed = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    x = (target_w - image.width) // 2
    y = (target_h - image.height) // 2
    framed.alpha_composite(image, (x, y))

    mask = Image.new("L", (target_w, target_h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, target_w, target_h), radius=radius, fill=255)
    clipped = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    clipped.paste(framed, mask=mask)

    shadow = Image.new("RGBA", (target_w + shadow_blur * 2, target_h + shadow_blur * 2), (0, 0, 0, 0))
    shadow_box = (shadow_blur, shadow_blur, shadow_blur + target_w, shadow_blur + target_h)
    ImageDraw.Draw(shadow).rounded_rectangle(shadow_box, radius=radius, fill=(7, 13, 24, 150))
    shadow = shadow.filter(ImageFilter.GaussianBlur(shadow_blur / 2))
    canvas.alpha_composite(shadow, (box[0] - shadow_blur + shadow_offset[0], box[1] - shadow_blur + shadow_offset[1]))
    canvas.alpha_composite(clipped, (box[0], box[1]))


def add_glow(canvas: Image.Image, center: Tuple[int, int], radius: int, color: Tuple[int, int, int, int]) -> None:
    overlay = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for step in range(5, 0, -1):
        alpha = int(color[3] * (step / 5) * 0.18)
        draw.ellipse(
            (
                center[0] - radius * step / 5,
                center[1] - radius * step / 5,
                center[0] + radius * step / 5,
                center[1] + radius * step / 5,
            ),
            fill=(color[0], color[1], color[2], alpha),
        )
    canvas.alpha_composite(overlay)


def draw_multiline(
    draw: ImageDraw.ImageDraw,
    text: str,
    xy: Tuple[int, int],
    font: ImageFont.FreeTypeFont,
    fill: Tuple[int, int, int, int],
    spacing: int = 10,
) -> None:
    draw.multiline_text(xy, text, font=font, fill=fill, spacing=spacing)


def build_hero_cover() -> None:
    width, height = 1600, 900
    canvas = Image.new("RGBA", (width, height), (7, 13, 24, 255))
    draw = ImageDraw.Draw(canvas)

    for index, color in enumerate([(68, 135, 255, 92), (69, 232, 201, 78), (170, 94, 255, 62)]):
        add_glow(canvas, (240 + index * 520, 150 + index * 120), 340, color)

    title_font = load_font(66, bold=True)
    subtitle_font = load_font(28)
    eyebrow_font = load_font(20)
    bullet_title_font = load_font(24, bold=True)
    bullet_body_font = load_font(18)

    draw.text((92, 78), "IMPROVEMAX / IPM", font=eyebrow_font, fill=(145, 182, 255, 240))
    draw.text((92, 118), "AI 资源操作系统", font=title_font, fill=(245, 249, 255, 255))
    draw_multiline(
        draw,
        "把资料、提示词、工作流、Agent 规则和局部图谱\n组织成一个可调用、可联动、可复用的个人工作台。",
        (92, 206),
        subtitle_font,
        (199, 213, 236, 230),
        spacing=12,
    )

    bullet_x = 92
    bullet_y = 336
    bullets = [
        ("卡牌资源库", "收纳知识卡、提示卡、脚本卡、流程卡，并支持 Markdown/TXT/PDF/DOCX/图片导入。"),
        ("图谱关系视图", "用主行星 + 轨道 + 语义连线的方式观察当前焦点与相关资源的关系强度。"),
        ("项目工作台", "把上下文、引擎、输出拆成槽位，形成稳定的 AI 创作与复盘流程。"),
    ]
    for title, body in bullets:
        rounded_panel(canvas, (bullet_x, bullet_y, bullet_x + 470, bullet_y + 118), 28, (14, 24, 42, 168), (62, 94, 138, 120))
        draw.text((bullet_x + 24, bullet_y + 18), title, font=bullet_title_font, fill=(244, 248, 255, 255))
        draw_multiline(draw, body, (bullet_x + 24, bullet_y + 56), bullet_body_font, (193, 208, 228, 235), spacing=8)
        bullet_y += 138

    add_shadowed_image(canvas, ASSET_DIR / "desktop-release-window.png", (840, 94, 1520, 530), radius=34)
    add_shadowed_image(canvas, ASSET_DIR / "cards-view.png", (840, 566, 1158, 814), radius=28)
    add_shadowed_image(canvas, ASSET_DIR / "graph-view.png", (1180, 566, 1520, 814), radius=28)

    rounded_panel(canvas, (92, 792, 1520, 848), 22, (11, 20, 34, 150), (70, 104, 150, 120))
    draw.text(
        (116, 808),
        "Windows Portable Beta · 解压即用 · 本地优先 · 适合设计 / AI 工作流 / 数字资产沉淀",
        font=load_font(22, bold=True),
        fill=(230, 239, 255, 240),
    )

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    canvas.save(OUTPUT_DIR / "hero-cover.png")


def build_quickstart_board() -> None:
    width, height = 1600, 1200
    canvas = Image.new("RGBA", (width, height), (7, 13, 24, 255))
    draw = ImageDraw.Draw(canvas)

    add_glow(canvas, (240, 190), 280, (68, 135, 255, 78))
    add_glow(canvas, (1330, 240), 300, (69, 232, 201, 66))
    add_glow(canvas, (1080, 940), 320, (170, 94, 255, 58))

    draw.text((90, 72), "IPM 快速开始", font=load_font(58, bold=True), fill=(244, 248, 255, 255))
    draw.text((92, 146), "3 步完成上手与发布前体验", font=load_font(26), fill=(191, 208, 232, 235))

    steps = [
        ("01 打开应用", "运行压缩包中的 IPM.exe，进入卡牌视图浏览资源。", ASSET_DIR / "desktop-release-window.png"),
        ("02 导入资料", "点击“导入文件”或直接拖拽，优先导入 Markdown、TXT、PDF、DOCX 与图片。", ASSET_DIR / "cards-view.png"),
        ("03 进入图谱", "切换到图谱视图，围绕当前焦点观察集合、工作台与标签带来的关系层级。", ASSET_DIR / "graph-view.png"),
    ]

    left = 92
    top = 230
    card_w = 1416
    card_h = 280
    for index, (title, body, image_path) in enumerate(steps):
        y = top + index * 300
        rounded_panel(canvas, (left, y, left + card_w, y + card_h), 36, (12, 22, 39, 176), (60, 92, 136, 118))
        draw.text((left + 32, y + 28), title, font=load_font(34, bold=True), fill=(244, 248, 255, 255))
        draw_multiline(draw, body, (left + 34, y + 88), load_font(22), (197, 211, 232, 238), spacing=10)
        add_shadowed_image(canvas, image_path, (left + 620, y + 24, left + card_w - 24, y + card_h - 24), radius=28)

    canvas.save(OUTPUT_DIR / "quickstart-board.png")


def main() -> None:
    build_hero_cover()
    build_quickstart_board()


if __name__ == "__main__":
    main()
