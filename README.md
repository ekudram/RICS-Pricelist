# RICS Price List

A GitHub Pages site for displaying RICS mod purchase lists.

## For Streamers

### Quick Setup
1. Fork this repository
2. Enable GitHub Pages in your repository settings (Settings → Pages → Source: Deploy from branch → main branch)
3. Upload your RICS JSON files to the `data/` folder:
   - `StoreItems.json`
   - `StoreEvents.json` 
   - `StoreTraits.json`
   - `StoreRaces.json`
4. Your price list will be available at `https://yourusername.github.io/rics-pricelist/`

### Customization
- Edit `index.html` to change the title or layout
- Modify `assets/css/rics-store.css` to change colors and styling
- Update the JSON files whenever your RICS mod generates new ones

### File Structure
- `index.html` - Main page
- `assets/css/rics-store.css` - Styles
- `assets/js/rics-store.js` - Functionality
- `data/` - Your RICS JSON files go here
