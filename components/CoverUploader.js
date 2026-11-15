'use client';

import { useRef, useState } from 'react';

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read that image. Try a JPG, PNG or WebP."));
    };
    img.src = url;
  });
}

function toJpeg(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Couldn't process that image."))),
      'image/jpeg',
      quality
    );
  });
}

// the page background: at most 1920px wide
async function makeMain(img) {
  const scale = Math.min(1, 1920 / img.naturalWidth);
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(img, 0, 0, w, h);

  let q = 0.8;
  let blob = await toJpeg(canvas, q);
  while (blob.size > 1.5 * 1024 * 1024 && q > 0.5) {
    q -= 0.1;
    blob = await toJpeg(canvas, q);
  }
  return blob;
}

// the link preview: exactly 1200x630, cropped from the centre
async function makeShare(img) {
  const W = 1200;
  const H = 630;
  const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const sw = W / s;
  const sh = H / s;
  const sx = (img.naturalWidth - sw) / 2;
  const sy = (img.naturalHeight - sh) / 2;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  canvas.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
  return toJpeg(canvas, 0.72);
}

function putFile(input, blob, name) {
  const dt = new DataTransfer();
  dt.items.add(new File([blob], name, { type: 'image/jpeg' }));
  input.files = dt.files;
}

export default function CoverUploader({ onBusy }) {
  const mainRef = useRef(null);
  const shareRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [note, setNote] = useState('');

  function clear() {
    if (mainRef.current) mainRef.current.value = '';
    if (shareRef.current) shareRef.current.value = '';
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setNote('');
  }

  async function onPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setNote('Please choose an image file.');
      e.target.value = '';
      return;
    }

    onBusy(true);
    setNote('Preparing image…');
    try {
      const { img, url } = await loadImage(file);
      const [main, share] = await Promise.all([makeMain(img), makeShare(img)]);
      URL.revokeObjectURL(url);

      putFile(mainRef.current, main, 'cover.jpg');
      putFile(shareRef.current, share, 'cover-og.jpg');

      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(main));
      setNote(`Ready (${Math.round(main.size / 1024)} KB). It replaces the dropdown choice when you save.`);
    } catch (err) {
      clear();
      setNote(err.message);
    } finally {
      e.target.value = ''; // the original big file is never submitted
      onBusy(false);
    }
  }

  return (
    <div className="cover-upload">
      <label className="btn btn--small cover-upload__btn">
        Upload a new image
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onPick} hidden />
      </label>

      {/* the resized copies are put in these, and these are what get submitted */}
      <input type="file" name="cover_file" ref={mainRef} hidden tabIndex={-1} />
      <input type="file" name="og_file" ref={shareRef} hidden tabIndex={-1} />

      {preview && (
        <div className="cover-upload__preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Selected cover preview" />
          <button type="button" className="btn btn--small" onClick={clear}>Remove</button>
        </div>
      )}
      {note && <span className="form-hint">{note}</span>}
    </div>
  );
}