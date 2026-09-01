# TiffinConnect — Updated Connected Version

## Pages
- `index.html` — public home, announcement banner and mess discovery
- `login.html` — Student / Owner / Admin role login
- `dashboard.html` — student dashboard
- `owner.html` — mess-owner controls
- `admin.html` — admin analytics and announcements
- `app.js` — shared LocalStorage/auth/dated-notice logic
- `style.css` — glassmorphism, classic typography, 3D tiffin and responsive design

## Demo credentials
Admin:
- Email: `admin@tiffinconnect.com`
- Password: `Admin@123`

Mess Owner:
- Email: `owner@tiffinconnect.com`
- Password: `Owner@123`

Students:
- Use Sign up to create an account.

## Automatic daily cleanup
`app.js` checks `tiffinStatus`, `siteNotice`, and `menu` on every page load. If a stored item has a date different from today, it is automatically removed from LocalStorage.

So a message such as "Today's tiffin is delayed" will not remain on the site tomorrow.

## Run
Extract the ZIP and open `index.html` in a browser. Internet is used only for CDN fonts/Tailwind and remote demo food images. App data is stored locally in the browser.

## Note
This is a frontend demonstration. LocalStorage authentication is not secure for a real production website.
