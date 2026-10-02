# CareBuddy Website

A professional home healthcare services website similar to Care24.co.in, built with HTML, CSS, and JavaScript.

## Features

- **Clean, Professional Design**: Modern UI with responsive layout
- **Custom Logo**: CareBuddy logo with heart symbol (SVG inline)
- **Services Section**: 
  - Patient Care
  - Japa Maid
  - Maid Services
- **Contact Form**: Integrated with Zoho Forms and Zoho Bigin
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Hover effects and smooth scrolling

## File Structure

```
CareBuddy/
├── index.html      # Main HTML structure
├── style.css       # CSS styling
├── script.js       # JavaScript functionality
├── server.js       # Simple Node.js server (optional)
└── README.md       # This file
```

## How to Use

### Option 1: Open Directly in Browser
Simply open `index.html` in your web browser:
- Double-click on `index.html`
- Or right-click and select "Open with" > your browser

### Option 2: Using Node.js Server (if Node.js is installed)
```bash
node server.js
```
Then open http://localhost:3000 in your browser

### Option 3: Using Python Server (if Python is installed)
```bash
python -m http.server 8000
```
Then open http://localhost:8000 in your browser

## Zoho Integration

The website is pre-configured to integrate with Zoho Forms and Zoho Bigin. To enable this integration:

### Step 1: Get Zoho Bigin Credentials

1. Go to [Zoho Bigin](https://www.zoho.com/bigin/)
2. Create an account or sign in
3. Go to Settings > Developer Space > API
4. Generate an Auth Token
5. Note down your:
   - Auth Token
   - Organization ID
   - Pipeline ID

### Step 2: Configure Zoho Forms (Optional)

1. Go to [Zoho Forms](https://www.zoho.com/forms/)
2. Create a form with fields matching your contact form
3. Get the form link or embed code

### Step 3: Update script.js

Open `script.js` and update the `ZOHO_CONFIG` object with your credentials:

```javascript
const ZOHO_CONFIG = {
    forms: {
        formLink: 'YOUR_ZOHO_FORM_LINK',
        formId: 'YOUR_FORM_ID'
    },
    
    bigin: {
        authToken: 'YOUR_ZOHO_BIGIN_AUTH_TOKEN',
        organizationId: 'YOUR_ORG_ID',
        pipelineId: 'YOUR_PIPELINE_ID',
        apiUrl: 'https://www.zohoapis.com/bigin/v1'
    }
};
```

### Step 4: Test the Integration

1. Submit a test form on your website
2. Check Zoho Bigin to verify the contact was created
3. Check that a deal was created in your pipeline

## Customization

### Change Colors
Edit the CSS variables in `style.css`:

```css
:root {
    --primary-color: #e74c3c;    /* Main brand color */
    --secondary-color: #2c3e50;  /* Dark text color */
    --accent-color: #3498db;     /* Accent color */
    --success-color: #27ae60;    /* Success messages */
}
```

### Update Contact Information
Edit the contact information in `index.html` (search for "contact-info" section):

```html
<div class="contact-item">
    <h4>Phone</h4>
    <p>+91 99999 99999</p>
</div>
```

### Add More Services
Add new service cards in the `services-grid` section of `index.html`.

## Deployment

### GitHub Pages
1. Push the code to a GitHub repository
2. Go to repository Settings > Pages
3. Select the main branch as source
4. Your site will be live at `https://yourusername.github.io/repository-name`

### Netlify
1. Drag and drop the folder to [Netlify Drop](https://app.netlify.com/drop)
2. Your site will be live instantly

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel` in the project directory
3. Follow the prompts

## Support

For issues or questions, please contact the development team.

## License

© 2026 CareBuddy. All rights reserved.
