# Paws and Homes Pet Care and Adoption

A responsive, accessible static website for a fictional animal-welfare organisation. Visitors can browse adoptable pets, filter them by type, read pet-care guidance, learn about the adoption process and complete a client-side adoption enquiry form.

The site uses only **HTML, CSS and vanilla JavaScript**. There is no backend, database, build step or external library, so it runs directly on GitHub Pages.

## Project structure

```text
pet-care-and-adoption-website/
├── index.html      Home page
├── adopt.html      Adoptable pets with JavaScript filtering
├── care.html       Pet-care guidance and "Before You Adopt" checklist
├── about.html      Mission, values and adoption process
├── contact.html    Contact details and enquiry form
├── 404.html        Custom "Page Not Found" page
├── css/
│   └── style.css   All styles, including responsive and print styles
├── js/
│   └── script.js   Mobile menu, pet filter and form validation
├── images/
│   └── README.txt  Notes about image sources and licensing
└── README.md       This file
```

## Deploying to GitHub Pages

1. Sign in to GitHub and create a new **public** repository, for example `pet-care-and-adoption-website`.
2. Upload the **contents** of this folder to the root of the repository, so that `index.html` sits at the top level next to the `css`, `js` and `images` folders. (Do not upload the outer folder itself, or `index.html` will be one level too deep.)
3. Commit the files to the `main` branch.
4. Open the repository's **Settings** and choose **Pages** in the side menu.
5. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
6. Choose the **main** branch and the **/ (root)** folder, then select **Save**.
7. Wait a minute or two, then refresh the Pages settings screen. GitHub shows the live address, which will look like:
   `https://your-username.github.io/pet-care-and-adoption-website/`

No installation or build steps are needed. Every link uses a relative path, so the site works both at a project address like the one above and when the files are opened locally.

## Viewing locally

Double-click `index.html` to open it in any modern web browser. All features work without a web server.

## Features

- Sticky header with a keyboard-accessible mobile menu (`aria-expanded`, `aria-controls`, Escape to close)
- Skip-to-content link and visible focus indicators
- Active navigation link marked with `aria-current="page"`
- Pet filter (All Pets, Dogs, Cats) with `aria-pressed` buttons and an `aria-live` status message
- "Enquire About [Pet]" buttons that pass the pet's name to the contact form (`contact.html?pet=Bella`)
- Contact form that preselects the chosen pet, validates every field with clear inline errors and shows a success message without reloading the page
- Image fallback that keeps the layout tidy if a remote image cannot load
- Responsive layouts for desktop, tablet and mobile, plus print and reduced-motion styles

## Testing checklist

- Visit every page using both the header and footer links.
- Narrow the browser window and open and close the menu with the mouse and with the keyboard (Tab, Enter, Escape).
- On the Adopt a Pet page, select each filter and confirm only the matching pets are shown.
- Select an "Enquire About" button and confirm the pet is preselected on the Contact page.
- Submit the form empty, then with invalid values, then with valid values.

## Privacy

The enquiry form is a demonstration only. Information is checked in the visitor's browser and is never sent to a server or stored.

## Notes

- Images are loaded from Unsplash as placeholders. See `images/README.txt` before using the site for a real organisation.
- GitHub Pages serves `404.html` for missing addresses. For a missing address inside a sub-folder (for example `/missing/page`), browsers may not find the stylesheet because the site uses relative paths; the page content and its link home still work.
- Paws and Homes is a fictional organisation. The email address uses the reserved `.example` domain and the telephone number is a fictional `555` number.
