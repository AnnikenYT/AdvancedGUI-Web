export function getBase64(file: File | Blob): Promise<string> {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise(resolve => {
    reader.onload = function() {
      resolve(reader.result as string);
    };
  });
}

export interface Font {
  name: string;
  data: string;
}

export const fonts: { [key: string]: Font } = {};

export async function registerFont(file: File | Blob, fontName: string) {
  const dataUrl = await getBase64(file);
  const font = new FontFace(fontName, `url(${dataUrl})`);
  // wait for font to be loaded
  await font.load();
  // add font to document
  document.fonts.add(font);

  fonts[fontName] = {
    name: fontName,
    data: dataUrl
  };
}

export function registerDefaultFonts() {
  for (const font of [
    "Anton",
    "Bitter",
    "IndieFlower",
    "Oswald",
    "PermanentMarker",
    "PressStart2P",
    "Roboto",
    "VT323",
    "Yoster"
  ]) {
    fetch(`fonts/${font}.ttf`)
      .then(resp => resp.blob())
      .then(blob => registerFont(blob, font));
  }
}