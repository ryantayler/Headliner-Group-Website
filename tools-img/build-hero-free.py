"""Builds the Free Sh!t hero.

Two blurs, not one. The frame takes the site's standard radius so it matches the other
heroes, and a feathered region over the monitor takes far more, because the document on
screen names an ASG product and Ryan's rules keep Aaron past tense only. At the site
radius that text is still readable at hero scale.

Re-run if the source or the crop changes. Everything below is measured against the
2400px output, so the 1200px variant scales from the same fractions.
"""
from PIL import Image, ImageFilter, ImageDraw

SRC = 'assets/img/_src/free-hero-source.jpg'
CROP = (0, 1250, None, 3000)          # a wide band out of a portrait frame
SCREEN = (0.225, 0.155, 0.745, 0.875)  # the monitor, as fractions of the output

def build(size, blur):
    im = Image.open(SRC).convert('RGB')
    x0, y0, _, y1 = CROP
    band = im.crop((x0, y0, im.size[0], y1)).resize(size, Image.LANCZOS)
    soft = band.filter(ImageFilter.GaussianBlur(blur))
    heavy = band.filter(ImageFilter.GaussianBlur(size[0] * 13 / 2400))
    w, h = size
    mask = Image.new('L', size, 0)
    ImageDraw.Draw(mask).rectangle(
        (int(w*SCREEN[0]), int(h*SCREEN[1]), int(w*SCREEN[2]), int(h*SCREEN[3])), fill=255)
    # feathered, or the patch reads as a rectangle sitting on the photograph
    mask = mask.filter(ImageFilter.GaussianBlur(size[0] * 0.035))
    return Image.composite(heavy, soft, mask)

if __name__ == '__main__':
    build((2400, 1026), 4).save('assets/img/hero-free.jpg', quality=82, progressive=True, optimize=True)
    build((1200, 513), 2).save('assets/img/hero-free-1200.jpg', quality=82, progressive=True, optimize=True)
    print('built')
