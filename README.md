# RICS Price List

A GitHub Pages site for displaying RICS mod purchase lists.

## For Streamers

### Quick Setup
1. Fork this repository
2. Enable GitHub Pages in your repository settings (Settings → Pages → Source: Deploy from branch → main branch)
3. Upload your RICS JSON files to the `data/` folder 
from `%AppData%\LocalLow\Ludeon Studios\RimWorld by Ludeon Studios\Config\CAP_ChatInteractive` :
   - `StoreItems.json`
   - `Events.json` 
   - `Traits.json`
   - `Racessetting.json`
   - `Weather.json`
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

## Updating Your Fork

### If you've just forked this repo:
1. Go to Settings → Pages
2. Set Source to "Deploy from a branch"
3. Select branch `main` and folder `/root`
4. Click Save - your site will be at `https://YOUR-USERNAME.github.io/REPO-NAME`

### To update your fork with new changes:
#### Simple method:
1. Go to your fork on GitHub
2. Edit `assets/js/rics-store.js`
3. Replace the `processRacesData` and `renderRaces` functions with the latest versions
4. Commit changes

#### Using Sync Fork:
1. Go to your fork
2. Click "Sync fork" (top of repo)
3. Click "Update branch"
4. Resolve any conflicts if prompted

#### Using Git (advanced):

git pull upstream main
# Resolve any conflicts
git push origin main


### 4. **Common Issues to Warn About:**


⚠️ **Important Notes:**
1. **Data files must be in `data/` folder** at root level
2. **Case sensitivity matters**: `StoreItems.json` not `storeitems.json`
3. **Check browser console** (F12) for loading errors
4. **GitHub Pages takes 1-5 minutes** to deploy after pushing
