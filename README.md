# Eagle Eye Emma's Valentine Quest 💕

A personalized 6-level browser game for Emma, telling your love story.

## Quick Start

### Option 1: Local Testing
1. Open `index.html` in a web browser
2. For best results, use a local server:
   ```bash
   cd /Users/barretttaylor/Desktop/Clark/ClaudeCode/claude-code/projects/emma-valentine-game
   python3 -m http.server 8000
   ```
3. Open http://localhost:8000 in your browser

### Option 2: Deploy to GitHub Pages (Get a shareable link)
1. Create a new GitHub repository
2. Upload these files: `index.html`, `game.js`, `sprites.js`
3. Go to Settings → Pages → Source: main branch
4. Your game will be at: `https://yourusername.github.io/repo-name/`

### Option 3: Netlify Drop (Fastest)
1. Go to https://app.netlify.com/drop
2. Drag the entire `emma-valentine-game` folder
3. Get instant shareable URL!

## Game Levels

1. **The Dispensary (3Fifteen)** - Where you met, exterior → waiting room → store, "Did you like the tree?" DM
2. **Art Hill / Forest Park** - First date at the museum, walk to the blanket together
3. **SLU / Mizzou Days** - Class rush mini-game (park far, run to classes!), tornado chase in storm vehicle
4. **Cozy Night In** - Catch falling items, guitar serenade, "What da hell"
5. **The Long Drive** - Drive from Columbia to STL, "Worth Every Mile"
6. **Valentine's Finale** - Hearts explosion, your message to Emma

## Customization

### Change the Final Message
Edit `game.js`, find the `Level6_Finale` class, and modify the `message` variable around line 1050.

### Add Your Own Photos
1. Add images to an `assets/` folder
2. In `BootScene.preload()`, add:
   ```javascript
   this.load.image('custom_bg', 'assets/your-photo.jpg');
   ```
3. Use in any scene with:
   ```javascript
   this.add.image(x, y, 'custom_bg');
   ```

### Change Character Colors
Edit `sprites.js` and modify the `colors` object at the top to change Emma's or Barrett's appearance.

## Controls

- **Desktop**: Arrow keys to move, spacebar to jump/action
- **Mobile**:
  - Tap left side to move left
  - Tap right side to move right
  - Tap center to jump/action

## Technical Details

- Built with Phaser 3.70
- All sprites generated programmatically (no external image files needed)
- Mobile-optimized touch controls
- ~3500+ lines of JavaScript

## Files

- `index.html` - Game container and styling
- `game.js` - All 6 levels and game logic
- `sprites.js` - Pixel art sprite generation

## Future Enhancements (Post-Polish)

- [ ] **Add Background Music**
  - Title screen: Romantic/chill music
  - Gameplay: Upbeat background tracks
  - Level 4 (Cozy Night): Acoustic guitar sounds (maybe Barrett playing!)
  - Finale: Emotional/triumphant music
  - Options: Royalty-free tracks, custom audio files, or Web Audio API synth

- [ ] **Sound Effects**
  - Collectible pickup sounds
  - Jump/movement sounds
  - Level complete jingles
  - Dialogue blips

---

Made with 💕 for Emma

Happy Valentine's Day, Eagle Eye Emma! - Your Old Man 👴
