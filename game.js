/**
 * Eagle Eye Emma's Valentine Quest
 * A love story in 6 chapters
 * Built with Phaser 3
 */

// Global game state
const GameState = {
    heartsCollected: 0,
    currentLevel: 0,
    playerName: 'Emma'
};

// ============================================
// BOOT SCENE - Load assets and generate sprites
// ============================================
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
        this.loadedCount = 0;
        this.totalToLoad = 0;
    }

    preload() {
        console.log('BootScene: Starting preload...');

        // Generate all sprites
        let sprites;
        try {
            sprites = SpriteGenerator.generateAllSprites();
            console.log('BootScene: Sprites generated successfully');
        } catch (e) {
            console.error('BootScene: Error generating sprites:', e);
            return;
        }

        // Count total textures to load
        // 4 emma + 7 chars + 4 collectibles + 7 items + 7 vehicles + 5 nature + 1 tornado + 4 buildings + 6 props + 9 UI icons + 4 signs = 58
        this.totalToLoad = 58;

        // Load Emma walk frames
        sprites.emma.forEach((dataUrl, i) => {
            this.loadTexture(`emma_walk_${i}`, dataUrl);
        });

        // Load character sprites
        this.loadTexture('barrett', sprites.barrett);
        this.loadTexture('barrett_guitar', sprites.barrettGuitar);
        this.loadTexture('barrett_keyboard', sprites.barrettKeyboard);
        this.loadTexture('minnie', sprites.minnie);
        this.loadTexture('bowtie_cat', sprites.bowtieCat);
        this.loadTexture('ghost', sprites.ghost);
        this.loadTexture('neighbor_lady', sprites.neighborLady);

        // Load collectibles
        this.loadTexture('heart', sprites.heart);
        this.loadTexture('heart_red', sprites.heartRed);
        this.loadTexture('heart_gold', sprites.heartGold);
        this.loadTexture('leaf', sprites.leaf);

        // Load Level 4 items
        this.loadTexture('popcorn', sprites.popcorn);
        this.loadTexture('remote', sprites.remote);
        this.loadTexture('alfredo', sprites.alfredo);
        this.loadTexture('salad', sprites.salad);
        this.loadTexture('music_note', sprites.musicNote);
        this.loadTexture('smoke_puff', sprites.smokePuff);

        // Load vehicles
        this.loadTexture('car', sprites.car);
        this.loadTexture('car_blue', sprites.carBlue);
        this.loadTexture('car_green', sprites.carGreen);
        this.loadTexture('car_yellow', sprites.carYellow);
        this.loadTexture('car_red', sprites.carRed);
        this.loadTexture('car_purple', sprites.carPurple);
        this.loadTexture('storm_vehicle', sprites.stormVehicle);

        // Load nature sprites
        this.loadTexture('tree', sprites.tree);
        this.loadTexture('bird', sprites.bird);
        this.loadTexture('butterfly', sprites.butterfly);
        this.loadTexture('sparkle', sprites.sparkle);
        this.loadTexture('anxiety_cloud', sprites.anxietyCloud);

        // Load Level 3 sprites
        this.loadTexture('tornado', sprites.tornado);

        // Load Level 6 / Finale sprites
        this.loadTexture('arch', sprites.arch);
        this.loadTexture('building', sprites.building);
        this.loadTexture('building_tall', sprites.buildingTall);
        this.loadTexture('building_short', sprites.buildingShort);

        // Load props
        this.loadTexture('dispensary_sign', sprites.dispensarySign);
        this.loadTexture('blanket', sprites.blanket);
        this.loadTexture('wine', sprites.wine);
        this.loadTexture('guitar', sprites.guitar);
        this.loadTexture('electric_keyboard', sprites.electricKeyboard);
        this.loadTexture('phone', sprites.phone);
        this.loadTexture('speech_bubble', sprites.speechBubble);

        // Load UI icons
        this.loadTexture('clipboard', sprites.clipboard);
        this.loadTexture('grad_cap', sprites.gradCap);
        this.loadTexture('couch', sprites.couch);
        this.loadTexture('museum', sprites.museum);
        this.loadTexture('car_icon', sprites.carIcon);
        this.loadTexture('city_icon', sprites.cityIcon);
        this.loadTexture('star', sprites.star);
        this.loadTexture('door', sprites.door);
        this.loadTexture('clapboard', sprites.clapboard);

        // Generate road signs
        ['Columbia 120mi', 'STL 60mi', 'Worth Every Mile', 'Welcome to STL!'].forEach(text => {
            const signData = SpriteGenerator.generateRoadSign(text);
            this.loadTexture(`sign_${text.replace(/[^a-z0-9]/gi, '')}`, signData);
        });
    }

    loadTexture(key, dataUrl) {
        console.log('Loading texture:', key);
        const img = new Image();
        img.onload = () => {
            console.log('Loaded texture:', key);
            this.textures.addImage(key, img);
            this.loadedCount++;
            this.checkAllLoaded();
        };
        img.onerror = (e) => {
            console.error('Failed to load texture:', key, e);
            this.loadedCount++;
            this.checkAllLoaded();
        };
        img.src = dataUrl;
    }

    checkAllLoaded() {
        console.log('Loaded:', this.loadedCount, '/', this.totalToLoad);
        if (this.loadedCount >= this.totalToLoad) {
            console.log('All textures loaded, starting game...');
            this.startGame();
        }
    }

    create() {
        // Will be called before images load, so we check in checkAllLoaded
    }

    startGame() {
        // Hide loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }

        // Start title scene
        this.scene.start('TitleScene');
    }
}

// ============================================
// TITLE SCENE
// ============================================
class TitleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TitleScene' });
        this.levelSelectOpen = false;
    }

    create() {
        const { width, height } = this.scale;

        // Background gradient (drawn with graphics)
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x0f3460, 0x0f3460, 1);
        bg.fillRect(0, 0, width, height);

        // Floating hearts background
        this.hearts = [];
        for (let i = 0; i < 15; i++) {
            const heartKey = Phaser.Utils.Array.GetRandom(['heart', 'heart_red', 'heart_gold']);
            const heart = this.add.image(
                Phaser.Math.Between(20, width - 20),
                Phaser.Math.Between(50, height - 50),
                heartKey
            );
            heart.setScale(Phaser.Math.FloatBetween(1, 2.5));
            heart.setAlpha(0.3);
            this.hearts.push({
                obj: heart,
                speed: Phaser.Math.FloatBetween(0.3, 1),
                wobble: Phaser.Math.FloatBetween(0, Math.PI * 2)
            });
        }

        // Title heart
        this.add.image(width / 2, 120, 'heart').setScale(4).setOrigin(0.5);

        this.add.text(width / 2, 200, "Eagle Eye Emma's", {
            fontSize: '28px',
            fontFamily: 'Georgia, serif',
            fill: '#FF69B4'
        }).setOrigin(0.5);

        this.add.text(width / 2, 240, 'Valentine Quest', {
            fontSize: '32px',
            fontFamily: 'Georgia, serif',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, 300, 'A love story in 6 chapters', {
            fontSize: '14px',
            fill: '#888'
        }).setOrigin(0.5);

        // Start button
        const startBtn = this.add.rectangle(width / 2, 420, 200, 50, 0xE91E63)
            .setInteractive({ useHandCursor: true });

        this.add.text(width / 2, 420, '▶ Start Game', {
            fontSize: '20px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Button hover effect
        startBtn.on('pointerover', () => startBtn.setFillStyle(0xFF69B4));
        startBtn.on('pointerout', () => startBtn.setFillStyle(0xE91E63));
        startBtn.on('pointerdown', () => {
            if (this.levelSelectOpen) return;
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('Level1_Dispensary');
            });
        });

        // ========== SELECT LEVEL BUTTON ==========
        const levelBtn = this.add.rectangle(width / 2, 490, 200, 40, 0x4A4A6A)
            .setInteractive({ useHandCursor: true });

        this.add.image(width / 2 - 70, 490, 'clipboard').setScale(1.2);
        this.add.text(width / 2 + 10, 490, 'Select Level', {
            fontSize: '16px',
            fill: '#fff'
        }).setOrigin(0.5);

        levelBtn.on('pointerover', () => levelBtn.setFillStyle(0x6A6A8A));
        levelBtn.on('pointerout', () => levelBtn.setFillStyle(0x4A4A6A));
        levelBtn.on('pointerdown', () => {
            if (!this.levelSelectOpen) {
                this.openLevelSelect();
            }
        });

        // Credits
        this.add.text(width / 2 - 10, height - 40, 'Made with', {
            fontSize: '12px',
            fill: '#666'
        }).setOrigin(1, 0.5);
        this.add.image(width / 2, height - 40, 'heart').setScale(0.8);
        this.add.text(width / 2 + 10, height - 40, 'for Emma', {
            fontSize: '12px',
            fill: '#666'
        }).setOrigin(0, 0.5);

        // Fade in
        this.cameras.main.fadeIn(500);
    }

    openLevelSelect() {
        this.levelSelectOpen = true;
        const { width, height } = this.scale;

        // Modal container
        this.levelModal = this.add.container(0, 0).setDepth(1000);

        // Dark overlay
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8)
            .setInteractive();
        this.levelModal.add(overlay);

        // Modal box
        const modalBg = this.add.rectangle(width / 2, height / 2, width - 40, height - 100, 0x1a1a2e);
        modalBg.setStrokeStyle(3, 0xFF69B4);
        this.levelModal.add(modalBg);

        // Title with clipboard sprite
        const titleIcon = this.add.image(width / 2 - 80, 80, 'clipboard').setScale(1.5);
        const title = this.add.text(width / 2 + 10, 80, 'Select Level', {
            fontSize: '24px',
            fill: '#FF69B4',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.levelModal.add([titleIcon, title]);

        // Level data - using sprite keys instead of emojis
        const levels = [
            { key: 'Level1_Dispensary', name: '1. The Dispensary', icon: 'leaf', desc: '3Fifteen - Where it all began' },
            { key: 'Level2_ForestPark', name: '2. Art Hill', icon: 'museum', desc: 'Forest Park - First date' },
            { key: 'Level3_MizzouDays', name: '3. SLU/Mizzou', icon: 'grad_cap', desc: 'College days & tornado chase' },
            { key: 'Level4_CozyNight', name: '4. Cozy Night', icon: 'couch', desc: 'Movie night & keyboard' },
            { key: 'Level5_LongDrive', name: '5. The Long Drive', icon: 'car_icon', desc: 'Columbia to STL' },
            { key: 'Level6_Finale', name: '6. Valentine Finale', icon: 'heart', desc: 'The grand finale' }
        ];

        // Create level buttons
        const startY = 140;
        const buttonHeight = 70;

        levels.forEach((level, index) => {
            const y = startY + index * buttonHeight;

            // Button background
            const btn = this.add.rectangle(width / 2, y, width - 80, 60, 0x2d2d4a)
                .setInteractive({ useHandCursor: true });

            // Level icon (sprite instead of emoji)
            const iconSprite = this.add.image(50, y, level.icon).setScale(1.5);

            // Level name
            const nameText = this.add.text(85, y - 10, level.name, {
                fontSize: '16px',
                fill: '#fff',
                fontStyle: 'bold'
            }).setOrigin(0, 0.5);

            // Description
            const descText = this.add.text(85, y + 12, level.desc, {
                fontSize: '11px',
                fill: '#888'
            }).setOrigin(0, 0.5);

            // Play arrow
            const playArrow = this.add.text(width - 50, y, '▶', {
                fontSize: '20px',
                fill: '#4CAF50'
            }).setOrigin(0.5);

            this.levelModal.add([btn, iconSprite, nameText, descText, playArrow]);

            // Button interactions
            btn.on('pointerover', () => {
                btn.setFillStyle(0x4a4a6a);
                playArrow.setScale(1.2);
            });
            btn.on('pointerout', () => {
                btn.setFillStyle(0x2d2d4a);
                playArrow.setScale(1);
            });
            btn.on('pointerdown', () => {
                this.closeLevelSelect();
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.time.delayedCall(500, () => {
                    this.scene.start(level.key);
                });
            });
        });

        // Close button (X)
        const closeBtn = this.add.text(width - 35, 60, '✕', {
            fontSize: '28px',
            fill: '#FF6B6B'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerover', () => closeBtn.setScale(1.2));
        closeBtn.on('pointerout', () => closeBtn.setScale(1));
        closeBtn.on('pointerdown', () => this.closeLevelSelect());

        this.levelModal.add(closeBtn);

        // Animate modal opening
        this.levelModal.setAlpha(0);
        this.tweens.add({
            targets: this.levelModal,
            alpha: 1,
            duration: 200
        });
    }

    closeLevelSelect() {
        if (!this.levelModal) return;

        this.tweens.add({
            targets: this.levelModal,
            alpha: 0,
            duration: 150,
            onComplete: () => {
                this.levelModal.destroy();
                this.levelModal = null;
                this.levelSelectOpen = false;
            }
        });
    }

    update() {
        // Animate floating hearts
        this.hearts.forEach(h => {
            h.obj.y -= h.speed;
            h.obj.x += Math.sin(h.wobble) * 0.5;
            h.wobble += 0.02;

            if (h.obj.y < -30) {
                h.obj.y = this.scale.height + 30;
                h.obj.x = Phaser.Math.Between(20, this.scale.width - 20);
            }
        });
    }
}

// ============================================
// DIALOGUE BOX CLASS (used across levels)
// ============================================
class DialogueBox {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.isShowing = false;
        this.onComplete = null;
        this.isTyping = false;
        this.canAdvance = false;
        this.currentText = '';
        this.dialogueText = null;
        this.typeTimer = null;
        this.clickZone = null;
    }

    show(text, speaker = '', callback = null) {
        // Clean up any existing dialogue first
        this.hide();

        this.isShowing = true;
        this.isTyping = true;
        this.canAdvance = false;
        this.onComplete = callback;
        this.currentText = text;

        const { width, height } = this.scene.scale;

        this.container = this.scene.add.container(0, height - 120);
        this.container.setScrollFactor(0);
        this.container.setDepth(999);

        // Background box
        const bg = this.scene.add.rectangle(width / 2, 50, width - 40, 100, 0x000000, 0.85);
        bg.setStrokeStyle(2, 0xFF69B4);
        this.container.add(bg);

        // Speaker name
        if (speaker) {
            const nameText = this.scene.add.text(30, 15, speaker, {
                fontSize: '14px',
                fill: '#FF69B4',
                fontStyle: 'bold'
            });
            this.container.add(nameText);
        }

        // Dialogue text with typewriter effect
        this.dialogueText = this.scene.add.text(30, speaker ? 40 : 25, '', {
            fontSize: '16px',
            fill: '#fff',
            wordWrap: { width: width - 80 }
        });
        this.container.add(this.dialogueText);

        // Typewriter effect
        let i = 0;
        this.typeTimer = this.scene.time.addEvent({
            delay: 30,
            repeat: text.length - 1,
            callback: () => {
                if (this.dialogueText && i < text.length) {
                    this.dialogueText.text += text[i];
                    i++;
                }
                // When typing is complete
                if (i >= text.length) {
                    this.isTyping = false;
                    this.canAdvance = true;
                    this.showContinueIndicator();
                }
            }
        });

        // Also set canAdvance after typing completes (backup)
        this.scene.time.delayedCall(text.length * 30 + 100, () => {
            this.isTyping = false;
            this.canAdvance = true;
        });

        // Click ANYWHERE to advance
        this.clickZone = this.scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0);
        this.clickZone.setScrollFactor(0);
        this.clickZone.setInteractive();
        this.clickZone.setDepth(1000);

        this.clickZone.on('pointerdown', () => this.handleClick());
    }

    showContinueIndicator() {
        if (!this.container || !this.scene) return;

        const { width } = this.scene.scale;
        const continueText = this.scene.add.text(width - 50, 80, '▼', {
            fontSize: '16px',
            fill: '#FF69B4'
        });
        this.container.add(continueText);

        this.scene.tweens.add({
            targets: continueText,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    handleClick() {
        if (!this.isShowing) return;

        if (this.isTyping) {
            // Skip typewriter - show full text immediately
            if (this.typeTimer) {
                this.typeTimer.remove();
                this.typeTimer = null;
            }
            if (this.dialogueText) {
                this.dialogueText.text = this.currentText;
            }
            this.isTyping = false;
            this.canAdvance = true;
            this.showContinueIndicator();
        } else if (this.canAdvance) {
            // Advance to next dialogue or complete
            this.canAdvance = false;  // Prevent double-clicks
            const callback = this.onComplete;
            this.hide();
            if (callback) {
                // Small delay to ensure clean state before callback
                this.scene.time.delayedCall(50, () => {
                    callback();
                });
            }
        }
    }

    hide() {
        this.isShowing = false;
        this.isTyping = false;
        this.canAdvance = false;
        this.onComplete = null;

        if (this.typeTimer) {
            this.typeTimer.remove();
            this.typeTimer = null;
        }
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }
        if (this.clickZone) {
            this.clickZone.destroy();
            this.clickZone = null;
        }
        this.dialogueText = null;
    }
}

// ============================================
// BASE LEVEL CLASS
// ============================================
class BaseLevel extends Phaser.Scene {
    constructor(key) {
        super({ key });
        this.emma = null;
        this.dialogue = null;
        this.moveLeft = false;
        this.moveRight = false;
        this.canMove = true;
    }

    createEmma(x, y) {
        this.emma = this.physics.add.sprite(x, y, 'emma_walk_0');
        this.emma.setScale(2);
        this.emma.setCollideWorldBounds(true);
        this.emma.body.setSize(16, 24);
        this.emma.body.setOffset(8, 24);

        // Create walk animation
        if (!this.anims.exists('emma_walk')) {
            this.anims.create({
                key: 'emma_walk',
                frames: [
                    { key: 'emma_walk_0' },
                    { key: 'emma_walk_1' },
                    { key: 'emma_walk_2' },
                    { key: 'emma_walk_3' }
                ],
                frameRate: 8,
                repeat: -1
            });
        }

        return this.emma;
    }

    setupControls() {
        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Touch controls - divide screen into thirds
        this.input.on('pointerdown', (pointer) => {
            if (!this.canMove) return;

            const third = this.scale.width / 3;
            if (pointer.x < third) {
                this.moveLeft = true;
            } else if (pointer.x > third * 2) {
                this.moveRight = true;
            } else {
                this.handleAction();
            }
        });

        this.input.on('pointerup', () => {
            this.moveLeft = false;
            this.moveRight = false;
        });
    }

    handleMovement() {
        if (!this.emma || !this.canMove) return;

        const speed = 160;

        if (this.cursors.left.isDown || this.moveLeft) {
            this.emma.setVelocityX(-speed);
            this.emma.setFlipX(true);
            this.emma.play('emma_walk', true);
        } else if (this.cursors.right.isDown || this.moveRight) {
            this.emma.setVelocityX(speed);
            this.emma.setFlipX(false);
            this.emma.play('emma_walk', true);
        } else {
            this.emma.setVelocityX(0);
            this.emma.stop();
            this.emma.setTexture('emma_walk_0');
        }
    }

    handleAction() {
        // Override in subclasses
    }

    createHeartUI() {
        this.heartIcon = this.add.image(30, 25, 'heart').setScale(1.5).setScrollFactor(0).setDepth(1000);
        this.heartText = this.add.text(50, 20, '' + GameState.heartsCollected, {
            fontSize: '20px',
            fill: '#fff'
        }).setScrollFactor(0).setDepth(1000);
    }

    updateHeartUI() {
        if (this.heartText) {
            this.heartText.setText('' + GameState.heartsCollected);
        }
    }

    collectHeart(emma, heart) {
        heart.destroy();
        GameState.heartsCollected++;
        this.updateHeartUI();

        // Heart collect animation using sprite
        const floatHeart = this.add.image(heart.x, heart.y, 'heart').setScale(1.5);
        this.tweens.add({
            targets: floatHeart,
            y: heart.y - 50,
            alpha: 0,
            duration: 500,
            onComplete: () => floatHeart.destroy()
        });
    }

    transitionTo(nextScene, delay = 1000) {
        this.canMove = false;
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.time.delayedCall(delay, () => {
            this.scene.start(nextScene);
        });
    }
}

// ============================================
// LEVEL 1: THE DISPENSARY - 3Fifteen Primo
// ============================================
class Level1_Dispensary extends BaseLevel {
    constructor() {
        super('Level1_Dispensary');
        this.currentScene = 'exterior';  // exterior -> waitingRoom -> store
        this.dialogueStep = 0;
        this.leafCollected = false;
        this.enteredDoor = false;
        this.barrettCalledName = false;
    }

    create() {
        this.createExteriorScene();
    }

    // ========== SCENE 1: EXTERIOR - Parking lot & storefront ==========
    createExteriorScene() {
        const { width, height } = this.scale;
        this.currentScene = 'exterior';

        // Clear any existing children
        this.children.removeAll();

        const bg = this.add.graphics();

        // ===== SKY WITH GRADIENT (beautiful day) =====
        bg.fillGradientStyle(0x87CEEB, 0x5FA8D3, 0x4A90C2, 0x3A7AB1, 1);
        bg.fillRect(0, 0, width, height * 0.35);

        // Subtle clouds
        this.add.ellipse(width * 0.2, height * 0.12, 50, 20, 0xFFFFFF, 0.6);
        this.add.ellipse(width * 0.25, height * 0.1, 35, 15, 0xFFFFFF, 0.5);
        this.add.ellipse(width * 0.7, height * 0.08, 60, 22, 0xFFFFFF, 0.5);
        this.add.ellipse(width * 0.75, height * 0.06, 40, 16, 0xFFFFFF, 0.4);

        // ===== 3FIFTEEN PRIMO BUILDING (with depth & shadows) =====
        const buildingY = height * 0.22;
        const buildingH = height * 0.38;

        // Building shadow (left side depth)
        bg.fillStyle(0x5A3311, 0.5);
        bg.fillRect(width * 0.14, buildingY + 5, 8, buildingH);

        // Main brick building with gradient
        bg.fillGradientStyle(0x9B5523, 0x8B4513, 0x7B3503, 0x6B2503, 1);
        bg.fillRect(width * 0.15, buildingY, width * 0.7, buildingH);

        // Brick texture with depth
        for (let row = 0; row < 14; row++) {
            const y = buildingY + 12 + row * 18;
            // Mortar lines (lighter)
            bg.lineStyle(2, 0xA07050, 0.4);
            bg.lineBetween(width * 0.15, y, width * 0.85, y);
            // Brick shadows (offset pattern)
            const offset = row % 2 === 0 ? 0 : 20;
            for (let x = width * 0.15 + offset; x < width * 0.85; x += 40) {
                bg.lineStyle(1, 0x5A3010, 0.3);
                bg.lineBetween(x, y, x, y + 16);
            }
        }

        // ===== WHITE COLUMNS WITH 3D EFFECT =====
        const columnPositions = [0.19, 0.36, 0.51, 0.66];
        columnPositions.forEach(xPct => {
            const cx = width * xPct;
            // Column shadow
            bg.fillStyle(0xC0C0C0);
            bg.fillRect(cx + 2, buildingY + 25, 14, buildingH - 30);
            // Column highlight
            bg.fillGradientStyle(0xFFFFFF, 0xF5F5F5, 0xE8E8E8, 0xDDDDDD, 1);
            bg.fillRect(cx, buildingY + 22, 14, buildingH - 28);
            // Column base
            bg.fillStyle(0xE0E0E0);
            bg.fillRect(cx - 3, buildingY + buildingH - 8, 20, 10);
            // Column capital
            bg.fillStyle(0xF0F0F0);
            bg.fillRect(cx - 2, buildingY + 18, 18, 8);
        });

        // ===== GREEN AWNING WITH SHADOW =====
        // Awning shadow
        bg.fillStyle(0x000000, 0.2);
        bg.fillRect(width * 0.12, buildingY + 5, width * 0.76, 8);
        // Awning body with gradient
        bg.fillGradientStyle(0x3D6A4A, 0x2E5A3A, 0x1E4A2A, 0x0E3A1A, 1);
        bg.fillRect(width * 0.11, buildingY - 18, width * 0.78, 25);
        // Awning edge highlight
        bg.fillStyle(0x4D7A5A, 0.6);
        bg.fillRect(width * 0.11, buildingY - 18, width * 0.78, 4);

        // ===== SIGN: "3Fifteen Primo CANNABIS" (with glow) =====
        // Sign shadow
        bg.fillStyle(0x000000, 0.4);
        bg.fillRect(width * 0.19, buildingY - 8, width * 0.62, 18);
        // Sign background
        bg.fillGradientStyle(0x2a2a2a, 0x1a1a1a, 0x0a0a0a, 0x000000, 1);
        bg.fillRect(width * 0.18, buildingY - 12, width * 0.64, 18);

        // Sign text with glow
        this.add.text(width * 0.26, buildingY - 10, '3', {
            fontSize: '14px', fill: '#FFD700', fontStyle: 'bold',
            shadow: { offsetX: 0, offsetY: 0, color: '#FFD700', blur: 8, fill: true }
        });
        this.add.text(width * 0.33, buildingY - 9, 'Fifteen', {
            fontSize: '11px', fill: '#FFFFFF', fontStyle: 'bold'
        });
        this.add.text(width * 0.52, buildingY - 9, 'Primo', {
            fontSize: '11px', fill: '#C41E3A', fontStyle: 'italic'
        });
        this.add.text(width * 0.68, buildingY - 8, 'CANNABIS', {
            fontSize: '9px', fill: '#CCCCCC'
        });

        // ===== LARGE WINDOWS (with reflections) =====
        const windowY = buildingY + 45;
        const windowH = height * 0.22;

        // Window frames
        bg.fillStyle(0x2a2a2a);
        bg.fillRect(width * 0.21, windowY - 3, width * 0.26 + 6, windowH + 6);
        bg.fillRect(width * 0.52, windowY - 3, width * 0.26 + 6, windowH + 6);

        // Glass with gradient reflection
        bg.fillGradientStyle(0x6BA3C3, 0x5A93B3, 0x4A83A3, 0x3A7393, 0.5);
        bg.fillRect(width * 0.22, windowY, width * 0.25, windowH);
        bg.fillRect(width * 0.53, windowY, width * 0.25, windowH);

        // Window reflection highlights
        bg.fillStyle(0xFFFFFF, 0.15);
        bg.fillRect(width * 0.22, windowY, width * 0.08, windowH);
        bg.fillRect(width * 0.53, windowY, width * 0.08, windowH);

        // Yellow chairs visible through windows (with shadows)
        const chairY = windowY + windowH * 0.6;
        [[0.28, 0xFFD700], [0.38, 0xFFD700], [0.59, 0x1a1a1a], [0.69, 0xFFD700]].forEach(([xPct, color]) => {
            this.add.ellipse(width * xPct + 2, chairY + 3, 10, 5, 0x000000, 0.3);  // Shadow
            this.add.rectangle(width * xPct, chairY, 14, 16, color);
            this.add.ellipse(width * xPct, chairY - 10, 12, 14, color);
        });

        // ===== ENTRANCE DOOR (with depth) =====
        this.doorX = width * 0.47;
        // Door frame
        bg.fillStyle(0x333333);
        bg.fillRect(this.doorX - 4, windowY, 34, windowH + 8);
        // Door body
        bg.fillGradientStyle(0x5A5A5A, 0x4A4A4A, 0x3A3A3A, 0x2A2A2A, 1);
        bg.fillRect(this.doorX, windowY + 2, 26, windowH + 4);
        // Door glass
        bg.fillStyle(0x5A8AAA, 0.6);
        bg.fillRect(this.doorX + 4, windowY + 8, 18, windowH - 20);
        // Door handle
        this.add.circle(this.doorX + 22, windowY + windowH * 0.5, 4, 0xE0E0E0);
        this.add.circle(this.doorX + 22, windowY + windowH * 0.5, 2, 0xC0C0C0);

        // ===== LANDSCAPING (with depth) =====
        // Mulch bed shadow
        bg.fillStyle(0x000000, 0.2);
        bg.fillRect(0, height * 0.6, width, 5);
        // Mulch beds with gradient
        bg.fillGradientStyle(0x4D3827, 0x3D2817, 0x2D1807, 0x1D0800, 1);
        bg.fillRect(0, height * 0.58, width, 35);

        // Bushes with layered depth
        [0.08, 0.24, 0.76, 0.92].forEach(xPct => {
            const bx = width * xPct;
            // Bush shadows
            this.add.ellipse(bx + 3, height * 0.6 + 3, 20, 12, 0x0a3a0a, 0.4);
            // Back layer
            this.add.circle(bx, height * 0.56, 18, 0x1a5a1a);
            // Middle layer
            this.add.circle(bx - 10, height * 0.58, 14, 0x228B22);
            this.add.circle(bx + 10, height * 0.58, 14, 0x228B22);
            // Front layer (highlights)
            this.add.circle(bx, height * 0.57, 12, 0x2E8B2E);
            this.add.circle(bx - 5, height * 0.56, 6, 0x3CB371, 0.6);
        });

        // ===== SIDEWALK (with texture) =====
        bg.fillGradientStyle(0xD0D0D0, 0xC5C5C5, 0xB8B8B8, 0xAAAAAA, 1);
        bg.fillRect(0, height * 0.55, width, 28);
        // Sidewalk cracks/joints
        bg.lineStyle(1, 0x909090, 0.5);
        for (let x = 0; x < width; x += 50) {
            bg.lineBetween(x, height * 0.55, x, height * 0.55 + 28);
        }

        // ===== PARKING LOT (with texture & depth) =====
        // Asphalt gradient
        bg.fillGradientStyle(0x707070, 0x606060, 0x505050, 0x454545, 1);
        bg.fillRect(0, height * 0.62, width, height * 0.38);

        // Asphalt texture
        bg.fillStyle(0x5A5A5A, 0.3);
        for (let i = 0; i < 50; i++) {
            const rx = Math.random() * width;
            const ry = height * 0.62 + Math.random() * height * 0.35;
            bg.fillRect(rx, ry, 3, 2);
        }

        // Parking lines (with slight shadow)
        for (let x = 30; x < width; x += 65) {
            bg.fillStyle(0x000000, 0.2);
            bg.fillRect(x + 2, height * 0.66, 4, height * 0.16);
            bg.fillStyle(0xFFFFFF, 0.9);
            bg.fillRect(x, height * 0.65, 4, height * 0.15);
        }

        // ===== EMMA'S BLACK SUV (with reflections & detail) =====
        const suvX = 65;
        const suvY = height * 0.78;

        // SUV shadow
        this.add.ellipse(suvX, suvY + 12, 55, 10, 0x000000, 0.3);

        // SUV body with gradient
        bg.fillGradientStyle(0x2a2a2a, 0x1a1a1a, 0x0a0a0a, 0x000000, 1);
        bg.fillRect(suvX - 32, suvY - 26, 64, 32);
        bg.fillGradientStyle(0x2a2a2a, 0x1a1a1a, 0x1a1a1a, 0x0a0a0a, 1);
        bg.fillRect(suvX - 27, suvY - 42, 50, 20);

        // Body reflection
        bg.fillStyle(0x4a4a4a, 0.4);
        bg.fillRect(suvX - 30, suvY - 24, 60, 6);

        // Windows (tinted with reflection)
        bg.fillGradientStyle(0x3a3a5a, 0x2a2a4a, 0x1a1a3a, 0x0a0a2a, 1);
        bg.fillRect(suvX - 24, suvY - 40, 20, 16);
        bg.fillRect(suvX + 4, suvY - 40, 20, 16);
        // Window reflection
        bg.fillStyle(0x6a6a8a, 0.3);
        bg.fillRect(suvX - 24, suvY - 40, 6, 16);
        bg.fillRect(suvX + 4, suvY - 40, 6, 16);

        // Wheels with detail
        this.add.circle(suvX - 20, suvY + 6, 10, 0x1a1a1a);
        this.add.circle(suvX + 20, suvY + 6, 10, 0x1a1a1a);
        this.add.circle(suvX - 20, suvY + 6, 6, 0x3a3a3a);
        this.add.circle(suvX + 20, suvY + 6, 6, 0x3a3a3a);
        this.add.circle(suvX - 20, suvY + 6, 3, 0x505050);
        this.add.circle(suvX + 20, suvY + 6, 3, 0x505050);

        // Headlights & taillights
        this.add.rectangle(suvX + 30, suvY - 18, 5, 10, 0xFFFFCC);
        this.add.rectangle(suvX + 30, suvY - 18, 3, 8, 0xFFFFFF, 0.8);
        this.add.rectangle(suvX - 30, suvY - 18, 5, 8, 0xFF3333);

        // ===== CHAPTER TITLE =====
        this.add.text(width / 2, 22, 'Chapter 1', {
            fontSize: '14px', fill: '#fff',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);

        this.add.text(width / 2, 48, '3Fifteen Primo', {
            fontSize: '22px', fill: '#FFD700', fontStyle: 'bold',
            stroke: '#000', strokeThickness: 4,
            shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 4, fill: true }
        }).setOrigin(0.5);

        // ========== EMMA ==========
        this.createEmma(suvX + 55, height * 0.72);
        this.emma.body.setAllowGravity(false);

        // ========== DOOR TRIGGER ==========
        this.doorTriggerX = this.doorX + 12;

        // Setup controls
        this.setupControls();
        this.createHeartUI();
        this.dialogue = new DialogueBox(this);

        // Instruction text
        this.instructionText = this.add.text(width / 2, height - 40, '→ Walk to the door', {
            fontSize: '14px', fill: '#fff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);

        this.tweens.add({
            targets: this.instructionText,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.cameras.main.fadeIn(500);

        // ========== AMBIENT EFFECTS ==========
        this.createExteriorAmbientEffects(width, height);
    }

    createExteriorAmbientEffects(width, height) {
        // ===== ANIMATED CLOUDS =====
        this.clouds = [];
        const cloudData = [
            { x: width * 0.2, y: height * 0.12, size: 50, speed: 0.15 },
            { x: width * 0.7, y: height * 0.08, size: 60, speed: 0.12 },
            { x: width * 0.45, y: height * 0.15, size: 40, speed: 0.18 }
        ];
        cloudData.forEach(c => {
            const cloud = this.add.container(c.x, c.y);
            cloud.add(this.add.ellipse(0, 0, c.size, c.size * 0.4, 0xFFFFFF, 0.6));
            cloud.add(this.add.ellipse(-c.size * 0.3, c.size * 0.1, c.size * 0.6, c.size * 0.3, 0xFFFFFF, 0.5));
            cloud.add(this.add.ellipse(c.size * 0.25, c.size * 0.05, c.size * 0.5, c.size * 0.28, 0xFFFFFF, 0.5));
            cloud.speed = c.speed;
            cloud.startX = c.x;
            this.clouds.push(cloud);
        });

        // ===== FLOATING DUST MOTES (in sunlight) =====
        this.dustMotes = [];
        for (let i = 0; i < 15; i++) {
            const mote = this.add.circle(
                Math.random() * width,
                Math.random() * height * 0.5 + height * 0.1,
                Math.random() * 2 + 1,
                0xFFFFDD,
                Math.random() * 0.4 + 0.2
            );
            mote.baseY = mote.y;
            mote.driftSpeed = Math.random() * 0.3 + 0.1;
            mote.floatOffset = Math.random() * Math.PI * 2;
            this.dustMotes.push(mote);
        }

        // ===== SIGN GLOW FLICKER =====
        this.signGlow = this.add.rectangle(width * 0.5, height * 0.22 - 12, width * 0.64, 22, 0xFFD700, 0);
        this.tweens.add({
            targets: this.signGlow,
            alpha: 0.15,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // ===== OCCASIONAL BIRDS =====
        this.birdTimer = this.time.addEvent({
            delay: 5000,
            callback: () => this.spawnBird(width, height),
            loop: true
        });

        // ===== EMMA'S MOVING SHADOW =====
        this.emmaShadow = this.add.ellipse(this.emma.x, height * 0.76, 24, 8, 0x000000, 0.25);

        // ===== SUBTLE HEAT SHIMMER (above parking lot) =====
        this.heatShimmer = [];
        for (let i = 0; i < 5; i++) {
            const shimmer = this.add.rectangle(
                width * 0.1 + i * width * 0.2,
                height * 0.64,
                40,
                8,
                0xFFFFFF,
                0.03
            );
            shimmer.baseY = shimmer.y;
            shimmer.phase = i * 0.5;
            this.heatShimmer.push(shimmer);
        }

        // ===== WINDOW REFLECTION ANIMATION =====
        this.windowReflection = this.add.rectangle(width * 0.26, height * 0.35, 15, height * 0.22, 0xFFFFFF, 0.08);
        this.tweens.add({
            targets: this.windowReflection,
            x: width * 0.45,
            duration: 8000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    spawnBird(width, height) {
        if (this.currentScene !== 'exterior') return;

        const startX = -20;
        const startY = height * 0.08 + Math.random() * height * 0.12;
        const bird = this.add.image(startX, startY, 'bird').setScale(0.8);

        this.tweens.add({
            targets: bird,
            x: width + 30,
            y: startY + (Math.random() - 0.5) * 40,
            duration: 4000 + Math.random() * 2000,
            ease: 'Linear',
            onUpdate: () => {
                // Wing flap effect
                bird.setScale(0.8, Math.sin(Date.now() * 0.02) * 0.15 + 0.8);
            },
            onComplete: () => bird.destroy()
        });
    }

    updateExteriorAmbientEffects(time, delta) {
        const { width, height } = this.scale;

        // ===== ANIMATE CLOUDS =====
        if (this.clouds) {
            this.clouds.forEach(cloud => {
                cloud.x += cloud.speed;
                if (cloud.x > width + 60) {
                    cloud.x = -60;
                }
            });
        }

        // ===== ANIMATE DUST MOTES =====
        if (this.dustMotes) {
            this.dustMotes.forEach(mote => {
                // Gentle floating motion
                mote.y = mote.baseY + Math.sin(time * 0.001 + mote.floatOffset) * 8;
                mote.x += mote.driftSpeed;
                // Wrap around
                if (mote.x > width + 10) {
                    mote.x = -10;
                    mote.baseY = Math.random() * height * 0.5 + height * 0.1;
                }
                // Subtle alpha pulse
                mote.setAlpha(0.3 + Math.sin(time * 0.002 + mote.floatOffset) * 0.15);
            });
        }

        // ===== ANIMATE HEAT SHIMMER =====
        if (this.heatShimmer) {
            this.heatShimmer.forEach(shimmer => {
                shimmer.y = shimmer.baseY + Math.sin(time * 0.003 + shimmer.phase) * 3;
                shimmer.scaleX = 1 + Math.sin(time * 0.004 + shimmer.phase) * 0.3;
            });
        }

        // ===== UPDATE EMMA'S SHADOW =====
        if (this.emmaShadow && this.emma) {
            this.emmaShadow.x = this.emma.x;
            // Shadow stretches slightly based on position
            const distFromCenter = Math.abs(this.emma.x - width / 2) / (width / 2);
            this.emmaShadow.scaleX = 1 + distFromCenter * 0.3;
        }
    }

    // ========== SCENE 2: WAITING ROOM - STL Mural ==========
    createWaitingRoomScene() {
        const { width, height } = this.scale;
        this.currentScene = 'waitingRoom';

        // Clear scene
        this.children.removeAll();

        const bg = this.add.graphics();

        // ===== CEILING (drop ceiling with depth) =====
        bg.fillGradientStyle(0xFAFAFA, 0xF0F0F0, 0xE8E8E8, 0xE0E0E0, 1);
        bg.fillRect(0, 0, width, height * 0.15);

        // Ceiling tile grid with shadows
        for (let x = 0; x < width; x += 45) {
            bg.fillStyle(0xD0D0D0, 0.6);
            bg.fillRect(x, 0, 3, height * 0.15);
        }
        for (let y = 0; y < height * 0.15; y += 35) {
            bg.fillStyle(0xD0D0D0, 0.6);
            bg.fillRect(0, y, width, 3);
        }

        // Recessed lights with glow
        [width * 0.25, width * 0.5, width * 0.75].forEach(x => {
            this.add.circle(x, height * 0.08, 12, 0xFFFFF0, 0.3);  // Glow
            this.add.circle(x, height * 0.08, 9, 0xFFFFEE);
            this.add.circle(x, height * 0.08, 6, 0xFFFFFF);
        });

        // ===== STL MURAL (detailed with depth) =====
        // Night sky gradient
        bg.fillGradientStyle(0x1A2A3A, 0x2C3E50, 0x1E3448, 0x152535, 1);
        bg.fillRect(0, height * 0.15, width * 0.75, height * 0.5);

        // Stars with varying brightness
        for (let i = 0; i < 40; i++) {
            const starX = Math.random() * width * 0.7 + 10;
            const starY = Math.random() * height * 0.35 + height * 0.17;
            const starSize = Math.random() * 1.5 + 0.5;
            const alpha = Math.random() * 0.5 + 0.4;
            this.add.circle(starX, starY, starSize, 0xFFFFFF, alpha);
        }

        // ===== GATEWAY ARCH (improved with reflection) =====
        const archX = width * 0.13;
        const archY = height * 0.56;
        // Arch reflection glow
        this.add.ellipse(archX + 10, archY + 15, 45, 12, 0xC0C0C0, 0.2);
        // Arch with gradient (metallic look)
        bg.fillGradientStyle(0xC0C0C0, 0xA8A8A8, 0x909090, 0x808080, 1);
        // Left leg
        bg.fillRect(archX - 6, archY - 85, 5, 90);
        bg.fillRect(archX - 4, archY - 105, 4, 25);
        bg.fillRect(archX - 2, archY - 120, 3, 20);
        // Right leg
        bg.fillRect(archX + 23, archY - 85, 5, 90);
        bg.fillRect(archX + 22, archY - 105, 4, 25);
        bg.fillRect(archX + 21, archY - 120, 3, 20);
        // Top curve
        bg.fillRect(archX + 8, archY - 128, 7, 4);
        bg.fillRect(archX + 3, archY - 125, 5, 3);
        bg.fillRect(archX + 15, archY - 125, 5, 3);
        // Arch highlight
        bg.fillStyle(0xE0E0E0, 0.5);
        bg.fillRect(archX - 5, archY - 85, 2, 90);

        // ===== DOWNTOWN STL SKYLINE (with lit windows) =====
        const buildings = [
            { x: 0.26, w: 22, h: 0.32, y: 0.33 },
            { x: 0.29, w: 16, h: 0.27, y: 0.38 },
            { x: 0.33, w: 20, h: 0.35, y: 0.30 },
            { x: 0.39, w: 14, h: 0.28, y: 0.37 },
            { x: 0.44, w: 24, h: 0.25, y: 0.40 },
        ];
        buildings.forEach(b => {
            // Building shadow
            bg.fillStyle(0x2A2A2A);
            bg.fillRect(width * b.x + 3, height * b.y + 3, b.w, height * b.h);
            // Building body
            bg.fillGradientStyle(0x4A4A5A, 0x3A3A4A, 0x2A2A3A, 0x1A1A2A, 1);
            bg.fillRect(width * b.x, height * b.y, b.w, height * b.h);
            // Windows
            for (let wy = height * b.y + 8; wy < height * (b.y + b.h) - 5; wy += 12) {
                for (let wx = width * b.x + 3; wx < width * b.x + b.w - 4; wx += 7) {
                    if (Math.random() > 0.25) {
                        const winColor = Math.random() > 0.7 ? 0xFFE066 : 0xFFD700;
                        this.add.rectangle(wx, wy, 4, 6, winColor, 0.8);
                    }
                }
            }
        });

        // ===== EADS BRIDGE (with detail) =====
        const bridgeY = height * 0.56;
        bg.fillStyle(0x5A5A6A);
        bg.fillRect(width * 0.5, bridgeY, width * 0.25, 10);
        // Bridge arches
        for (let i = 0; i < 3; i++) {
            this.add.arc(width * 0.55 + i * 26, bridgeY + 5, 14, 0, Math.PI, false, 0x6A6A7A);
            this.add.arc(width * 0.55 + i * 26, bridgeY + 5, 10, 0, Math.PI, false, 0x5A5A6A);
        }

        // ===== RIVER WITH REFLECTIONS =====
        bg.fillGradientStyle(0x1A3050, 0x2A4060, 0x1A3050, 0x0A2040, 0.8);
        bg.fillRect(0, height * 0.58, width * 0.75, 25);
        // Gold/yellow reflection
        bg.fillStyle(0xDAA520, 0.3);
        bg.fillRect(width * 0.1, height * 0.59, width * 0.3, 3);
        bg.fillStyle(0xFFD700, 0.2);
        bg.fillRect(width * 0.2, height * 0.62, width * 0.2, 2);

        // ===== 3FIFTEEN LOGO SPOTLIGHT =====
        // Glow effect
        this.add.circle(width * 0.56, height * 0.31, 45, 0xFFFFFF, 0.2);
        this.add.circle(width * 0.56, height * 0.31, 38, 0xFFFFFF);
        // Logo text
        this.add.text(width * 0.5, height * 0.26, '3', {
            fontSize: '30px', fill: '#FFD700', fontStyle: 'bold',
            shadow: { offsetX: 0, offsetY: 0, color: '#FFD700', blur: 6, fill: true }
        });
        this.add.text(width * 0.52, height * 0.33, 'Fifteen', {
            fontSize: '13px', fill: '#333', fontStyle: 'bold'
        });
        this.add.text(width * 0.53, height * 0.39, 'Primo', {
            fontSize: '9px', fill: '#666'
        });

        // ===== GRAY WALL (right side with texture) =====
        bg.fillGradientStyle(0x707070, 0x606060, 0x505050, 0x454545, 1);
        bg.fillRect(width * 0.75, height * 0.15, width * 0.25, height * 0.5);

        // ===== FLOOR (wood with grain & reflection) =====
        bg.fillGradientStyle(0xD4B896, 0xC4A886, 0xB49876, 0xA48866, 1);
        bg.fillRect(0, height * 0.65, width, height * 0.35);

        // Wood grain pattern
        bg.lineStyle(1, 0xB08060, 0.3);
        for (let y = height * 0.65; y < height; y += 18) {
            bg.lineBetween(0, y, width, y);
        }
        // Vertical joints
        for (let x = 0; x < width; x += 70) {
            bg.lineStyle(1, 0x9A7050, 0.2);
            bg.lineBetween(x, height * 0.65, x, height);
        }
        // Floor shine/reflection
        bg.fillStyle(0xE4C8A6, 0.2);
        bg.fillRect(width * 0.2, height * 0.68, width * 0.5, height * 0.08);

        // ===== EAMES-STYLE CHAIRS (with shadows) =====
        const chairY = height * 0.73;
        this.createChair(width * 0.15, chairY, 0xFFD700);
        this.createChair(width * 0.32, chairY, 0x1a1a1a);
        this.createChair(width * 0.49, chairY, 0xFFD700);
        this.createChair(width * 0.66, chairY, 0x1a1a1a);

        // ===== CORNER PLANT (detailed) =====
        const plantX = width * 0.86;
        // Pot shadow
        this.add.ellipse(plantX, height * 0.66, 18, 6, 0x000000, 0.2);
        // Terracotta pot
        bg.fillGradientStyle(0x9B5523, 0x8B4513, 0x7B3503, 0x6B2503, 1);
        bg.fillRect(plantX - 12, height * 0.62, 24, 30);
        bg.fillStyle(0xAB6533);
        bg.fillRect(plantX - 14, height * 0.62, 28, 6);
        // Plant leaves
        this.add.ellipse(plantX, height * 0.58, 28, 40, 0x228B22);
        this.add.ellipse(plantX + 8, height * 0.52, 22, 30, 0x2E8B2E);
        this.add.ellipse(plantX - 8, height * 0.54, 20, 28, 0x3CB371);
        // Leaf highlights
        this.add.ellipse(plantX - 5, height * 0.55, 8, 12, 0x4ADB4A, 0.4);

        // ===== DOOR TO STORE (with depth) =====
        this.storeDoorX = width * 0.78;
        // Door frame shadow
        bg.fillStyle(0x202020);
        bg.fillRect(this.storeDoorX - 5, height * 0.34, 45, height * 0.32);
        // Door frame
        bg.fillGradientStyle(0x4A4A4A, 0x3A3A3A, 0x2A2A2A, 0x1A1A1A, 1);
        bg.fillRect(this.storeDoorX - 3, height * 0.35, 42, height * 0.3);
        // Door body
        bg.fillGradientStyle(0x5A5A5A, 0x4A4A4A, 0x3A3A3A, 0x2A2A2A, 1);
        bg.fillRect(this.storeDoorX, height * 0.36, 36, height * 0.28);
        // Door window
        bg.fillStyle(0x4A6A8A, 0.5);
        bg.fillRect(this.storeDoorX + 5, height * 0.38, 26, height * 0.15);
        // Door handle
        this.add.circle(this.storeDoorX + 32, height * 0.52, 4, 0xC0C0C0);
        this.add.circle(this.storeDoorX + 32, height * 0.52, 2, 0xE0E0E0);

        // "Sales Floor" sign
        bg.fillStyle(0x2A2A2A);
        bg.fillRect(this.storeDoorX + 2, height * 0.31, 32, 14);
        this.add.text(this.storeDoorX + 18, height * 0.32, '→ Sales', {
            fontSize: '10px', fill: '#fff'
        }).setOrigin(0.5);

        // ========== EMMA ==========
        this.createEmma(30, height * 0.78);
        this.emma.body.setAllowGravity(false);

        // ========== SETUP ==========
        this.setupControls();
        this.createHeartUI();
        this.dialogue = new DialogueBox(this);

        this.cameras.main.fadeIn(400);

        // Barrett comes out after a moment
        this.time.delayedCall(800, () => {
            this.barrettEntersWaitingRoom();
        });

        // ========== WAITING ROOM AMBIENT EFFECTS ==========
        this.createWaitingRoomAmbientEffects(width, height);
    }

    createWaitingRoomAmbientEffects(width, height) {
        // ===== FLICKERING CEILING LIGHTS =====
        this.ceilingLights = [];
        [width * 0.25, width * 0.5, width * 0.75].forEach((x, i) => {
            const lightGlow = this.add.circle(x, height * 0.08, 15, 0xFFFFF0, 0.25);
            lightGlow.baseAlpha = 0.25;
            lightGlow.flickerSpeed = 0.005 + i * 0.001;
            this.ceilingLights.push(lightGlow);
        });

        // ===== LOGO SPOTLIGHT PULSE =====
        this.logoSpotlight = this.add.circle(width * 0.56, height * 0.31, 50, 0xFFFFFF, 0);
        this.tweens.add({
            targets: this.logoSpotlight,
            alpha: 0.15,
            scale: 1.1,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // ===== SUBTLE DUST IN SPOTLIGHT =====
        this.spotlightDust = [];
        for (let i = 0; i < 8; i++) {
            const dust = this.add.circle(
                width * 0.5 + Math.random() * 50,
                height * 0.25 + Math.random() * 30,
                Math.random() * 1.5 + 0.5,
                0xFFFFDD,
                Math.random() * 0.3 + 0.1
            );
            dust.baseX = dust.x;
            dust.baseY = dust.y;
            dust.phase = Math.random() * Math.PI * 2;
            this.spotlightDust.push(dust);
        }

        // ===== RIVER REFLECTION SHIMMER =====
        this.riverShimmers = [];
        for (let i = 0; i < 6; i++) {
            const shimmer = this.add.rectangle(
                width * 0.1 + i * width * 0.1,
                height * 0.6,
                8 + Math.random() * 10,
                2,
                0xFFD700,
                0.2
            );
            shimmer.phase = i * 0.5;
            this.riverShimmers.push(shimmer);
        }

        // ===== PLANT SUBTLE SWAY =====
        this.plantLeaves = this.add.container(width * 0.86, height * 0.55);
        // Recreate plant top for animation
        const leaf1 = this.add.ellipse(0, 0, 15, 25, 0x3CB371, 0.5);
        const leaf2 = this.add.ellipse(8, -5, 12, 20, 0x4ADB4A, 0.4);
        this.plantLeaves.add([leaf1, leaf2]);
        this.tweens.add({
            targets: this.plantLeaves,
            angle: 3,
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // ===== EMMA'S SHADOW =====
        this.emmaShadowWR = this.add.ellipse(this.emma.x, height * 0.82, 24, 8, 0x000000, 0.2);
    }

    updateWaitingRoomAmbientEffects(time) {
        // ===== CEILING LIGHT FLICKER =====
        if (this.ceilingLights) {
            this.ceilingLights.forEach(light => {
                const flicker = Math.sin(time * light.flickerSpeed) * 0.08;
                light.setAlpha(light.baseAlpha + flicker + Math.random() * 0.02);
            });
        }

        // ===== SPOTLIGHT DUST FLOAT =====
        if (this.spotlightDust) {
            this.spotlightDust.forEach(dust => {
                dust.x = dust.baseX + Math.sin(time * 0.001 + dust.phase) * 10;
                dust.y = dust.baseY + Math.cos(time * 0.0008 + dust.phase) * 8;
                dust.setAlpha(0.15 + Math.sin(time * 0.002 + dust.phase) * 0.1);
            });
        }

        // ===== RIVER SHIMMER =====
        if (this.riverShimmers) {
            this.riverShimmers.forEach(shimmer => {
                shimmer.setAlpha(0.15 + Math.sin(time * 0.003 + shimmer.phase) * 0.1);
                shimmer.scaleX = 1 + Math.sin(time * 0.002 + shimmer.phase) * 0.3;
            });
        }

        // ===== UPDATE EMMA'S SHADOW =====
        if (this.emmaShadowWR && this.emma) {
            this.emmaShadowWR.x = this.emma.x;
        }
    }

    createChair(x, y, color) {
        // Chair shadow
        this.add.ellipse(x, y + 22, 20, 6, 0x000000, 0.25);
        // Eames-style chair with depth
        const highlight = Phaser.Display.Color.ValueToColor(color).lighten(20).color;
        const shadow = Phaser.Display.Color.ValueToColor(color).darken(20).color;
        // Back
        this.add.ellipse(x - 2, y - 15, 20, 22, shadow);
        this.add.ellipse(x - 3, y - 16, 18, 20, color);
        this.add.ellipse(x - 5, y - 18, 8, 12, highlight, 0.3);
        // Seat
        this.add.ellipse(x, y, 24, 14, shadow);
        this.add.ellipse(x - 1, y - 1, 22, 12, color);
        // Wooden legs
        const legColor = 0xC4A060;
        this.add.rectangle(x - 10, y + 16, 4, 22, 0xA08040).setAngle(-12);
        this.add.rectangle(x + 10, y + 16, 4, 22, legColor).setAngle(12);
        this.add.rectangle(x - 5, y + 14, 3, 20, legColor).setAngle(-6);
        this.add.rectangle(x + 5, y + 14, 3, 20, 0xA08040).setAngle(6);
    }

    barrettEntersWaitingRoom() {
        const { width, height } = this.scale;

        // Barrett walks out from the store door
        this.barrett = this.add.sprite(this.storeDoorX + 17, height * 0.68, 'barrett');
        this.barrett.setScale(2);
        this.barrett.setAlpha(0);

        // Fade in Barrett
        this.tweens.add({
            targets: this.barrett,
            alpha: 1,
            duration: 300,
            onComplete: () => {
                // Barrett calls Emma's name
                this.canMove = false;
                this.time.delayedCall(400, () => {
                    this.dialogue.show("Emma?", "Barrett", () => {
                        this.barrettCalledName = true;
                        this.canMove = true;

                        // Instruction to walk to Barrett
                        this.instructionText = this.add.text(width / 2, height - 30, '→ Follow Barrett', {
                            fontSize: '14px', fill: '#fff',
                            stroke: '#000', strokeThickness: 2
                        }).setOrigin(0.5);

                        this.tweens.add({
                            targets: this.instructionText,
                            alpha: 0.5,
                            duration: 800,
                            yoyo: true,
                            repeat: -1
                        });
                    });
                });
            }
        });
    }

    // ========== SCENE 3: STORE INTERIOR ==========
    createStoreScene() {
        const { width, height } = this.scale;
        this.currentScene = 'store';

        // IMPORTANT: Reset state for store scene
        this.dialogueStep = 0;
        this.canMove = true;

        // Clear scene
        this.children.removeAll();

        const bg = this.add.graphics();

        // ===== DARK CEILING WITH DEPTH =====
        bg.fillGradientStyle(0x1a1a1a, 0x151515, 0x101010, 0x0a0a0a, 1);
        bg.fillRect(0, 0, width, height * 0.13);

        // Track lighting with glow
        [width * 0.12, width * 0.32, width * 0.52, width * 0.72, width * 0.92].forEach(x => {
            // Track bar
            this.add.rectangle(x, height * 0.05, 18, 6, 0x3a3a3a);
            // Light glow
            this.add.circle(x, height * 0.08, 12, 0xFFFFDD, 0.3);
            this.add.circle(x, height * 0.08, 6, 0xFFFFEE);
            this.add.circle(x, height * 0.08, 3, 0xFFFFFF);
        });

        // ===== BACK WALL WITH PRODUCT SHELVES (detailed) =====
        bg.fillGradientStyle(0x4A4A5A, 0x404050, 0x353545, 0x2A2A3A, 1);
        bg.fillRect(0, height * 0.12, width, height * 0.26);

        // LED-backlit shelving units
        const shelfColors = [0x00CED1, 0xFF69B4, 0x32CD32, 0x9370DB, 0x00CED1];

        for (let i = 0; i < 5; i++) {
            const shelfX = 12 + i * 72;
            const shelfY = height * 0.14;

            // LED backlight glow (multiple layers)
            this.add.rectangle(shelfX + 30, shelfY + 38, 60, 72, shelfColors[i], 0.15);
            this.add.rectangle(shelfX + 30, shelfY + 38, 58, 70, shelfColors[i], 0.1);

            // Shelf unit frame
            bg.fillStyle(0x2a2a2a);
            bg.fillRect(shelfX - 2, shelfY - 2, 62, 78);

            // Shelf unit body with gradient
            bg.fillGradientStyle(0xF0F0F0, 0xE8E8E8, 0xE0E0E0, 0xD8D8D8, 1);
            bg.fillRect(shelfX, shelfY, 58, 74);

            // Shelf dividers with shadow
            for (let s = 0; s < 2; s++) {
                const sy = shelfY + 24 + s * 24;
                bg.fillStyle(0x000000, 0.1);
                bg.fillRect(shelfX, sy + 2, 58, 2);
                bg.fillStyle(0xC8C8C8);
                bg.fillRect(shelfX, sy, 58, 3);
            }

            // Products on shelves (jars/boxes with detail)
            const productColors = [0xFF6B6B, 0x4ECDC4, 0xFFE66D, 0x95E1D3, 0xF38181];
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    const px = shelfX + 10 + col * 18;
                    const py = shelfY + 8 + row * 24;
                    const pc = productColors[(row + col + i) % productColors.length];
                    // Product shadow
                    this.add.rectangle(px + 1, py + 1, 13, 17, 0x000000, 0.2);
                    // Product body
                    this.add.rectangle(px, py, 13, 17, pc);
                    // Product highlight
                    this.add.rectangle(px - 3, py - 3, 4, 10, 0xFFFFFF, 0.3);
                }
            }
        }

        // ===== CASH REGISTER COUNTER (polished) =====
        const counterY = height * 0.43;

        // Counter shadow
        bg.fillStyle(0x000000, 0.3);
        bg.fillRect(width * 0.09, counterY + 4, width * 0.82, 38);

        // Counter body with gradient
        bg.fillGradientStyle(0x3a3a3a, 0x2a2a2a, 0x1a1a1a, 0x0a0a0a, 1);
        bg.fillRect(width * 0.1, counterY, width * 0.8, 38);

        // Glass counter top with reflection
        bg.fillGradientStyle(0x5a5a5a, 0x4a4a4a, 0x3a3a3a, 0x2a2a2a, 1);
        bg.fillRect(width * 0.1, counterY, width * 0.8, 10);
        // Reflection highlight
        bg.fillStyle(0x7a7a7a, 0.5);
        bg.fillRect(width * 0.1, counterY, width * 0.8, 3);

        // LED accent strip under counter
        bg.fillStyle(0x00CED1, 0.4);
        bg.fillRect(width * 0.1, counterY + 35, width * 0.8, 3);

        // POS systems with detail
        const registerPositions = [width * 0.22, width * 0.5, width * 0.78];
        registerPositions.forEach(rx => {
            // Monitor back
            this.add.rectangle(rx, counterY - 16, 28, 24, 0x1a1a1a);
            // Screen with glow
            this.add.rectangle(rx, counterY - 16, 24, 20, 0x2A4A6A);
            this.add.rectangle(rx, counterY - 16, 22, 18, 0x4FC3F7, 0.8);
            // Screen reflection
            this.add.rectangle(rx - 6, counterY - 20, 8, 12, 0xFFFFFF, 0.15);
            // Stand
            this.add.rectangle(rx, counterY - 3, 10, 8, 0x2a2a2a);
        });

        // ===== EMPLOYEES BEHIND COUNTER =====

        // Employee 1: Rotund lady (with improved shading)
        const rotundLadyX = width * 0.22;

        // Body shadow
        this.add.ellipse(rotundLadyX + 3, counterY - 32, 48, 40, 0x1a3a1a, 0.3);

        // Main body (green shirt with gradient effect)
        this.add.ellipse(rotundLadyX, counterY - 35, 48, 40, 0x2E5A3A);
        this.add.ellipse(rotundLadyX - 22, counterY - 30, 20, 28, 0x2E5A3A);
        this.add.ellipse(rotundLadyX + 22, counterY - 30, 20, 28, 0x2E5A3A);
        // Body highlight
        this.add.ellipse(rotundLadyX - 10, counterY - 40, 15, 20, 0x3E6A4A, 0.4);

        // Face with proper shading
        this.add.circle(rotundLadyX, counterY - 76, 18, 0x8B5A2B);
        this.add.circle(rotundLadyX - 5, counterY - 80, 8, 0x9B6A3B, 0.4);  // Highlight
        // Rosy cheeks
        this.add.circle(rotundLadyX - 11, counterY - 73, 6, 0xA05535, 0.4);
        this.add.circle(rotundLadyX + 11, counterY - 73, 6, 0xA05535, 0.4);
        // Double chin
        this.add.ellipse(rotundLadyX, counterY - 58, 14, 7, 0x7A4A1A);

        // Poofy hair with depth
        this.add.circle(rotundLadyX, counterY - 94, 16, 0x0a0a0a);
        this.add.circle(rotundLadyX - 14, counterY - 90, 12, 0x1a1a1a);
        this.add.circle(rotundLadyX + 14, counterY - 90, 12, 0x1a1a1a);
        this.add.circle(rotundLadyX - 9, counterY - 98, 10, 0x151515);
        this.add.circle(rotundLadyX + 9, counterY - 98, 10, 0x151515);
        // Hair shine
        this.add.circle(rotundLadyX - 5, counterY - 96, 4, 0x3a3a3a, 0.5);

        // Eyes
        this.add.circle(rotundLadyX - 7, counterY - 79, 5, 0xFFFFFF);
        this.add.circle(rotundLadyX + 7, counterY - 79, 5, 0xFFFFFF);
        this.add.circle(rotundLadyX - 7, counterY - 79, 2.5, 0x4A3020);
        this.add.circle(rotundLadyX + 7, counterY - 79, 2.5, 0x4A3020);
        this.add.circle(rotundLadyX - 6, counterY - 80, 1, 0xFFFFFF);  // Eye shine
        this.add.circle(rotundLadyX + 8, counterY - 80, 1, 0xFFFFFF);
        // Smile
        this.add.arc(rotundLadyX, counterY - 68, 9, 0, Math.PI, false, 0xFFFFFF);

        // Arms
        this.add.ellipse(rotundLadyX - 40, counterY - 40, 10, 14, 0x8B5A2B);
        this.add.ellipse(rotundLadyX + 40, counterY - 40, 10, 14, 0x8B5A2B);

        // Employee 2: Barrett
        this.barrett = this.add.sprite(width * 0.5, counterY - 36, 'barrett');
        this.barrett.setScale(2.2);

        // iPad with reflection
        this.add.rectangle(width * 0.5 - 22, counterY - 5, 20, 26, 0x1a1a1a);
        this.add.rectangle(width * 0.5 - 22, counterY - 5, 16, 22, 0x4FC3F7);
        this.add.rectangle(width * 0.5 - 26, counterY - 10, 6, 14, 0xFFFFFF, 0.1);

        // Employee 3: Regular guy (improved)
        const emp3X = width * 0.78;
        // Body shadow
        this.add.rectangle(emp3X + 2, counterY - 43, 22, 32, 0x0a0a0a, 0.3);
        // Body
        bg.fillGradientStyle(0x2a2a2a, 0x1a1a1a, 0x0a0a0a, 0x000000, 1);
        bg.fillRect(emp3X - 11, counterY - 46, 22, 32);
        // Face
        this.add.circle(emp3X, counterY - 56, 12, 0xF0D5C0);
        this.add.circle(emp3X - 4, counterY - 60, 5, 0xFAE5D0, 0.4);  // Highlight
        // Hair
        bg.fillGradientStyle(0x5D4037, 0x4D3027, 0x3D2017, 0x2D1007, 1);
        bg.fillRect(emp3X - 10, counterY - 68, 20, 10);
        // Eyes
        this.add.circle(emp3X - 5, counterY - 57, 3.5, 0xFFFFFF);
        this.add.circle(emp3X + 5, counterY - 57, 3.5, 0xFFFFFF);
        this.add.circle(emp3X - 5, counterY - 57, 1.8, 0x4A3525);
        this.add.circle(emp3X + 5, counterY - 57, 1.8, 0x4A3525);

        // ===== FLOOR (polished tiles) =====
        bg.fillGradientStyle(0x454555, 0x3a3a4a, 0x30303f, 0x252535, 1);
        bg.fillRect(0, height * 0.5, width, height * 0.5);

        // Tile grid with depth
        for (let x = 0; x < width; x += 45) {
            bg.fillStyle(0x2a2a3a, 0.6);
            bg.fillRect(x, height * 0.5, 3, height * 0.5);
        }
        for (let y = height * 0.5; y < height; y += 45) {
            bg.fillStyle(0x2a2a3a, 0.6);
            bg.fillRect(0, y, width, 3);
        }

        // Floor reflection/shine
        bg.fillStyle(0x5a5a6a, 0.15);
        bg.fillRect(width * 0.15, height * 0.52, width * 0.7, height * 0.1);

        // ===== FLOOR DISPLAY CASES =====
        this.createFloorDisplayCase(width * 0.18, height * 0.63);
        this.createFloorDisplayCase(width * 0.42, height * 0.63);
        this.createFloorDisplayCase(width * 0.66, height * 0.63);
        this.createFloorDisplayCase(width * 0.88, height * 0.63);

        // ===== GLOWING LEAF COLLECTIBLE =====
        // Leaf glow effect
        this.add.circle(width * 0.3, height * 0.76, 25, 0x8BC34A, 0.2);
        this.leaf = this.add.sprite(width * 0.3, height * 0.76, 'leaf');
        this.leaf.setScale(2.2);
        this.leafCollected = false;

        this.tweens.add({
            targets: this.leaf,
            alpha: 0.6,
            scale: 2.5,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // ========== EMMA ==========
        this.createEmma(30, height * 0.83);
        this.emma.body.setAllowGravity(false);

        // ========== SETUP ==========
        this.setupControls();
        this.createHeartUI();
        this.dialogue = new DialogueBox(this);

        this.counterTriggerX = width * 0.38;

        this.instructionText = this.add.text(width / 2, height - 25, '→ Walk to the counter', {
            fontSize: '12px', fill: '#fff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);

        this.tweens.add({
            targets: this.instructionText,
            alpha: 0.5,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        this.cameras.main.fadeIn(400);

        // ========== STORE AMBIENT EFFECTS ==========
        this.createStoreAmbientEffects(width, height);
    }

    createStoreAmbientEffects(width, height) {
        // ===== LED SHELF LIGHTS PULSE =====
        this.shelfLEDs = [];
        for (let i = 0; i < 4; i++) {
            const ledGlow = this.add.rectangle(
                width * 0.15 + i * width * 0.22,
                height * 0.19,
                width * 0.2,
                8,
                0x4ECDC4,
                0
            );
            ledGlow.phase = i * 0.5;
            this.shelfLEDs.push(ledGlow);
        }

        // ===== TRACK LIGHTING GLOW =====
        this.trackLights = [];
        [0.1, 0.3, 0.5, 0.7, 0.9].forEach((xPct, i) => {
            const light = this.add.circle(width * xPct, height * 0.08, 20, 0xFFF8DC, 0);
            light.phase = i * 0.3;
            this.trackLights.push(light);
        });

        // ===== FLOOR REFLECTION SHIMMER =====
        this.floorReflection = this.add.rectangle(
            width * 0.4,
            height * 0.55,
            width * 0.6,
            height * 0.08,
            0xFFFFFF,
            0
        );
        this.tweens.add({
            targets: this.floorReflection,
            alpha: 0.06,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // ===== DISPLAY CASE LED ACCENTS =====
        this.displayCaseLEDs = [];
        [0.18, 0.42, 0.66, 0.88].forEach((xPct, i) => {
            const led = this.add.rectangle(width * xPct, height * 0.61, 58, 4, 0x00FFFF, 0);
            led.phase = i * 0.4;
            this.displayCaseLEDs.push(led);
        });

        // ===== LEAF COLLECTIBLE PARTICLE EFFECT =====
        this.leafParticles = [];
        for (let i = 0; i < 6; i++) {
            const particle = this.add.circle(
                width * 0.3 + (Math.random() - 0.5) * 40,
                height * 0.76 + (Math.random() - 0.5) * 30,
                Math.random() * 2 + 1,
                0x8BC34A,
                0
            );
            particle.baseX = particle.x;
            particle.baseY = particle.y;
            particle.phase = Math.random() * Math.PI * 2;
            this.leafParticles.push(particle);
        }

        // ===== EMMA'S SHADOW =====
        this.emmaShadowStore = this.add.ellipse(this.emma.x, height * 0.88, 24, 8, 0x000000, 0.2);

        // ===== COUNTER AMBIENT GLOW =====
        this.counterGlow = this.add.rectangle(width * 0.6, height * 0.38, width * 0.5, 30, 0x00CED1, 0);
        this.tweens.add({
            targets: this.counterGlow,
            alpha: 0.1,
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    updateStoreAmbientEffects(time) {
        // ===== SHELF LED PULSE =====
        if (this.shelfLEDs) {
            this.shelfLEDs.forEach(led => {
                led.setAlpha(0.15 + Math.sin(time * 0.002 + led.phase) * 0.1);
            });
        }

        // ===== TRACK LIGHT FLICKER =====
        if (this.trackLights) {
            this.trackLights.forEach(light => {
                const flicker = Math.sin(time * 0.003 + light.phase) * 0.08;
                light.setAlpha(0.12 + flicker + Math.random() * 0.02);
            });
        }

        // ===== DISPLAY CASE LED ANIMATION =====
        if (this.displayCaseLEDs) {
            this.displayCaseLEDs.forEach(led => {
                led.setAlpha(0.2 + Math.sin(time * 0.004 + led.phase) * 0.15);
            });
        }

        // ===== LEAF PARTICLES =====
        if (this.leafParticles && !this.leafCollected) {
            this.leafParticles.forEach(particle => {
                particle.x = particle.baseX + Math.sin(time * 0.002 + particle.phase) * 15;
                particle.y = particle.baseY + Math.cos(time * 0.0015 + particle.phase) * 12;
                particle.setAlpha(0.3 + Math.sin(time * 0.003 + particle.phase) * 0.2);
            });
        } else if (this.leafParticles && this.leafCollected) {
            // Hide particles after leaf is collected
            this.leafParticles.forEach(p => p.setAlpha(0));
        }

        // ===== UPDATE EMMA'S SHADOW =====
        if (this.emmaShadowStore && this.emma) {
            this.emmaShadowStore.x = this.emma.x;
        }
    }

    createFloorDisplayCase(x, y) {
        // Display case shadow
        this.add.ellipse(x, y + 22, 50, 10, 0x000000, 0.25);

        // Case body with gradient
        this.add.rectangle(x, y, 58, 44, 0x2a2a2a);
        this.add.rectangle(x - 1, y - 1, 56, 42, 0x3a3a3a);

        // Glass top with reflection layers
        this.add.rectangle(x, y - 20, 56, 8, 0x6AAACC, 0.3);
        this.add.rectangle(x, y - 20, 54, 6, 0x87CEEB, 0.4);
        // Reflection highlight
        this.add.rectangle(x - 15, y - 21, 20, 3, 0xFFFFFF, 0.2);

        // LED accent strip
        this.add.rectangle(x, y - 16, 58, 3, 0x00CED1, 0.5);
        this.add.rectangle(x, y - 16, 56, 2, 0x40FFFF, 0.3);

        // Products with shadows
        const colors = [0xFFD700, 0xFF6B6B, 0x4ECDC4, 0x9370DB, 0x95E1D3];
        for (let i = 0; i < 4; i++) {
            const px = x - 20 + i * 14;
            this.add.rectangle(px + 1, y - 4, 9, 16, 0x000000, 0.2);
            this.add.rectangle(px, y - 5, 9, 16, colors[i % colors.length]);
            this.add.rectangle(px - 2, y - 9, 3, 10, 0xFFFFFF, 0.2);
        }

        // Product label card
        this.add.rectangle(x, y + 14, 44, 10, 0xFFFFF0, 0.9);
        this.add.rectangle(x, y + 14, 42, 8, 0xFFFFFF);
    }

    collectLeaf() {
        if (this.leafCollected || !this.leaf) return;
        this.leafCollected = true;

        const leafX = this.leaf.x;
        const leafY = this.leaf.y;
        this.leaf.destroy();

        GameState.heartsCollected++;
        this.updateHeartUI();

        // Transform leaf to heart animation
        const leafSprite = this.add.image(leafX, leafY, 'leaf').setScale(2);
        this.tweens.add({
            targets: leafSprite,
            y: leafY - 40,
            scale: 2.5,
            alpha: 0,
            duration: 400,
            onComplete: () => {
                leafSprite.destroy();
                const heart = this.add.image(leafX, leafY - 40, 'heart').setScale(2);
                this.tweens.add({
                    targets: heart,
                    y: heart.y - 50,
                    scale: 3,
                    alpha: 0,
                    duration: 600,
                    onComplete: () => heart.destroy()
                });
            }
        });
    }

    triggerStoreDialogue() {
        if (this.dialogue.isShowing || this.dialogueStep > 0) return;

        this.dialogueStep = 1;
        this.canMove = false;

        const dialogues = [
            { text: "So what are you looking for today?", speaker: "Barrett" },
            { text: "Just browsing... what do you recommend?", speaker: "Emma" },
            { text: "*checks iPad* Hmm, Emma...", speaker: "Barrett" },
            { text: "He's kinda old though...", speaker: "Emma's thoughts" },
            { text: "But there's something about him...", speaker: "Emma's thoughts" }
        ];

        const showNext = (index) => {
            if (index >= dialogues.length) {
                this.showDMScreen();
                return;
            }

            this.dialogue.show(dialogues[index].text, dialogues[index].speaker, () => {
                showNext(index + 1);
            });
        };

        showNext(0);
    }

    showDMScreen() {
        const { width, height } = this.scale;

        // Change scene state so update() doesn't interfere
        this.currentScene = 'dmScreen';

        this.cameras.main.fadeOut(300, 0, 0, 0);

        this.time.delayedCall(300, () => {
            this.children.removeAll();

            const bg = this.add.graphics();
            bg.fillStyle(0x1a1a1a);
            bg.fillRect(0, 0, width, height);

            // Instagram DM mockup
            this.add.image(width / 2 - 70, 80, 'phone').setScale(1.5);
            this.add.text(width / 2, 80, 'Instagram', {
                fontSize: '20px', fill: '#E1306C'
            }).setOrigin(0.5);

            this.add.text(width / 2, 120, 'Later that week...', {
                fontSize: '14px', fill: '#666'
            }).setOrigin(0.5);

            // DM bubble
            this.add.rectangle(width / 2, height / 2 - 30, 280, 100, 0x262626);

            this.add.text(width / 2, height / 2 - 60, 'Barrett', {
                fontSize: '14px', fill: '#888'
            }).setOrigin(0.5);

            this.add.text(width / 2, height / 2 - 25, '"Did you like the tree?"', {
                fontSize: '20px', fill: '#fff', fontStyle: 'italic'
            }).setOrigin(0.5);

            // Heart reaction
            this.add.image(width / 2, height / 2 + 30, 'heart_red').setScale(3);

            this.add.text(width / 2 - 10, height / 2 + 100, 'And just like that...\nthey had a date planned.', {
                fontSize: '16px', fill: '#FF69B4', align: 'center'
            }).setOrigin(0.5);
            this.add.image(width / 2 + 100, height / 2 + 100, 'heart').setScale(1.5);

            // Make the ENTIRE SCREEN tappable to continue
            const clickZone = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0);
            clickZone.setInteractive({ useHandCursor: true });

            // Continue text
            const continueBtn = this.add.text(width / 2, height - 80, 'Tap anywhere to continue →', {
                fontSize: '16px', fill: '#FF69B4'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: continueBtn,
                alpha: 0.5,
                duration: 600,
                yoyo: true,
                repeat: -1
            });

            clickZone.on('pointerdown', () => {
                this.transitionTo('Level2_ForestPark');
            });

            this.cameras.main.fadeIn(300);
        });
    }

    update(time, delta) {
        this.handleMovement();

        // ===== AMBIENT EFFECT UPDATES =====
        if (this.currentScene === 'exterior') {
            this.updateExteriorAmbientEffects(time, delta);
        } else if (this.currentScene === 'waitingRoom') {
            this.updateWaitingRoomAmbientEffects(time);
        } else if (this.currentScene === 'store') {
            this.updateStoreAmbientEffects(time);
        }

        if (this.currentScene === 'exterior') {
            // Check if Emma reached the door
            if (!this.enteredDoor && this.emma && this.emma.x >= this.doorTriggerX - 20) {
                this.enteredDoor = true;
                this.canMove = false;

                // Fade and transition to waiting room
                this.cameras.main.fadeOut(400, 0, 0, 0);
                this.time.delayedCall(500, () => {
                    this.createWaitingRoomScene();
                });
            }
        }

        if (this.currentScene === 'waitingRoom') {
            // Check if Emma reached the store door (after Barrett called her name)
            if (this.barrettCalledName && this.emma && this.emma.x >= this.storeDoorX - 20) {
                this.barrettCalledName = false;  // Prevent re-trigger
                this.canMove = false;

                // Fade and transition to store
                this.cameras.main.fadeOut(400, 0, 0, 0);
                this.time.delayedCall(500, () => {
                    this.createStoreScene();
                });
            }
        }

        if (this.currentScene === 'store') {
            // Check leaf collection
            if (!this.leafCollected && this.leaf && this.emma) {
                if (Math.abs(this.emma.x - this.leaf.x) < 40 && Math.abs(this.emma.y - this.leaf.y) < 50) {
                    this.collectLeaf();
                }
            }

            // Check if Emma reached the counter
            if (this.dialogueStep === 0 && this.emma && this.emma.x >= this.counterTriggerX) {
                this.triggerStoreDialogue();
            }
        }
    }
}

// ============================================
// LEVEL 2: FOREST PARK ADVENTURE
// ============================================
class Level2_ForestPark extends BaseLevel {
    constructor() {
        super('Level2_ForestPark');
        this.hearts = [];
        this.clouds = [];
        this.reachedBlanket = false;
    }

    create() {
        const { width, height } = this.scale;
        const levelWidth = 1200;

        // GROUND LINE - this is where feet touch the ground visually
        const GROUND_Y = height - 100;  // = 540 when height is 640

        // ========== SKY WITH GRADIENT AND ATMOSPHERE ==========
        const bg = this.add.graphics();

        // Rich sky gradient - deeper blue at top, lighter near horizon
        bg.fillGradientStyle(0x1E90FF, 0x1E90FF, 0x87CEEB, 0x87CEEB, 1);
        bg.fillRect(0, 0, levelWidth, height - 250);

        // Horizon glow - warm golden light near the horizon
        bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xFFE4B5, 0xFFE4B5, 0.6);
        bg.fillRect(0, height - 350, levelWidth, 100);

        // Atmospheric haze layer
        this.add.rectangle(levelWidth / 2, height - 280, levelWidth, 60, 0xFFFFFF, 0.15);

        // Fluffy clouds with depth and shading
        const cloudPositions = [[80, 60], [250, 45], [450, 70], [650, 50], [850, 65], [1050, 55]];
        cloudPositions.forEach(([cx, cy]) => {
            // Cloud shadow
            this.add.ellipse(cx + 3, cy + 3, 50, 20, 0x6B8E9F, 0.3);
            // Main cloud body
            this.add.ellipse(cx, cy, 50, 20, 0xFFFFFF, 0.9);
            this.add.ellipse(cx - 18, cy + 5, 30, 15, 0xFFFFFF, 0.85);
            this.add.ellipse(cx + 20, cy + 3, 35, 16, 0xFFFFFF, 0.85);
            // Cloud highlight
            this.add.ellipse(cx - 5, cy - 5, 25, 10, 0xFFFFFF, 1);
        });

        // ========== DISTANT HILLS WITH DEPTH ==========
        // Far distant hills - misty blue
        bg.fillGradientStyle(0x7BA3A8, 0x7BA3A8, 0x8FBC8F, 0x8FBC8F, 0.7);
        bg.fillRect(0, height - 280, levelWidth, 40);

        // Mid-distance rolling hills
        bg.fillGradientStyle(0x6B8E6B, 0x6B8E6B, 0x7CB342, 0x7CB342, 1);
        bg.fillRect(0, height - 250, levelWidth, 50);

        // Hill slope gradient going down to basin
        bg.fillGradientStyle(0x7CB342, 0x7CB342, 0x8BC34A, 0x8BC34A, 1);
        bg.fillRect(0, height - 200, levelWidth, 60);

        // ========== GRAND BASIN WITH REFLECTIONS ==========
        // Water base with gradient for depth
        bg.fillGradientStyle(0x2E6B7A, 0x2E6B7A, 0x5DA3B8, 0x5DA3B8, 1);
        bg.fillRect(0, height - 145, 350, 45);

        // Water shimmer/reflection highlights
        for (let i = 0; i < 12; i++) {
            this.add.rectangle(20 + i * 28, height - 130, 15, 2, 0xFFFFFF, 0.3);
            this.add.rectangle(30 + i * 28, height - 120, 10, 1, 0xFFFFFF, 0.2);
        }

        // Enhanced fountains with spray and mist
        [[80, 0.8], [180, 1.0], [280, 0.8]].forEach(([fx, scale]) => {
            // Fountain mist glow
            this.add.circle(fx, height - 160, 20 * scale, 0xFFFFFF, 0.15);
            // Main spray
            this.add.ellipse(fx, height - 155, 16 * scale, 8 * scale, 0xFFFFFF, 0.85);
            this.add.ellipse(fx, height - 168, 10 * scale, 6 * scale, 0xFFFFFF, 0.7);
            this.add.ellipse(fx, height - 180, 6 * scale, 4 * scale, 0xFFFFFF, 0.5);
            this.add.ellipse(fx, height - 188, 4 * scale, 3 * scale, 0xFFFFFF, 0.3);
            // Spray droplets
            for (let d = 0; d < 5; d++) {
                this.add.circle(fx + (Math.random() - 0.5) * 20, height - 160 - Math.random() * 30, 2, 0xFFFFFF, 0.4);
            }
        });

        // ========== SAINT LOUIS ART MUSEUM (Classical Architecture) ==========
        const museumX = 120;
        const museumY = height - 280;

        // Museum shadow on ground
        this.add.ellipse(museumX, museumY + 85, 180, 20, 0x000000, 0.2);

        // Main building base with gradient for depth
        bg.fillGradientStyle(0xF5F0E1, 0xE8E0D0, 0xF5F0E1, 0xE8E0D0, 1);
        bg.fillRect(museumX - 85, museumY, 170, 85);

        // Building depth shadow on right side
        bg.fillStyle(0xD4C5A9, 0.6);
        bg.fillRect(museumX + 80, museumY, 8, 85);

        // Ornate roof with trim
        bg.fillGradientStyle(0x6B6B60, 0x8B8878, 0x6B6B60, 0x8B8878, 1);
        bg.fillRect(museumX - 90, museumY - 10, 180, 12);
        // Roof decorative line
        this.add.rectangle(museumX, museumY - 3, 175, 2, 0xA09080);

        // Central entrance with grand arch
        bg.fillGradientStyle(0xC4B599, 0xD4C5A9, 0xC4B599, 0xD4C5A9, 1);
        bg.fillRect(museumX - 28, museumY + 20, 56, 65);

        // Arch top with shadow
        this.add.circle(museumX, museumY + 20, 28, 0xC4B599);
        this.add.circle(museumX, museumY + 20, 22, 0x3A3530, 0.8);  // Dark interior

        // Grand columns with 3D effect
        const columnPositions = [-62, -48, 40, 54];
        columnPositions.forEach(offset => {
            // Column shadow
            this.add.rectangle(museumX + offset + 3, museumY + 47, 10, 68, 0x8B8070, 0.5);
            // Column base
            this.add.rectangle(museumX + offset, museumY + 78, 14, 6, 0xD8D0C0);
            // Column shaft with gradient look
            this.add.rectangle(museumX + offset - 2, museumY + 45, 4, 62, 0xE8E0D0);  // Highlight side
            this.add.rectangle(museumX + offset + 2, museumY + 45, 4, 62, 0xD4C8B8);  // Shadow side
            this.add.rectangle(museumX + offset, museumY + 45, 4, 62, 0xF0E8E0);  // Center
            // Column capital
            this.add.rectangle(museumX + offset, museumY + 12, 14, 6, 0xE8E0D0);
        });

        // Decorative windows with reflections
        [[-72, 35], [60, 35]].forEach(([wx, wy]) => {
            // Window frame
            this.add.rectangle(museumX + wx, museumY + wy, 18, 24, 0x3A3530);
            // Window glass with reflection
            this.add.rectangle(museumX + wx, museumY + wy, 14, 20, 0x4A6670);
            this.add.rectangle(museumX + wx - 3, museumY + wy - 4, 4, 8, 0x7A9AA8, 0.5);  // Reflection
        });

        // ========== KING LOUIS IX STATUE (Bronze with Patina) ==========
        const statueX = 180;
        const statueY = height - 200;

        // Statue shadow on ground
        this.add.ellipse(statueX, statueY + 38, 45, 12, 0x000000, 0.25);

        // Grand pedestal with layers
        bg.fillGradientStyle(0x606060, 0x808080, 0x606060, 0x808080, 1);
        bg.fillRect(statueX - 18, statueY + 8, 36, 28);
        // Pedestal top layer
        this.add.rectangle(statueX, statueY + 4, 30, 8, 0x909090);
        // Pedestal trim
        this.add.rectangle(statueX, statueY + 36, 40, 4, 0x707070);
        // Pedestal highlight
        this.add.rectangle(statueX - 15, statueY + 20, 3, 20, 0xA0A0A0, 0.5);

        // Horse body with bronze shading
        bg.fillGradientStyle(0x3A2E20, 0x5A4A38, 0x3A2E20, 0x5A4A38, 1);
        bg.fillRect(statueX - 12, statueY - 22, 28, 18);
        // Horse legs with depth
        this.add.rectangle(statueX - 7, statueY - 5, 5, 14, 0x4A3C2A);
        this.add.rectangle(statueX + 7, statueY - 5, 5, 14, 0x3A2E20);
        // Horse rear legs (rearing pose)
        this.add.rectangle(statueX - 2, statueY - 2, 4, 10, 0x4A3C2A);
        // Horse head and neck
        bg.fillStyle(0x4A3C2A);
        bg.fillRect(statueX + 12, statueY - 32, 10, 16);
        // Horse mane
        this.add.rectangle(statueX + 15, statueY - 35, 6, 8, 0x3A2E20);

        // Rider (King Louis IX) with details
        this.add.rectangle(statueX, statueY - 38, 10, 22, 0x4A3C2A);  // Body
        this.add.circle(statueX, statueY - 52, 6, 0x5A4A38);  // Head
        this.add.rectangle(statueX - 6, statueY - 32, 3, 12, 0x4A3C2A);  // Arm
        // Raised sword with glint
        this.add.rectangle(statueX + 3, statueY - 58, 2, 22, 0x6A5A48);
        this.add.rectangle(statueX + 3, statueY - 68, 1, 6, 0x8A8070, 0.8);  // Sword glint

        // Bronze patina highlights
        this.add.circle(statueX + 5, statueY - 18, 3, 0x4A8A6A, 0.3);
        this.add.circle(statueX - 8, statueY - 28, 2, 0x4A8A6A, 0.25);

        // ========== LUSH GREEN GRASS WITH TEXTURE ==========
        // Base grass layer
        bg.fillGradientStyle(0x3D9140, 0x4CAF50, 0x3D9140, 0x4CAF50, 1);
        bg.fillRect(0, GROUND_Y, levelWidth, 100);

        // Grass texture stripes for depth
        for (let i = 0; i < levelWidth; i += 30) {
            const shade = i % 60 === 0 ? 0x43A047 : 0x388E3C;
            bg.fillStyle(shade, 0.5);
            bg.fillRect(i, GROUND_Y, 15, 100);
        }

        // Individual grass blades near foreground
        for (let i = 0; i < levelWidth; i += 8) {
            const h = 4 + Math.random() * 6;
            this.add.rectangle(i + Math.random() * 4, GROUND_Y - h / 2, 2, h, 0x2E7D32, 0.6);
        }

        // ========== BACKGROUND TREES (Near Museum) ==========
        [40, 220, 260, 300].forEach((x, idx) => {
            // Tree shadow
            this.add.ellipse(x + 5, height - 290, 25, 8, 0x000000, 0.2);
            // Conical evergreen trees with layered depth
            const baseY = height - 320;
            // Dark inner layer
            this.add.polygon(x, baseY, [[0, -50], [-20, 15], [20, 15]], 0x1E4A10);
            this.add.polygon(x, baseY - 20, [[0, -35], [-15, 12], [15, 12]], 0x1E4A10);
            this.add.polygon(x, baseY - 35, [[0, -25], [-10, 10], [10, 10]], 0x1E4A10);
            // Lighter highlight layer
            this.add.polygon(x - 5, baseY, [[0, -45], [-12, 12], [8, 12]], 0x2E6A1C, 0.6);
            this.add.polygon(x - 3, baseY - 22, [[0, -30], [-10, 10], [6, 10]], 0x2E6A1C, 0.5);
            // Trunk
            this.add.rectangle(x, baseY + 10, 6, 12, 0x4A3020);
        });

        // ========== GROVE OF TREES (Walking Path) ==========
        const groveStart = 400;
        const trunkHeight = 60;
        for (let i = 0; i < 10; i++) {
            const x = groveStart + i * 80;
            const foliageY = GROUND_Y - trunkHeight - 30;

            // Tree shadow on ground
            this.add.ellipse(x + 10, GROUND_Y + 5, 50, 15, 0x000000, 0.2);

            // Trunk with bark texture
            this.add.rectangle(x, GROUND_Y - trunkHeight / 2, 20, trunkHeight, 0x4A3020);
            // Bark highlights
            this.add.rectangle(x - 6, GROUND_Y - trunkHeight / 2, 4, trunkHeight, 0x5D4037, 0.7);
            // Bark shadow
            this.add.rectangle(x + 6, GROUND_Y - trunkHeight / 2, 4, trunkHeight, 0x3A2515, 0.5);
            // Bark texture lines
            for (let b = 0; b < 4; b++) {
                this.add.rectangle(x + (Math.random() - 0.5) * 12, GROUND_Y - 10 - b * 15, 2, 8, 0x3A2515, 0.3);
            }

            // Layered foliage with depth
            // Back layer (darker)
            this.add.circle(x, foliageY + 5, 40, 0x1B5E20);
            this.add.circle(x - 22, foliageY + 20, 32, 0x1B5E20);
            this.add.circle(x + 22, foliageY + 20, 32, 0x1B5E20);

            // Mid layer
            this.add.circle(x, foliageY, 38, 0x2E7D32);
            this.add.circle(x - 20, foliageY + 15, 30, 0x388E3C);
            this.add.circle(x + 20, foliageY + 15, 30, 0x388E3C);

            // Front layer (lighter, highlights)
            this.add.circle(x - 8, foliageY - 10, 25, 0x43A047, 0.8);
            this.add.circle(x + 12, foliageY - 5, 20, 0x4CAF50, 0.6);
            this.add.circle(x, foliageY - 28, 22, 0x43A047);

            // Light dappling through leaves
            for (let d = 0; d < 3; d++) {
                this.add.circle(
                    x + (Math.random() - 0.5) * 40,
                    foliageY + (Math.random() - 0.5) * 30,
                    3 + Math.random() * 4,
                    0x66BB6A, 0.4
                );
            }
        }

        // ========== ROMANTIC PICNIC BLANKET ==========
        const blanketX = 1050;

        // Soft lighting around blanket area
        this.add.circle(blanketX, GROUND_Y - 20, 60, 0xFFF8DC, 0.15);

        // Blanket shadow
        this.add.ellipse(blanketX, GROUND_Y + 3, 90, 12, 0x000000, 0.25);

        // Woven blanket base with pattern
        this.add.rectangle(blanketX, GROUND_Y - 3, 85, 14, 0x8B2500).setOrigin(0.5, 1);
        // Woven texture stripes
        for (let s = -38; s < 38; s += 8) {
            this.add.rectangle(blanketX + s, GROUND_Y - 5, 3, 10, 0x6B1500, 0.4).setOrigin(0.5, 1);
        }
        // Decorative pattern
        this.add.rectangle(blanketX, GROUND_Y - 5, 80, 3, 0x1E90FF).setOrigin(0.5, 1);
        this.add.rectangle(blanketX, GROUND_Y - 9, 80, 2, 0xDAA520).setOrigin(0.5, 1);
        // Diamond patterns
        [-28, 0, 28].forEach(offset => {
            this.add.polygon(blanketX + offset, GROUND_Y - 6, [[0, -4], [4, 0], [0, 4], [-4, 0]], 0x2F4F4F);
        });
        // Fringe on edges
        for (let f = -40; f < 40; f += 6) {
            this.add.rectangle(blanketX + f, GROUND_Y - 1, 2, 4, 0xDAA520, 0.7).setOrigin(0.5, 0);
        }

        // ========== WINE BOTTLE WITH GLASS SHEEN ==========
        const wineX = blanketX + 48;
        // Bottle shadow
        this.add.ellipse(wineX + 3, GROUND_Y - 2, 12, 5, 0x000000, 0.3);
        // Bottle body (dark burgundy glass)
        this.add.rectangle(wineX, GROUND_Y - 12, 10, 24, 0x3A0A0A).setOrigin(0.5, 1);
        // Glass sheen highlight
        this.add.rectangle(wineX - 3, GROUND_Y - 18, 2, 14, 0x6A2020, 0.6).setOrigin(0.5, 1);
        // Bottle neck
        this.add.rectangle(wineX, GROUND_Y - 30, 5, 12, 0x3A0A0A).setOrigin(0.5, 1);
        // Cork
        this.add.rectangle(wineX, GROUND_Y - 38, 4, 6, 0xC4A35A).setOrigin(0.5, 1);
        // Label
        this.add.rectangle(wineX, GROUND_Y - 16, 8, 10, 0xF5F5DC).setOrigin(0.5, 1);

        // ========== ELEGANT WINE GLASSES ==========
        const glassX = blanketX - 48;
        [[0, 0], [18, 2]].forEach(([gx, gy]) => {
            // Glass shadow
            this.add.ellipse(glassX + gx + 6 + 2, GROUND_Y - 2 + gy, 10, 4, 0x000000, 0.2);
            // Stem
            this.add.rectangle(glassX + gx + 6, GROUND_Y - 5 + gy, 2, 10, 0xD0D0D0).setOrigin(0.5, 1);
            // Base
            this.add.ellipse(glassX + gx + 6, GROUND_Y - 1 + gy, 10, 4, 0xE0E0E0, 0.8);
            // Bowl
            this.add.polygon(glassX + gx, GROUND_Y - 10 + gy, [[0, 0], [8, -15], [16, 0]], 0xE8E8E8, 0.7);
            // Wine in glass
            this.add.polygon(glassX + gx + 2, GROUND_Y - 12 + gy, [[0, 0], [5, -8], [10, 0]], 0x722F37, 0.6);
            // Glass highlight
            this.add.rectangle(glassX + gx + 2, GROUND_Y - 18 + gy, 2, 8, 0xFFFFFF, 0.4);
        });

        // ========== CHAPTER TITLE WITH STYLED TEXT ==========
        // Title shadow
        this.add.text(width / 2 + 2, 32, 'Chapter 2', {
            fontSize: '14px', fill: '#000',
        }).setOrigin(0.5).setScrollFactor(0).setAlpha(0.3);

        this.add.text(width / 2, 30, 'Chapter 2', {
            fontSize: '14px', fill: '#fff',
            stroke: '#1E5A20', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0);

        // Main title with glow effect
        this.add.text(width / 2, 55, 'Art Hill', {
            fontSize: '24px', fill: '#90EE90', fontStyle: 'bold',
            stroke: '#1B5E20', strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0);

        this.add.text(width / 2, 80, 'Forest Park', {
            fontSize: '15px', fill: '#C8E6C9',
            stroke: '#2E7D32', strokeThickness: 2
        }).setOrigin(0.5).setScrollFactor(0);

        // ========== PHYSICS SETUP ==========
        // World bounds: full level width, height goes to GROUND_Y
        this.physics.world.setBounds(0, 0, levelWidth, GROUND_Y);

        // ========== CREATE BARRETT (waiting by the statue) ==========
        // Barrett is waiting near the King Louis IX statue
        const barrettX = 200;  // Right by the statue
        this.barrett = this.add.sprite(barrettX, GROUND_Y - 24, 'barrett');
        this.barrett.setScale(2);
        this.barrett.setFlipX(true);  // Facing right, waiting for Emma
        this.metBarrett = false;
        this.barrettFollowing = false;

        // ========== CREATE EMMA ==========
        // Emma starts at the left, approaching the statue where Barrett waits
        this.emma = this.physics.add.sprite(80, GROUND_Y - 50, 'emma_walk_0');
        this.emma.setScale(2);

        // Set body size to match the actual character pixels
        this.emma.body.setSize(12, 22);
        this.emma.body.setOffset(10, 2);
        this.emma.setCollideWorldBounds(true);

        // ========== HEARTS (collectibles) ==========
        // Hearts scattered along the path into the grove
        this.heartsArray = [];
        [320, 480, 620, 780, 920].forEach((x, i) => {
            const heart = this.add.sprite(x, GROUND_Y - 50 - (i * 5), 'heart');
            heart.setScale(1.5);
            heart.collected = false;
            this.heartsArray.push(heart);
            // Gentle floating animation
            this.tweens.add({
                targets: heart,
                y: heart.y - 15,
                duration: 1000 + i * 100,
                yoyo: true,
                repeat: -1
            });
        });

        // ========== CLOUDS (atmospheric) ==========
        this.cloudsGroup = this.add.group();
        [100, 400, 700, 1000].forEach(x => {
            const cloud = this.add.text(x, 80 + Math.random() * 40, '☁️', { fontSize: '30px' });
            cloud.setAlpha(0.7);
            this.cloudsGroup.add(cloud);
        });

        // ========== PARK VISITORS (walking around near museum) ==========
        this.parkVisitors = [];

        // Visitor 1: Jogger (running left)
        const jogger = this.createParkVisitor(320, GROUND_Y - 24, 0xFF6B6B, 0x1a1a1a);  // Red shirt, black shorts
        jogger.speed = -1.5;
        jogger.minX = -50;
        jogger.maxX = 350;
        this.parkVisitors.push(jogger);

        // Visitor 2: Person walking dog (walking right)
        const dogWalker = this.createParkVisitor(50, GROUND_Y - 24, 0x4ECDC4, 0x5D4037);  // Teal shirt, brown pants
        dogWalker.speed = 0.8;
        dogWalker.minX = 30;
        dogWalker.maxX = 300;
        // Add a little dog
        const dog = this.add.ellipse(dogWalker.x - 25, GROUND_Y - 8, 18, 10, 0x8B4513);
        dog.walker = dogWalker;
        dogWalker.dog = dog;
        this.parkVisitors.push(dogWalker);

        // Visitor 3: Couple walking together (walking left slowly)
        const person1 = this.createParkVisitor(280, GROUND_Y - 24, 0x9370DB, 0x607D8B);  // Purple shirt
        person1.speed = -0.5;
        person1.minX = 100;
        person1.maxX = 350;
        const person2 = this.createParkVisitor(295, GROUND_Y - 24, 0xFFB347, 0x5D4037);  // Orange shirt
        person2.speed = -0.5;
        person2.minX = 115;
        person2.maxX = 365;
        person2.partner = person1;
        this.parkVisitors.push(person1);
        this.parkVisitors.push(person2);

        // Visitor 4: Person taking photo of museum (stationary, occasionally moves)
        const photographer = this.createParkVisitor(150, GROUND_Y - 24, 0x2ECC71, 0x34495E);  // Green shirt
        photographer.speed = 0;
        photographer.isPhotographer = true;
        photographer.photoTimer = 0;
        this.parkVisitors.push(photographer);

        // Visitor 5: Kid running around
        const kid = this.createParkVisitor(220, GROUND_Y - 18, 0xF39C12, 0x3498DB, true);  // Yellow shirt, smaller
        kid.speed = 2;
        kid.minX = 100;
        kid.maxX = 350;
        this.parkVisitors.push(kid);

        // ========== BLANKET TRIGGER ==========
        // Store blanket X position for simple distance check in update()
        // No physics body needed - we'll check distance manually
        this.blanketX = blanketX;

        // ========== ANIMATION ==========
        if (!this.anims.exists('emma_walk')) {
            this.anims.create({
                key: 'emma_walk',
                frames: [
                    { key: 'emma_walk_0' },
                    { key: 'emma_walk_1' },
                    { key: 'emma_walk_2' },
                    { key: 'emma_walk_3' }
                ],
                frameRate: 8,
                repeat: -1
            });
        }

        // ========== COLLISIONS & OVERLAPS ==========
        // All triggers checked manually in update() - no physics overlaps needed

        // ========== CAMERA ==========
        this.cameras.main.startFollow(this.emma, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, levelWidth, height);

        // ========== CONTROLS & UI ==========
        this.setupControls();
        this.createHeartUI();
        this.heartText.setScrollFactor(0);
        this.dialogue = new DialogueBox(this);

        this.cameras.main.fadeIn(500);

        // ========== LEVEL 2 AMBIENT EFFECTS ==========
        this.createLevel2AmbientEffects(width, height, levelWidth, GROUND_Y);
    }

    createLevel2AmbientEffects(width, height, levelWidth, GROUND_Y) {
        // ===== PARALLAX BACKGROUND LAYERS =====
        // Store original positions for parallax effect
        this.parallaxLayers = {
            farHills: { elements: [], factor: 0.1 },
            midHills: { elements: [], factor: 0.3 },
            museum: { elements: [], factor: 0.5 }
        };

        // ===== ANIMATED BUTTERFLIES =====
        this.butterflies = [];
        for (let i = 0; i < 6; i++) {
            const butterfly = this.add.container(
                300 + i * 150,
                height * 0.3 + Math.random() * 100
            );
            const wing1 = this.add.ellipse(-5, 0, 8, 12, [0xFF69B4, 0xFFB6C1, 0x87CEEB][i % 3], 0.8);
            const wing2 = this.add.ellipse(5, 0, 8, 12, [0xFF69B4, 0xFFB6C1, 0x87CEEB][i % 3], 0.8);
            butterfly.add([wing1, wing2]);
            butterfly.baseX = butterfly.x;
            butterfly.baseY = butterfly.y;
            butterfly.phase = Math.random() * Math.PI * 2;
            butterfly.wing1 = wing1;
            butterfly.wing2 = wing2;
            this.butterflies.push(butterfly);
        }

        // ===== FLOATING LEAVES =====
        this.floatingLeaves = [];
        for (let i = 0; i < 10; i++) {
            const leaf = this.add.image(
                Math.random() * levelWidth,
                Math.random() * height * 0.4 + height * 0.2,
                'leaf'
            ).setScale(0.8);
            leaf.setAlpha(0.6);
            leaf.baseY = leaf.y;
            leaf.speed = Math.random() * 0.5 + 0.2;
            leaf.phase = Math.random() * Math.PI * 2;
            leaf.rotSpeed = (Math.random() - 0.5) * 2;
            this.floatingLeaves.push(leaf);
        }

        // ===== FOUNTAIN SPRAY PARTICLES =====
        this.fountainParticles = [];
        [80, 180, 280].forEach(fx => {
            for (let i = 0; i < 8; i++) {
                const particle = this.add.circle(
                    fx + (Math.random() - 0.5) * 20,
                    height - 160 - Math.random() * 30,
                    Math.random() * 2 + 1,
                    0xFFFFFF,
                    0
                );
                particle.baseX = fx;
                particle.baseY = height - 160;
                particle.phase = Math.random() * Math.PI * 2;
                particle.speed = Math.random() * 2 + 1;
                this.fountainParticles.push(particle);
            }
        });

        // ===== WATER RIPPLES =====
        this.waterRipples = [];
        for (let i = 0; i < 5; i++) {
            const ripple = this.add.circle(
                50 + i * 70,
                height - 125,
                5 + i * 3,
                0xFFFFFF,
                0
            );
            ripple.phase = i * 0.5;
            this.waterRipples.push(ripple);
        }

        // ===== DAPPLED SUNLIGHT THROUGH TREES =====
        this.sunDapples = [];
        for (let i = 0; i < 15; i++) {
            const treeIndex = Math.floor(i / 2);
            const groveStart = 400;
            const x = groveStart + treeIndex * 80 + (Math.random() - 0.5) * 30;
            const dapple = this.add.circle(
                x,
                GROUND_Y - 20 - Math.random() * 40,
                Math.random() * 8 + 4,
                0xFFFFAA,
                0
            );
            dapple.phase = Math.random() * Math.PI * 2;
            this.sunDapples.push(dapple);
        }

        // ===== BIRD FLYING ACROSS =====
        this.birdsTimer = this.time.addEvent({
            delay: 6000,
            callback: () => this.spawnForestBird(levelWidth, height),
            loop: true
        });

        // ===== CHARACTER SHADOWS =====
        this.emmaShadowL2 = this.add.ellipse(this.emma.x, GROUND_Y + 5, 28, 10, 0x000000, 0.2);
        this.barrettShadowL2 = this.add.ellipse(this.barrett.x, GROUND_Y + 5, 28, 10, 0x000000, 0.2);

        // ===== AMBIENT SOUNDS VISUAL (musical notes near blanket) =====
        this.ambientNotes = [];
        for (let i = 0; i < 4; i++) {
            const note = this.add.image(
                this.blanketX - 30 + i * 20,
                GROUND_Y - 40,
                'music_note'
            ).setScale(0.8);
            note.setAlpha(0);
            note.baseY = note.y;
            note.phase = i * 0.8;
            this.ambientNotes.push(note);
        }
    }

    spawnForestBird(levelWidth, height) {
        const startX = -30;
        const startY = height * 0.15 + Math.random() * height * 0.15;
        const bird = this.add.image(startX, startY, 'bird').setScale(1);

        this.tweens.add({
            targets: bird,
            x: levelWidth + 50,
            y: startY + (Math.random() - 0.5) * 60,
            duration: 6000 + Math.random() * 3000,
            ease: 'Linear',
            onUpdate: () => {
                bird.setScale(1, 0.7 + Math.sin(Date.now() * 0.015) * 0.3);
            },
            onComplete: () => bird.destroy()
        });
    }

    updateLevel2AmbientEffects(time) {
        const { width, height } = this.scale;
        const GROUND_Y = height - 100;

        // ===== BUTTERFLY ANIMATION =====
        if (this.butterflies) {
            this.butterflies.forEach(bf => {
                // Gentle floating path
                bf.x = bf.baseX + Math.sin(time * 0.001 + bf.phase) * 30;
                bf.y = bf.baseY + Math.cos(time * 0.0008 + bf.phase) * 20;
                // Wing flap
                const flapAngle = Math.sin(time * 0.02 + bf.phase) * 0.5;
                bf.wing1.setScale(1, 0.3 + Math.abs(flapAngle));
                bf.wing2.setScale(1, 0.3 + Math.abs(flapAngle));
            });
        }

        // ===== FLOATING LEAVES =====
        if (this.floatingLeaves) {
            this.floatingLeaves.forEach(leaf => {
                leaf.y = leaf.baseY + Math.sin(time * 0.001 + leaf.phase) * 15;
                leaf.x += leaf.speed;
                leaf.angle += leaf.rotSpeed;
                if (leaf.x > 1250) {
                    leaf.x = -20;
                    leaf.baseY = Math.random() * height * 0.4 + height * 0.2;
                }
            });
        }

        // ===== FOUNTAIN PARTICLES =====
        if (this.fountainParticles) {
            this.fountainParticles.forEach(p => {
                const t = (time * 0.005 + p.phase) % (Math.PI * 2);
                const progress = t / (Math.PI * 2);
                p.x = p.baseX + Math.sin(t * 2) * 12;
                p.y = p.baseY - Math.sin(t) * 35 * p.speed;
                p.setAlpha(Math.sin(t) * 0.6);
                p.setScale(1 - progress * 0.5);
            });
        }

        // ===== WATER RIPPLES =====
        if (this.waterRipples) {
            this.waterRipples.forEach(ripple => {
                const scale = 1 + Math.sin(time * 0.003 + ripple.phase) * 0.5;
                ripple.setScale(scale);
                ripple.setAlpha((1 - (scale - 1)) * 0.2);
            });
        }

        // ===== SUN DAPPLES =====
        if (this.sunDapples) {
            this.sunDapples.forEach(dapple => {
                dapple.setAlpha(0.1 + Math.sin(time * 0.002 + dapple.phase) * 0.08);
            });
        }

        // ===== UPDATE SHADOWS =====
        if (this.emmaShadowL2 && this.emma) {
            this.emmaShadowL2.x = this.emma.x;
        }
        if (this.barrettShadowL2 && this.barrett) {
            this.barrettShadowL2.x = this.barrett.x;
        }

        // ===== AMBIENT NOTES (appear near blanket) =====
        if (this.ambientNotes && this.emma && this.emma.x > 900) {
            this.ambientNotes.forEach(note => {
                note.y = note.baseY + Math.sin(time * 0.003 + note.phase) * 10;
                note.setAlpha(0.3 + Math.sin(time * 0.002 + note.phase) * 0.2);
            });
        }
    }

    handleAction() {
        // Jump when on ground - higher jump!
        if (this.emma.body.blocked.down || this.emma.body.touching.down) {
            this.emma.setVelocityY(-600);
        }
    }


    reachBlanket() {
        if (this.reachedBlanket) return;
        this.reachedBlanket = true;
        this.canMove = false;
        this.barrettFollowing = false;

        // Stop Emma
        this.emma.setVelocity(0, 0);

        // Position both characters sitting on the blanket
        this.emma.x = this.blanketX - 15;
        this.barrett.x = this.blanketX + 15;

        // Face each other
        this.emma.setFlipX(true);    // Emma faces right (toward Barrett)
        this.barrett.setFlipX(true);  // Barrett faces left (toward Emma)

        // Sit on blanket scene
        this.cameras.main.stopFollow();

        this.time.delayedCall(500, () => {
            this.dialogue.show("This is nice...", "Barrett", () => {
                this.dialogue.show("It really is...", "Emma", () => {
                    this.showBlanketEnding();
                });
            });
        });
    }

    showBlanketEnding() {
        const { width, height } = this.scale;

        // Dim screen immediately
        const overlay = this.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            0x000000, 0
        );
        overlay.setScrollFactor(0);
        overlay.setDepth(500);

        this.tweens.add({
            targets: overlay,
            alpha: 0.8,
            duration: 1000,
            onComplete: () => {
                // Show transition text
                const transitionText = this.add.text(
                    width / 2,
                    height / 2 - 30,
                    'Sometimes things don\'t go as planned...',
                    {
                        fontSize: '18px',
                        fill: '#fff',
                        align: 'center'
                    }
                ).setOrigin(0.5).setScrollFactor(0).setDepth(501);

                this.time.delayedCall(2000, () => {
                    transitionText.setText('Weeks passed...\n\nthen she texted again');

                    this.time.delayedCall(2500, () => {
                        this.cameras.main.fadeOut(500, 0, 0, 0);
                        this.time.delayedCall(600, () => {
                            this.scene.start('Level3_MizzouDays');
                        });
                    });
                });
            }
        });
    }

    update(time, delta) {
        this.handleMovement();

        // ===== AMBIENT EFFECTS UPDATE =====
        this.updateLevel2AmbientEffects(time);

        // Handle jumping with keyboard (check both touching and blocked)
        const onGround = this.emma.body.touching.down || this.emma.body.blocked.down;
        if ((this.cursors.up.isDown || this.spaceKey.isDown) && onGround) {
            this.emma.setVelocityY(-600);
        }

        // Move clouds manually (no physics)
        this.cloudsGroup.getChildren().forEach(cloud => {
            cloud.x -= 0.3;  // Gentle drift left
            if (cloud.x < -50) {
                cloud.x = 1250;
            }
        });

        // Animate park visitors walking around
        this.updateParkVisitors();

        // ========== MEET BARRETT TRIGGER ==========
        // When Emma reaches Barrett by the statue, trigger the meeting
        if (!this.metBarrett && Math.abs(this.emma.x - this.barrett.x) < 50) {
            this.meetBarrett();
        }

        // ========== BARRETT FOLLOWS EMMA ==========
        // Once they've met, Barrett follows Emma as they walk together
        if (this.barrettFollowing && this.canMove) {
            // Barrett follows slightly behind Emma
            const followDistance = 40;
            const followSpeed = 0.08;

            // Smooth follow - Barrett moves toward a position behind Emma
            const targetX = this.emma.x - followDistance;
            this.barrett.x += (targetX - this.barrett.x) * followSpeed;

            // Match Emma's Y position (on the ground)
            this.barrett.y = this.emma.y + 26;  // Offset for sprite difference

            // Flip Barrett to face the same direction as Emma
            if (this.emma.body.velocity.x > 0) {
                this.barrett.setFlipX(false);  // Facing right
            } else if (this.emma.body.velocity.x < 0) {
                this.barrett.setFlipX(true);   // Facing left
            }
        }

        // Check heart collection manually (no physics)
        this.heartsArray.forEach(heart => {
            if (!heart.collected && Math.abs(this.emma.x - heart.x) < 40 && Math.abs(this.emma.y - heart.y) < 60) {
                heart.collected = true;
                heart.destroy();
                GameState.heartsCollected++;
                this.updateHeartUI();
            }
        });

        // Check if Emma reached the blanket - trigger cutscene
        if (!this.reachedBlanket && this.emma.x >= this.blanketX - 60) {
            this.reachBlanket();
        }
    }

    createParkVisitor(x, y, shirtColor, pantsColor, isSmall = false) {
        const scale = isSmall ? 0.7 : 1;
        const container = this.add.container(x, y);

        // Body/shirt
        const body = this.add.rectangle(0, -12 * scale, 14 * scale, 16 * scale, shirtColor);
        container.add(body);

        // Head
        const head = this.add.circle(0, -24 * scale, 7 * scale, 0xF0D5C0);
        container.add(head);

        // Hair
        const hair = this.add.rectangle(0, -28 * scale, 12 * scale, 6 * scale, 0x5D4037);
        container.add(hair);

        // Legs/pants
        const leftLeg = this.add.rectangle(-4 * scale, 2 * scale, 5 * scale, 12 * scale, pantsColor);
        const rightLeg = this.add.rectangle(4 * scale, 2 * scale, 5 * scale, 12 * scale, pantsColor);
        container.add(leftLeg);
        container.add(rightLeg);

        container.leftLeg = leftLeg;
        container.rightLeg = rightLeg;
        container.walkFrame = 0;

        return container;
    }

    updateParkVisitors() {
        if (!this.parkVisitors) return;

        this.parkVisitors.forEach(visitor => {
            if (visitor.speed !== 0) {
                visitor.x += visitor.speed;

                // Flip based on direction
                visitor.setScale(visitor.speed > 0 ? 1 : -1, 1);

                // Bounce at boundaries
                if (visitor.minX !== undefined && visitor.x < visitor.minX) {
                    visitor.speed = Math.abs(visitor.speed);
                }
                if (visitor.maxX !== undefined && visitor.x > visitor.maxX) {
                    visitor.speed = -Math.abs(visitor.speed);
                }

                // Animate legs (simple walk cycle)
                visitor.walkFrame = (visitor.walkFrame || 0) + Math.abs(visitor.speed) * 0.15;
                const legOffset = Math.sin(visitor.walkFrame) * 3;
                if (visitor.leftLeg) visitor.leftLeg.y = 2 + legOffset;
                if (visitor.rightLeg) visitor.rightLeg.y = 2 - legOffset;

                // Move dog with walker
                if (visitor.dog) {
                    visitor.dog.x = visitor.x + (visitor.speed > 0 ? -25 : 25);
                }

                // Keep couple together
                if (visitor.partner) {
                    visitor.partner.x = visitor.x - 15;
                }
            }

            // Photographer occasionally takes a step
            if (visitor.isPhotographer) {
                visitor.photoTimer = (visitor.photoTimer || 0) + 1;
                if (visitor.photoTimer > 200) {
                    visitor.x += (Math.random() - 0.5) * 20;
                    visitor.photoTimer = 0;
                }
            }
        });
    }

    meetBarrett() {
        this.metBarrett = true;
        this.canMove = false;

        // Stop Emma
        this.emma.setVelocity(0, 0);

        // Barrett turns to face Emma
        this.barrett.setFlipX(true);

        // Short dialogue when they meet
        this.time.delayedCall(300, () => {
            this.dialogue.show("Hey, it's you!", "Barrett", () => {
                this.dialogue.show("Hey old man", "Emma", () => {
                    this.dialogue.show("Let's find a spot in the trees...", "Barrett", () => {
                        this.dialogue.show("I'm not a serial killer, I promise", "Barrett", () => {
                            // Now Barrett follows Emma
                            this.barrettFollowing = true;
                            this.canMove = true;
                            this.barrett.setFlipX(false);  // Face right, ready to walk
                        });
                    });
                });
            });
        });
    }
}

// ============================================
// LEVEL 3: SLU/MIZZOU DAYS - Class Rush & Tornado Chase
// ============================================
class Level3_MizzouDays extends BaseLevel {
    constructor() {
        super('Level3_MizzouDays');
        this.currentPhase = 'intro';  // intro, classRush, tornadoChase
        this.classesCompleted = 0;
        this.totalClasses = 4;
        this.currentClass = null;
        this.timeRemaining = 0;
        this.tornadoActive = false;
    }

    create() {
        this.showIntroDialogue();
    }

    showIntroDialogue() {
        const { width, height } = this.scale;

        // Dark background for intro
        const bg = this.add.graphics();
        bg.fillStyle(0x1a1a2e);
        bg.fillRect(0, 0, width, height);

        // Chapter title
        this.add.text(width / 2, 80, 'Chapter 3', {
            fontSize: '14px', fill: '#888'
        }).setOrigin(0.5);

        this.add.text(width / 2, 110, 'SLU / Mizzou Days', {
            fontSize: '24px', fill: '#FFD700', fontStyle: 'bold'
        }).setOrigin(0.5);

        // Setup dialogue
        this.dialogue = new DialogueBox(this);

        this.cameras.main.fadeIn(500);

        // Start intro dialogue
        this.time.delayedCall(800, () => {
            this.dialogue.show("While Barrett learned to be a techfreakazoid...", "", () => {
                this.dialogue.show("Emma studied hard at SLU and Mizzou!", "", () => {
                    this.dialogue.show("She's working towards being a meteorologist!", "", () => {
                        this.dialogue.show("But first... she has to survive COLLEGE.", "", () => {
                            this.startClassRush();
                        });
                    });
                });
            });
        });
    }

    startClassRush() {
        const { width, height } = this.scale;
        this.currentPhase = 'classRush';

        // Clear scene
        this.children.removeAll();

        const bg = this.add.graphics();

        // ========== BEAUTIFUL SKY WITH CLOUDS ==========
        // Gradient sky - bright blue fading to lighter horizon
        bg.fillGradientStyle(0x1E90FF, 0x1E90FF, 0x87CEEB, 0x87CEEB, 1);
        bg.fillRect(0, 0, width, height - 100);

        // ========== BRIGHT SUN ==========
        // Outer glow
        this.add.circle(width - 50, 60, 50, 0xFFFF66, 0.2);
        this.add.circle(width - 50, 60, 35, 0xFFFF88, 0.3);
        // Sun body
        this.add.circle(width - 50, 60, 22, 0xFFDD44);
        this.add.circle(width - 50, 60, 18, 0xFFEE66);
        // Sun highlight
        this.add.circle(width - 55, 55, 6, 0xFFFFAA, 0.7);
        // Sun rays
        for (let i = 0; i < 8; i++) {
            const angle = (i * 45) * Math.PI / 180;
            const rayLength = 12 + (i % 2) * 8;
            const x1 = width - 50 + Math.cos(angle) * 25;
            const y1 = 60 + Math.sin(angle) * 25;
            const x2 = width - 50 + Math.cos(angle) * (25 + rayLength);
            const y2 = 60 + Math.sin(angle) * (25 + rayLength);
            bg.lineStyle(3, 0xFFDD44, 0.6);
            bg.lineBetween(x1, y1, x2, y2);
        }

        // Fluffy clouds with depth
        [[40, 35], [120, 50], [200, 40], [280, 55], [340, 38]].forEach(([cx, cy]) => {
            // Cloud shadow
            this.add.ellipse(cx + 2, cy + 2, 35, 14, 0x6B9EAF, 0.3);
            // Main cloud
            this.add.ellipse(cx, cy, 35, 14, 0xFFFFFF, 0.9);
            this.add.ellipse(cx - 12, cy + 4, 22, 10, 0xFFFFFF, 0.85);
            this.add.ellipse(cx + 14, cy + 3, 25, 11, 0xFFFFFF, 0.85);
            // Cloud highlight
            this.add.ellipse(cx - 4, cy - 4, 18, 7, 0xFFFFFF, 1);
        });

        // ========== CAMPUS BUILDINGS WITH POLISHED GRAPHICS ==========
        // Ground level is at height - 100, buildings need to extend down to it
        const groundY = height - 100;

        // ===== SLU CLOCK TOWER (Chemistry - left) =====
        // Building shadow
        this.add.ellipse(60, groundY, 70, 12, 0x000000, 0.2);

        // Main tower body with brick gradient - extends to ground
        bg.fillGradientStyle(0x7A2A2A, 0x8B3A3A, 0x7A2A2A, 0x8B3A3A, 1);
        bg.fillRect(30, 100, 60, groundY - 100);
        // Brick texture highlights
        for (let row = 0; row < 20; row++) {
            this.add.rectangle(33, 105 + row * 22, 54, 1, 0x6A2020, 0.3);
        }
        // Tower depth shadow on right
        bg.fillStyle(0x5A1A1A, 0.5);
        bg.fillRect(85, 100, 5, groundY - 100);

        // Ornate peaked roof with shading
        bg.fillGradientStyle(0x3A3A3A, 0x5A5A5A, 0x3A3A3A, 0x5A5A5A, 1);
        bg.beginPath();
        bg.moveTo(25, 100);
        bg.lineTo(60, 50);
        bg.lineTo(95, 100);
        bg.closePath();
        bg.fill();
        // Roof highlight
        this.add.polygon(60, 75, [[0, -25], [-15, 25], [0, 20]], 0x6A6A6A, 0.4);

        // Ornate clock face with glow
        this.add.circle(60, 130, 20, 0xFFF8DC, 0.3);  // Glow
        this.add.circle(60, 130, 18, 0xFFFACD);
        this.add.circle(60, 130, 15, 0xFFFFF0);
        // Clock numerals hint
        this.add.circle(60, 130, 13, 0xFFF8E7);
        // Clock hands with shadow
        bg.lineStyle(3, 0x2A2A1A);
        bg.lineBetween(60, 130, 60, 117);
        bg.lineBetween(60, 130, 71, 130);

        // Gothic arched windows with glow
        for (let j = 0; j < 3; j++) {
            // Window glow
            this.add.rectangle(48, 180 + j * 50, 20, 34, 0xFFEB3B, 0.3);
            this.add.rectangle(72, 180 + j * 50, 20, 34, 0xFFEB3B, 0.3);
            // Window frames
            this.add.rectangle(48, 180 + j * 50, 16, 30, 0xFFD54F);
            this.add.rectangle(72, 180 + j * 50, 16, 30, 0xFFD54F);
            // Window dividers
            this.add.rectangle(48, 180 + j * 50, 2, 30, 0x5D4037);
            this.add.rectangle(72, 180 + j * 50, 2, 30, 0x5D4037);
        }

        // Fountain with water effect
        this.add.ellipse(60, height - 113, 55, 18, 0x606060);
        this.add.ellipse(60, height - 115, 50, 15, 0x707070);
        this.add.ellipse(60, height - 117, 42, 12, 0x4A90A4);
        // Water shimmer
        this.add.ellipse(55, height - 118, 15, 4, 0x7AC0D4, 0.5);
        // Fountain spray
        this.add.circle(60, height - 128, 5, 0xFFFFFF, 0.6);
        this.add.circle(60, height - 135, 3, 0xFFFFFF, 0.4);

        this.add.text(60, 80, 'CHEM', { fontSize: '10px', fill: '#fff', stroke: '#000', strokeThickness: 2 }).setOrigin(0.5);

        // ===== SLU GOTHIC BUILDING (Math - center-left) =====
        // Building shadow
        this.add.ellipse(145, groundY, 80, 14, 0x000000, 0.2);

        // Main body with gradient brick - extends to ground
        bg.fillGradientStyle(0x7A2A2A, 0x8B3A3A, 0x7A2A2A, 0x8B3A3A, 1);
        bg.fillRect(115, 140, 70, groundY - 140);

        // Twin towers with depth - extend to ground
        bg.fillGradientStyle(0x8B3A3A, 0x9B4A4A, 0x8B3A3A, 0x9B4A4A, 1);
        bg.fillRect(110, 120, 25, groundY - 120);
        bg.fillRect(155, 120, 25, groundY - 120);
        // Tower depth shadows
        this.add.rectangle(132, (120 + groundY) / 2, 3, groundY - 120, 0x5A1A1A, 0.4);
        this.add.rectangle(177, (120 + groundY) / 2, 3, groundY - 120, 0x5A1A1A, 0.4);

        // Ornate peaked roofs with shading
        bg.fillGradientStyle(0x3A3A3A, 0x5A5A5A, 0x3A3A3A, 0x5A5A5A, 1);
        bg.beginPath();
        bg.moveTo(107, 120);
        bg.lineTo(122, 85);
        bg.lineTo(138, 120);
        bg.closePath();
        bg.fill();
        bg.beginPath();
        bg.moveTo(152, 120);
        bg.lineTo(167, 85);
        bg.lineTo(183, 120);
        bg.closePath();
        bg.fill();

        // Gothic arched windows with warm glow
        for (let j = 0; j < 4; j++) {
            this.add.rectangle(145, 168 + j * 40, 34, 29, 0xFFEB3B, 0.3);  // Glow
            this.add.rectangle(145, 168 + j * 40, 30, 25, 0xFFD54F);
            this.add.rectangle(145, 168 + j * 40, 2, 25, 0x5D4037);  // Divider
        }

        // Tower windows
        for (let j = 0; j < 3; j++) {
            this.add.rectangle(122, 150 + j * 55, 10, 20, 0xFFD54F);
            this.add.rectangle(167, 150 + j * 55, 10, 20, 0xFFD54F);
        }

        this.add.text(150, 70, 'MATH', { fontSize: '10px', fill: '#fff', stroke: '#000', strokeThickness: 2 }).setOrigin(0.5);

        // ===== MIZZOU JESSE HALL + THE FAMOUS COLUMNS =====
        // Building shadow
        this.add.ellipse(235, groundY, 90, 16, 0x000000, 0.2);

        // Jesse Hall main building with gradient brick - extends to ground
        bg.fillGradientStyle(0x8B4020, 0xA0522D, 0x8B4020, 0xA0522D, 1);
        bg.fillRect(195, 130, 80, groundY - 130);
        // Building depth
        this.add.rectangle(272, (130 + groundY) / 2, 4, groundY - 130, 0x6A3018, 0.5);

        // Grand white dome with gradient shading
        this.add.ellipse(235, 122, 40, 30, 0xE8E8E8);  // Shadow
        this.add.ellipse(235, 120, 38, 28, 0xF5F5F5);
        this.add.ellipse(235, 117, 32, 22, 0xFAFAFA);
        // Inner dome
        this.add.ellipse(235, 115, 22, 14, 0xE8E8E8);
        this.add.ellipse(235, 114, 20, 12, 0xF0F0F0);
        // Dome ornament with gold shine
        this.add.circle(235, 100, 5, 0xDAA520);
        this.add.circle(234, 99, 2, 0xFFD700, 0.7);  // Highlight

        // Windows with warm evening glow
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                const wx = 211 + i * 25;
                const wy = 164 + j * 40;
                this.add.rectangle(wx, wy, 22, 32, 0xFFEB3B, 0.25);  // Glow
                this.add.rectangle(wx, wy, 18, 28, 0xFFD54F);
                this.add.rectangle(wx, wy, 2, 28, 0x5D4037);  // Divider
            }
        }

        // ★★★ THE ICONIC MIZZOU COLUMNS ★★★
        // Stone platform with depth
        bg.fillGradientStyle(0xB0B0B0, 0xD3D3D3, 0xB0B0B0, 0xD3D3D3, 1);
        bg.fillRect(186, height - 68, 100, 12);
        this.add.rectangle(236, height - 73, 96, 4, 0xC8C8C8);

        for (let i = 0; i < 6; i++) {
            const colX = 200 + i * 13;
            // Column shadow
            this.add.rectangle(colX + 3, height - 117, 10, 95, 0x888888, 0.4);
            // Column base
            this.add.rectangle(colX, height - 72, 16, 8, 0xE0E0E0);
            // Column shaft with 3D effect
            this.add.rectangle(colX - 3, height - 117, 4, 85, 0xFAFAFA);  // Highlight
            this.add.rectangle(colX, height - 117, 6, 85, 0xF0F0F0);      // Center
            this.add.rectangle(colX + 3, height - 117, 4, 85, 0xD8D8D8);  // Shadow
            // Ionic capital
            this.add.rectangle(colX, height - 162, 16, 6, 0xF0F0F0);
            this.add.ellipse(colX - 5, height - 164, 6, 4, 0xE8E8E8);
            this.add.ellipse(colX + 5, height - 164, 6, 4, 0xE8E8E8);
        }

        this.add.text(235, height - 178, 'THE COLUMNS', {
            fontSize: '8px', fill: '#FFD700',
            stroke: '#2A2A2A', strokeThickness: 2
        }).setOrigin(0.5);
        this.add.text(235, 85, 'CAFE', { fontSize: '10px', fill: '#fff', stroke: '#000', strokeThickness: 2 }).setOrigin(0.5);

        // ===== MIZZOU METEOROLOGY BUILDING =====
        // Building shadow
        this.add.ellipse(310, groundY, 65, 14, 0x000000, 0.2);

        // Main building with gradient - extends to ground
        bg.fillGradientStyle(0x8B4020, 0xA0522D, 0x8B4020, 0xA0522D, 1);
        bg.fillRect(290, 140, 60, groundY - 140);

        // Modern glass addition with blue tint - extends to ground
        bg.fillGradientStyle(0x2980B9, 0x3498DB, 0x2980B9, 0x3498DB, 1);
        bg.fillRect(280, 160, 22, groundY - 160);
        // Glass reflection
        this.add.rectangle(285, 245, 4, 160, 0x5DADE2, 0.4);

        // Windows with glow
        for (let j = 0; j < 4; j++) {
            const wy = 169 + j * 40;
            this.add.rectangle(307, wy, 24, 32, 0xFFEB3B, 0.25);
            this.add.rectangle(307, wy, 20, 28, 0xFFD54F);
            this.add.rectangle(333, wy, 24, 32, 0xFFEB3B, 0.25);
            this.add.rectangle(333, wy, 20, 28, 0xFFD54F);
        }

        // Radar dome with metallic sheen
        this.add.ellipse(320, 132, 26, 18, 0xE0E0E0);
        this.add.ellipse(320, 130, 24, 16, 0xF0F0F0);
        this.add.ellipse(318, 128, 10, 8, 0xFFFFFF, 0.5);  // Highlight

        // Weather vane with detail
        bg.lineStyle(3, 0x404040);
        bg.lineBetween(320, 115, 320, 95);
        this.add.image(320, 85, 'tornado').setScale(0.6);

        this.add.text(320, 125, 'METEOROLOGY', { fontSize: '6px', fill: '#fff', stroke: '#1A5276', strokeThickness: 2 }).setOrigin(0.5);

        // ========== LUSH CAMPUS GRASS ==========
        bg.fillGradientStyle(0x388E3C, 0x4CAF50, 0x388E3C, 0x4CAF50, 1);
        bg.fillRect(0, height - 100, width, 50);

        // Grass texture stripes
        for (let i = 0; i < width; i += 25) {
            bg.fillStyle(i % 50 === 0 ? 0x43A047 : 0x2E7D32, 0.4);
            bg.fillRect(i, height - 100, 12, 50);
        }

        // Individual grass blades
        for (let i = 0; i < width; i += 6) {
            const h = 3 + Math.random() * 5;
            this.add.rectangle(i, height - 100 - h / 2, 2, h, 0x1B5E20, 0.5);
        }

        // ========== RED BRICK WALKING PATHS ==========
        bg.fillGradientStyle(0x6D3517, 0x8B4513, 0x6D3517, 0x8B4513, 1);
        bg.fillRect(0, height - 75, width, 30);

        // Brick pattern
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 20; col++) {
                const offset = row % 2 === 0 ? 0 : 10;
                this.add.rectangle(10 + col * 20 + offset, height - 72 + row * 10, 18, 8, 0x7A3D1D, 0.3);
            }
        }

        // Concrete paths to buildings with texture
        [[62, -110], [150, -110], [235, -110], [320, -110]].forEach(([px, py]) => {
            bg.fillGradientStyle(0x909090, 0xA0A0A0, 0x909090, 0xA0A0A0, 1);
            bg.fillRect(px - 8, height + py, 16, 40);
            // Path texture lines
            this.add.rectangle(px, height + py + 10, 14, 1, 0x808080, 0.5);
            this.add.rectangle(px, height + py + 25, 14, 1, 0x808080, 0.5);
        });

        // ========== DECORATIVE TREES & BUSHES ==========
        [[100, height - 88], [190, height - 86], [280, height - 88]].forEach(([tx, ty]) => {
            // Bush shadow
            this.add.ellipse(tx + 2, ty + 8, 18, 6, 0x000000, 0.15);
            // Layered bush
            this.add.circle(tx, ty, 10, 0x1B5E20);
            this.add.circle(tx - 5, ty + 3, 8, 0x2E7D32);
            this.add.circle(tx + 5, ty + 2, 8, 0x388E3C);
            this.add.circle(tx, ty - 4, 7, 0x43A047, 0.8);  // Highlight
        });

        // Sidewalk with texture
        bg.fillGradientStyle(0xA0A0A0, 0xBDBDBD, 0xA0A0A0, 0xBDBDBD, 1);
        bg.fillRect(30, height - 55, width - 60, 10);
        // Sidewalk cracks
        for (let i = 0; i < 6; i++) {
            this.add.rectangle(50 + i * 50, height - 50, 1, 10, 0x909090, 0.4);
        }

        // ========== STYLED UI ==========
        // Title with shadow
        this.add.text(width / 2 + 1, 21, 'Get to class on time!', {
            fontSize: '16px', fill: '#000'
        }).setOrigin(0.5).setAlpha(0.3);
        this.add.text(width / 2, 20, 'Get to class on time!', {
            fontSize: '16px', fill: '#fff',
            stroke: '#1A5276', strokeThickness: 3
        }).setOrigin(0.5);

        // Timer display with glow effect
        this.timerText = this.add.text(width / 2, 45, 'TIME: --', {
            fontSize: '20px', fill: '#FF6B6B',
            stroke: '#2A0A0A', strokeThickness: 3
        }).setOrigin(0.5);

        // Classes completed
        this.classText = this.add.text(width - 10, 20, 'Classes: 0/' + this.totalClasses, {
            fontSize: '14px', fill: '#fff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(1, 0);

        // Current objective
        this.objectiveText = this.add.text(width / 2, 70, '', {
            fontSize: '12px', fill: '#FFD700',
            stroke: '#2A2A1A', strokeThickness: 2
        }).setOrigin(0.5);

        // Emma's quote bubble with better styling
        this.quoteBubble = this.add.text(width / 2, height - 30, '', {
            fontSize: '11px', fill: '#fff',
            backgroundColor: '#2A2A2A',
            padding: { x: 10, y: 6 }
        }).setOrigin(0.5).setAlpha(0);

        // ========== SLU ENTRANCE ARCH (Polished) ==========
        // Arch posts with brick texture
        bg.fillGradientStyle(0x7A2A2A, 0x8B3A3A, 0x7A2A2A, 0x8B3A3A, 1);
        bg.fillRect(5, height - 180, 14, 62);
        bg.fillRect(93, height - 180, 14, 62);

        // Golden arch top with shine
        bg.fillGradientStyle(0xB8860B, 0xDAA520, 0xB8860B, 0xDAA520, 1);
        bg.fillRect(5, height - 188, 102, 12);
        this.add.rectangle(56, height - 185, 90, 3, 0xFFD700, 0.5);  // Highlight

        this.add.text(55, height - 200, 'SAINT LOUIS\nUNIVERSITY', {
            fontSize: '7px', fill: '#FFD700', align: 'center',
            stroke: '#2A1A0A', strokeThickness: 2
        }).setOrigin(0.5);

        // ========== PARKING LOT (Polished Asphalt) ==========
        bg.fillGradientStyle(0x2A2A2A, 0x3A3A3A, 0x2A2A2A, 0x3A3A3A, 1);
        bg.fillRect(0, height - 50, width, 50);

        // Asphalt texture
        for (let i = 0; i < 30; i++) {
            this.add.circle(
                Math.random() * width,
                height - 25 + Math.random() * 25,
                1, 0x4A4A4A, 0.4
            );
        }

        // Crisp parking lines
        bg.lineStyle(3, 0xFFFFFF, 0.9);
        for (let i = 0; i < 8; i++) {
            bg.lineBetween(20 + i * 45, height - 48, 20 + i * 45, height - 8);
        }

        // Emma's car with polish
        this.emmaCar = this.add.container(40, height - 30);
        const carBody = this.add.graphics();
        // Car shadow
        carBody.fillStyle(0x000000, 0.3);
        carBody.fillEllipse(0, 14, 35, 8);
        // Main body with gradient look
        carBody.fillStyle(0x1565C0);
        carBody.fillRect(-16, -9, 32, 18);
        carBody.fillStyle(0x1976D2);
        carBody.fillRect(-15, -8, 30, 16);
        // Roof
        carBody.fillStyle(0x1565C0);
        carBody.fillRect(-11, -16, 22, 10);
        // Windows with reflection
        carBody.fillStyle(0x90CAF9);
        carBody.fillRect(-9, -14, 18, 7);
        carBody.fillStyle(0xBBDEFB, 0.5);
        carBody.fillRect(-8, -14, 6, 3);
        // Wheels with detail
        this.add.circle(-10, 8, 5, 0x1a1a1a);
        this.add.circle(-10, 8, 3, 0x333333);
        this.add.circle(10, 8, 5, 0x1a1a1a);
        this.add.circle(10, 8, 3, 0x333333);
        // Headlights
        this.add.rectangle(15, -4, 3, 4, 0xFFEB3B);
        this.emmaCar.add(carBody);

        // Parking sign with better styling
        this.add.text(width / 2, height - 43, 'STUDENT PARKING (0.5 miles from buildings)', {
            fontSize: '8px', fill: '#FFD700',
            stroke: '#1A1A1A', strokeThickness: 2
        }).setOrigin(0.5);

        // ========== BUILDING DOORS (Polished Entry Points) ==========
        const doorY = height - 105;

        [62, 150, 235, 320].forEach((dx) => {
            // Door frame shadow
            this.add.rectangle(dx + 1, doorY - 4, 16, 22, 0x2A1A0A, 0.5);
            // Wooden door
            this.add.rectangle(dx, doorY - 5, 14, 20, 0x5D4037);
            this.add.rectangle(dx, doorY - 5, 12, 18, 0x6D4C41);
            // Door handle
            this.add.circle(dx + 4, doorY - 5, 2, 0xDAA520);
            // Door glow indicator
            this.add.image(dx, doorY - 28, 'door').setScale(0.5);
        });

        // ========== CLASS ZONES (at the doors) ==========
        this.classZones = [
            { x: 62, y: doorY, name: 'Chemistry', quote: "Chemistry is chemisTRY!", icon: 'sparkle',
              walkQuotes: ["This is like a mile walk!", "Why is parking SO far?!"] },
            { x: 150, y: doorY, name: 'Math', quote: "Why does math have letters now?!", icon: 'sparkle',
              walkQuotes: ["How am I supposed to get there on time?!", "My legs hurt already"] },
            { x: 235, y: doorY, name: 'Cafeteria', quote: "I NEED a Caesar salad!", icon: 'salad',
              walkQuotes: ["I'm gonna be SO late!", "Who designed this campus?!"] },
            { x: 320, y: doorY, name: 'Meteorology', quote: "This is MY class!", icon: 'tornado',
              walkQuotes: ["FINALLY my favorite class!", "At least this one's worth the walk"] }
        ];

        // Create visible door markers that pulse
        this.classZones.forEach((zone, i) => {
            // Glowing circle around door
            const marker = this.add.circle(zone.x, zone.y, 20, 0xFFD700, 0);
            zone.marker = marker;
            zone.index = i;

            // Arrow pointing to door (using sparkle as indicator)
            zone.arrow = this.add.image(zone.x, zone.y - 40, 'sparkle').setScale(1.5).setAlpha(0);
        });

        // ========== EMMA (starts at her car in parking lot) ==========
        this.createEmma(60, height - 55);
        this.emma.body.setAllowGravity(false);

        // Setup controls
        this.setupControls();
        this.createHeartUI();
        this.dialogue = new DialogueBox(this);

        this.cameras.main.fadeIn(300);

        // ========== CAMPUS AMBIENT EFFECTS ==========
        this.createCampusAmbientEffects(width, height);

        // Show initial parking complaint
        this.time.delayedCall(300, () => {
            this.showQuote("Ugh, I had to park SO far away!");
            this.time.delayedCall(2000, () => this.assignNextClass());
        });
    }

    createCampusAmbientEffects(width, height) {
        // ===== ANIMATED CLOUDS =====
        this.campusClouds = [];
        [[40, 35], [120, 50], [200, 40], [280, 55], [340, 38]].forEach(([cx, cy], i) => {
            const cloud = this.add.container(cx, cy);
            cloud.add(this.add.ellipse(0, 0, 35, 14, 0xFFFFFF, 0.85));
            cloud.add(this.add.ellipse(-12, 4, 22, 10, 0xFFFFFF, 0.8));
            cloud.add(this.add.ellipse(14, 3, 25, 11, 0xFFFFFF, 0.8));
            cloud.speed = 0.08 + i * 0.02;
            cloud.startX = cx;
            this.campusClouds.push(cloud);
        });

        // ===== CLOCK TOWER ANIMATION =====
        this.clockHands = this.add.container(60, 130);
        const minuteHand = this.add.rectangle(0, -6, 2, 12, 0x000000);
        const hourHand = this.add.rectangle(4, 0, 8, 2, 0x000000);
        this.clockHands.add([minuteHand, hourHand]);

        // ===== FOUNTAIN WATER ANIMATION =====
        this.fountainDrops = [];
        for (let i = 0; i < 6; i++) {
            const drop = this.add.circle(
                60 + (Math.random() - 0.5) * 30,
                height - 120,
                Math.random() * 2 + 1,
                0x87CEEB,
                0
            );
            drop.baseX = 60;
            drop.baseY = height - 120;
            drop.phase = Math.random() * Math.PI * 2;
            this.fountainDrops.push(drop);
        }

        // ===== WINDOW LIGHT FLICKER =====
        this.windowLights = [];
        // Add some glowing windows that flicker
        [[48, 180], [72, 180], [48, 230], [72, 230], [145, 168], [145, 208]].forEach(([wx, wy], i) => {
            const glow = this.add.rectangle(wx, wy, 20, 34, 0xFFEB3B, 0);
            glow.phase = i * 0.3;
            this.windowLights.push(glow);
        });

        // ===== BIRDS ON WIRES =====
        this.birdsOnWire = [];
        for (let i = 0; i < 4; i++) {
            const bird = this.add.image(100 + i * 50, height - 200, 'bird').setScale(0.6);
            bird.setAlpha(0.8);
            bird.baseY = bird.y;
            bird.phase = i * 0.5;
            this.birdsOnWire.push(bird);
        }

        // ===== STUDENTS WALKING (background) =====
        this.bgStudents = [];
        for (let i = 0; i < 3; i++) {
            const student = this.add.circle(
                50 + i * 120,
                height - 90,
                4,
                [0xFF6B6B, 0x4ECDC4, 0x9370DB][i]
            );
            student.speed = (Math.random() - 0.5) * 0.5;
            student.minX = 30;
            student.maxX = width - 30;
            this.bgStudents.push(student);
        }

        // ===== EMMA SHADOW =====
        this.emmaShadowCampus = this.add.ellipse(this.emma.x, height - 50, 24, 8, 0x000000, 0.25);

        // ===== PARKING LOT HEAT SHIMMER =====
        this.parkingShimmer = [];
        for (let i = 0; i < 4; i++) {
            const shimmer = this.add.rectangle(
                60 + i * 80,
                height - 35,
                50,
                6,
                0xFFFFFF,
                0
            );
            shimmer.phase = i * 0.4;
            this.parkingShimmer.push(shimmer);
        }

        // ===== RADAR DOME ROTATION (on meteorology building) =====
        this.radarAngle = 0;
    }

    updateCampusAmbientEffects(time) {
        const { width, height } = this.scale;

        // ===== CLOUD DRIFT =====
        if (this.campusClouds) {
            this.campusClouds.forEach(cloud => {
                cloud.x += cloud.speed;
                if (cloud.x > width + 40) cloud.x = -40;
            });
        }

        // ===== CLOCK HANDS =====
        if (this.clockHands) {
            this.clockHands.angle = (time * 0.01) % 360;
        }

        // ===== FOUNTAIN DROPS =====
        if (this.fountainDrops) {
            this.fountainDrops.forEach(drop => {
                const t = (time * 0.004 + drop.phase) % (Math.PI * 2);
                drop.x = drop.baseX + Math.sin(t * 3) * 15;
                drop.y = drop.baseY - Math.abs(Math.sin(t)) * 25;
                drop.setAlpha(Math.sin(t) * 0.5);
            });
        }

        // ===== WINDOW GLOW =====
        if (this.windowLights) {
            this.windowLights.forEach(glow => {
                glow.setAlpha(0.15 + Math.sin(time * 0.002 + glow.phase) * 0.1);
            });
        }

        // ===== BIRDS BOBBING =====
        if (this.birdsOnWire) {
            this.birdsOnWire.forEach(bird => {
                bird.y = bird.baseY + Math.sin(time * 0.003 + bird.phase) * 3;
            });
        }

        // ===== BG STUDENTS =====
        if (this.bgStudents) {
            this.bgStudents.forEach(student => {
                student.x += student.speed;
                if (student.x < student.minX || student.x > student.maxX) {
                    student.speed *= -1;
                }
            });
        }

        // ===== EMMA SHADOW =====
        if (this.emmaShadowCampus && this.emma) {
            this.emmaShadowCampus.x = this.emma.x;
            this.emmaShadowCampus.y = this.emma.y + 20;
        }

        // ===== HEAT SHIMMER =====
        if (this.parkingShimmer) {
            this.parkingShimmer.forEach(shimmer => {
                shimmer.setAlpha(0.03 + Math.sin(time * 0.004 + shimmer.phase) * 0.02);
                shimmer.scaleX = 1 + Math.sin(time * 0.003 + shimmer.phase) * 0.2;
            });
        }
    }

    assignNextClass() {
        if (this.classesCompleted >= this.totalClasses) {
            this.completeClassRush();
            return;
        }

        // Pick next class (in order for simplicity)
        this.currentClass = this.classZones[this.classesCompleted];
        this.currentClass.marker.setFillStyle(0xFFD700, 0.5);

        // Highlight with pulsing circle
        this.tweens.add({
            targets: this.currentClass.marker,
            alpha: 0.8,
            scale: 1.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Show arrow pointing to door
        this.currentClass.arrow.setAlpha(1);
        this.tweens.add({
            targets: this.currentClass.arrow,
            y: this.currentClass.arrow.y + 10,
            duration: 400,
            yoyo: true,
            repeat: -1
        });

        // Set timer (more time since parking is far!)
        this.timeRemaining = 10 + (this.totalClasses - this.classesCompleted) * 2;

        // Update UI
        this.objectiveText.setText('Run to ' + this.currentClass.emoji + ' ' + this.currentClass.name + '!');

        // Show walking complaint first, then class-specific quote
        const walkQuote = Phaser.Utils.Array.GetRandom(this.currentClass.walkQuotes);
        this.showQuote(walkQuote);

        // Show class quote after walk complaint
        this.time.delayedCall(2500, () => {
            if (this.currentClass && this.canMove) {
                this.showQuote(this.currentClass.quote);
            }
        });

        this.canMove = true;
    }

    showQuote(text) {
        this.quoteBubble.setText(text);
        this.quoteBubble.setAlpha(1);

        this.time.delayedCall(2500, () => {
            this.tweens.add({
                targets: this.quoteBubble,
                alpha: 0,
                duration: 300
            });
        });
    }

    checkClassReached() {
        if (!this.currentClass || !this.emma || !this.canMove) return;

        const dist = Phaser.Math.Distance.Between(
            this.emma.x, this.emma.y,
            this.currentClass.x, this.currentClass.y
        );

        // Larger detection radius for the doors (25 pixels)
        if (dist < 25) {
            this.reachClass();
        }
    }

    reachClass() {
        this.canMove = false;

        // Stop marker and arrow animations
        this.tweens.killTweensOf(this.currentClass.marker);
        this.tweens.killTweensOf(this.currentClass.arrow);
        this.currentClass.marker.setAlpha(0);
        this.currentClass.arrow.setAlpha(0);

        // Success!
        this.classesCompleted++;
        GameState.heartsCollected++;
        this.updateHeartUI();
        this.classText.setText('Classes: ' + this.classesCompleted + '/' + this.totalClasses);

        // Emma enters building animation (shrinks into door)
        this.tweens.add({
            targets: this.emma,
            scaleX: 0.3,
            scaleY: 0.3,
            alpha: 0.5,
            y: this.currentClass.y - 10,
            duration: 300,
            onComplete: () => {
                // Show success message
                const successText = this.add.text(this.currentClass.x, this.currentClass.y - 50, '✓ Made it to class!', {
                    fontSize: '14px', fill: '#4CAF50',
                    stroke: '#000', strokeThickness: 2
                }).setOrigin(0.5);

                this.tweens.add({
                    targets: successText,
                    y: successText.y - 30,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => successText.destroy()
                });

                // Door opens effect
                const doorOpen = this.add.image(this.currentClass.x, this.currentClass.y - 20, 'door').setScale(0.8);
                const doorSparkle = this.add.image(this.currentClass.x + 12, this.currentClass.y - 20, 'sparkle').setScale(1.2);
                this.time.delayedCall(800, () => { doorOpen.destroy(); doorSparkle.destroy(); });

                // Reset Emma and move to next class
                this.time.delayedCall(1000, () => {
                    // Emma "exits" building and goes back to parking lot
                    this.emma.setScale(1);
                    this.emma.setAlpha(1);
                    this.emma.x = 60;
                    this.emma.y = this.scale.height - 55;
                    this.assignNextClass();
                });
            }
        });
    }

    failClass() {
        this.canMove = false;

        // Fail message
        const failText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'LATE!\nTry again!', {
            fontSize: '24px', fill: '#FF6B6B', align: 'center',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);

        this.time.delayedCall(1500, () => {
            failText.destroy();
            // Reset timer and try again
            this.assignNextClass();
        });
    }

    completeClassRush() {
        this.canMove = false;
        this.currentPhase = 'transition';

        const { width, height } = this.scale;

        // Dim screen
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0);
        this.tweens.add({
            targets: overlay,
            alpha: 0.7,
            duration: 500,
            onComplete: () => {
                this.add.image(width / 2 - 100, height / 2 - 30, 'grad_cap').setScale(1.5);
                this.add.text(width / 2, height / 2 - 30, 'Classes Complete!', {
                    fontSize: '20px', fill: '#FFD700',
                    stroke: '#000', strokeThickness: 2
                }).setOrigin(0.5);

                this.add.text(width / 2, height / 2 + 10, 'Now for the fun part...', {
                    fontSize: '14px', fill: '#fff'
                }).setOrigin(0.5);

                this.add.image(width / 2 - 80, height / 2 + 40, 'tornado').setScale(0.8);
                this.add.text(width / 2 + 10, height / 2 + 40, 'TORNADO CHASE!', {
                    fontSize: '18px', fill: '#FF6B6B'
                }).setOrigin(0.5);
                this.add.image(width / 2 + 100, height / 2 + 40, 'tornado').setScale(0.8).setFlipX(true);

                this.time.delayedCall(2500, () => this.startTornadoChase());
            }
        });
    }

    startTornadoChase() {
        const { width, height } = this.scale;
        this.currentPhase = 'tornadoChase';
        this.tornadoActive = true;

        // Clear scene
        this.children.removeAll();

        const bg = this.add.graphics();

        // ========== DRAMATIC STORMY SKY ==========
        // Dark ominous gradient sky
        bg.fillGradientStyle(0x1A252F, 0x2C3E50, 0x1A252F, 0x2C3E50, 1);
        bg.fillRect(0, 0, width, height);

        // Storm clouds layer
        bg.fillGradientStyle(0x34495E, 0x2C3E50, 0x34495E, 0x2C3E50, 0.6);
        bg.fillRect(0, 0, width, 80);

        // Ominous green tint (tornado weather!)
        this.add.rectangle(width / 2, height / 2, width, height, 0x2E4A3A, 0.15);

        // Lightning flash effect layer (animated later)
        this.lightningFlash = this.add.rectangle(width / 2, height / 2, width, height, 0xFFFFFF, 0);

        // ========== MISSOURI STATE WITH DETAILED TERRAIN ==========
        // Main state body with gradient
        bg.fillGradientStyle(0x2D5A2D, 0x3D6B3D, 0x2D5A2D, 0x3D6B3D, 1);
        bg.fillRect(20, 60, width - 40, height - 120);

        // KC bump on west side
        bg.fillGradientStyle(0x3D6B3D, 0x4D7B4D, 0x3D6B3D, 0x4D7B4D, 1);
        bg.fillRect(5, 180, 28, 155);

        // Boot heel on southeast with gradient
        bg.fillStyle(0x3D6B3D);
        bg.beginPath();
        bg.moveTo(width - 65, height - 105);
        bg.lineTo(width - 18, height - 105);
        bg.lineTo(width - 18, height - 48);
        bg.lineTo(width - 65, height - 78);
        bg.closePath();
        bg.fill();

        // Farmland checkerboard pattern with varied greens
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 6; j++) {
                const shade = (i + j) % 3;
                const color = shade === 0 ? 0x4A7C4A : shade === 1 ? 0x3A6A3A : 0x5A8C5A;
                if ((i + j) % 2 === 0) {
                    this.add.rectangle(48 + i * 40, 115 + j * 80, 35, 70, color, 0.6);
                }
            }
        }

        // Dirt roads between fields
        for (let i = 0; i < 4; i++) {
            bg.fillStyle(0x8B7355, 0.4);
            bg.fillRect(25, 100 + i * 120, width - 50, 3);
            bg.fillRect(80 + i * 80, 65, 2, height - 130);
        }

        // ========== RIVERS WITH REALISTIC WATER ==========
        // Missouri River with gradient water
        bg.fillGradientStyle(0x2E6B7A, 0x4A90A4, 0x2E6B7A, 0x4A90A4, 1);
        bg.fillRect(width / 2 - 5, 60, 10, height - 175);
        // River shimmer
        for (let r = 0; r < 8; r++) {
            this.add.rectangle(width / 2, 80 + r * 50, 6, 15, 0x6BB3D9, 0.3);
        }

        // Mississippi on east side
        bg.fillGradientStyle(0x2E6B7A, 0x4A90A4, 0x2E6B7A, 0x4A90A4, 1);
        bg.fillRect(width - 42, 145, 12, height - 195);
        // Mississippi shimmer
        for (let r = 0; r < 6; r++) {
            this.add.rectangle(width - 36, 165 + r * 60, 8, 20, 0x6BB3D9, 0.3);
        }

        // Confluence at St. Louis
        bg.fillStyle(0x4A90A4);
        bg.fillRect(width - 85, height - 152, 55, 8);

        // ========== CITIES WITH GLOW EFFECTS ==========
        const cities = [
            { x: 50, y: 260, name: 'Kansas City', size: 8 },
            { x: width - 50, y: height - 130, name: 'St. Louis', size: 10 },
            { x: width / 2, y: 200, name: 'Columbia', size: 7 },
            { x: 100, y: height - 120, name: 'Springfield', size: 6 },
            { x: width / 2 + 60, y: 120, name: 'Hannibal', size: 5 },
            { x: 80, y: 140, name: 'St. Joseph', size: 5 }
        ];

        cities.forEach(city => {
            // City glow
            this.add.circle(city.x, city.y, city.size + 4, 0xFFEB3B, 0.2);
            // City marker
            this.add.circle(city.x, city.y, city.size, 0xFFF8E1);
            this.add.circle(city.x, city.y, city.size - 2, 0xFFFFFF);
            // City name with shadow
            this.add.text(city.x + 1, city.y + city.size + 6, city.name, {
                fontSize: '8px', fill: '#000'
            }).setOrigin(0.5).setAlpha(0.4);
            this.add.text(city.x, city.y + city.size + 5, city.name, {
                fontSize: '8px', fill: '#fff',
                stroke: '#1A1A2E', strokeThickness: 2
            }).setOrigin(0.5);
        });

        // ========== POLISHED UI OVERLAY ==========
        // Top bar with gradient
        bg.fillGradientStyle(0x0A0A1A, 0x1A1A2E, 0x0A0A1A, 0x1A1A2E, 0.85);
        bg.fillRect(0, 0, width, 58);
        // Bar bottom edge
        this.add.rectangle(width / 2, 58, width, 2, 0xFF6B6B, 0.5);

        // Title with glow effect
        this.add.image(width / 2 - 85, 16, 'tornado').setScale(0.6);
        this.add.text(width / 2, 16, 'STORM CHASE!', {
            fontSize: '18px', fill: '#FF8888',
            stroke: '#2A0A0A', strokeThickness: 3
        }).setOrigin(0.5);
        this.add.image(width / 2 + 85, 16, 'tornado').setScale(0.6).setFlipX(true);

        this.add.text(width / 2, 40, 'Outrun the tornado in your chase vehicle!', {
            fontSize: '10px', fill: '#C8D6E5',
            stroke: '#0A0A1A', strokeThickness: 1
        }).setOrigin(0.5);

        // Survival timer with styled background
        this.add.rectangle(width - 55, 18, 90, 24, 0x2A2A3E, 0.7);
        this.survivalTime = 0;
        this.survivalTarget = 15;
        this.survivalText = this.add.text(width - 12, 18, '0/' + this.survivalTarget + 's', {
            fontSize: '14px', fill: '#FFD700',
            stroke: '#1A1A0A', strokeThickness: 2
        }).setOrigin(1, 0.5);

        // ========== POLISHED STORM CHASE VEHICLE ==========
        this.chaseVehicle = this.add.container(width - 60, height - 140);

        const truckBody = this.add.graphics();

        // Vehicle shadow
        truckBody.fillStyle(0x000000, 0.4);
        truckBody.fillEllipse(0, 15, 48, 12);

        // Main truck body with metallic red
        truckBody.fillStyle(0x8B0000);
        truckBody.fillRect(-22, -16, 44, 22);
        truckBody.fillStyle(0xCC0000);
        truckBody.fillRect(-20, -14, 40, 18);
        // Highlight stripe
        truckBody.fillStyle(0xDD2222, 0.6);
        truckBody.fillRect(-18, -14, 36, 4);

        // Cab with gradient look
        truckBody.fillStyle(0x990000);
        truckBody.fillRect(-16, -27, 22, 14);
        truckBody.fillStyle(0xAA1111);
        truckBody.fillRect(-14, -25, 18, 10);

        // Windows with sky reflection
        truckBody.fillStyle(0x6BB3D9);
        truckBody.fillRect(-12, -24, 14, 8);
        truckBody.fillStyle(0x90CAF9, 0.5);
        truckBody.fillRect(-11, -24, 5, 3);

        // Wheels with detail
        this.add.circle(-13, 7, 7, 0x1a1a1a);
        this.add.circle(-13, 7, 5, 0x2a2a2a);
        this.add.circle(-13, 7, 2, 0x4a4a4a);
        this.add.circle(13, 7, 7, 0x1a1a1a);
        this.add.circle(13, 7, 5, 0x2a2a2a);
        this.add.circle(13, 7, 2, 0x4a4a4a);

        // Equipment rack in truck bed
        truckBody.fillStyle(0x606060);
        truckBody.fillRect(6, -20, 14, 16);
        truckBody.fillStyle(0x808080);
        truckBody.fillRect(8, -18, 10, 12);

        // Antenna with detail
        truckBody.lineStyle(3, 0x404040);
        truckBody.lineBetween(13, -20, 13, -34);
        truckBody.lineStyle(1, 0x606060);
        truckBody.lineBetween(14, -22, 14, -32);

        // Spinning radar dish with metallic look
        this.radarDish = this.add.ellipse(13, -36, 10, 5, 0xD0D0D0);
        const radarHighlight = this.add.ellipse(12, -37, 4, 2, 0xFFFFFF, 0.5);

        // Headlights (glowing)
        this.add.circle(-20, -8, 3, 0xFFEB3B, 0.5);
        this.add.circle(-20, -8, 2, 0xFFF59D);

        this.chaseVehicle.add([truckBody, this.radarDish, radarHighlight]);

        // Emma in the driver seat - use Emma sprite
        this.emmaInTruck = this.add.image(this.chaseVehicle.x - 8, this.chaseVehicle.y - 22, 'emma_walk_0').setScale(0.5);

        // ========== MASSIVE TORNADO WITH VISUAL EFFECTS ==========
        this.tornado = this.add.container(50, 260);

        // Tornado ground destruction effect
        const tornadoGround = this.add.ellipse(0, 45, 60, 20, 0x3A2A1A, 0.6);

        // Dust cloud around base
        const dustCloud1 = this.add.ellipse(-20, 35, 30, 12, 0x8B7355, 0.4);
        const dustCloud2 = this.add.ellipse(25, 38, 25, 10, 0x8B7355, 0.3);

        // Tornado sprite with layered effects for depth
        const tornadoGlow = this.add.image(0, -10, 'tornado').setScale(1.3).setAlpha(0.2).setTint(0x4A6A4A);
        const tornadoBase = this.add.image(0, 0, 'tornado').setScale(1.2);
        const tornadoMid = this.add.image(0, -15, 'tornado').setScale(0.9).setAlpha(0.85);
        const tornadoTop = this.add.image(0, -30, 'tornado').setScale(0.7).setAlpha(0.7);
        const tornadoTip = this.add.image(0, -45, 'tornado').setScale(0.5).setAlpha(0.5);

        this.tornado.add([tornadoGround, dustCloud1, dustCloud2, tornadoGlow, tornadoBase, tornadoMid, tornadoTop, tornadoTip]);

        // Tornado rotation animation with wobble
        this.tweens.add({
            targets: [tornadoBase, tornadoMid, tornadoTop, tornadoTip],
            angle: 360,
            duration: 1200,
            repeat: -1
        });

        // Dust cloud pulsing
        this.tweens.add({
            targets: [dustCloud1, dustCloud2],
            scaleX: 1.3,
            scaleY: 1.2,
            alpha: 0.2,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Enhanced debris around tornado - using shapes instead of emojis
        this.tornadoDebris = [];
        const debrisColors = [0x8B4513, 0x228B22, 0xFF6347, 0xDEB887, 0x696969, 0xCD853F, 0x808080, 0xDAA520];
        for (let i = 0; i < 8; i++) {
            const size = i < 4 ? 10 : 6;
            const debris = this.add.rectangle(
                this.tornado.x + Phaser.Math.Between(-50, 50),
                this.tornado.y + Phaser.Math.Between(-40, 40),
                size, size,
                debrisColors[i]
            );
            this.tornadoDebris.push(debris);
        }

        // ========== FLYING COW (Twister reference!) ==========
        this.flyingCow = this.add.container(-50, 150);
        // Cow drawn with shapes
        const cowBody = this.add.ellipse(0, 0, 24, 16, 0xF5F5F5);
        const cowHead = this.add.circle(12, -4, 8, 0xFFFFFF);
        const cowSpot1 = this.add.circle(-4, 2, 5, 0x2F2F2F);
        const cowSpot2 = this.add.circle(4, -2, 4, 0x2F2F2F);
        const cowShadow = this.add.ellipse(0, 25, 24, 8, 0x000000, 0.25);
        this.flyingCow.add([cowShadow, cowBody, cowHead, cowSpot1, cowSpot2]);
        this.flyingCow.setAlpha(0);
        this.cowDirection = 1;
        this.cowVisible = false;

        // Schedule cow appearances
        this.time.addEvent({
            delay: 4000,
            callback: () => this.launchFlyingCow(),
            loop: true
        });

        // ========== WITCH ON BROOMSTICK (Wizard of Oz!) ==========
        this.flyingWitch = this.add.container(width + 50, 100);
        // Witch silhouette with cape flutter
        const capeFlutter = this.add.text(-10, 5, '🦇', { fontSize: '12px' }).setOrigin(0.5).setAlpha(0.4);
        const witchEmoji = this.add.text(0, 0, '🧙‍♀️', { fontSize: '26px' }).setOrigin(0.5);
        const broomstick = this.add.text(18, 6, '🧹', { fontSize: '18px' }).setOrigin(0.5).setAngle(-25);
        const witchGlow = this.add.circle(0, 0, 15, 0x90EE90, 0.2);
        this.flyingWitch.add([witchGlow, capeFlutter, broomstick, witchEmoji]);
        this.flyingWitch.setAlpha(0);
        this.witchVisible = false;

        // Schedule witch appearances
        this.time.addEvent({
            delay: 6000,
            callback: () => this.launchWitch(),
            loop: true,
            startAt: 2000
        });

        // Lightning flash timer
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                if (this.lightningFlash && this.tornadoActive) {
                    this.tweens.add({
                        targets: this.lightningFlash,
                        alpha: 0.4,
                        duration: 50,
                        yoyo: true,
                        repeat: 2
                    });
                }
            },
            loop: true
        });

        // ========== POLISHED CONTROLS HINT ==========
        bg.fillGradientStyle(0x0A0A1A, 0x1A1A2E, 0x0A0A1A, 0x1A1A2E, 0.8);
        bg.fillRect(0, height - 38, width, 38);
        this.add.rectangle(width / 2, height - 38, width, 2, 0x4A5568, 0.5);

        this.add.text(width / 2, height - 18, '← → ↑ ↓ Drive your chase vehicle!', {
            fontSize: '11px', fill: '#fff'
        }).setOrigin(0.5);

        // Setup movement
        this.cursors = this.input.keyboard.createCursorKeys();
        this.setupTornadoControls();

        this.canMove = true;
        this.cameras.main.fadeIn(300);

        // Start radar spinning
        this.tweens.add({
            targets: this.radarDish,
            angle: 360,
            duration: 1000,
            repeat: -1
        });

        // ========== TORNADO CHASE AMBIENT EFFECTS ==========
        this.createTornadoChaseAmbientEffects(width, height);
    }

    createTornadoChaseAmbientEffects(width, height) {
        // ===== RAIN STREAKS =====
        this.rainDrops = [];
        for (let i = 0; i < 40; i++) {
            const drop = this.add.rectangle(
                Math.random() * width,
                Math.random() * height,
                2,
                15 + Math.random() * 10,
                0xAABBCC,
                0.3
            );
            drop.setAngle(-15);
            drop.speed = 8 + Math.random() * 4;
            this.rainDrops.push(drop);
        }

        // ===== STORM CLOUDS LAYER =====
        this.stormClouds = [];
        for (let i = 0; i < 6; i++) {
            const cloud = this.add.ellipse(
                i * 70 - 20,
                30 + Math.random() * 30,
                80 + Math.random() * 40,
                25 + Math.random() * 15,
                0x2C3E50,
                0.6
            );
            cloud.speed = 0.3 + Math.random() * 0.2;
            this.stormClouds.push(cloud);
        }

        // ===== WIND PARTICLES =====
        this.windParticles = [];
        for (let i = 0; i < 15; i++) {
            const particle = this.add.rectangle(
                Math.random() * width,
                60 + Math.random() * (height - 120),
                Math.random() * 20 + 5,
                2,
                0x8B9A6B,
                0.3
            );
            particle.speed = 3 + Math.random() * 2;
            this.windParticles.push(particle);
        }

        // ===== SCREEN VIGNETTE (dark edges) =====
        this.vignette = this.add.graphics();
        this.vignette.fillStyle(0x000000, 0.4);
        this.vignette.fillRect(0, 0, 20, height);
        this.vignette.fillRect(width - 20, 0, 20, height);
        this.vignette.fillRect(0, 55, width, 15);
        this.vignette.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0.3, 0.3, 0, 0);
        this.vignette.fillRect(0, height - 60, width, 22);

        // ===== VEHICLE DUST TRAIL =====
        this.dustTrail = [];
        for (let i = 0; i < 8; i++) {
            const dust = this.add.circle(0, 0, 4 + i * 2, 0x8B7355, 0);
            dust.index = i;
            this.dustTrail.push(dust);
        }

        // ===== CITY LIGHTS FLICKER (during storm) =====
        this.cityLights = [];
        const cities = [
            { x: 50, y: 260 },
            { x: width - 50, y: height - 130 },
            { x: width / 2, y: 200 }
        ];
        cities.forEach((city, i) => {
            const light = this.add.circle(city.x, city.y, 12, 0xFFEB3B, 0);
            light.phase = i * 0.4;
            this.cityLights.push(light);
        });

        // ===== SCREEN SHAKE INTENSITY =====
        this.shakeIntensity = 0;
    }

    updateTornadoChaseAmbientEffects(time) {
        const { width, height } = this.scale;

        // ===== RAIN ANIMATION =====
        if (this.rainDrops) {
            this.rainDrops.forEach(drop => {
                drop.y += drop.speed;
                drop.x -= drop.speed * 0.3;
                if (drop.y > height || drop.x < -20) {
                    drop.y = -20;
                    drop.x = Math.random() * (width + 50);
                }
            });
        }

        // ===== STORM CLOUDS DRIFT =====
        if (this.stormClouds) {
            this.stormClouds.forEach(cloud => {
                cloud.x += cloud.speed;
                if (cloud.x > width + 60) cloud.x = -80;
            });
        }

        // ===== WIND PARTICLES =====
        if (this.windParticles) {
            this.windParticles.forEach(particle => {
                particle.x += particle.speed;
                if (particle.x > width + 30) {
                    particle.x = -30;
                    particle.y = 60 + Math.random() * (height - 120);
                }
            });
        }

        // ===== DUST TRAIL BEHIND VEHICLE =====
        if (this.dustTrail && this.chaseVehicle) {
            this.dustTrail.forEach((dust, i) => {
                const offset = (i + 1) * 8;
                dust.x = this.chaseVehicle.x - offset * this.chaseVehicle.scaleX;
                dust.y = this.chaseVehicle.y + 10;
                dust.setAlpha(0.2 - i * 0.02);
                dust.setScale(1 - i * 0.08);
            });
        }

        // ===== CITY LIGHTS FLICKER =====
        if (this.cityLights) {
            this.cityLights.forEach(light => {
                const flicker = Math.sin(time * 0.005 + light.phase) * 0.1;
                light.setAlpha(0.15 + flicker + Math.random() * 0.05);
            });
        }

        // ===== LIGHTNING FLASH (handled by existing timer) =====

        // ===== SCREEN SHAKE (increases as tornado gets closer) =====
        if (this.tornado && this.chaseVehicle && this.tornadoActive) {
            const dist = Phaser.Math.Distance.Between(
                this.tornado.x, this.tornado.y,
                this.chaseVehicle.x, this.chaseVehicle.y
            );
            this.shakeIntensity = Math.max(0, (150 - dist) / 150) * 3;
            if (this.shakeIntensity > 0.5) {
                this.cameras.main.shake(50, this.shakeIntensity * 0.002);
            }
        }
    }

    launchFlyingCow() {
        if (!this.tornadoActive || this.cowVisible) return;

        this.cowVisible = true;
        this.cowDirection = Phaser.Math.Between(0, 1) === 0 ? 1 : -1;

        // Start from left or right
        this.flyingCow.x = this.cowDirection === 1 ? -50 : this.scale.width + 50;
        this.flyingCow.y = Phaser.Math.Between(80, 250);
        this.flyingCow.setAlpha(1);

        // Cow flies across with wobble
        this.tweens.add({
            targets: this.flyingCow,
            x: this.cowDirection === 1 ? this.scale.width + 50 : -50,
            y: this.flyingCow.y + Phaser.Math.Between(-50, 50),
            angle: this.cowDirection === 1 ? 720 : -720,
            duration: 3000,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                this.flyingCow.setAlpha(0);
                this.cowVisible = false;
            }
        });

        // "MOO!" text
        const mooText = this.add.text(this.flyingCow.x, this.flyingCow.y - 30, 'MOOOOO!', {
            fontSize: '12px', fill: '#fff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);

        this.tweens.add({
            targets: mooText,
            y: mooText.y - 40,
            alpha: 0,
            duration: 1500,
            onComplete: () => mooText.destroy()
        });
    }

    launchWitch() {
        if (!this.tornadoActive || this.witchVisible) return;

        this.witchVisible = true;

        // Witch always flies right to left (like in the movie)
        this.flyingWitch.x = this.scale.width + 50;
        this.flyingWitch.y = Phaser.Math.Between(60, 120);
        this.flyingWitch.setAlpha(1);

        // Smooth gliding motion
        this.tweens.add({
            targets: this.flyingWitch,
            x: -80,
            duration: 4000,
            ease: 'Linear',
            onComplete: () => {
                this.flyingWitch.setAlpha(0);
                this.witchVisible = false;
            }
        });

        // Cackle text
        const cackleText = this.add.text(this.flyingWitch.x - 30, this.flyingWitch.y + 20,
            Phaser.Utils.Array.GetRandom(['I\'ll get you my pretty!', 'Ehehehe!', 'Hahahaha!']), {
            fontSize: '10px', fill: '#90EE90',
            stroke: '#000', strokeThickness: 1
        }).setOrigin(0.5);

        this.tweens.add({
            targets: cackleText,
            x: -100,
            alpha: 0,
            duration: 4000,
            onComplete: () => cackleText.destroy()
        });
    }

    setupTornadoControls() {
        this.input.on('pointerdown', (pointer) => {
            if (!this.canMove || this.currentPhase !== 'tornadoChase') return;

            const thirdX = this.scale.width / 3;
            const thirdY = this.scale.height / 3;

            if (pointer.x < thirdX) this.tornadoMoveLeft = true;
            else if (pointer.x > thirdX * 2) this.tornadoMoveRight = true;

            if (pointer.y < thirdY) this.tornadoMoveUp = true;
            else if (pointer.y > thirdY * 2) this.tornadoMoveDown = true;
        });

        this.input.on('pointerup', () => {
            this.tornadoMoveLeft = false;
            this.tornadoMoveRight = false;
            this.tornadoMoveUp = false;
            this.tornadoMoveDown = false;
        });
    }

    updateTornadoChase(delta) {
        if (!this.tornadoActive || !this.canMove) return;

        const speed = 4;
        const { width, height } = this.scale;

        // Move chase vehicle
        if (this.cursors.left.isDown || this.tornadoMoveLeft) {
            this.chaseVehicle.x -= speed;
            this.chaseVehicle.scaleX = -1;  // Flip truck to face left
        }
        if (this.cursors.right.isDown || this.tornadoMoveRight) {
            this.chaseVehicle.x += speed;
            this.chaseVehicle.scaleX = 1;  // Face right
        }
        if (this.cursors.up.isDown || this.tornadoMoveUp) {
            this.chaseVehicle.y -= speed;
        }
        if (this.cursors.down.isDown || this.tornadoMoveDown) {
            this.chaseVehicle.y += speed;
        }

        // Keep vehicle in Missouri bounds (full screen minus UI areas)
        this.chaseVehicle.x = Phaser.Math.Clamp(this.chaseVehicle.x, 40, width - 40);
        this.chaseVehicle.y = Phaser.Math.Clamp(this.chaseVehicle.y, 80, height - 60);

        // Update Emma's position to follow vehicle
        this.emmaInTruck.x = this.chaseVehicle.x - 8 * this.chaseVehicle.scaleX;
        this.emmaInTruck.y = this.chaseVehicle.y - 20;

        // Tornado chases the vehicle
        const dx = this.chaseVehicle.x - this.tornado.x;
        const dy = this.chaseVehicle.y - this.tornado.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0) {
            const tornadoSpeed = 2 + (this.survivalTime * 0.08);  // Gets faster over time
            this.tornado.x += (dx / dist) * tornadoSpeed;
            this.tornado.y += (dy / dist) * tornadoSpeed;
        }

        // Move debris with tornado
        if (this.tornadoDebris) {
            this.tornadoDebris.forEach((debris, i) => {
                const angle = (Date.now() / 500 + i * 1.2) % (Math.PI * 2);
                const radius = 35 + i * 8;
                debris.x = this.tornado.x + Math.cos(angle) * radius;
                debris.y = this.tornado.y + Math.sin(angle) * radius;
                debris.angle += 5;
            });
        }

        // Check collision (larger radius for the big tornado)
        if (dist < 50) {
            this.tornadoCaught();
            return;
        }

        // Update survival time
        this.survivalTime += delta / 1000;
        this.survivalText.setText('Survive: ' + Math.floor(this.survivalTime) + '/' + this.survivalTarget + 's');

        // Check win condition
        if (this.survivalTime >= this.survivalTarget) {
            this.tornadoSurvived();
        }
    }

    tornadoCaught() {
        this.tornadoActive = false;
        this.canMove = false;

        const { width, height } = this.scale;

        // Dramatic caught animation
        const caughtContainer = this.add.container(width / 2, height / 2);
        const leftTornado = this.add.image(-80, 0, 'tornado').setScale(1.2);
        const caughtText = this.add.text(0, 0, 'CAUGHT!\nTry again!', {
            fontSize: '24px', fill: '#FF6B6B', align: 'center',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);
        const rightTornado = this.add.image(80, 0, 'tornado').setScale(1.2).setFlipX(true);
        caughtContainer.add([leftTornado, caughtText, rightTornado]);

        // Spin the vehicle dramatically
        this.tweens.add({
            targets: this.chaseVehicle,
            angle: 720,
            duration: 1000
        });

        this.time.delayedCall(1500, () => {
            caughtContainer.destroy();
            // Reset positions
            this.chaseVehicle.x = width - 60;
            this.chaseVehicle.y = height - 140;
            this.chaseVehicle.angle = 0;
            this.chaseVehicle.scaleX = 1;
            this.emmaInTruck.x = this.chaseVehicle.x - 8;
            this.emmaInTruck.y = this.chaseVehicle.y - 20;
            this.tornado.x = 50;
            this.tornado.y = 260;
            this.survivalTime = 0;
            this.tornadoActive = true;
            this.canMove = true;
        });
    }

    tornadoSurvived() {
        this.tornadoActive = false;
        this.canMove = false;

        const { width, height } = this.scale;

        // Victory!
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0);
        this.tweens.add({
            targets: overlay,
            alpha: 0.8,
            duration: 500
        });

        this.time.delayedCall(600, () => {
            this.add.image(width / 2 - 90, height / 2 - 40, 'star').setScale(1.5);
            this.add.text(width / 2, height / 2 - 40, 'SURVIVED!', {
                fontSize: '24px', fill: '#4CAF50',
                stroke: '#000', strokeThickness: 3
            }).setOrigin(0.5);
            this.add.image(width / 2 + 90, height / 2 - 40, 'star').setScale(1.5);

            this.add.text(width / 2, height / 2, 'Emma\'s gonna be a great\nmeteorologist!', {
                fontSize: '14px', fill: '#fff', align: 'center'
            }).setOrigin(0.5);

            this.add.text(width / 2, height / 2 + 50, 'Meanwhile, she kept texting Barrett...', {
                fontSize: '12px', fill: '#FF69B4'
            }).setOrigin(0.5);

            GameState.heartsCollected += 2;

            this.time.delayedCall(3000, () => {
                this.cameras.main.fadeOut(500);
                this.time.delayedCall(600, () => {
                    this.scene.start('Level4_CozyNight');
                });
            });
        });
    }

    // Override to allow 4-directional movement
    handleMovement() {
        if (!this.emma || !this.canMove || this.currentPhase !== 'classRush') return;

        const speed = 200;
        let vx = 0;
        let vy = 0;

        if (this.cursors.left.isDown || this.moveLeft) {
            vx = -speed;
            this.emma.setFlipX(true);
        } else if (this.cursors.right.isDown || this.moveRight) {
            vx = speed;
            this.emma.setFlipX(false);
        }

        if (this.cursors.up.isDown || this.moveUp) {
            vy = -speed;
        } else if (this.cursors.down.isDown || this.moveDown) {
            vy = speed;
        }

        this.emma.setVelocity(vx, vy);

        if (vx !== 0 || vy !== 0) {
            this.emma.play('emma_walk', true);
        } else {
            this.emma.stop();
            this.emma.setTexture('emma_walk_0');
        }
    }

    setupControls() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.input.on('pointerdown', (pointer) => {
            if (!this.canMove) return;

            const thirdX = this.scale.width / 3;
            const thirdY = this.scale.height / 3;

            if (pointer.x < thirdX) this.moveLeft = true;
            else if (pointer.x > thirdX * 2) this.moveRight = true;

            if (pointer.y < thirdY) this.moveUp = true;
            else if (pointer.y > thirdY * 2) this.moveDown = true;
        });

        this.input.on('pointerup', () => {
            this.moveLeft = false;
            this.moveRight = false;
            this.moveUp = false;
            this.moveDown = false;
        });
    }

    update(time, delta) {
        if (this.currentPhase === 'classRush') {
            this.handleMovement();
            this.checkClassReached();

            // ===== CAMPUS AMBIENT EFFECTS =====
            this.updateCampusAmbientEffects(time);

            // Update timer
            if (this.canMove && this.currentClass) {
                this.timeRemaining -= delta / 1000;
                this.timerText.setText('TIME: ' + Math.max(0, Math.ceil(this.timeRemaining)));

                if (this.timeRemaining <= 0) {
                    this.failClass();
                }

                // Timer color warning
                if (this.timeRemaining <= 3) {
                    this.timerText.setColor('#FF0000');
                } else {
                    this.timerText.setColor('#FF6B6B');
                }
            }
        } else if (this.currentPhase === 'tornadoChase') {
            this.updateTornadoChase(delta);
            // ===== TORNADO CHASE AMBIENT EFFECTS =====
            this.updateTornadoChaseAmbientEffects(time);
        }
    }
}

// ============================================
// LEVEL 4: COZY NIGHT IN (Mini-game)
// ============================================
class Level4_CozyNight extends BaseLevel {
    constructor() {
        super('Level4_CozyNight');
        this.score = 0;
        this.targetScore = 10;
        this.gameActive = true;
    }

    init() {
        // Reset state when scene starts (important for level select)
        this.score = 0;
        this.targetScore = 10;
        this.gameActive = true;
        this.currentMovie = 0;
        this.spawnTimer = null;
    }

    create() {
        console.log('Level4_CozyNight: create() starting...');
        const { width, height } = this.scale;

        // ========== POLISHED LIVING ROOM WITH DEPTH & LIGHTING ==========
        const bg = this.add.graphics();
        const floorY = height - 120;

        // ===== WALL WITH GRADIENT (warm evening lighting) =====
        // Base wall color with subtle gradient effect
        bg.fillGradientStyle(0x5A6B7A, 0x5A6B7A, 0x4A5B6A, 0x4A5B6A, 1);
        bg.fillRect(0, 0, width, floorY);

        // Warm ambient light glow from lamp (left side)
        this.add.circle(35, floorY - 180, 120, 0xFFE4B5, 0.15);
        this.add.circle(35, floorY - 180, 80, 0xFFD699, 0.1);

        // Subtle moonlight from windows
        this.add.ellipse(width / 2, 180, 280, 100, 0x6B8CAE, 0.08);

        // ===== HARDWOOD FLOOR WITH PERSPECTIVE =====
        // Floor base with gradient for depth
        bg.fillGradientStyle(0xB8956B, 0xB8956B, 0xA07850, 0xA07850, 1);
        bg.fillRect(0, floorY, width, height - floorY);

        // Floor board lines with perspective
        bg.lineStyle(1, 0x8B6914, 0.4);
        for (let i = 0; i < 8; i++) {
            const y = floorY + i * 15;
            bg.lineBetween(0, y, width, y);
        }
        // Vertical board separations
        bg.lineStyle(1, 0x9A7B4F, 0.3);
        for (let i = 0; i < 8; i++) {
            bg.lineBetween(i * 50, floorY, i * 50, height);
        }

        // Floor reflection/shine
        bg.fillStyle(0xD4A574, 0.15);
        bg.fillRect(width / 2 - 100, floorY + 5, 200, 40);

        // ===== ORIENTAL RUG WITH DETAIL =====
        const rugX = width / 2 - 90;
        const rugY = floorY + 10;
        const rugW = 180;
        const rugH = 85;

        // Rug shadow
        bg.fillStyle(0x000000, 0.2);
        bg.fillRect(rugX + 5, rugY + 5, rugW, rugH);

        // Main rug body (deep red)
        bg.fillGradientStyle(0x8B1A1A, 0x6B0F0F, 0x8B1A1A, 0x6B0F0F, 1);
        bg.fillRect(rugX, rugY, rugW, rugH);

        // Rug border (gold)
        bg.lineStyle(4, 0xDAA520);
        bg.strokeRect(rugX + 4, rugY + 4, rugW - 8, rugH - 8);
        bg.lineStyle(2, 0xB8860B);
        bg.strokeRect(rugX + 10, rugY + 10, rugW - 20, rugH - 20);

        // Rug center medallion
        this.add.ellipse(width / 2, rugY + rugH / 2, 40, 25, 0xDAA520, 0.6);
        this.add.ellipse(width / 2, rugY + rugH / 2, 25, 15, 0x8B1A1A);

        // ===== THREE LARGE WINDOWS WITH STARRY NIGHT =====
        const windowY = 70;
        const windowH = 180;
        const windowW = 95;
        const windowPositions = [20, 133, 245];

        windowPositions.forEach((wx, idx) => {
            // Window outer shadow
            bg.fillStyle(0x000000, 0.3);
            bg.fillRect(wx + 4, windowY + 4, windowW, windowH);

            // Window frame (white with depth)
            bg.fillStyle(0xF5F5F5);
            bg.fillRect(wx, windowY, windowW, windowH);
            bg.fillStyle(0xE8E8E8);
            bg.fillRect(wx + 2, windowY + 2, windowW - 4, 4);  // Top highlight

            // --- STARRY NIGHT (Van Gogh style) ---
            // Night sky gradient
            bg.fillGradientStyle(0x0D1B2A, 0x1A365D, 0x0D1B2A, 0x2D4A6A, 1);
            bg.fillRect(wx + 6, windowY + 6, windowW - 12, windowH - 12);

            // Swirling patterns (multiple layers for depth)
            const swirls = [
                { x: 30, y: 40, w: 25, h: 10, c: 0x2C5282 },
                { x: 55, y: 70, w: 22, h: 9, c: 0x3182CE },
                { x: 25, y: 100, w: 28, h: 11, c: 0x2B6CB0 },
                { x: 50, y: 130, w: 20, h: 8, c: 0x2C5282 },
            ];
            swirls.forEach(s => {
                this.add.ellipse(wx + s.x, windowY + s.y, s.w, s.h, s.c, 0.7);
                this.add.ellipse(wx + s.x, windowY + s.y, s.w - 5, s.h - 3, 0x4299E1, 0.4);
            });

            // Stars with glow effect
            const stars = [
                { x: 25, y: 30, r: 8 }, { x: 60, y: 45, r: 6 }, { x: 40, y: 80, r: 5 },
                { x: 70, y: 95, r: 4 }, { x: 20, y: 115, r: 5 }, { x: 55, y: 140, r: 4 }
            ];
            stars.forEach(s => {
                this.add.circle(wx + s.x, windowY + s.y, s.r + 3, 0xFFF44F, 0.3);  // Glow
                this.add.circle(wx + s.x, windowY + s.y, s.r, 0xFFF44F);
                this.add.circle(wx + s.x, windowY + s.y, s.r - 2, 0xFFFFF0);
            });

            // Crescent moon (center window)
            if (idx === 1) {
                this.add.circle(wx + 70, windowY + 35, 18, 0xFFF44F, 0.4);  // Moon glow
                this.add.circle(wx + 70, windowY + 35, 14, 0xFFF44F);
                this.add.circle(wx + 76, windowY + 30, 12, 0x0D1B2A);  // Shadow
            }

            // Cypress trees (left & right windows)
            if (idx !== 1) {
                bg.fillStyle(0x0a0a18);
                // Flame-shaped tree
                bg.beginPath();
                bg.moveTo(wx + 78, windowY + windowH - 15);
                bg.lineTo(wx + 72, windowY + 50);
                bg.lineTo(wx + 75, windowY + 30);
                bg.lineTo(wx + 78, windowY + 50);
                bg.lineTo(wx + 84, windowY + windowH - 15);
                bg.closePath();
                bg.fill();
            }

            // Village silhouette
            bg.fillStyle(0x0a0a18);
            bg.fillRect(wx + 6, windowY + windowH - 30, windowW - 12, 25);
            // Houses
            bg.fillRect(wx + 15, windowY + windowH - 45, 15, 20);
            bg.fillRect(wx + 40, windowY + windowH - 50, 18, 25);
            bg.fillRect(wx + 65, windowY + windowH - 40, 12, 15);
            // Church steeple (center)
            if (idx === 1) {
                bg.fillRect(wx + 45, windowY + windowH - 70, 8, 45);
                bg.fillRect(wx + 42, windowY + windowH - 70, 14, 5);
            }

            // Window mullions (white cross) with 3D effect
            bg.fillStyle(0xFFFFFF);
            bg.fillRect(wx + windowW/2 - 3, windowY + 6, 6, windowH - 12);
            bg.fillRect(wx + 6, windowY + windowH/2 - 3, windowW - 12, 6);
            bg.fillStyle(0xE0E0E0);
            bg.fillRect(wx + windowW/2 + 1, windowY + 6, 2, windowH - 12);
            bg.fillRect(wx + 6, windowY + windowH/2 + 1, windowW - 12, 2);
        });

        // ===== FRAMED ART GALLERY (between windows) =====

        // --- CAT OIL PAINTING (ornate gold frame) ---
        const catPaintX = 118;
        const catPaintY = windowY + 35;
        // Frame shadow
        bg.fillStyle(0x000000, 0.3);
        bg.fillRect(catPaintX + 3, catPaintY + 3, 14, 20);
        // Ornate gold frame layers
        bg.fillStyle(0x8B6914);
        bg.fillRect(catPaintX, catPaintY, 14, 20);
        bg.fillStyle(0xDAA520);
        bg.fillRect(catPaintX + 1, catPaintY + 1, 12, 18);
        bg.fillStyle(0xFFD700);
        bg.fillRect(catPaintX + 2, catPaintY + 2, 10, 16);
        // Canvas (dark burgundy)
        bg.fillStyle(0x4A1515);
        bg.fillRect(catPaintX + 3, catPaintY + 3, 8, 14);
        // Cat portrait
        this.add.circle(catPaintX + 7, catPaintY + 8, 3, 0x1a1a1a);  // Head
        bg.fillStyle(0x1a1a1a);
        bg.fillRect(catPaintX + 5, catPaintY + 11, 4, 5);  // Body
        // Glowing eyes
        this.add.circle(catPaintX + 6, catPaintY + 7, 1, 0x00FF00);
        this.add.circle(catPaintX + 8, catPaintY + 7, 1, 0x00FF00);

        // --- ESCHER PRINT (black frame) ---
        const escherX = 230;
        const escherY = windowY + 30;
        bg.fillStyle(0x000000, 0.3);
        bg.fillRect(escherX + 2, escherY + 2, 14, 18);
        bg.fillStyle(0x1a1a1a);
        bg.fillRect(escherX, escherY, 14, 18);
        bg.fillStyle(0xE8E8E8);
        bg.fillRect(escherX + 2, escherY + 2, 10, 14);
        // Impossible stairs
        bg.fillStyle(0x4a4a4a);
        for (let i = 0; i < 4; i++) {
            bg.fillRect(escherX + 3 + i * 2, escherY + 4 + i * 2, 4, 2);
        }
        bg.fillStyle(0x2d2d2d);
        for (let i = 0; i < 3; i++) {
            bg.fillRect(escherX + 9 - i, escherY + 6 + i * 2, 3, 2);
        }

        // ===== LEATHER CHESTERFIELD COUCH (with depth) =====
        const couchX = width / 2 - 75;
        const couchY = floorY - 80;
        const couchW = 150;
        const couchH = 70;

        // Couch shadow
        bg.fillStyle(0x000000, 0.25);
        this.add.ellipse(width / 2, floorY + 5, couchW - 20, 15, 0x000000, 0.3);

        // Couch back (darker leather)
        bg.fillGradientStyle(0x3D2D22, 0x2A1F18, 0x3D2D22, 0x2A1F18, 1);
        bg.fillRect(couchX, couchY - 25, couchW, 30);

        // Main couch body
        bg.fillGradientStyle(0x5A4030, 0x4A3020, 0x5A4030, 0x4A3020, 1);
        bg.fillRect(couchX, couchY, couchW, couchH);

        // Leather highlight
        bg.fillStyle(0x6A5040, 0.5);
        bg.fillRect(couchX + 10, couchY + 5, couchW - 20, 8);

        // Arm rests with 3D shading
        bg.fillGradientStyle(0x4A3728, 0x3D2D22, 0x4A3728, 0x3D2D22, 1);
        bg.fillRect(couchX - 12, couchY, 18, couchH - 5);
        bg.fillRect(couchX + couchW - 6, couchY, 18, couchH - 5);
        // Armrest highlights
        bg.fillStyle(0x5A4738, 0.6);
        bg.fillRect(couchX - 10, couchY + 2, 4, couchH - 10);
        bg.fillRect(couchX + couchW - 4, couchY + 2, 4, couchH - 10);

        // Tufted buttons with shadows
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 2; j++) {
                const bx = couchX + 20 + i * 28;
                const by = couchY - 18 + j * 15;
                this.add.circle(bx + 1, by + 1, 3, 0x1A1510, 0.5);  // Shadow
                this.add.circle(bx, by, 3, 0x2A1F18);
                this.add.circle(bx - 1, by - 1, 1, 0x4A3728, 0.5);  // Highlight
            }
        }

        // Seat cushions with creases
        bg.fillGradientStyle(0x6A5040, 0x5A4030, 0x5A4030, 0x4A3020, 1);
        bg.fillRect(couchX + 8, couchY + 15, couchW - 16, 45);
        // Cushion dividers
        bg.lineStyle(2, 0x3D2D22, 0.6);
        bg.lineBetween(couchX + 55, couchY + 18, couchX + 55, couchY + 55);
        bg.lineBetween(couchX + 95, couchY + 18, couchX + 95, couchY + 55);

        // ===== MONSTERA PLANT (left of couch) =====
        const plantX = couchX - 45;
        const plantY = floorY - 5;

        // Pot shadow
        this.add.ellipse(plantX + 15, floorY + 8, 28, 8, 0x000000, 0.2);

        // Terracotta pot with gradient
        bg.fillGradientStyle(0xCD853F, 0xA0522D, 0xCD853F, 0xA0522D, 1);
        bg.fillRect(plantX, plantY - 40, 30, 45);
        // Pot rim
        bg.fillStyle(0xD2691E);
        bg.fillRect(plantX - 3, plantY - 40, 36, 8);
        // Pot highlight
        bg.fillStyle(0xDEB887, 0.4);
        bg.fillRect(plantX + 2, plantY - 38, 6, 40);

        // Monstera leaves with depth
        const leaves = [
            { x: 15, y: -70, r: 22, c: 0x228B22 },
            { x: 5, y: -90, r: 18, c: 0x2E8B2E },
            { x: 25, y: -85, r: 20, c: 0x32CD32 },
            { x: 15, y: -110, r: 15, c: 0x3CB371 },
            { x: -5, y: -65, r: 14, c: 0x228B22 },
            { x: 30, y: -60, r: 12, c: 0x2E8B2E },
        ];
        leaves.forEach(l => {
            // Leaf shadow
            this.add.circle(plantX + l.x + 3, plantY + l.y + 3, l.r, 0x1a4a1a, 0.4);
            // Main leaf
            this.add.circle(plantX + l.x, plantY + l.y, l.r, l.c);
            // Leaf highlight
            this.add.circle(plantX + l.x - 3, plantY + l.y - 3, l.r * 0.4, 0x90EE90, 0.3);
        });

        // ===== UPRIGHT PIANO (right side) =====
        const pianoX = width - 95;
        const pianoY = floorY - 140;

        // Piano shadow
        bg.fillStyle(0x000000, 0.3);
        bg.fillRect(pianoX + 8, pianoY + 8, 85, 145);

        // Piano body (glossy black)
        bg.fillGradientStyle(0x1a1a1a, 0x2d2d2d, 0x1a1a1a, 0x0a0a0a, 1);
        bg.fillRect(pianoX, pianoY, 85, 145);

        // Piano top (lid with shine)
        bg.fillGradientStyle(0x333333, 0x1a1a1a, 0x333333, 0x1a1a1a, 1);
        bg.fillRect(pianoX - 3, pianoY - 8, 91, 12);
        // Shine on lid
        bg.fillStyle(0x4a4a4a, 0.5);
        bg.fillRect(pianoX + 5, pianoY - 6, 30, 3);

        // Music stand
        bg.fillStyle(0x2d2d2d);
        bg.fillRect(pianoX + 15, pianoY + 15, 55, 35);
        // Sheet music
        bg.fillStyle(0xFFFAF0);
        bg.fillRect(pianoX + 20, pianoY + 20, 45, 25);
        // Music notes
        bg.lineStyle(1, 0x000000);
        for (let i = 0; i < 5; i++) {
            bg.lineBetween(pianoX + 22, pianoY + 25 + i * 4, pianoX + 62, pianoY + 25 + i * 4);
        }

        // Piano keys with proper spacing
        const keyStartX = pianoX + 10;
        const keyY = pianoY + 60;
        // White keys
        for (let i = 0; i < 14; i++) {
            bg.fillStyle(i % 2 === 0 ? 0xFFFFF0 : 0xF5F5DC);
            bg.fillRect(keyStartX + i * 5, keyY, 4, 25);
            bg.lineStyle(1, 0xCCCCCC);
            bg.strokeRect(keyStartX + i * 5, keyY, 4, 25);
        }
        // Black keys
        bg.fillStyle(0x0a0a0a);
        [1, 2, 4, 5, 6, 8, 9, 11, 12].forEach(pos => {
            bg.fillRect(keyStartX + pos * 5 - 1, keyY, 3, 15);
        });

        // Piano bench
        bg.fillGradientStyle(0x2d2d2d, 0x1a1a1a, 0x2d2d2d, 0x1a1a1a, 1);
        bg.fillRect(pianoX + 15, floorY - 25, 50, 15);
        // Red velvet cushion
        bg.fillGradientStyle(0x8B0000, 0x6B0000, 0x8B0000, 0x5B0000, 1);
        bg.fillRect(pianoX + 18, floorY - 25, 44, 10);
        // Cushion highlight
        bg.fillStyle(0xAA2020, 0.4);
        bg.fillRect(pianoX + 20, floorY - 24, 20, 3);

        // ===== ROCKING CHAIR (between plant & piano) =====
        const chairX = width - 155;
        const chairY = floorY - 70;

        // Chair shadow
        this.add.ellipse(chairX + 25, floorY + 5, 50, 10, 0x000000, 0.2);

        // Chair back (wooden slats)
        bg.fillGradientStyle(0xB8860B, 0x9A7209, 0xB8860B, 0x8B6508, 1);
        bg.fillRect(chairX + 5, chairY - 40, 40, 50);
        // Spindles
        bg.fillStyle(0x8B7355);
        for (let i = 0; i < 5; i++) {
            bg.fillRect(chairX + 10 + i * 8, chairY - 35, 3, 40);
        }
        // Top rail
        bg.fillStyle(0xDAA520);
        bg.fillRect(chairX + 3, chairY - 42, 44, 6);

        // Seat with cushion
        bg.fillGradientStyle(0x2F4F4F, 0x1F3F3F, 0x2F4F4F, 0x1F3F3F, 1);
        bg.fillRect(chairX, chairY + 5, 50, 18);
        // Throw blanket
        bg.fillGradientStyle(0x98FB98, 0x7CDB7C, 0x98FB98, 0x7CDB7C, 1);
        bg.fillRect(chairX + 5, chairY - 5, 20, 30);
        bg.fillStyle(0xADFFAD, 0.4);
        bg.fillRect(chairX + 7, chairY - 3, 8, 25);

        // Armrests
        bg.fillStyle(0xB8860B);
        bg.fillRect(chairX - 5, chairY, 10, 25);
        bg.fillRect(chairX + 45, chairY, 10, 25);

        // Rockers
        bg.lineStyle(5, 0x8B7355);
        bg.lineBetween(chairX - 10, floorY - 5, chairX + 60, floorY - 5);

        // ===== FLOOR LAMP (left corner) =====
        const lampX = 30;
        const lampY = floorY - 160;

        // Lamp pole
        bg.fillGradientStyle(0x808080, 0x696969, 0x808080, 0x606060, 1);
        bg.fillRect(lampX - 2, lampY + 40, 6, 125);

        // Lamp shade
        bg.fillGradientStyle(0xF5DEB3, 0xDEB887, 0xF5DEB3, 0xD2B48C, 1);
        bg.beginPath();
        bg.moveTo(lampX - 18, lampY + 40);
        bg.lineTo(lampX + 20, lampY + 40);
        bg.lineTo(lampX + 15, lampY);
        bg.lineTo(lampX - 13, lampY);
        bg.closePath();
        bg.fill();

        // Inner glow
        bg.fillStyle(0xFFE4B5, 0.6);
        bg.beginPath();
        bg.moveTo(lampX - 12, lampY + 35);
        bg.lineTo(lampX + 14, lampY + 35);
        bg.lineTo(lampX + 10, lampY + 5);
        bg.lineTo(lampX - 8, lampY + 5);
        bg.closePath();
        bg.fill();

        // Light glow effect
        this.add.circle(lampX + 1, lampY + 20, 40, 0xFFE4B5, 0.4);
        this.add.circle(lampX + 1, lampY + 20, 25, 0xFFF8DC, 0.3);
        // Warm light glow
        this.add.circle(27, height - 215, 15, 0xFFE4B5, 0.3);

        // ===== FRAMED ART GALLERY =====

        // --- ORNATE CAT OIL PAINTING (large, gold frame) ---
        // Ornate gold frame
        bg.fillStyle(0xDAA520);
        bg.fillRect(8, 130, 55, 75);
        // Inner gold detail
        bg.fillStyle(0xFFD700);
        bg.fillRect(11, 133, 49, 69);
        // Dark inner border
        bg.fillStyle(0x8B6914);
        bg.fillRect(14, 136, 43, 63);
        // Canvas background (rich burgundy)
        bg.fillStyle(0x722F37);
        bg.fillRect(17, 139, 37, 57);
        // Cat portrait - regal sitting cat
        // Cat body (black & white)
        bg.fillStyle(0x1a1a1a);
        bg.fillRect(28, 160, 14, 20);  // Body
        this.add.ellipse(35, 155, 10, 12, 0x1a1a1a);  // Head
        // White chest
        bg.fillStyle(0xF5F5F5);
        bg.fillRect(32, 165, 6, 10);
        // Cat ears
        bg.fillStyle(0x1a1a1a);
        bg.fillRect(30, 145, 4, 6);
        bg.fillRect(38, 145, 4, 6);
        // Cat eyes (glowing green, mysterious)
        this.add.circle(33, 154, 2, 0x00FF00);
        this.add.circle(38, 154, 2, 0x00FF00);
        // Cat whiskers
        bg.lineStyle(1, 0xFFFFFF);
        bg.lineBetween(28, 158, 24, 156);
        bg.lineBetween(28, 160, 24, 160);
        bg.lineBetween(43, 158, 47, 156);
        bg.lineBetween(43, 160, 47, 160);

        // --- MC ESCHER INSPIRED PRINT (geometric impossible shapes) ---
        // Black frame
        bg.fillStyle(0x1a1a1a);
        bg.fillRect(295, 130, 55, 70);
        // White mat
        bg.fillStyle(0xFFFFF0);
        bg.fillRect(299, 134, 47, 62);
        // Gray background
        bg.fillStyle(0x808080);
        bg.fillRect(302, 137, 41, 56);
        // Impossible stairs/geometric pattern
        bg.fillStyle(0x2d2d2d);
        // Ascending stairs that loop (Escher-style)
        for (let i = 0; i < 5; i++) {
            bg.fillRect(305 + i * 7, 145 + i * 8, 10, 6);
            bg.fillRect(305 + i * 7, 151 + i * 8, 3, 10);
        }
        // Descending stairs connecting back
        bg.fillStyle(0x4a4a4a);
        for (let i = 0; i < 5; i++) {
            bg.fillRect(335 - i * 6, 150 + i * 7, 8, 5);
        }
        // Impossible cube in corner
        bg.lineStyle(2, 0x000000);
        bg.lineBetween(308, 175, 318, 170);
        bg.lineBetween(318, 170, 328, 175);
        bg.lineBetween(328, 175, 318, 180);
        bg.lineBetween(318, 180, 308, 175);
        bg.lineBetween(313, 165, 313, 175);
        bg.lineBetween(323, 165, 323, 175);

        // --- SMALL ABSTRACT PRINT (above piano) ---
        bg.fillStyle(0x5D4037);  // Dark wood frame
        bg.fillRect(width - 75, 140, 35, 45);
        bg.fillStyle(0xE0E0E0);  // Light canvas
        bg.fillRect(width - 72, 143, 29, 39);
        // Abstract colorful shapes
        this.add.circle(width - 62, 155, 8, 0xFF6B6B);
        this.add.circle(width - 52, 165, 6, 0x4ECDC4);
        bg.fillStyle(0xFFE66D);
        bg.fillRect(width - 68, 170, 12, 8);

        // Chapter title
        this.add.text(width / 2, 30, 'Chapter 4', {
            fontSize: '14px',
            fill: '#888'
        }).setOrigin(0.5);

        this.add.text(width / 2, 55, 'Cozy Night In', {
            fontSize: '24px',
            fill: '#FF69B4',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Instructions
        this.add.text(width / 2, 90, 'Catch the falling items!', {
            fontSize: '14px',
            fill: '#fff',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Score display
        this.scoreText = this.add.text(width / 2, 115, 'Caught: 0/' + this.targetScore, {
            fontSize: '16px',
            fill: '#FFD700',
            stroke: '#000',
            strokeThickness: 1
        }).setOrigin(0.5);

        // ===== BARRETT with electric keyboard (sitting on the couch) =====
        const barrettY = height - 120 - 55;  // floorY - 55
        this.barrett = this.add.image(width / 2 + 25, barrettY, 'barrett_keyboard');
        this.barrett.setScale(2.5);  // Increased scale for better visibility

        // Musical notes floating from Barrett
        this.createMusicalNotes();

        // Smoke clouds - peaceful atmosphere
        this.createSmokeClouds();

        // ===== TV OFF-SCREEN (movie titles show as thought bubbles) =====
        this.movieTitles = ['House', 'Twister', 'Portrait', 'Oz'];
        this.currentMovie = 0;
        // Movie reference appears near couch
        this.movieText = this.add.text(width / 2 - 50, height - 220, this.movieTitles[0], {
            fontSize: '10px',
            fill: '#fff',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: { x: 4, y: 2 }
        }).setOrigin(0.5).setAlpha(0.7);

        this.time.addEvent({
            delay: 3000,
            callback: () => {
                this.currentMovie = (this.currentMovie + 1) % this.movieTitles.length;
                this.movieText.setText(this.movieTitles[this.currentMovie]);
            },
            loop: true
        });

        // Emma (catcher) at bottom
        this.emma = this.add.image(width / 2, height - 60, 'emma_walk_0');
        this.emma.setScale(2.5);  // Increased scale to match apartment scale

        // Falling items group
        this.items = this.physics.add.group();

        // Spawn items timer
        this.spawnTimer = this.time.addEvent({
            delay: 1200,
            callback: this.spawnItem,
            callbackScope: this,
            loop: true
        });

        // "What da hell" random text
        this.time.addEvent({
            delay: 5000,
            callback: this.showWhatDaHell,
            callbackScope: this,
            loop: true
        });

        // Setup controls (simplified - just left/right)
        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.on('pointermove', (pointer) => {
            if (this.gameActive) {
                this.emma.x = Phaser.Math.Clamp(pointer.x, 30, width - 30);
            }
        });

        // Collision for catching items
        this.catchZone = this.add.rectangle(width / 2, height - 50, width, 40, 0x000000, 0);
        this.physics.add.existing(this.catchZone, true);

        // Create heart UI
        this.createHeartUI();
        this.dialogue = new DialogueBox(this);

        // Fade in
        this.cameras.main.fadeIn(500);
        console.log('Level4_CozyNight: create() completed successfully');

        // ========== COZY NIGHT AMBIENT EFFECTS ==========
        this.createCozyNightAmbientEffects(width, height, floorY);
    }

    createCozyNightAmbientEffects(width, height, floorY) {
        // ===== LAMP LIGHT FLICKER =====
        this.lampGlow = this.add.circle(35, height - 300, 100, 0xFFE4B5, 0);
        this.tweens.add({
            targets: this.lampGlow,
            alpha: 0.12,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // ===== WINDOW STAR TWINKLE =====
        this.twinklingStars = [];
        const windowPositions = [20, 133, 245];
        windowPositions.forEach(wx => {
            for (let i = 0; i < 4; i++) {
                const star = this.add.circle(
                    wx + 20 + Math.random() * 60,
                    90 + Math.random() * 100,
                    Math.random() * 3 + 2,
                    0xFFF44F,
                    0
                );
                star.phase = Math.random() * Math.PI * 2;
                star.baseAlpha = 0.4 + Math.random() * 0.4;
                this.twinklingStars.push(star);
            }
        });

        // ===== MOONLIGHT SHIMMER =====
        this.moonlight = this.add.ellipse(width / 2, 180, 280, 100, 0x6B8CAE, 0);
        this.tweens.add({
            targets: this.moonlight,
            alpha: 0.06,
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // ===== FLOATING DUST IN LAMPLIGHT =====
        this.lampDust = [];
        for (let i = 0; i < 12; i++) {
            const dust = this.add.circle(
                20 + Math.random() * 60,
                height - 350 + Math.random() * 150,
                Math.random() * 1.5 + 0.5,
                0xFFE4B5,
                0
            );
            dust.baseX = dust.x;
            dust.baseY = dust.y;
            dust.phase = Math.random() * Math.PI * 2;
            this.lampDust.push(dust);
        }

        // ===== FLOOR REFLECTION SHIMMER =====
        this.floorReflection = this.add.rectangle(
            width / 2,
            floorY + 25,
            180,
            35,
            0xD4A574,
            0
        );
        this.tweens.add({
            targets: this.floorReflection,
            alpha: 0.12,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // ===== GUITAR STRINGS VIBRATION =====
        this.guitarVibration = this.add.rectangle(
            width / 2 + 30,
            height - 170,
            25,
            2,
            0xFFD700,
            0
        );
        this.tweens.add({
            targets: this.guitarVibration,
            scaleY: 1.5,
            alpha: 0.4,
            duration: 150,
            yoyo: true,
            repeat: -1
        });

        // ===== EMMA SHADOW =====
        this.emmaShadowL4 = this.add.ellipse(width / 2, height - 45, 30, 10, 0x000000, 0.2);

        // ===== COZY WARMTH VIGNETTE =====
        this.warmthOverlay = this.add.graphics();
        this.warmthOverlay.fillStyle(0xFF8C00, 0.02);
        this.warmthOverlay.fillRect(0, 0, width, height);
    }

    updateCozyNightAmbientEffects(time) {
        // ===== STAR TWINKLE =====
        if (this.twinklingStars) {
            this.twinklingStars.forEach(star => {
                star.setAlpha(star.baseAlpha * (0.5 + Math.sin(time * 0.003 + star.phase) * 0.5));
            });
        }

        // ===== LAMP DUST FLOAT =====
        if (this.lampDust) {
            this.lampDust.forEach(dust => {
                dust.x = dust.baseX + Math.sin(time * 0.001 + dust.phase) * 8;
                dust.y = dust.baseY + Math.cos(time * 0.0008 + dust.phase) * 6;
                dust.setAlpha(0.25 + Math.sin(time * 0.002 + dust.phase) * 0.15);
            });
        }

        // ===== EMMA SHADOW FOLLOW =====
        if (this.emmaShadowL4 && this.emma) {
            this.emmaShadowL4.x = this.emma.x;
        }
    }

    createMusicalNotes() {
        for (let i = 0; i < 6; i++) {
            // Notes come from Barrett on the couch (center of screen)
            const note = this.add.image(
                this.scale.width / 2 + 25 + Phaser.Math.Between(-30, 30),
                this.scale.height - 180,
                'music_note'
            ).setScale(1.2);

            this.tweens.add({
                targets: note,
                y: note.y - 80,
                x: note.x + Phaser.Math.Between(-30, 30),
                alpha: 0,
                duration: 2500 + i * 400,
                repeat: -1,
                delay: i * 350
            });
        }
    }

    createSmokeClouds() {
        for (let i = 0; i < 3; i++) {
            const cloud = this.add.image(
                Phaser.Math.Between(50, this.scale.width - 50),
                Phaser.Math.Between(200, 400),
                'smoke_puff'
            ).setScale(2).setAlpha(0.3);

            this.tweens.add({
                targets: cloud,
                x: cloud.x + Phaser.Math.Between(-50, 50),
                y: cloud.y - 30,
                alpha: 0.1,
                duration: 4000 + i * 1000,
                yoyo: true,
                repeat: -1
            });
        }
    }

    spawnItem() {
        if (!this.gameActive) return;

        const { width } = this.scale;
        const itemTypes = ['popcorn', 'remote', 'alfredo', 'salad', 'leaf'];

        const itemType = Phaser.Utils.Array.GetRandom(itemTypes);
        const item = this.add.image(
            Phaser.Math.Between(40, width - 40),
            -30,
            itemType
        ).setScale(2);

        this.physics.add.existing(item);
        item.body.setVelocityY(150);
        item.body.setAllowGravity(false);
        item.itemName = itemType;
        this.items.add(item);
    }

    showWhatDaHell() {
        if (!this.gameActive) return;

        const text = this.add.text(
            Phaser.Math.Between(50, this.scale.width - 100),
            Phaser.Math.Between(150, 300),
            'What da hell',
            {
                fontSize: '16px',
                fill: '#FF69B4',
                backgroundColor: '#000',
                padding: { x: 8, y: 4 }
            }
        );

        this.tweens.add({
            targets: text,
            alpha: 0,
            y: text.y - 30,
            duration: 2000,
            onComplete: () => text.destroy()
        });
    }

    update(time, delta) {
        // ===== AMBIENT EFFECTS =====
        this.updateCozyNightAmbientEffects(time);

        if (!this.gameActive) return;

        const { width, height } = this.scale;

        // Keyboard movement
        if (this.cursors.left.isDown) {
            this.emma.x -= 5;
        } else if (this.cursors.right.isDown) {
            this.emma.x += 5;
        }

        // Clamp position
        this.emma.x = Phaser.Math.Clamp(this.emma.x, 30, width - 30);

        // Check item collisions
        this.items.getChildren().forEach(item => {
            // Catch item
            if (item.y > height - 90 && item.y < height - 40) {
                const dx = Math.abs(item.x - this.emma.x);
                if (dx < 40) {
                    this.catchItem(item);
                }
            }

            // Remove if fallen through
            if (item.y > height + 50) {
                item.destroy();
            }
        });
    }

    catchItem(item) {
        // Show "Grandpa" text occasionally
        if (item.itemName === 'leaf' && Math.random() > 0.5) {
            const grandpaText = this.add.text(item.x, item.y, 'Grandpa!', {
                fontSize: '12px',
                fill: '#fff',
                backgroundColor: '#E91E63',
                padding: { x: 5, y: 3 }
            });
            this.tweens.add({
                targets: grandpaText,
                y: grandpaText.y - 40,
                alpha: 0,
                duration: 1000,
                onComplete: () => grandpaText.destroy()
            });
        }

        item.destroy();
        this.score++;
        GameState.heartsCollected++;
        this.updateHeartUI();
        this.scoreText.setText('Caught: ' + this.score + '/' + this.targetScore);

        // Check win
        if (this.score >= this.targetScore) {
            this.winGame();
        }
    }

    winGame() {
        this.gameActive = false;
        if (this.spawnTimer) {
            this.spawnTimer.remove();
        }

        this.dialogue.show("Perfect cozy night together...", "", () => {
            this.dialogue.show("Movie marathons, keyboard serenades, and each other.", "", () => {
                this.transitionTo('Level5_LongDrive');
            });
        });
    }

    shutdown() {
        // Clean up timers and events when scene is shut down
        if (this.spawnTimer) {
            this.spawnTimer.remove();
            this.spawnTimer = null;
        }
        this.time.removeAllEvents();
        this.input.removeAllListeners();
    }
}

// ============================================
// LEVEL 5: THE LONG DRIVE HOME
// ============================================
class Level5_LongDrive extends BaseLevel {
    constructor() {
        super('Level5_LongDrive');
        this.distance = 120; // Miles to STL
        this.gameActive = true;
        this.roadSpeed = 5;
        this.roadLineOffset = 0;
    }

    create() {
        const { width, height } = this.scale;

        // ========== SKY (gradient sunset) ==========
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xFFB74D, 0xFF8C00, 1);
        bg.fillRect(0, 0, width, 200);

        // Clouds
        for (let i = 0; i < 4; i++) {
            const cloud = this.add.ellipse(
                Phaser.Math.Between(30, width - 30),
                Phaser.Math.Between(40, 120),
                Phaser.Math.Between(40, 80),
                Phaser.Math.Between(20, 35),
                0xFFFFFF, 0.8
            );
            this.tweens.add({
                targets: cloud,
                x: cloud.x + 30,
                duration: 8000 + i * 2000,
                yoyo: true,
                repeat: -1
            });
        }

        // ========== GRASS/FIELDS on sides ==========
        bg.fillStyle(0x7CB342);
        bg.fillRect(0, 200, width, height - 200);

        // Grass texture stripes (farmland)
        bg.fillStyle(0x8BC34A);
        for (let i = 0; i < 8; i++) {
            bg.fillRect(0, 210 + i * 50, 60, 20);
            bg.fillRect(width - 60, 210 + i * 50, 60, 20);
        }

        // ========== ROAD (3 lanes) ==========
        const roadLeft = 70;
        const roadRight = width - 70;
        const roadWidth = roadRight - roadLeft;

        // Road surface
        bg.fillStyle(0x424242);
        bg.fillRect(roadLeft, 200, roadWidth, height - 200);

        // Road shoulders (white lines on edges)
        bg.fillStyle(0xFFFFFF);
        bg.fillRect(roadLeft, 200, 4, height - 200);
        bg.fillRect(roadRight - 4, 200, 4, height - 200);

        // ========== DASHED CENTER LINES (animated) ==========
        this.roadLines = [];
        const laneWidth = roadWidth / 3;

        // Two sets of dashed lines (between 3 lanes)
        for (let lane = 1; lane <= 2; lane++) {
            const lineX = roadLeft + lane * laneWidth;
            for (let i = 0; i < 12; i++) {
                const line = this.add.rectangle(lineX, 180 + i * 50, 6, 30, 0xFFEB3B);
                this.roadLines.push(line);
            }
        }

        // ========== CHAPTER TITLE ==========
        this.add.text(width / 2, 25, 'Chapter 5', {
            fontSize: '12px',
            fill: '#333'
        }).setOrigin(0.5);

        this.add.text(width / 2, 48, 'The Long Drive Home', {
            fontSize: '18px',
            fill: '#E91E63',
            fontStyle: 'bold',
            stroke: '#fff',
            strokeThickness: 2
        }).setOrigin(0.5);

        // ========== SPEEDOMETER (85 MPH!) ==========
        const speedBg = this.add.graphics();
        speedBg.fillStyle(0x1a1a1a);
        speedBg.fillRect(10, 70, 70, 40);
        speedBg.lineStyle(2, 0xFF0000);
        speedBg.strokeRect(10, 70, 70, 40);

        this.add.text(45, 82, '85', {
            fontSize: '20px',
            fill: '#FF0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(45, 100, 'MPH', {
            fontSize: '10px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Speed needle wobble effect
        const speedNeedle = this.add.text(70, 90, '▶', {
            fontSize: '10px',
            fill: '#FF0000'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: speedNeedle,
            y: 88,
            duration: 200,
            yoyo: true,
            repeat: -1
        });

        // ========== DISTANCE COUNTER (highway style) ==========
        const distBg = this.add.graphics();
        distBg.fillStyle(0x006B3C);
        distBg.fillRect(width / 2 - 55, 70, 110, 35);
        distBg.lineStyle(2, 0xFFFFFF);
        distBg.strokeRect(width / 2 - 55, 70, 110, 35);

        this.add.image(width / 2 - 40, 87, 'city_icon').setScale(0.8);
        this.distanceText = this.add.text(width / 2 + 10, 87, 'STL ' + this.distance + ' mi', {
            fontSize: '12px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // ========== EMMA'S WHITE SEDAN ==========
        this.car = this.add.container(width / 2, height - 80);

        const carGfx = this.add.graphics();
        // Car body (white sedan)
        carGfx.fillStyle(0xF5F5F5);
        carGfx.fillRect(-20, -10, 40, 30);  // Main body
        // Car roof/cabin
        carGfx.fillStyle(0xE0E0E0);
        carGfx.fillRect(-15, -25, 30, 18);
        // Windows (blue tint)
        carGfx.fillStyle(0x87CEEB);
        carGfx.fillRect(-12, -23, 24, 12);
        // Rear window
        carGfx.fillRect(-10, 5, 20, 8);
        // Headlights
        carGfx.fillStyle(0xFFEB3B);
        carGfx.fillRect(-18, -12, 6, 4);
        carGfx.fillRect(12, -12, 6, 4);
        // Taillights
        carGfx.fillStyle(0xFF0000);
        carGfx.fillRect(-18, 16, 6, 4);
        carGfx.fillRect(12, 16, 6, 4);
        // Wheels
        carGfx.fillStyle(0x1a1a1a);
        carGfx.fillRect(-22, -5, 6, 12);
        carGfx.fillRect(16, -5, 6, 12);
        carGfx.fillRect(-22, 10, 6, 12);
        carGfx.fillRect(16, 10, 6, 12);

        this.car.add(carGfx);

        // Emma sprite in car
        const emmaInCar = this.add.image(0, -15, 'emma_walk_0').setScale(0.5);
        this.car.add(emmaInCar);

        // ========== GROUPS ==========
        this.obstacles = this.add.group();
        this.hearts = this.add.group();
        this.signs = this.add.group();
        this.billboards = this.add.group();
        this.cops = this.add.group();

        // ========== SPAWN TIMERS ==========
        this.time.addEvent({
            delay: 2500,
            callback: this.spawnObstacle,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 4000,
            callback: this.spawnHeart,
            callbackScope: this,
            loop: true
        });

        // Highway signs (I-70, I-64)
        this.time.addEvent({
            delay: 3500,
            callback: this.spawnHighwaySign,
            callbackScope: this,
            loop: true
        });

        // Billboards
        this.time.addEvent({
            delay: 6000,
            callback: this.spawnBillboard,
            callbackScope: this,
            loop: true
        });

        // Mile markers
        this.time.addEvent({
            delay: 8000,
            callback: this.spawnMileMarker,
            callbackScope: this,
            loop: true
        });

        // Police officers with speed guns!
        this.time.addEvent({
            delay: 7000,
            callback: this.spawnCop,
            callbackScope: this,
            loop: true
        });

        // Emma's speeding dialogue
        this.time.addEvent({
            delay: 10000,
            callback: this.showSpeedingDialogue,
            callbackScope: this,
            loop: true
        });

        // Distance countdown
        this.time.addEvent({
            delay: 600,
            callback: () => {
                if (this.gameActive && this.distance > 0) {
                    this.distance -= 2;
                    this.distanceText.setText('STL ' + Math.max(0, this.distance) + ' mi');

                    if (this.distance <= 0) {
                        this.reachSTL();
                    }
                }
            },
            loop: true
        });

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.on('pointermove', (pointer) => {
            if (this.gameActive) {
                this.car.x = Phaser.Math.Clamp(pointer.x, 95, width - 95);
            }
        });

        // Heart UI
        this.createHeartUI();
        this.dialogue = new DialogueBox(this);

        // Fade in
        this.cameras.main.fadeIn(500);

        // Initial highway sign
        this.time.delayedCall(1000, () => this.spawnHighwaySign());

        // First speeding comment
        this.time.delayedCall(3000, () => this.showSpeedingDialogue());

        // Create ambient effects
        this.createLongDriveAmbientEffects(width, height);
    }

    createLongDriveAmbientEffects(width, height) {
        // ========== SUN RAYS FROM HORIZON ==========
        this.sunRays = [];
        for (let i = 0; i < 5; i++) {
            const ray = this.add.graphics();
            ray.fillStyle(0xFFD700, 0.08);
            ray.beginPath();
            ray.moveTo(width / 2 + (i - 2) * 30, 200);
            ray.lineTo(width / 2 + (i - 2) * 80 - 40, 0);
            ray.lineTo(width / 2 + (i - 2) * 80 + 40, 0);
            ray.closePath();
            ray.fill();
            ray.setDepth(1);
            this.sunRays.push({ graphics: ray, phase: i * 0.7 });
        }

        // ========== PARALLAX TREES ON SIDES ==========
        this.parallaxTrees = [];
        const treeColors = [0x1B5E20, 0x2E7D32, 0x388E3C];
        for (let i = 0; i < 8; i++) {
            const side = i % 2 === 0 ? 'left' : 'right';
            const x = side === 'left' ? Phaser.Math.Between(-10, 30) : Phaser.Math.Between(width - 30, width + 10);
            const tree = this.add.graphics();
            const color = Phaser.Utils.Array.GetRandom(treeColors);
            const treeHeight = Phaser.Math.Between(40, 70);

            tree.fillStyle(0x5D4037);
            tree.fillRect(-3, 0, 6, treeHeight * 0.4);
            tree.fillStyle(color);
            tree.fillTriangle(-15, treeHeight * 0.4, 15, treeHeight * 0.4, 0, -treeHeight * 0.6);
            tree.fillStyle(color + 0x111111);
            tree.fillTriangle(-12, treeHeight * 0.2, 12, treeHeight * 0.2, 0, -treeHeight * 0.4);

            tree.setPosition(x, Phaser.Math.Between(-100, height));
            tree.setDepth(5);
            this.parallaxTrees.push({ graphics: tree, speed: Phaser.Math.FloatBetween(1.5, 2.5), side });
        }

        // ========== FARMLAND PATTERNS (parallax fields) ==========
        this.farmPatches = [];
        for (let i = 0; i < 6; i++) {
            const side = i % 2 === 0 ? 'left' : 'right';
            const patch = this.add.graphics();
            const patchColor = Phaser.Utils.Array.GetRandom([0x8BC34A, 0x7CB342, 0x689F38, 0xC5A02C]);
            patch.fillStyle(patchColor, 0.7);
            const patchWidth = Phaser.Math.Between(30, 50);
            const patchHeight = Phaser.Math.Between(20, 35);
            patch.fillRect(-patchWidth / 2, -patchHeight / 2, patchWidth, patchHeight);

            const x = side === 'left' ? Phaser.Math.Between(10, 50) : Phaser.Math.Between(width - 50, width - 10);
            patch.setPosition(x, Phaser.Math.Between(-50, height));
            patch.setDepth(3);
            this.farmPatches.push({ graphics: patch, speed: 1.8, side });
        }

        // ========== CAR EXHAUST/DUST ==========
        this.exhaustParticles = [];
        for (let i = 0; i < 6; i++) {
            const particle = this.add.circle(0, 0, Phaser.Math.Between(2, 4), 0x888888, 0.4);
            particle.setVisible(false);
            particle.setDepth(50);
            this.exhaustParticles.push({
                circle: particle,
                active: false,
                vx: 0,
                vy: 0,
                life: 0
            });
        }
        this.exhaustTimer = 0;

        // ========== ROAD TEXTURE DETAILS ==========
        this.roadCracks = [];
        for (let i = 0; i < 4; i++) {
            const crack = this.add.graphics();
            crack.lineStyle(1, 0x2a2a2a, 0.5);
            crack.beginPath();
            crack.moveTo(0, 0);
            crack.lineTo(Phaser.Math.Between(-10, 10), Phaser.Math.Between(15, 25));
            crack.lineTo(Phaser.Math.Between(-5, 5), Phaser.Math.Between(30, 40));
            crack.stroke();
            crack.setPosition(Phaser.Math.Between(90, width - 90), Phaser.Math.Between(-50, height));
            crack.setDepth(15);
            this.roadCracks.push(crack);
        }

        // ========== DASHBOARD GLOW ==========
        this.dashboardGlow = this.add.rectangle(width / 2, height - 30, 120, 20, 0x00FF00, 0.1);
        this.dashboardGlow.setDepth(55);

        // ========== SPEEDOMETER NEEDLE WOBBLE ==========
        // The speedometer already exists, we'll animate it in update

        // ========== PASSING BIRDS IN SKY ==========
        this.skyBirds = [];
        this.birdSpawnTimer = this.time.addEvent({
            delay: 5000,
            callback: () => {
                if (this.skyBirds.length < 3) {
                    const bird = this.add.text(
                        Phaser.Math.Between(0, 1) === 0 ? -20 : width + 20,
                        Phaser.Math.Between(50, 150),
                        'bird'
                    ).setScale(0.7);
                    bird.setDepth(2);
                    const direction = bird.x < 0 ? 1 : -1;
                    this.skyBirds.push({ sprite: bird, direction, speed: Phaser.Math.FloatBetween(1, 2) });
                }
            },
            loop: true
        });

        // ========== LENS FLARE FROM SUN ==========
        this.lensFlare = this.add.circle(width / 2, 180, 60, 0xFFFFFF, 0.15);
        this.lensFlare.setDepth(2);

        this.lensFlareSecondary = this.add.circle(width / 2 + 40, 220, 20, 0xFFD700, 0.1);
        this.lensFlareSecondary.setDepth(2);

        // ========== CLOUD SHADOWS ON ROAD ==========
        this.cloudShadows = [];
        for (let i = 0; i < 2; i++) {
            const shadow = this.add.ellipse(
                Phaser.Math.Between(100, width - 100),
                Phaser.Math.Between(-100, height),
                80,
                30,
                0x000000,
                0.15
            );
            shadow.setDepth(14);
            this.cloudShadows.push(shadow);
        }

        // ========== HEAT WAVES ON ROAD ==========
        this.heatWaves = [];
        for (let i = 0; i < 3; i++) {
            const wave = this.add.graphics();
            wave.lineStyle(2, 0xFFFFFF, 0.1);
            wave.beginPath();
            for (let x = 70; x < width - 70; x += 5) {
                const waveY = 250 + i * 80;
                if (x === 70) {
                    wave.moveTo(x, waveY);
                } else {
                    wave.lineTo(x, waveY + Math.sin(x * 0.1) * 2);
                }
            }
            wave.stroke();
            wave.setDepth(16);
            this.heatWaves.push({ graphics: wave, phase: i * 1.5, baseY: 250 + i * 80 });
        }

        // ========== REFLECTIVE CAR SHINE ==========
        this.carShine = this.add.rectangle(0, -12, 15, 4, 0xFFFFFF, 0.3);
        this.car.add(this.carShine);
    }

    updateLongDriveAmbientEffects(time) {
        const { width, height } = this.scale;

        // ========== ANIMATE SUN RAYS ==========
        this.sunRays.forEach(ray => {
            const pulse = 0.05 + Math.sin(time * 0.001 + ray.phase) * 0.03;
            ray.graphics.setAlpha(pulse);
        });

        // ========== MOVE PARALLAX TREES ==========
        this.parallaxTrees.forEach(tree => {
            tree.graphics.y += tree.speed;
            if (tree.graphics.y > height + 80) {
                tree.graphics.y = -80;
                tree.graphics.x = tree.side === 'left'
                    ? Phaser.Math.Between(-10, 30)
                    : Phaser.Math.Between(width - 30, width + 10);
            }
        });

        // ========== MOVE FARM PATCHES ==========
        this.farmPatches.forEach(patch => {
            patch.graphics.y += patch.speed;
            if (patch.graphics.y > height + 50) {
                patch.graphics.y = -50;
                patch.graphics.x = patch.side === 'left'
                    ? Phaser.Math.Between(10, 50)
                    : Phaser.Math.Between(width - 50, width - 10);
            }
        });

        // ========== ANIMATE EXHAUST PARTICLES ==========
        this.exhaustTimer += 16;
        if (this.exhaustTimer > 100) {
            this.exhaustTimer = 0;
            const inactiveParticle = this.exhaustParticles.find(p => !p.active);
            if (inactiveParticle) {
                inactiveParticle.active = true;
                inactiveParticle.circle.setVisible(true);
                inactiveParticle.circle.setPosition(this.car.x, this.car.y + 25);
                inactiveParticle.circle.setAlpha(0.4);
                inactiveParticle.vx = Phaser.Math.FloatBetween(-0.5, 0.5);
                inactiveParticle.vy = Phaser.Math.FloatBetween(1, 2);
                inactiveParticle.life = 40;
            }
        }

        this.exhaustParticles.forEach(p => {
            if (p.active) {
                p.circle.x += p.vx;
                p.circle.y += p.vy;
                p.life--;
                p.circle.setAlpha(p.life / 60);
                if (p.life <= 0) {
                    p.active = false;
                    p.circle.setVisible(false);
                }
            }
        });

        // ========== MOVE ROAD CRACKS ==========
        this.roadCracks.forEach(crack => {
            crack.y += 4;
            if (crack.y > height + 50) {
                crack.y = -50;
                crack.x = Phaser.Math.Between(90, width - 90);
            }
        });

        // ========== DASHBOARD GLOW PULSE ==========
        const dashPulse = 0.08 + Math.sin(time * 0.003) * 0.04;
        this.dashboardGlow.setAlpha(dashPulse);

        // ========== MOVE SKY BIRDS ==========
        this.skyBirds.forEach((bird, idx) => {
            bird.sprite.x += bird.direction * bird.speed;
            bird.sprite.y += Math.sin(time * 0.005 + idx) * 0.3;
            if (bird.sprite.x < -30 || bird.sprite.x > width + 30) {
                bird.sprite.destroy();
                this.skyBirds.splice(idx, 1);
            }
        });

        // ========== LENS FLARE SHIMMER ==========
        const flareAlpha = 0.1 + Math.sin(time * 0.002) * 0.05;
        this.lensFlare.setAlpha(flareAlpha);
        this.lensFlareSecondary.setAlpha(flareAlpha * 0.6);

        // ========== MOVE CLOUD SHADOWS ==========
        this.cloudShadows.forEach(shadow => {
            shadow.y += 1.5;
            if (shadow.y > height + 50) {
                shadow.y = -50;
                shadow.x = Phaser.Math.Between(100, width - 100);
            }
        });

        // ========== ANIMATE HEAT WAVES ==========
        this.heatWaves.forEach(wave => {
            wave.graphics.clear();
            wave.graphics.lineStyle(2, 0xFFFFFF, 0.08 + Math.sin(time * 0.002 + wave.phase) * 0.04);
            wave.graphics.beginPath();
            for (let x = 70; x < width - 70; x += 5) {
                const waveY = wave.baseY + Math.sin(time * 0.003 + wave.phase) * 3;
                if (x === 70) {
                    wave.graphics.moveTo(x, waveY + Math.sin((x + time * 0.5) * 0.1) * 3);
                } else {
                    wave.graphics.lineTo(x, waveY + Math.sin((x + time * 0.5) * 0.1) * 3);
                }
            }
            wave.graphics.stroke();
        });

        // ========== CAR SHINE SHIMMER ==========
        const shineAlpha = 0.2 + Math.sin(time * 0.004) * 0.1;
        this.carShine.setAlpha(shineAlpha);
    }

    spawnObstacle() {
        if (!this.gameActive) return;

        const { width } = this.scale;
        const roadLeft = 70;
        const laneWidth = (width - 140) / 3;
        const lanes = [roadLeft + laneWidth * 0.5, roadLeft + laneWidth * 1.5, roadLeft + laneWidth * 2.5];
        const lane = Phaser.Utils.Array.GetRandom(lanes);

        // Other cars (various colors)
        const carColors = [0x3498DB, 0xE74C3C, 0x27AE60, 0x9B59B6, 0xF39C12];
        const carColor = Phaser.Utils.Array.GetRandom(carColors);

        const obstacle = this.add.container(lane, -60);

        const otherCar = this.add.graphics();
        otherCar.fillStyle(carColor);
        otherCar.fillRect(-15, -8, 30, 25);
        otherCar.fillStyle(carColor - 0x222222);
        otherCar.fillRect(-10, -18, 20, 12);
        otherCar.fillStyle(0x87CEEB);
        otherCar.fillRect(-8, -16, 16, 8);
        otherCar.fillStyle(0x1a1a1a);
        otherCar.fillRect(-17, -3, 5, 10);
        otherCar.fillRect(12, -3, 5, 10);
        obstacle.add(otherCar);

        this.obstacles.add(obstacle);
    }

    spawnHeart() {
        if (!this.gameActive) return;

        const { width } = this.scale;
        const heart = this.add.image(
            Phaser.Math.Between(90, width - 90),
            -30,
            Phaser.Utils.Array.GetRandom(['heart', 'heart_red', 'heart_gold'])
        ).setScale(1.5).setOrigin(0.5);
        this.hearts.add(heart);
    }

    spawnHighwaySign() {
        if (!this.gameActive) return;

        const { width } = this.scale;
        const side = Phaser.Math.Between(0, 1) === 0 ? 'left' : 'right';
        const x = side === 'left' ? 35 : width - 35;

        // Highway sign types
        const signTypes = [
            { text: 'I-70 E\nSt. Louis', color: 0x006B3C },
            { text: 'I-64 W\nSt. Louis', color: 0x006B3C },
            { text: 'EXIT 210\nWentzville', color: 0x006B3C },
            { text: 'EXIT 228\nSt. Charles', color: 0x006B3C },
            { text: 'STL\n→ 45 mi', color: 0x006B3C },
            { text: 'REST AREA\n2 miles', color: 0x0000AA },
            { text: 'SPEED\nLIMIT 70', color: 0xFFFFFF }
        ];

        const signType = Phaser.Utils.Array.GetRandom(signTypes);

        const signContainer = this.add.container(x, -80);

        // Sign post
        const post = this.add.rectangle(0, 50, 4, 60, 0x808080);
        signContainer.add(post);

        // Sign background
        const signBg = this.add.rectangle(0, 0, 55, 45, signType.color);
        signBg.setStrokeStyle(2, 0xFFFFFF);
        signContainer.add(signBg);

        // Sign text
        const textColor = signType.color === 0xFFFFFF ? '#000' : '#fff';
        const signText = this.add.text(0, 0, signType.text, {
            fontSize: '8px',
            fill: textColor,
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        signContainer.add(signText);

        this.signs.add(signContainer);
    }

    spawnBillboard() {
        if (!this.gameActive) return;

        const { width } = this.scale;
        const side = Phaser.Math.Between(0, 1) === 0 ? 'left' : 'right';
        const x = side === 'left' ? 25 : width - 25;

        const billboardTexts = [
            'Worth\nEvery Mile',
            'Almost\nHome!',
            'COFFEE\nNEXT EXIT',
            'EAT AT\nJOE\'S',
            'GAS\n$2.89',
            'LIVE\nMUSIC',
            'Emma\nI love you'
        ];

        const billboardText = Phaser.Utils.Array.GetRandom(billboardTexts);

        const billboard = this.add.container(x, -100);

        // Billboard posts
        const post1 = this.add.rectangle(-20, 55, 4, 50, 0x8B4513);
        const post2 = this.add.rectangle(20, 55, 4, 50, 0x8B4513);
        billboard.add([post1, post2]);

        // Billboard background
        const bg = this.add.rectangle(0, 0, 60, 40, 0xFFFFFF);
        bg.setStrokeStyle(2, 0x333333);
        billboard.add(bg);

        // Billboard text
        const text = this.add.text(0, 0, billboardText, {
            fontSize: '7px',
            fill: '#333',
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        billboard.add(text);

        this.billboards.add(billboard);
    }

    spawnMileMarker() {
        if (!this.gameActive) return;

        const { width } = this.scale;
        const x = Phaser.Math.Between(0, 1) === 0 ? 55 : width - 55;

        const marker = this.add.container(x, -30);

        // Green mile marker
        const markerBg = this.add.rectangle(0, 0, 20, 25, 0x006B3C);
        marker.add(markerBg);

        const mileNum = this.add.text(0, 0, Math.floor(this.distance).toString(), {
            fontSize: '10px',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        marker.add(mileNum);

        this.signs.add(marker);
    }

    spawnCop() {
        if (!this.gameActive) return;

        const { width } = this.scale;
        const side = Phaser.Math.Between(0, 1) === 0 ? 'left' : 'right';
        const x = side === 'left' ? 35 : width - 35;

        const cop = this.add.container(x, -80);

        // Police car (black and white)
        const copCar = this.add.graphics();
        copCar.fillStyle(0x1a1a1a);
        copCar.fillRect(-18, 10, 36, 25);
        copCar.fillStyle(0xFFFFFF);
        copCar.fillRect(-15, 15, 30, 15);
        // Light bar on top
        copCar.fillStyle(0xFF0000);
        copCar.fillRect(-10, 5, 8, 6);
        copCar.fillStyle(0x0000FF);
        copCar.fillRect(2, 5, 8, 6);
        cop.add(copCar);

        // Police officer (simple shape)
        const officerX = side === 'left' ? 25 : -25;
        const officerBody = this.add.rectangle(officerX, 22, 10, 14, 0x1E3A5F);  // Blue uniform
        const officerHead = this.add.circle(officerX, 12, 5, 0xFFDBAC);  // Head
        const officerHat = this.add.rectangle(officerX, 8, 10, 4, 0x1E3A5F);  // Hat
        cop.add([officerBody, officerHead, officerHat]);

        // Speed gun (simple radar device)
        const gunX = side === 'left' ? 35 : -35;
        const gunBody = this.add.rectangle(gunX, 25, 8, 12, 0x333333);
        const gunDish = this.add.circle(gunX + (side === 'left' ? 4 : -4), 22, 5, 0x666666);
        cop.add([gunBody, gunDish]);

        // "85 MPH" readout appears briefly
        const readout = this.add.text(side === 'left' ? 45 : -45, 10, '85!', {
            fontSize: '10px',
            fill: '#FF0000',
            fontStyle: 'bold',
            backgroundColor: '#000',
            padding: { x: 2, y: 1 }
        }).setOrigin(0.5);
        cop.add(readout);

        // Cop shakes head but doesn't pull over
        this.tweens.add({
            targets: officer,
            x: officer.x + 3,
            duration: 150,
            yoyo: true,
            repeat: 3
        });

        this.cops.add(cop);
    }

    showSpeedingDialogue() {
        if (!this.gameActive) return;

        const { width } = this.scale;

        const quotes = [
            "I'm lucky I'm so pretty",
            "I've never gotten a ticket!",
            "85 isn't THAT fast...",
            "Gotta get to my man!",
            "Speed limit is just a suggestion",
            "These cops can't catch me!",
            "Worth the risk to see Barrett"
        ];

        const quote = Phaser.Utils.Array.GetRandom(quotes);

        const bubble = this.add.text(width / 2, this.car.y - 60, quote, {
            fontSize: '11px',
            fill: '#fff',
            backgroundColor: '#E91E63',
            padding: { x: 8, y: 4 }
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: bubble,
            y: bubble.y - 30,
            alpha: 0,
            duration: 2500,
            onComplete: () => bubble.destroy()
        });
    }

    reachSTL() {
        this.gameActive = false;

        const { width, height } = this.scale;

        // ========== THE GATEWAY ARCH RISES ON THE HORIZON ==========
        const archContainer = this.add.container(width / 2, 250);
        archContainer.setScale(0.3);
        archContainer.setAlpha(0);

        // Draw the iconic Gateway Arch
        const arch = this.add.graphics();
        // Arch outline (silver/steel color)
        arch.fillStyle(0xC0C0C0);
        // Left leg
        arch.beginPath();
        arch.moveTo(-60, 80);
        arch.lineTo(-50, 80);
        arch.quadraticCurveTo(-35, -20, 0, -70);
        arch.quadraticCurveTo(-25, -20, -40, 80);
        arch.closePath();
        arch.fill();
        // Right leg
        arch.beginPath();
        arch.moveTo(60, 80);
        arch.lineTo(50, 80);
        arch.quadraticCurveTo(35, -20, 0, -70);
        arch.quadraticCurveTo(25, -20, 40, 80);
        arch.closePath();
        arch.fill();
        // Highlight
        arch.fillStyle(0xE0E0E0);
        arch.beginPath();
        arch.moveTo(-45, 60);
        arch.quadraticCurveTo(-30, -10, 0, -55);
        arch.quadraticCurveTo(-20, -10, -35, 60);
        arch.closePath();
        arch.fill();

        archContainer.add(arch);

        // City skyline behind arch
        const skylineBg = this.add.graphics();
        skylineBg.fillStyle(0x4A4A6A);
        // Buildings
        skylineBg.fillRect(-80, 40, 25, 50);
        skylineBg.fillRect(-50, 50, 20, 40);
        skylineBg.fillRect(-25, 35, 30, 55);
        skylineBg.fillRect(10, 45, 25, 45);
        skylineBg.fillRect(40, 55, 20, 35);
        skylineBg.fillRect(65, 40, 25, 50);
        archContainer.add(skylineBg);
        archContainer.sendToBack(skylineBg);

        // Animate arch rising on the horizon
        this.tweens.add({
            targets: archContainer,
            y: 170,
            scale: 1,
            alpha: 1,
            duration: 2000,
            ease: 'Power2.easeOut'
        });

        // "Look! The Arch!" text with sparkles
        this.add.image(width / 2 - 85, 120, 'sparkle').setScale(1.5).setAlpha(0).setName('lookSparkle1');
        const lookText = this.add.text(width / 2, 120, 'The Gateway Arch!', {
            fontSize: '14px',
            fill: '#FFD700',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5).setAlpha(0);
        this.add.image(width / 2 + 85, 120, 'sparkle').setScale(1.5).setAlpha(0).setName('lookSparkle2');

        this.tweens.add({
            targets: [lookText, this.children.getByName('lookSparkle1'), this.children.getByName('lookSparkle2')],
            alpha: 1,
            duration: 1000,
            delay: 1500
        });

        // Welcome text appears after arch rises
        this.time.delayedCall(2500, () => {
            const welcomeContainer = this.add.container(width / 2, 280);
            const welcomeCity1 = this.add.image(-100, 0, 'city_icon').setScale(1.2);
            const welcomeText = this.add.text(0, 0, 'Welcome to St. Louis!', {
                fontSize: '18px',
                fill: '#fff',
                backgroundColor: '#E91E63',
                padding: { x: 12, y: 8 }
            }).setOrigin(0.5);
            const welcomeCity2 = this.add.image(100, 0, 'city_icon').setScale(1.2).setFlipX(true);
            welcomeContainer.add([welcomeCity1, welcomeText, welcomeCity2]);

            this.tweens.add({
                targets: welcomeContainer,
                scale: 1.1,
                duration: 500,
                yoyo: true,
                repeat: 2,
                onComplete: () => {
                    this.dialogue.show("2 hours, every weekend. Just to see him.", "", () => {
                        this.dialogue.show("Worth. Every. Mile.", "", () => {
                            this.transitionTo('Level6_Finale');
                        });
                    });
                }
            });
        });
    }

    update(time) {
        if (!this.gameActive) return;

        const { width, height } = this.scale;

        // Update ambient effects
        this.updateLongDriveAmbientEffects(time);

        // ========== ANIMATE ROAD LINES ==========
        this.roadLineOffset += this.roadSpeed;
        if (this.roadLineOffset >= 50) {
            this.roadLineOffset = 0;
        }

        this.roadLines.forEach((line, i) => {
            line.y += this.roadSpeed;
            if (line.y > height + 30) {
                line.y = 180;
            }
        });

        // ========== KEYBOARD MOVEMENT ==========
        if (this.cursors.left.isDown) {
            this.car.x -= 5;
        } else if (this.cursors.right.isDown) {
            this.car.x += 5;
        }

        this.car.x = Phaser.Math.Clamp(this.car.x, 95, width - 95);

        // ========== MOVE OBSTACLES ==========
        this.obstacles.getChildren().forEach(obstacle => {
            obstacle.y += 4;

            if (obstacle.y > height + 80) {
                obstacle.destroy();
                return;
            }

            // Collision check
            const dx = Math.abs(obstacle.x - this.car.x);
            const dy = Math.abs(obstacle.y - this.car.y);
            if (dx < 30 && dy < 40) {
                this.cameras.main.shake(100, 0.01);
                obstacle.destroy();
            }
        });

        // ========== MOVE HEARTS ==========
        this.hearts.getChildren().forEach(heart => {
            heart.y += 3;

            if (heart.y > height + 50) {
                heart.destroy();
                return;
            }

            const dx = Math.abs(heart.x - this.car.x);
            const dy = Math.abs(heart.y - this.car.y);
            if (dx < 35 && dy < 35) {
                heart.destroy();
                GameState.heartsCollected++;
                this.updateHeartUI();
            }
        });

        // ========== MOVE SIGNS ==========
        this.signs.getChildren().forEach(sign => {
            sign.y += 2.5;
            if (sign.y > height + 100) {
                sign.destroy();
            }
        });

        // ========== MOVE BILLBOARDS ==========
        this.billboards.getChildren().forEach(billboard => {
            billboard.y += 2;
            if (billboard.y > height + 120) {
                billboard.destroy();
            }
        });

        // ========== MOVE COPS ==========
        this.cops.getChildren().forEach(cop => {
            cop.y += 2;
            if (cop.y > height + 100) {
                cop.destroy();
            }
        });
    }
}

// ============================================
// LEVEL 6: VALENTINE'S FINALE
// ============================================
class Level6_Finale extends BaseLevel {
    constructor() {
        super('Level6_Finale');
    }

    create() {
        const { width, height } = this.scale;

        // Warm apartment background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x3d2d1d, 0x3d2d1d, 0x2d2d2d, 0x2d2d2d, 1);
        bg.fillRect(0, 0, width, height);

        // Floor
        bg.fillStyle(0x5D4037);
        bg.fillRect(0, height - 100, width, 100);

        // Hearts everywhere in background
        for (let i = 0; i < 30; i++) {
            const heartKey = Phaser.Utils.Array.GetRandom(['heart', 'heart_red', 'heart_gold']);
            const heart = this.add.image(
                Phaser.Math.Between(20, width - 20),
                Phaser.Math.Between(100, height - 120),
                heartKey
            );
            heart.setScale(0.8 + Math.random() * 1.2);
            heart.setAlpha(0.2 + Math.random() * 0.3);

            this.tweens.add({
                targets: heart,
                y: heart.y - 20,
                alpha: heart.alpha - 0.1,
                duration: 2000 + Math.random() * 2000,
                yoyo: true,
                repeat: -1
            });
        }

        // Chapter title
        this.add.text(width / 2, 40, 'Chapter 6', {
            fontSize: '14px',
            fill: '#888'
        }).setOrigin(0.5);

        this.add.text(width / 2, 65, "Valentine's Day", {
            fontSize: '28px',
            fill: '#FF69B4',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Barrett with guitar
        this.barrett = this.add.image(width - 80, height - 170, 'barrett_guitar');
        this.barrett.setScale(2.5);

        // Minnie the cat!
        this.minnie = this.add.image(width - 120, height - 90, 'minnie');
        this.minnie.setScale(2);

        // Musical notes from Barrett
        this.createMusicalNotes(width - 80, height - 250);

        // Emma enters from left
        this.emma = this.add.image(-50, height - 140, 'emma_walk_0');
        this.emma.setScale(2.5);

        // Emma walks in animation
        this.tweens.add({
            targets: this.emma,
            x: width / 2 - 50,
            duration: 3000,
            ease: 'Power1',
            onComplete: () => {
                this.showFinalMessage();
            }
        });

        // Heart UI showing total collected
        this.add.image(20, 20, 'heart').setScale(1.2).setOrigin(0, 0.5);
        this.add.text(45, 20, 'Total Hearts: ' + GameState.heartsCollected, {
            fontSize: '16px',
            fill: '#fff'
        }).setOrigin(0, 0.5);

        // Fade in
        this.cameras.main.fadeIn(1000);

        // Create finale ambient effects
        this.createFinaleAmbientEffects(width, height);
    }

    createFinaleAmbientEffects(width, height) {
        // ========== WARM AMBIENT GLOW ==========
        this.warmGlow = this.add.circle(width / 2, height / 2, 250, 0xFF69B4, 0.08);
        this.warmGlow.setDepth(0);

        // ========== CANDLE/LAMP FLICKER LIGHTS ==========
        this.candleLights = [];
        const candlePositions = [
            { x: 50, y: height - 200 },
            { x: width - 50, y: height - 220 },
            { x: 100, y: 150 }
        ];
        candlePositions.forEach((pos, i) => {
            const candleGlow = this.add.circle(pos.x, pos.y, 30, 0xFFD700, 0.15);
            candleGlow.setDepth(1);
            const candleCore = this.add.circle(pos.x, pos.y, 10, 0xFFA500, 0.3);
            candleCore.setDepth(1);
            this.candleLights.push({ glow: candleGlow, core: candleCore, phase: i * 1.2 });
        });

        // ========== FLOATING SPARKLES ==========
        this.sparkles = [];
        for (let i = 0; i < 15; i++) {
            const sparkle = this.add.circle(
                Phaser.Math.Between(20, width - 20),
                Phaser.Math.Between(50, height - 120),
                Phaser.Math.Between(1, 3),
                0xFFFFFF,
                0.6
            );
            sparkle.setDepth(2);
            this.sparkles.push({
                circle: sparkle,
                baseY: sparkle.y,
                phase: Math.random() * Math.PI * 2,
                speed: Phaser.Math.FloatBetween(0.5, 1.5)
            });
        }

        // ========== EMMA'S WALKING SHADOW ==========
        this.emmaShadow = this.add.ellipse(this.emma.x, height - 85, 40, 15, 0x000000, 0.3);
        this.emmaShadow.setDepth(0);

        // ========== BARRETT'S SHADOW ==========
        this.barrettShadow = this.add.ellipse(this.barrett.x, height - 85, 45, 18, 0x000000, 0.25);
        this.barrettShadow.setDepth(0);

        // ========== MINNIE'S TAIL WAG ==========
        // Minnie already animates in update, but we'll add purr particles
        this.purrParticles = [];
        for (let i = 0; i < 4; i++) {
            // Use small sparkles for purr effect instead of emoji
            const purr = this.add.image(0, 0, 'sparkle').setScale(0.4);
            purr.setVisible(false);
            purr.setDepth(50);
            this.purrParticles.push({ sprite: purr, active: false, life: 0 });
        }
        this.purrTimer = 0;

        // ========== ROMANTIC LIGHT RAYS ==========
        this.lightRays = [];
        for (let i = 0; i < 3; i++) {
            const ray = this.add.graphics();
            ray.fillStyle(0xFFD700, 0.05);
            ray.beginPath();
            ray.moveTo(width - 80, height - 250); // From Barrett
            const angle = -0.5 + i * 0.3;
            ray.lineTo(width - 80 + Math.cos(angle) * 200, height - 250 + Math.sin(angle) * 200 - 50);
            ray.lineTo(width - 80 + Math.cos(angle + 0.15) * 200, height - 250 + Math.sin(angle + 0.15) * 200 - 50);
            ray.closePath();
            ray.fill();
            ray.setDepth(1);
            this.lightRays.push({ graphics: ray, phase: i * 0.8 });
        }

        // ========== FLOOR REFLECTION/SHINE ==========
        this.floorShine = this.add.rectangle(width / 2, height - 50, width - 60, 8, 0xFFFFFF, 0.05);
        this.floorShine.setDepth(0);

        // ========== AMBIENT LOVE PARTICLES ==========
        this.loveParticles = [];
        for (let i = 0; i < 8; i++) {
            const particleKey = Phaser.Utils.Array.GetRandom(['sparkle', 'star', 'heart']);
            const particle = this.add.image(
                Phaser.Math.Between(30, width - 30),
                Phaser.Math.Between(100, height - 150),
                particleKey
            );
            particle.setScale(0.6);
            particle.setAlpha(0.4);
            particle.setDepth(2);
            this.loveParticles.push({
                sprite: particle,
                baseX: particle.x,
                baseY: particle.y,
                phase: Math.random() * Math.PI * 2
            });
        }

        // ========== SOFT VIGNETTE ==========
        const vignette = this.add.graphics();
        vignette.fillStyle(0x000000, 0.4);
        vignette.fillRect(0, 0, width, 30);
        vignette.fillRect(0, height - 30, width, 30);
        vignette.fillStyle(0x000000, 0.2);
        vignette.fillRect(0, 30, width, 20);
        vignette.fillRect(0, height - 50, width, 20);
        vignette.setDepth(99);

        // ========== GUITAR STRING VIBRATION LINES ==========
        this.guitarStrings = [];
        for (let i = 0; i < 3; i++) {
            const string = this.add.rectangle(
                this.barrett.x - 5 + i * 5,
                this.barrett.y - 20,
                1,
                25,
                0xD4AF37,
                0.6
            );
            string.setDepth(45);
            this.guitarStrings.push({ rect: string, phase: i * 0.5 });
        }

        // ========== COZY WARMTH OVERLAY ==========
        this.warmthOverlay = this.add.rectangle(width / 2, height / 2, width, height, 0xFF6B6B, 0.03);
        this.warmthOverlay.setDepth(0);
    }

    updateFinaleAmbientEffects(time) {
        const { width, height } = this.scale;

        // ========== WARM GLOW PULSE ==========
        const glowPulse = 0.06 + Math.sin(time * 0.001) * 0.03;
        this.warmGlow.setAlpha(glowPulse);

        // ========== CANDLE FLICKER ==========
        this.candleLights.forEach(candle => {
            const flicker = 0.12 + Math.sin(time * 0.008 + candle.phase) * 0.05 + Math.random() * 0.03;
            candle.glow.setAlpha(flicker);
            candle.core.setAlpha(flicker * 2);
            candle.glow.setScale(0.9 + Math.sin(time * 0.01 + candle.phase) * 0.1);
        });

        // ========== FLOATING SPARKLES ==========
        this.sparkles.forEach(sparkle => {
            sparkle.circle.y = sparkle.baseY + Math.sin(time * 0.002 * sparkle.speed + sparkle.phase) * 10;
            const twinkle = 0.3 + Math.sin(time * 0.005 + sparkle.phase) * 0.3;
            sparkle.circle.setAlpha(twinkle);
        });

        // ========== EMMA'S SHADOW FOLLOW ==========
        if (this.emma && this.emmaShadow) {
            this.emmaShadow.x = this.emma.x;
        }

        // ========== PURR PARTICLES FROM MINNIE ==========
        this.purrTimer += 16;
        if (this.purrTimer > 2000 && this.minnie) {
            this.purrTimer = 0;
            const inactivePurr = this.purrParticles.find(p => !p.active);
            if (inactivePurr) {
                inactivePurr.active = true;
                inactivePurr.sprite.setVisible(true);
                inactivePurr.sprite.setPosition(this.minnie.x + 15, this.minnie.y - 20);
                inactivePurr.sprite.setAlpha(0.7);
                inactivePurr.life = 60;
            }
        }

        this.purrParticles.forEach(p => {
            if (p.active) {
                p.sprite.y -= 0.5;
                p.life--;
                p.sprite.setAlpha(p.life / 80);
                if (p.life <= 0) {
                    p.active = false;
                    p.sprite.setVisible(false);
                }
            }
        });

        // ========== LIGHT RAYS SHIMMER ==========
        this.lightRays.forEach(ray => {
            const shimmer = 0.03 + Math.sin(time * 0.002 + ray.phase) * 0.02;
            ray.graphics.setAlpha(shimmer);
        });

        // ========== FLOOR SHINE SHIMMER ==========
        const floorShine = 0.03 + Math.sin(time * 0.001) * 0.02;
        this.floorShine.setAlpha(floorShine);

        // ========== LOVE PARTICLES FLOAT ==========
        this.loveParticles.forEach(particle => {
            particle.sprite.x = particle.baseX + Math.sin(time * 0.001 + particle.phase) * 5;
            particle.sprite.y = particle.baseY + Math.cos(time * 0.0015 + particle.phase) * 8;
            const alpha = 0.3 + Math.sin(time * 0.003 + particle.phase) * 0.2;
            particle.sprite.setAlpha(alpha);
        });

        // ========== GUITAR STRINGS VIBRATE ==========
        this.guitarStrings.forEach(string => {
            const vibration = Math.sin(time * 0.02 + string.phase) * 2;
            string.rect.x = this.barrett.x - 5 + this.guitarStrings.indexOf(string) * 5 + vibration;
        });

        // ========== WARMTH OVERLAY PULSE ==========
        const warmth = 0.02 + Math.sin(time * 0.0008) * 0.01;
        this.warmthOverlay.setAlpha(warmth);
    }

    createMusicalNotes(x, y) {
        // Use music note sprites instead of emoji
        for (let i = 0; i < 8; i++) {
            const note = this.add.image(
                x + Phaser.Math.Between(-40, 40),
                y,
                'music_note'
            ).setScale(1.2 + Math.random() * 0.5);
            note.setTint(0xFFD700);

            this.tweens.add({
                targets: note,
                y: note.y - 150,
                x: note.x + Phaser.Math.Between(-30, 30),
                alpha: 0,
                duration: 3000 + i * 500,
                repeat: -1,
                delay: i * 400
            });
        }
    }

    showFinalMessage() {
        const { width, height } = this.scale;

        // Hearts explosion using sprites
        for (let i = 0; i < 50; i++) {
            const heartKey = Phaser.Utils.Array.GetRandom(['heart', 'heart_red', 'heart_gold']);
            const heart = this.add.image(width / 2, height / 2, heartKey)
                .setScale(Phaser.Math.FloatBetween(1, 3));

            this.tweens.add({
                targets: heart,
                x: Phaser.Math.Between(0, width),
                y: Phaser.Math.Between(0, height),
                alpha: 0,
                duration: 2000,
                delay: i * 30
            });
        }

        // Big heart using sprite
        const bigHeart = this.add.image(width / 2, 150, 'heart')
            .setScale(5)
            .setOrigin(0.5)
            .setAlpha(0);

        this.tweens.add({
            targets: bigHeart,
            alpha: 1,
            scale: 6,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Final message (delayed)
        this.time.delayedCall(1500, () => {
            // Darken background
            const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

            // Message box
            const msgBox = this.add.rectangle(width / 2, height / 2, width - 40, 350, 0x1a1a1a, 0.95);
            msgBox.setStrokeStyle(3, 0xFF69B4);

            // Final message text (keeping a minimal emoji for personal touch)
            const message = `Happy Valentine's Day

Eagle Eye Emma

From Your Old Man

I love you more than
words could ever say.

Thank you for every mile,
every movie night,
every moment with you.

Here's to forever.`;

            const msgText = this.add.text(width / 2, height / 2, message, {
                fontSize: '16px',
                fill: '#fff',
                align: 'center',
                lineSpacing: 8
            }).setOrigin(0.5);

            // Add heart sprites around the message
            this.add.image(width / 2 - 100, height / 2 - 150, 'heart').setScale(2);
            this.add.image(width / 2 + 100, height / 2 - 150, 'heart').setScale(2);
            this.add.image(width / 2, height / 2 + 145, 'heart_red').setScale(2);

            // Continuous hearts rain using sprites
            this.time.addEvent({
                delay: 200,
                callback: () => {
                    const heartKey = Phaser.Utils.Array.GetRandom(['heart', 'heart_red', 'heart_gold']);
                    const h = this.add.image(
                        Phaser.Math.Between(20, width - 20),
                        -20,
                        heartKey
                    ).setScale(Phaser.Math.FloatBetween(1, 2));

                    this.tweens.add({
                        targets: h,
                        y: height + 30,
                        duration: 3000,
                        onComplete: () => h.destroy()
                    });
                },
                loop: true
            });

            // Replay button
            this.time.delayedCall(3000, () => {
                const replayBtn = this.add.text(width / 2, height - 50, 'Play Again', {
                    fontSize: '18px',
                    fill: '#FF69B4',
                    backgroundColor: '#333',
                    padding: { x: 20, y: 10 }
                }).setOrigin(0.5).setInteractive({ useHandCursor: true });

                replayBtn.on('pointerover', () => replayBtn.setStyle({ fill: '#fff' }));
                replayBtn.on('pointerout', () => replayBtn.setStyle({ fill: '#FF69B4' }));
                replayBtn.on('pointerdown', () => {
                    GameState.heartsCollected = 0;
                    this.scene.start('TitleScene');
                });
            });
        });
    }

    update(time) {
        // Update finale ambient effects
        this.updateFinaleAmbientEffects(time);

        // Minnie cat idle animation
        if (this.minnie) {
            this.minnie.y = this.scale.height - 90 + Math.sin(time / 500) * 2;
        }
    }
}

// ============================================
// GAME CONFIGURATION & START
// ============================================
window.onload = () => {
    const config = {
        type: Phaser.AUTO,
        width: 360,
        height: 640,
        parent: 'game-container',
        pixelArt: true,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 800 },
                debug: false
            }
        },
        scene: [
            BootScene,
            TitleScene,
            Level1_Dispensary,
            Level2_ForestPark,
            Level3_MizzouDays,
            Level4_CozyNight,
            Level5_LongDrive,
            Level6_Finale
        ],
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        backgroundColor: '#1a1a2e'
    };

    const game = new Phaser.Game(config);
};
