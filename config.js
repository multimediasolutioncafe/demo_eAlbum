/*
  MSC E-ALBUM STUDIO — YOUR ONLY REGULAR EDIT

  1) Put your PDF inside the "assets" folder.
  2) Write its exact filename below.
  3) Save and open index.html through a web server.

  Example: PDF_FILE: "Rahul-Wedding.pdf"
*/
window.MSC_ALBUM = {
  PDF_FILE: "Rahul-Wedding.pdf",
  ALBUM_TITLE: "A Beautiful Beginning",
  COUPLE_NAMES: "Shobha & Vikash",

  // Optional background music. Put an MP3 inside assets and enter its filename.
  // Leave "" for no music.
  MUSIC_FILE: "song.mp3",

  // "auto" detects phone or desktop. You can force "single" or "double".
  PAGE_MODE: "double",

  // Visual quality. Higher quality uses more memory on phones.
  RENDER_SCALE: 2.35,

  // Show the first PDF page as the outside cover.
  HARD_COVER: true
};
