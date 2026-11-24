MSC E-ALBUM STUDIO — ULTRA PREMIUM EDITION

QUICK START
1. Extract this ZIP.
2. Put your PDF inside the assets folder.
3. Open config.js.
4. Change PDF_FILE to your exact PDF filename.
   Example: PDF_FILE: "Wedding-Album.pdf"
5. Optionally change ALBUM_TITLE and COUPLE_NAMES.
6. Open this folder through a local web server or upload the entire folder to your hosting.

LOCAL TEST (XAMPP)
- Copy the extracted folder to C:\xampp\htdocs\MSC-EAlbum-Ultra-Premium
- Start Apache.
- Open http://localhost/MSC-EAlbum-Ultra-Premium/

SHARING
Upload this folder to hosting, for example:
public_html/album/rahul-wedding/
Then share:
https://yourdomain.com/album/rahul-wedding/

FOR EACH NEW PDF
Create a separate copy of the viewer folder, put the new PDF in its assets folder,
and update PDF_FILE and album title in config.js.

OPTIONAL MUSIC
Put an MP3 in assets/ and set MUSIC_FILE: "track.mp3" in config.js.
Browsers require a user tap before audio can start.

IMPORTANT
- No PHP, MySQL, login, admin panel or database.
- PDF.js and StPageFlip load from CDNs, so an internet connection is required.
- Do not double-click index.html as a file:// URL. Use XAMPP, localhost or a web host.
- Large PDFs can use significant memory on phones. Export/optimize the PDF before uploading.
- This is a static viewer, not DRM. Anyone who has access to the PDF URL may be able to retrieve it.
- Always test on actual Android and iPhone devices before sharing with a customer.
- Page flip appearance depends on PDF page dimensions and the visitor's browser/device.
