/**
 * Enhanced Sprite Generation System
 * Creates high-quality pixel art sprites with shading, highlights, and refined proportions
 */

const SpriteGenerator = {
    // Enhanced color palettes with shading variants
    colors: {
        // Emma colors - long brown hair, fair skin, likes dark clothes
        emmaSkin: '#F5D5C8',
        emmaSkinLight: '#FFEAE0',
        emmaSkinShadow: '#D4B5A8',
        emmaHair: '#5D4037',
        emmaHairLight: '#7D5A47',
        emmaHairDark: '#3D2A27',
        emmaShirt: '#1a1a1a',
        emmaShirtLight: '#2a2a2a',
        emmaShirtDark: '#0a0a0a',
        emmaPants: '#9E9E9E',
        emmaPantsLight: '#AEAEAE',
        emmaPantsDark: '#7E7E7E',

        // Barrett colors - brown hair, glasses, mustache, green shirt
        barrettSkin: '#F0D5C0',
        barrettSkinLight: '#FFE5D5',
        barrettSkinShadow: '#D0B5A0',
        barrettHair: '#5D4037',
        barrettHairLight: '#7D5A47',
        barrettHairDark: '#3D2A27',
        barrettShirt: '#9ACD32',
        barrettShirtLight: '#AADD42',
        barrettShirtDark: '#7AAD22',
        barrettPants: '#607D8B',
        barrettPantsLight: '#708D9B',
        barrettPantsDark: '#506D7B',

        // Cat colors
        catBlack: '#1a1a1a',
        catBlackLight: '#2a2a2a',
        catWhite: '#f5f5f5',
        catWhiteShadow: '#e0e0e0',
        bowtieRed: '#e53935',

        // Environment
        grassGreen: '#4CAF50',
        treeGreen: '#2E7D32',
        treeBark: '#5D4037',
        skyBlue: '#87CEEB',
        roadGray: '#424242',

        // UI/Effects
        heartPink: '#FF69B4',
        heartRed: '#E91E63',
        leafGreen: '#8BC34A',
        ghostWhite: 'rgba(255, 255, 255, 0.5)',
    },

    /**
     * Create a canvas with given dimensions
     */
    createCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        return canvas;
    },

    /**
     * Draw a pixel (or scaled pixel) at position
     */
    drawPixel(ctx, x, y, color, scale = 1) {
        ctx.fillStyle = color;
        ctx.fillRect(x * scale, y * scale, scale, scale);
    },

    /**
     * Draw multiple pixels from an array
     */
    drawPixels(ctx, pixels, scale = 1) {
        pixels.forEach(([x, y, color]) => {
            this.drawPixel(ctx, x, y, color, scale);
        });
    },

    /**
     * Draw a smooth gradient-filled shape (for higher quality)
     */
    drawGradientRect(ctx, x, y, w, h, colorTop, colorBottom) {
        const gradient = ctx.createLinearGradient(x, y, x, y + h);
        gradient.addColorStop(0, colorTop);
        gradient.addColorStop(1, colorBottom);
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, w, h);
    },

    /**
     * Generate Emma sprite (32x48 pixels) - SKINNIER with enhanced quality
     */
    generateEmma(frame = 0) {
        const canvas = this.createCanvas(32, 48);
        const ctx = canvas.getContext('2d');
        const c = this.colors;

        // ========== HAIR (Slimmer, more flowing) ==========
        const hairPixels = [
            // Top of head - narrower
            [14,1,c.emmaHairLight],[15,1,c.emmaHairLight],[16,1,c.emmaHairLight],[17,1,c.emmaHairLight],
            [13,2,c.emmaHair],[14,2,c.emmaHairLight],[15,2,c.emmaHairLight],[16,2,c.emmaHairLight],[17,2,c.emmaHair],[18,2,c.emmaHair],
            [12,3,c.emmaHair],[13,3,c.emmaHair],[14,3,c.emmaHairLight],[15,3,c.emmaHairLight],[16,3,c.emmaHairLight],[17,3,c.emmaHair],[18,3,c.emmaHair],[19,3,c.emmaHair],
            [12,4,c.emmaHairDark],[13,4,c.emmaHair],[14,4,c.emmaHair],[15,4,c.emmaHair],[16,4,c.emmaHair],[17,4,c.emmaHair],[18,4,c.emmaHair],[19,4,c.emmaHairDark],
            [11,5,c.emmaHairDark],[12,5,c.emmaHair],[18,5,c.emmaHair],[19,5,c.emmaHairDark],[20,5,c.emmaHairDark],
            // Long flowing side hair
            [10,6,c.emmaHairDark],[11,6,c.emmaHair],[19,6,c.emmaHair],[20,6,c.emmaHairDark],
            [10,7,c.emmaHairDark],[11,7,c.emmaHair],[19,7,c.emmaHair],[20,7,c.emmaHairDark],
            [10,8,c.emmaHairDark],[11,8,c.emmaHair],[19,8,c.emmaHair],[20,8,c.emmaHairDark],
            [10,9,c.emmaHairDark],[11,9,c.emmaHair],[19,9,c.emmaHair],[20,9,c.emmaHairDark],
            [10,10,c.emmaHairDark],[19,10,c.emmaHairDark],
            [10,11,c.emmaHairDark],[19,11,c.emmaHairDark],
            [10,12,c.emmaHairDark],[19,12,c.emmaHairDark],
            [11,13,c.emmaHairDark],[18,13,c.emmaHairDark],
        ];

        // ========== FACE (More refined, slimmer) ==========
        const facePixels = [
            // Face shape - narrower
            [14,5,c.emmaSkinLight],[15,5,c.emmaSkinLight],[16,5,c.emmaSkinLight],[17,5,c.emmaSkinLight],
            [13,6,c.emmaSkin],[14,6,c.emmaSkinLight],[15,6,c.emmaSkinLight],[16,6,c.emmaSkinLight],[17,6,c.emmaSkinLight],[18,6,c.emmaSkin],
            [12,7,c.emmaSkin],[13,7,c.emmaSkin],[14,7,c.emmaSkin],[15,7,c.emmaSkin],[16,7,c.emmaSkin],[17,7,c.emmaSkin],[18,7,c.emmaSkin],[19,7,c.emmaSkin],
            [12,8,c.emmaSkin],[13,8,c.emmaSkin],[14,8,c.emmaSkin],[15,8,c.emmaSkin],[16,8,c.emmaSkin],[17,8,c.emmaSkin],[18,8,c.emmaSkin],[19,8,c.emmaSkin],
            [12,9,c.emmaSkinShadow],[13,9,c.emmaSkin],[14,9,c.emmaSkin],[15,9,c.emmaSkin],[16,9,c.emmaSkin],[17,9,c.emmaSkin],[18,9,c.emmaSkin],[19,9,c.emmaSkinShadow],
            [13,10,c.emmaSkinShadow],[14,10,c.emmaSkin],[15,10,c.emmaSkin],[16,10,c.emmaSkin],[17,10,c.emmaSkin],[18,10,c.emmaSkinShadow],
            // Eyes - expressive, blue-gray
            [13,7,'#6B8E9F'],[14,7,'#1a1a1a'],[17,7,'#1a1a1a'],[18,7,'#6B8E9F'],
            // Eye highlights
            [14,7,'#FFFFFF40'],
            // Eyebrows
            [13,6,c.emmaHairDark],[14,6,c.emmaHairDark],[17,6,c.emmaHairDark],[18,6,c.emmaHairDark],
            // Nose (subtle)
            [15,8,c.emmaSkinShadow],[16,8,c.emmaSkinShadow],
            // Nose ring
            [15,9,'#C0C0C0'],[15,9,'#A0A0A0'],
            // Smile
            [15,10,'#C08080'],[16,10,'#C08080'],
        ];

        // ========== NECK (Slender) ==========
        const neckPixels = [
            [15,11,c.emmaSkin],[16,11,c.emmaSkin],
            [15,12,c.emmaSkinShadow],[16,12,c.emmaSkinShadow],
        ];

        // ========== BODY (Slim, fitted shirt) ==========
        const bodyPixels = [
            // Shoulders - narrower
            [13,13,c.emmaShirt],[14,13,c.emmaShirtLight],[15,13,c.emmaShirtLight],[16,13,c.emmaShirtLight],[17,13,c.emmaShirtLight],[18,13,c.emmaShirt],
            [12,14,c.emmaShirt],[13,14,c.emmaShirtLight],[14,14,c.emmaShirtLight],[15,14,c.emmaShirtLight],[16,14,c.emmaShirtLight],[17,14,c.emmaShirtLight],[18,14,c.emmaShirtLight],[19,14,c.emmaShirt],
            // Torso - slim
            [12,15,c.emmaShirt],[13,15,c.emmaShirtLight],[14,15,c.emmaShirtLight],[15,15,c.emmaShirtLight],[16,15,c.emmaShirtLight],[17,15,c.emmaShirtLight],[18,15,c.emmaShirtLight],[19,15,c.emmaShirt],
            [13,16,c.emmaShirt],[14,16,c.emmaShirtLight],[15,16,c.emmaShirtLight],[16,16,c.emmaShirtLight],[17,16,c.emmaShirtLight],[18,16,c.emmaShirt],
            [13,17,c.emmaShirtDark],[14,17,c.emmaShirt],[15,17,c.emmaShirtLight],[16,17,c.emmaShirtLight],[17,17,c.emmaShirt],[18,17,c.emmaShirtDark],
            [13,18,c.emmaShirtDark],[14,18,c.emmaShirt],[15,18,c.emmaShirt],[16,18,c.emmaShirt],[17,18,c.emmaShirt],[18,18,c.emmaShirtDark],
            // Arms (slim)
            [11,14,c.emmaSkin],[20,14,c.emmaSkin],
            [11,15,c.emmaSkin],[20,15,c.emmaSkin],
            [11,16,c.emmaSkinShadow],[20,16,c.emmaSkinShadow],
        ];

        // ========== LEGS (Slim fitted pants) ==========
        const legPixels = [
            // Waist
            [13,19,c.emmaPants],[14,19,c.emmaPantsLight],[15,19,c.emmaPantsLight],[16,19,c.emmaPantsLight],[17,19,c.emmaPantsLight],[18,19,c.emmaPants],
            [13,20,c.emmaPants],[14,20,c.emmaPantsLight],[15,20,c.emmaPantsLight],[16,20,c.emmaPantsLight],[17,20,c.emmaPantsLight],[18,20,c.emmaPants],
            // Upper legs - slim with gap
            [13,21,c.emmaPantsDark],[14,21,c.emmaPants],[15,21,c.emmaPantsLight],[17,21,c.emmaPantsLight],[18,21,c.emmaPants],
            [13,22,c.emmaPantsDark],[14,22,c.emmaPants],[15,22,c.emmaPants],[17,22,c.emmaPants],[18,22,c.emmaPants],
            [13,23,c.emmaPantsDark],[14,23,c.emmaPants],[15,23,c.emmaPantsLight],[17,23,c.emmaPantsLight],[18,23,c.emmaPants],
            [13,24,c.emmaPantsDark],[14,24,c.emmaPants],[17,24,c.emmaPants],[18,24,c.emmaPantsDark],
            [13,25,c.emmaPantsDark],[14,25,c.emmaPants],[17,25,c.emmaPants],[18,25,c.emmaPantsDark],
            // Feet - small and neat
            [12,26,'#2a2a2a'],[13,26,'#333333'],[14,26,'#333333'],[17,26,'#333333'],[18,26,'#333333'],[19,26,'#2a2a2a'],
        ];

        // Animation offset for walking
        const walkOffset = frame % 2 === 1 ? 1 : 0;

        this.drawPixels(ctx, hairPixels);
        this.drawPixels(ctx, facePixels);
        this.drawPixels(ctx, neckPixels);
        this.drawPixels(ctx, bodyPixels);

        // Adjust legs for walking animation
        if (frame > 0) {
            const adjustedLegs = legPixels.map(([x, y, color]) => {
                if (y > 23) {
                    const shift = walkOffset ? (x < 16 ? -1 : 1) : 0;
                    return [x + shift, y, color];
                }
                return [x, y, color];
            });
            this.drawPixels(ctx, adjustedLegs);
        } else {
            this.drawPixels(ctx, legPixels);
        }

        return canvas.toDataURL();
    },

    /**
     * Generate Barrett sprite - SKINNIER with enhanced quality
     */
    generateBarrett(withGuitar = false) {
        const canvas = this.createCanvas(32, 48);
        const ctx = canvas.getContext('2d');
        const c = this.colors;

        // ========== HAIR (Short, styled) ==========
        const hairPixels = [
            [14,2,c.barrettHairLight],[15,2,c.barrettHairLight],[16,2,c.barrettHairLight],[17,2,c.barrettHairLight],
            [13,3,c.barrettHair],[14,3,c.barrettHairLight],[15,3,c.barrettHairLight],[16,3,c.barrettHairLight],[17,3,c.barrettHair],[18,3,c.barrettHair],
            [12,4,c.barrettHairDark],[13,4,c.barrettHair],[14,4,c.barrettHair],[15,4,c.barrettHair],[16,4,c.barrettHair],[17,4,c.barrettHair],[18,4,c.barrettHair],[19,4,c.barrettHairDark],
            [12,5,c.barrettHairDark],[13,5,c.barrettHair],[18,5,c.barrettHair],[19,5,c.barrettHairDark],
        ];

        // ========== FACE (With glasses and mustache) ==========
        const facePixels = [
            // Face shape - slimmer
            [14,5,c.barrettSkinLight],[15,5,c.barrettSkinLight],[16,5,c.barrettSkinLight],[17,5,c.barrettSkinLight],
            [13,6,c.barrettSkin],[14,6,c.barrettSkinLight],[15,6,c.barrettSkinLight],[16,6,c.barrettSkinLight],[17,6,c.barrettSkinLight],[18,6,c.barrettSkin],
            [12,7,c.barrettSkin],[13,7,c.barrettSkin],[14,7,c.barrettSkin],[15,7,c.barrettSkin],[16,7,c.barrettSkin],[17,7,c.barrettSkin],[18,7,c.barrettSkin],[19,7,c.barrettSkin],
            [12,8,c.barrettSkin],[13,8,c.barrettSkin],[14,8,c.barrettSkin],[15,8,c.barrettSkin],[16,8,c.barrettSkin],[17,8,c.barrettSkin],[18,8,c.barrettSkin],[19,8,c.barrettSkin],
            [12,9,c.barrettSkinShadow],[13,9,c.barrettSkin],[14,9,c.barrettSkin],[15,9,c.barrettSkin],[16,9,c.barrettSkin],[17,9,c.barrettSkin],[18,9,c.barrettSkin],[19,9,c.barrettSkinShadow],
            [13,10,c.barrettSkinShadow],[14,10,c.barrettSkin],[15,10,c.barrettSkin],[16,10,c.barrettSkin],[17,10,c.barrettSkin],[18,10,c.barrettSkinShadow],
            // Glasses frames - stylish
            [12,6,'#1a1a1a'],[13,6,'#1a1a1a'],[14,6,'#1a1a1a'],[15,6,'#333333'],[16,6,'#333333'],[17,6,'#1a1a1a'],[18,6,'#1a1a1a'],[19,6,'#1a1a1a'],
            [12,7,'#1a1a1a'],[15,7,'#1a1a1a'],[16,7,'#1a1a1a'],[19,7,'#1a1a1a'],
            [12,8,'#1a1a1a'],[13,8,'#1a1a1a'],[14,8,'#1a1a1a'],[17,8,'#1a1a1a'],[18,8,'#1a1a1a'],[19,8,'#1a1a1a'],
            // Eyes behind glasses - green
            [13,7,'#5B8C5A'],[14,7,'#1a1a1a'],[17,7,'#1a1a1a'],[18,7,'#5B8C5A'],
            // Mustache - refined
            [14,9,'#5D4037'],[15,9,'#6D5047'],[16,9,'#6D5047'],[17,9,'#5D4037'],
            [14,10,'#4D3027'],[15,10,'#5D4037'],[16,10,'#5D4037'],[17,10,'#4D3027'],
        ];

        // ========== NECK (Slender) ==========
        const neckPixels = [
            [15,11,c.barrettSkin],[16,11,c.barrettSkin],
            [15,12,c.barrettSkinShadow],[16,12,c.barrettSkinShadow],
        ];

        // ========== BODY (Slim, fitted shirt) ==========
        const bodyPixels = [
            // Shoulders - narrower
            [13,13,c.barrettShirt],[14,13,c.barrettShirtLight],[15,13,c.barrettShirtLight],[16,13,c.barrettShirtLight],[17,13,c.barrettShirtLight],[18,13,c.barrettShirt],
            [12,14,c.barrettShirt],[13,14,c.barrettShirtLight],[14,14,c.barrettShirtLight],[15,14,c.barrettShirtLight],[16,14,c.barrettShirtLight],[17,14,c.barrettShirtLight],[18,14,c.barrettShirtLight],[19,14,c.barrettShirt],
            // Torso - slim
            [12,15,c.barrettShirt],[13,15,c.barrettShirtLight],[14,15,c.barrettShirtLight],[15,15,c.barrettShirtLight],[16,15,c.barrettShirtLight],[17,15,c.barrettShirtLight],[18,15,c.barrettShirtLight],[19,15,c.barrettShirt],
            [13,16,c.barrettShirt],[14,16,c.barrettShirtLight],[15,16,c.barrettShirtLight],[16,16,c.barrettShirtLight],[17,16,c.barrettShirtLight],[18,16,c.barrettShirt],
            [13,17,c.barrettShirtDark],[14,17,c.barrettShirt],[15,17,c.barrettShirtLight],[16,17,c.barrettShirtLight],[17,17,c.barrettShirt],[18,17,c.barrettShirtDark],
            [13,18,c.barrettShirtDark],[14,18,c.barrettShirt],[15,18,c.barrettShirt],[16,18,c.barrettShirt],[17,18,c.barrettShirt],[18,18,c.barrettShirtDark],
            // Arms (slim)
            [11,14,c.barrettSkin],[20,14,c.barrettSkin],
            [11,15,c.barrettSkin],[20,15,c.barrettSkin],
            [11,16,c.barrettSkinShadow],[20,16,c.barrettSkinShadow],
        ];

        // ========== LEGS (Slim jeans) ==========
        const legPixels = [
            // Waist
            [13,19,c.barrettPants],[14,19,c.barrettPantsLight],[15,19,c.barrettPantsLight],[16,19,c.barrettPantsLight],[17,19,c.barrettPantsLight],[18,19,c.barrettPants],
            [13,20,c.barrettPants],[14,20,c.barrettPantsLight],[15,20,c.barrettPantsLight],[16,20,c.barrettPantsLight],[17,20,c.barrettPantsLight],[18,20,c.barrettPants],
            // Legs - slim with gap
            [13,21,c.barrettPantsDark],[14,21,c.barrettPants],[15,21,c.barrettPantsLight],[17,21,c.barrettPantsLight],[18,21,c.barrettPants],
            [13,22,c.barrettPantsDark],[14,22,c.barrettPants],[15,22,c.barrettPants],[17,22,c.barrettPants],[18,22,c.barrettPants],
            [13,23,c.barrettPantsDark],[14,23,c.barrettPants],[15,23,c.barrettPantsLight],[17,23,c.barrettPantsLight],[18,23,c.barrettPants],
            [13,24,c.barrettPantsDark],[14,24,c.barrettPants],[17,24,c.barrettPants],[18,24,c.barrettPantsDark],
            [13,25,c.barrettPantsDark],[14,25,c.barrettPants],[17,25,c.barrettPants],[18,25,c.barrettPantsDark],
            // Feet - dark shoes
            [12,26,'#1a1a1a'],[13,26,'#222222'],[14,26,'#222222'],[17,26,'#222222'],[18,26,'#222222'],[19,26,'#1a1a1a'],
        ];

        this.drawPixels(ctx, hairPixels);
        this.drawPixels(ctx, facePixels);
        this.drawPixels(ctx, neckPixels);
        this.drawPixels(ctx, bodyPixels);
        this.drawPixels(ctx, legPixels);

        // Add guitar if specified - enhanced quality
        if (withGuitar) {
            const guitarPixels = [
                // Guitar body (acoustic - rich wood tones)
                [21,14,'#C9853C'],[22,14,'#D4955C'],[23,14,'#D4955C'],[24,14,'#C9853C'],
                [20,15,'#B8742C'],[21,15,'#C9853C'],[22,15,'#8B5A2B'],[23,15,'#8B5A2B'],[24,15,'#C9853C'],[25,15,'#B8742C'],
                [20,16,'#B8742C'],[21,16,'#C9853C'],[22,16,'#2a2a2a'],[23,16,'#8B5A2B'],[24,16,'#C9853C'],[25,16,'#B8742C'],
                [20,17,'#B8742C'],[21,17,'#C9853C'],[22,17,'#8B5A2B'],[23,17,'#8B5A2B'],[24,17,'#C9853C'],[25,17,'#B8742C'],
                [21,18,'#A8641C'],[22,18,'#C9853C'],[23,18,'#C9853C'],[24,18,'#A8641C'],
                // Guitar neck - mahogany
                [25,10,'#6B4423'],[26,10,'#7B5433'],
                [25,11,'#6B4423'],[26,11,'#7B5433'],
                [25,12,'#6B4423'],[26,12,'#7B5433'],
                [25,13,'#6B4423'],[26,13,'#7B5433'],
                // Headstock
                [25,8,'#4B2413'],[26,8,'#4B2413'],[27,8,'#4B2413'],
                [25,9,'#5B3423'],[26,9,'#5B3423'],
                // Strings (shiny)
                [25,10,'#DDD'],[25,11,'#DDD'],[25,12,'#DDD'],[25,13,'#DDD'],
                [26,10,'#CCC'],[26,11,'#CCC'],[26,12,'#CCC'],[26,13,'#CCC'],
                // Tuning pegs
                [24,8,'#C0C0C0'],[28,8,'#C0C0C0'],
            ];
            this.drawPixels(ctx, guitarPixels);
        }

        return canvas.toDataURL();
    },

    /**
     * Generate Barrett with electric keyboard sprite
     */
    generateBarrettKeyboard() {
        const canvas = this.createCanvas(48, 48);
        const ctx = canvas.getContext('2d');
        const c = this.colors;

        // ========== HAIR (Short, styled) ==========
        const hairPixels = [
            [14,2,c.barrettHairLight],[15,2,c.barrettHairLight],[16,2,c.barrettHairLight],[17,2,c.barrettHairLight],
            [13,3,c.barrettHair],[14,3,c.barrettHairLight],[15,3,c.barrettHairLight],[16,3,c.barrettHairLight],[17,3,c.barrettHair],[18,3,c.barrettHair],
            [12,4,c.barrettHairDark],[13,4,c.barrettHair],[14,4,c.barrettHair],[15,4,c.barrettHair],[16,4,c.barrettHair],[17,4,c.barrettHair],[18,4,c.barrettHair],[19,4,c.barrettHairDark],
            [12,5,c.barrettHairDark],[13,5,c.barrettHair],[18,5,c.barrettHair],[19,5,c.barrettHairDark],
        ];

        // ========== FACE (With glasses and mustache) ==========
        const facePixels = [
            [14,5,c.barrettSkinLight],[15,5,c.barrettSkinLight],[16,5,c.barrettSkinLight],[17,5,c.barrettSkinLight],
            [13,6,c.barrettSkin],[14,6,c.barrettSkinLight],[15,6,c.barrettSkinLight],[16,6,c.barrettSkinLight],[17,6,c.barrettSkinLight],[18,6,c.barrettSkin],
            [12,7,c.barrettSkin],[13,7,c.barrettSkin],[14,7,c.barrettSkin],[15,7,c.barrettSkin],[16,7,c.barrettSkin],[17,7,c.barrettSkin],[18,7,c.barrettSkin],[19,7,c.barrettSkin],
            [12,8,c.barrettSkin],[13,8,c.barrettSkin],[14,8,c.barrettSkin],[15,8,c.barrettSkin],[16,8,c.barrettSkin],[17,8,c.barrettSkin],[18,8,c.barrettSkin],[19,8,c.barrettSkin],
            [12,9,c.barrettSkinShadow],[13,9,c.barrettSkin],[14,9,c.barrettSkin],[15,9,c.barrettSkin],[16,9,c.barrettSkin],[17,9,c.barrettSkin],[18,9,c.barrettSkin],[19,9,c.barrettSkinShadow],
            [13,10,c.barrettSkinShadow],[14,10,c.barrettSkin],[15,10,c.barrettSkin],[16,10,c.barrettSkin],[17,10,c.barrettSkin],[18,10,c.barrettSkinShadow],
            // Glasses
            [12,6,'#1a1a1a'],[13,6,'#1a1a1a'],[14,6,'#1a1a1a'],[15,6,'#333333'],[16,6,'#333333'],[17,6,'#1a1a1a'],[18,6,'#1a1a1a'],[19,6,'#1a1a1a'],
            [12,7,'#1a1a1a'],[15,7,'#1a1a1a'],[16,7,'#1a1a1a'],[19,7,'#1a1a1a'],
            [12,8,'#1a1a1a'],[13,8,'#1a1a1a'],[14,8,'#1a1a1a'],[17,8,'#1a1a1a'],[18,8,'#1a1a1a'],[19,8,'#1a1a1a'],
            // Eyes
            [13,7,'#5B8C5A'],[14,7,'#1a1a1a'],[17,7,'#1a1a1a'],[18,7,'#5B8C5A'],
            // Mustache
            [14,9,'#5D4037'],[15,9,'#6D5047'],[16,9,'#6D5047'],[17,9,'#5D4037'],
            [14,10,'#4D3027'],[15,10,'#5D4037'],[16,10,'#5D4037'],[17,10,'#4D3027'],
        ];

        // ========== NECK ==========
        const neckPixels = [
            [15,11,c.barrettSkin],[16,11,c.barrettSkin],
            [15,12,c.barrettSkinShadow],[16,12,c.barrettSkinShadow],
        ];

        // ========== BODY (Leaning forward at keyboard) ==========
        const bodyPixels = [
            [13,13,c.barrettShirt],[14,13,c.barrettShirtLight],[15,13,c.barrettShirtLight],[16,13,c.barrettShirtLight],[17,13,c.barrettShirtLight],[18,13,c.barrettShirt],
            [12,14,c.barrettShirt],[13,14,c.barrettShirtLight],[14,14,c.barrettShirtLight],[15,14,c.barrettShirtLight],[16,14,c.barrettShirtLight],[17,14,c.barrettShirtLight],[18,14,c.barrettShirtLight],[19,14,c.barrettShirt],
            [12,15,c.barrettShirt],[13,15,c.barrettShirtLight],[14,15,c.barrettShirtLight],[15,15,c.barrettShirtLight],[16,15,c.barrettShirtLight],[17,15,c.barrettShirtLight],[18,15,c.barrettShirtLight],[19,15,c.barrettShirt],
            [13,16,c.barrettShirt],[14,16,c.barrettShirtLight],[15,16,c.barrettShirtLight],[16,16,c.barrettShirtLight],[17,16,c.barrettShirtLight],[18,16,c.barrettShirt],
            [13,17,c.barrettShirtDark],[14,17,c.barrettShirt],[15,17,c.barrettShirtLight],[16,17,c.barrettShirtLight],[17,17,c.barrettShirt],[18,17,c.barrettShirtDark],
            // Arms extended to keyboard
            [10,14,c.barrettSkin],[11,14,c.barrettSkin],[20,14,c.barrettSkin],[21,14,c.barrettSkin],
            [9,15,c.barrettSkin],[10,15,c.barrettSkin],[21,15,c.barrettSkin],[22,15,c.barrettSkin],
            [8,16,c.barrettSkinShadow],[9,16,c.barrettSkinShadow],[22,16,c.barrettSkinShadow],[23,16,c.barrettSkinShadow],
        ];

        // ========== LEGS ==========
        const legPixels = [
            [13,18,c.barrettPants],[14,18,c.barrettPantsLight],[15,18,c.barrettPantsLight],[16,18,c.barrettPantsLight],[17,18,c.barrettPantsLight],[18,18,c.barrettPants],
            [13,19,c.barrettPants],[14,19,c.barrettPantsLight],[15,19,c.barrettPantsLight],[16,19,c.barrettPantsLight],[17,19,c.barrettPantsLight],[18,19,c.barrettPants],
            [13,20,c.barrettPantsDark],[14,20,c.barrettPants],[15,20,c.barrettPantsLight],[17,20,c.barrettPantsLight],[18,20,c.barrettPants],
            [13,21,c.barrettPantsDark],[14,21,c.barrettPants],[15,21,c.barrettPants],[17,21,c.barrettPants],[18,21,c.barrettPants],
            [12,22,'#1a1a1a'],[13,22,'#222222'],[14,22,'#222222'],[17,22,'#222222'],[18,22,'#222222'],[19,22,'#1a1a1a'],
        ];

        // ========== ELECTRIC KEYBOARD ==========
        const keyboardPixels = [
            // Keyboard body (black/dark gray)
            [3,17,'#2a2a2a'],[4,17,'#333333'],[5,17,'#333333'],[6,17,'#333333'],[7,17,'#333333'],[8,17,'#333333'],
            [23,17,'#333333'],[24,17,'#333333'],[25,17,'#333333'],[26,17,'#333333'],[27,17,'#333333'],[28,17,'#2a2a2a'],
            // Keyboard top surface
            [2,18,'#1a1a1a'],[3,18,'#252525'],[4,18,'#303030'],[5,18,'#303030'],[6,18,'#303030'],[7,18,'#303030'],[8,18,'#303030'],
            [23,18,'#303030'],[24,18,'#303030'],[25,18,'#303030'],[26,18,'#303030'],[27,18,'#303030'],[28,18,'#252525'],[29,18,'#1a1a1a'],
            // White keys
            [3,19,'#F5F5F5'],[4,19,'#FFFFFF'],[5,19,'#F5F5F5'],[6,19,'#FFFFFF'],[7,19,'#F5F5F5'],[8,19,'#FFFFFF'],
            [23,19,'#FFFFFF'],[24,19,'#F5F5F5'],[25,19,'#FFFFFF'],[26,19,'#F5F5F5'],[27,19,'#FFFFFF'],[28,19,'#F5F5F5'],
            [3,20,'#E8E8E8'],[4,20,'#F5F5F5'],[5,20,'#E8E8E8'],[6,20,'#F5F5F5'],[7,20,'#E8E8E8'],[8,20,'#F5F5F5'],
            [23,20,'#F5F5F5'],[24,20,'#E8E8E8'],[25,20,'#F5F5F5'],[26,20,'#E8E8E8'],[27,20,'#F5F5F5'],[28,20,'#E8E8E8'],
            // Black keys
            [3,18,'#1a1a1a'],[5,18,'#1a1a1a'],[7,18,'#1a1a1a'],
            [24,18,'#1a1a1a'],[26,18,'#1a1a1a'],[28,18,'#1a1a1a'],
            // Keyboard stand
            [5,21,'#4a4a4a'],[6,21,'#4a4a4a'],[25,21,'#4a4a4a'],[26,21,'#4a4a4a'],
            [5,22,'#3a3a3a'],[6,22,'#3a3a3a'],[25,22,'#3a3a3a'],[26,22,'#3a3a3a'],
            [5,23,'#3a3a3a'],[6,23,'#3a3a3a'],[25,23,'#3a3a3a'],[26,23,'#3a3a3a'],
            // Control panel lights (red/green LEDs)
            [4,17,'#FF3333'],[6,17,'#33FF33'],
            [25,17,'#FF3333'],[27,17,'#33FF33'],
        ];

        this.drawPixels(ctx, hairPixels);
        this.drawPixels(ctx, facePixels);
        this.drawPixels(ctx, neckPixels);
        this.drawPixels(ctx, bodyPixels);
        this.drawPixels(ctx, legPixels);
        this.drawPixels(ctx, keyboardPixels);

        return canvas.toDataURL();
    },

    /**
     * Generate electric keyboard sprite (standalone)
     */
    generateElectricKeyboard() {
        const canvas = this.createCanvas(60, 24);
        const ctx = canvas.getContext('2d');

        // Keyboard body (sleek black)
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(2, 2, 56, 14);

        // Keyboard frame
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, 0, 60, 2);
        ctx.fillRect(0, 16, 60, 2);
        ctx.fillRect(0, 0, 2, 18);
        ctx.fillRect(58, 0, 2, 18);

        // White keys
        for (let i = 0; i < 12; i++) {
            ctx.fillStyle = i % 2 === 0 ? '#F5F5F5' : '#FFFFFF';
            ctx.fillRect(4 + i * 4, 8, 3, 8);
        }

        // Black keys
        const blackKeyPositions = [0, 1, 3, 4, 5, 7, 8, 10, 11];
        blackKeyPositions.forEach(pos => {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(6 + pos * 4, 4, 2, 5);
        });

        // Control panel area
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(4, 2, 52, 4);

        // LED lights
        ctx.fillStyle = '#FF3333';
        ctx.fillRect(8, 3, 2, 2);
        ctx.fillStyle = '#33FF33';
        ctx.fillRect(12, 3, 2, 2);
        ctx.fillStyle = '#3366FF';
        ctx.fillRect(16, 3, 2, 2);

        // Pitch wheel area
        ctx.fillStyle = '#444444';
        ctx.fillRect(50, 3, 4, 4);
        ctx.fillStyle = '#666666';
        ctx.fillRect(51, 4, 2, 2);

        // Stand
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(15, 18, 4, 6);
        ctx.fillRect(41, 18, 4, 6);

        return canvas.toDataURL();
    },

    /**
     * Generate enhanced heart sprite with glow effect
     */
    generateHeart(color = '#FF69B4', size = 16) {
        const canvas = this.createCanvas(size, size);
        const ctx = canvas.getContext('2d');

        // Parse color for gradient
        const lighterColor = this.lightenColor(color, 40);
        const darkerColor = this.darkenColor(color, 30);

        // Heart pattern with shading
        const heartPatternBase = [
            [0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0],
            [0,0,1,1,1,1,0,1,1,1,1,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
        ];

        // Highlight positions
        const highlights = [[3,1],[4,2],[3,2]];

        heartPatternBase.forEach((row, y) => {
            row.forEach((pixel, x) => {
                if (pixel) {
                    // Check if highlight position
                    const isHighlight = highlights.some(([hx, hy]) => hx === x && hy === y);
                    if (isHighlight) {
                        ctx.fillStyle = lighterColor;
                    } else if (y > 6) {
                        ctx.fillStyle = darkerColor;
                    } else {
                        ctx.fillStyle = color;
                    }
                    ctx.fillRect(x, y, 1, 1);
                }
            });
        });

        return canvas.toDataURL();
    },

    /**
     * Generate enhanced leaf sprite
     */
    generateLeaf() {
        const canvas = this.createCanvas(16, 16);
        const ctx = canvas.getContext('2d');

        const leafPixels = [
            // Leaf with gradient shading
            [7,0,'#66BB6A'],[8,0,'#66BB6A'],
            [6,1,'#4CAF50'],[7,1,'#81C784'],[8,1,'#81C784'],[9,1,'#4CAF50'],
            [5,2,'#43A047'],[6,2,'#66BB6A'],[7,2,'#A5D6A7'],[8,2,'#A5D6A7'],[9,2,'#66BB6A'],[10,2,'#43A047'],
            [4,3,'#388E3C'],[5,3,'#4CAF50'],[6,3,'#81C784'],[7,3,'#C8E6C9'],[8,3,'#A5D6A7'],[9,3,'#81C784'],[10,3,'#4CAF50'],[11,3,'#388E3C'],
            [4,4,'#388E3C'],[5,4,'#4CAF50'],[6,4,'#66BB6A'],[7,4,'#81C784'],[8,4,'#81C784'],[9,4,'#66BB6A'],[10,4,'#4CAF50'],[11,4,'#388E3C'],
            [5,5,'#2E7D32'],[6,5,'#43A047'],[7,5,'#4CAF50'],[8,5,'#4CAF50'],[9,5,'#43A047'],[10,5,'#2E7D32'],
            [6,6,'#2E7D32'],[7,6,'#388E3C'],[8,6,'#388E3C'],[9,6,'#2E7D32'],
            // Stem with shading
            [7,7,'#6D4C41'],[8,7,'#8D6E63'],
            [7,8,'#5D4037'],[8,8,'#6D4C41'],
            [7,9,'#4E342E'],[8,9,'#5D4037'],
            [7,10,'#3E2723'],
        ];

        this.drawPixels(ctx, leafPixels);
        return canvas.toDataURL();
    },

    /**
     * Generate enhanced cat sprite (Minnie or bowtie cat)
     */
    generateCat(hasBowtie = false) {
        const canvas = this.createCanvas(24, 20);
        const ctx = canvas.getContext('2d');
        const c = this.colors;

        // Enhanced black and white cat pattern with shading
        const catPixels = [
            // Ears with depth
            [6,0,c.catBlack],[7,0,c.catBlackLight],[16,0,c.catBlackLight],[17,0,c.catBlack],
            [5,1,c.catBlack],[6,1,'#FFB6C1'],[7,1,c.catBlack],[16,1,c.catBlack],[17,1,'#FFB6C1'],[18,1,c.catBlack],
            // Head with shading
            [5,2,c.catBlack],[6,2,c.catBlack],[7,2,c.catWhite],[8,2,c.catWhite],[9,2,c.catWhite],[10,2,c.catWhite],[11,2,c.catWhite],[12,2,c.catWhite],[13,2,c.catWhite],[14,2,c.catWhite],[15,2,c.catWhite],[16,2,c.catBlack],[17,2,c.catBlack],[18,2,c.catBlack],
            [4,3,c.catBlack],[5,3,c.catWhite],[6,3,c.catWhite],[7,3,c.catWhite],[8,3,c.catWhite],[9,3,c.catWhite],[10,3,c.catWhite],[11,3,c.catWhite],[12,3,c.catWhite],[13,3,c.catWhite],[14,3,c.catWhite],[15,3,c.catWhite],[16,3,c.catWhite],[17,3,c.catWhite],[18,3,c.catBlack],[19,3,c.catBlack],
            // Eyes - expressive green
            [4,4,c.catBlack],[5,4,c.catWhite],[6,4,c.catWhite],[7,4,'#66BB6A'],[8,4,'#1a1a1a'],[9,4,c.catWhite],[10,4,c.catWhite],[11,4,c.catBlack],[12,4,c.catWhite],[13,4,c.catWhite],[14,4,'#66BB6A'],[15,4,'#1a1a1a'],[16,4,c.catWhite],[17,4,c.catWhite],[18,4,c.catBlack],[19,4,c.catBlack],
            // Eye highlights
            [7,4,'#FFFFFF40'],[14,4,'#FFFFFF40'],
            // Nose and mouth
            [4,5,c.catBlack],[5,5,c.catWhite],[6,5,c.catWhite],[7,5,c.catWhite],[8,5,c.catWhite],[9,5,c.catWhite],[10,5,'#FFB6C1'],[11,5,'#FF8A9A'],[12,5,'#FFB6C1'],[13,5,c.catWhite],[14,5,c.catWhite],[15,5,c.catWhite],[16,5,c.catWhite],[17,5,c.catWhite],[18,5,c.catBlack],[19,5,c.catBlack],
            // Whisker area
            [5,6,c.catBlack],[6,6,c.catWhiteShadow],[7,6,c.catWhite],[8,6,c.catWhite],[9,6,c.catWhite],[10,6,c.catWhite],[11,6,c.catWhite],[12,6,c.catWhite],[13,6,c.catWhite],[14,6,c.catWhite],[15,6,c.catWhite],[16,6,c.catWhiteShadow],[17,6,c.catBlack],[18,6,c.catBlack],
            // Body with long fur texture
            [6,7,c.catBlack],[7,7,c.catBlackLight],[8,7,c.catWhite],[9,7,c.catWhite],[10,7,c.catWhite],[11,7,c.catWhite],[12,7,c.catWhite],[13,7,c.catWhite],[14,7,c.catWhite],[15,7,c.catBlackLight],[16,7,c.catBlack],
            [5,8,c.catBlack],[6,8,c.catWhite],[7,8,c.catWhiteShadow],[8,8,c.catWhite],[9,8,c.catBlack],[10,8,c.catBlackLight],[11,8,c.catBlack],[12,8,c.catBlackLight],[13,8,c.catBlack],[14,8,c.catWhite],[15,8,c.catWhiteShadow],[16,8,c.catWhite],[17,8,c.catBlack],
            [4,9,c.catBlack],[5,9,c.catWhite],[6,9,c.catWhite],[7,9,c.catWhiteShadow],[8,9,c.catBlack],[9,9,c.catBlackLight],[10,9,c.catBlack],[11,9,c.catBlackLight],[12,9,c.catBlack],[13,9,c.catBlackLight],[14,9,c.catBlack],[15,9,c.catWhiteShadow],[16,9,c.catWhite],[17,9,c.catWhite],[18,9,c.catBlack],
            [4,10,c.catBlack],[5,10,c.catWhite],[6,10,c.catWhiteShadow],[7,10,c.catBlack],[8,10,c.catBlackLight],[15,10,c.catBlackLight],[16,10,c.catBlack],[17,10,c.catWhiteShadow],[18,10,c.catWhite],[19,10,c.catBlack],
            // Legs - fluffy
            [5,11,c.catBlackLight],[6,11,c.catBlack],[7,11,c.catBlackLight],[16,11,c.catBlackLight],[17,11,c.catBlack],[18,11,c.catBlackLight],
            // Fluffy tail
            [19,7,c.catBlack],[20,6,c.catBlackLight],[21,5,c.catBlack],[22,4,c.catBlackLight],[22,3,c.catBlack],[21,3,c.catBlackLight],
        ];

        this.drawPixels(ctx, catPixels);

        // Add bowtie if specified - enhanced
        if (hasBowtie) {
            const bowtiePixels = [
                [9,7,'#C62828'],[10,7,'#E53935'],[11,7,'#EF5350'],[12,7,'#E53935'],[13,7,'#C62828'],
                [10,6,'#E53935'],[11,6,'#FFCDD2'],[12,6,'#E53935'],
                [10,8,'#C62828'],[11,8,'#E53935'],[12,8,'#C62828'],
            ];
            this.drawPixels(ctx, bowtiePixels);
        }

        return canvas.toDataURL();
    },

    /**
     * Generate enhanced ghost sprite with transparency effects
     */
    generateGhost() {
        const canvas = this.createCanvas(24, 28);
        const ctx = canvas.getContext('2d');

        // Outer glow
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.arc(12, 10, 10, Math.PI, 0, false);
        ctx.lineTo(22, 24);
        ctx.lineTo(2, 24);
        ctx.closePath();
        ctx.fill();

        // Ghost body with gradient
        const gradient = ctx.createLinearGradient(12, 2, 12, 24);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        gradient.addColorStop(1, 'rgba(200, 200, 255, 0.4)');
        ctx.fillStyle = gradient;

        ctx.beginPath();
        ctx.arc(12, 10, 8, Math.PI, 0, false);
        ctx.lineTo(20, 22);
        ctx.lineTo(17, 19);
        ctx.lineTo(14, 22);
        ctx.lineTo(12, 19);
        ctx.lineTo(10, 22);
        ctx.lineTo(7, 19);
        ctx.lineTo(4, 22);
        ctx.lineTo(4, 10);
        ctx.fill();

        // Eyes with glow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(8, 8, 3, 4);
        ctx.fillRect(14, 8, 3, 4);

        // Eye highlights
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillRect(8, 8, 1, 1);
        ctx.fillRect(14, 8, 1, 1);

        return canvas.toDataURL();
    },

    /**
     * Generate enhanced car sprite (top-down view)
     */
    generateCar(color = '#E91E63') {
        const canvas = this.createCanvas(24, 40);
        const ctx = canvas.getContext('2d');

        const lighterColor = this.lightenColor(color, 30);
        const darkerColor = this.darkenColor(color, 30);

        // Car body with gradient
        const bodyGradient = ctx.createLinearGradient(4, 6, 20, 6);
        bodyGradient.addColorStop(0, darkerColor);
        bodyGradient.addColorStop(0.3, color);
        bodyGradient.addColorStop(0.7, color);
        bodyGradient.addColorStop(1, darkerColor);
        ctx.fillStyle = bodyGradient;
        ctx.fillRect(4, 6, 16, 28);

        // Roof with shine
        ctx.fillStyle = color;
        ctx.fillRect(6, 12, 12, 12);
        ctx.fillStyle = lighterColor;
        ctx.fillRect(7, 13, 4, 2);

        // Windows with reflection
        const windowGradient = ctx.createLinearGradient(7, 13, 17, 17);
        windowGradient.addColorStop(0, '#B3E5FC');
        windowGradient.addColorStop(0.5, '#87CEEB');
        windowGradient.addColorStop(1, '#64B5F6');
        ctx.fillStyle = windowGradient;
        ctx.fillRect(7, 13, 10, 4);
        ctx.fillRect(7, 19, 10, 4);

        // Window reflections
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fillRect(8, 14, 3, 1);
        ctx.fillRect(8, 20, 3, 1);

        // Wheels with detail
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(2, 8, 4, 8);
        ctx.fillRect(18, 8, 4, 8);
        ctx.fillRect(2, 24, 4, 8);
        ctx.fillRect(18, 24, 4, 8);
        // Wheel rims
        ctx.fillStyle = '#444';
        ctx.fillRect(3, 10, 2, 4);
        ctx.fillRect(19, 10, 2, 4);
        ctx.fillRect(3, 26, 2, 4);
        ctx.fillRect(19, 26, 2, 4);

        // Headlights with glow
        ctx.fillStyle = '#FFF9C4';
        ctx.fillRect(6, 4, 4, 3);
        ctx.fillRect(14, 4, 4, 3);
        ctx.fillStyle = '#FFECB3';
        ctx.fillRect(7, 5, 2, 1);
        ctx.fillRect(15, 5, 2, 1);

        // Taillights
        ctx.fillStyle = '#D32F2F';
        ctx.fillRect(6, 33, 4, 2);
        ctx.fillRect(14, 33, 4, 2);
        ctx.fillStyle = '#FFCDD2';
        ctx.fillRect(7, 33, 2, 1);
        ctx.fillRect(15, 33, 2, 1);

        return canvas.toDataURL();
    },

    /**
     * Generate enhanced road sign sprite
     */
    generateRoadSign(text) {
        const canvas = this.createCanvas(80, 40);
        const ctx = canvas.getContext('2d');

        // Sign background with gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 30);
        gradient.addColorStop(0, '#43A047');
        gradient.addColorStop(1, '#2E7D32');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 80, 30);

        // Border with shine
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 76, 26);

        // Inner highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(4, 4, 72, 22);

        // Text with shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, 41, 19);
        ctx.fillStyle = '#FFF';
        ctx.fillText(text, 40, 18);

        // Post with wood grain
        ctx.fillStyle = '#6D4C41';
        ctx.fillRect(38, 30, 4, 10);
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(39, 30, 1, 10);

        return canvas.toDataURL();
    },

    /**
     * Generate enhanced neighbor lady sprite - slightly slimmer
     */
    generateNeighborLady() {
        const canvas = this.createCanvas(28, 48);
        const ctx = canvas.getContext('2d');

        // Hair (gray, curly) with highlights
        const hairPixels = [
            [13,1,'#BDBDBD'],[14,1,'#BDBDBD'],[15,1,'#BDBDBD'],
            [12,2,'#9E9E9E'],[13,2,'#EEEEEE'],[14,2,'#EEEEEE'],[15,2,'#EEEEEE'],[16,2,'#9E9E9E'],
            [11,3,'#9E9E9E'],[12,3,'#BDBDBD'],[13,3,'#EEEEEE'],[14,3,'#EEEEEE'],[15,3,'#BDBDBD'],[16,3,'#BDBDBD'],[17,3,'#9E9E9E'],
            [11,4,'#757575'],[12,4,'#9E9E9E'],[16,4,'#9E9E9E'],[17,4,'#757575'],
        ];

        // Face with more definition
        const facePixels = [
            [13,4,'#E8C4B8'],[14,4,'#F0D0C4'],[15,4,'#E8C4B8'],
            [12,5,'#E0BCA8'],[13,5,'#E8C4B8'],[14,5,'#F0D0C4'],[15,5,'#E8C4B8'],[16,5,'#E0BCA8'],
            [12,6,'#E0BCA8'],[13,6,'#1a1a1a'],[14,6,'#E8C4B8'],[15,6,'#1a1a1a'],[16,6,'#E0BCA8'],
            [12,7,'#D8B498'],[13,7,'#E0BCA8'],[14,7,'#E8C4B8'],[15,7,'#E0BCA8'],[16,7,'#D8B498'],
            [13,8,'#D0A888'],[14,8,'#C08070'],[15,8,'#D0A888'],
        ];

        // Dress (floral pattern - purple) - slimmer
        const dressPixels = [];
        for (let y = 9; y < 26; y++) {
            const width = y < 12 ? 4 : (y < 18 ? 5 : 6);
            const startX = 14 - Math.floor(width / 2);
            for (let x = startX; x < startX + width; x++) {
                const shade = x === startX || x === startX + width - 1 ? '#6A1B9A' : '#8E24AA';
                dressPixels.push([x, y, shade]);
            }
        }
        // Flower dots on dress
        [[13,11,'#EC407A'],[15,13,'#EC407A'],[12,16,'#EC407A'],[14,19,'#EC407A'],[13,22,'#EC407A']].forEach(p => dressPixels.push(p));

        // Arms - slender
        const armPixels = [
            [10,11,'#E8C4B8'],[18,11,'#E8C4B8'],
            [9,12,'#E0BCA8'],[19,12,'#E0BCA8'],
            [8,13,'#D8B498'],[20,13,'#D8B498'],
        ];

        // Legs and shoes - slimmer
        const legPixels = [
            [13,26,'#E0BCA8'],[15,26,'#E0BCA8'],
            [13,27,'#D8B498'],[15,27,'#D8B498'],
            [12,28,'#5D4037'],[13,28,'#6D4C41'],[15,28,'#6D4C41'],[16,28,'#5D4037'],
        ];

        // Cane with grip detail
        const canePixels = [
            [7,13,'#4E342E'],[7,14,'#5D4037'],[7,15,'#5D4037'],[7,16,'#5D4037'],[7,17,'#5D4037'],
            [7,18,'#5D4037'],[7,19,'#5D4037'],[7,20,'#5D4037'],[7,21,'#5D4037'],[7,22,'#5D4037'],
            [7,23,'#5D4037'],[7,24,'#5D4037'],[7,25,'#5D4037'],[7,26,'#5D4037'],[7,27,'#4E342E'],
            [5,12,'#3E2723'],[6,12,'#4E342E'],[7,12,'#5D4037'],[8,12,'#4E342E'], // Handle
            [6,11,'#8D6E63'], // Grip
        ];

        this.drawPixels(ctx, hairPixels);
        this.drawPixels(ctx, facePixels);
        this.drawPixels(ctx, dressPixels);
        this.drawPixels(ctx, armPixels);
        this.drawPixels(ctx, legPixels);
        this.drawPixels(ctx, canePixels);

        return canvas.toDataURL();
    },

    /**
     * Helper: Lighten a hex color
     */
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    },

    /**
     * Helper: Darken a hex color
     */
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.max(0, (num >> 16) - amt);
        const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
        const B = Math.max(0, (num & 0x0000FF) - amt);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    },

    /**
     * Generate popcorn sprite for Level 4
     */
    generatePopcorn() {
        const canvas = this.createCanvas(16, 16);
        const ctx = canvas.getContext('2d');

        // Popcorn bucket
        ctx.fillStyle = '#D32F2F';
        ctx.fillRect(4, 8, 8, 7);
        ctx.fillStyle = '#B71C1C';
        ctx.fillRect(4, 8, 2, 7);
        // White stripes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(6, 8, 1, 7);
        ctx.fillRect(9, 8, 1, 7);

        // Popcorn pieces
        const popcornColors = ['#FFF8E1', '#FFECB3', '#FFE082'];
        [[5,3],[7,2],[9,3],[6,4],[8,4],[5,6],[7,5],[9,6],[6,7],[8,7]].forEach(([x, y], i) => {
            ctx.fillStyle = popcornColors[i % 3];
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        });

        return canvas.toDataURL();
    },

    /**
     * Generate TV remote sprite for Level 4
     */
    generateRemote() {
        const canvas = this.createCanvas(16, 20);
        const ctx = canvas.getContext('2d');

        // Remote body
        ctx.fillStyle = '#37474F';
        ctx.fillRect(5, 2, 6, 16);
        ctx.fillStyle = '#455A64';
        ctx.fillRect(6, 2, 4, 16);

        // Buttons
        ctx.fillStyle = '#F44336'; // Power
        ctx.fillRect(7, 4, 2, 2);

        ctx.fillStyle = '#4CAF50'; // Channel
        ctx.fillRect(6, 8, 2, 2);
        ctx.fillRect(8, 8, 2, 2);

        ctx.fillStyle = '#2196F3'; // Volume
        ctx.fillRect(6, 11, 2, 2);
        ctx.fillRect(8, 11, 2, 2);

        // Number pad
        ctx.fillStyle = '#9E9E9E';
        ctx.fillRect(6, 14, 1, 1);
        ctx.fillRect(8, 14, 1, 1);
        ctx.fillRect(9, 14, 1, 1);

        return canvas.toDataURL();
    },

    /**
     * Generate alfredo bowl sprite for Level 4
     */
    generateAlfredo() {
        const canvas = this.createCanvas(18, 16);
        const ctx = canvas.getContext('2d');

        // Bowl
        ctx.fillStyle = '#ECEFF1';
        ctx.beginPath();
        ctx.ellipse(9, 12, 7, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#CFD8DC';
        ctx.beginPath();
        ctx.ellipse(9, 11, 6, 3, 0, 0, Math.PI);
        ctx.fill();

        // Pasta/alfredo sauce
        ctx.fillStyle = '#FFF9C4';
        ctx.beginPath();
        ctx.ellipse(9, 10, 5, 2.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pasta swirls
        ctx.strokeStyle = '#FFEB3B';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(7 + i * 2, 10, 1.5, 0, Math.PI);
            ctx.stroke();
        }

        // Parsley garnish
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(8, 9, 1, 1);
        ctx.fillRect(10, 9, 1, 1);

        return canvas.toDataURL();
    },

    /**
     * Generate salad sprite for Level 4
     */
    generateSalad() {
        const canvas = this.createCanvas(18, 16);
        const ctx = canvas.getContext('2d');

        // Bowl
        ctx.fillStyle = '#8D6E63';
        ctx.beginPath();
        ctx.ellipse(9, 12, 7, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#6D4C41';
        ctx.beginPath();
        ctx.ellipse(9, 11, 6, 3, 0, 0, Math.PI);
        ctx.fill();

        // Lettuce base
        ctx.fillStyle = '#81C784';
        ctx.beginPath();
        ctx.ellipse(9, 10, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Darker lettuce
        ctx.fillStyle = '#66BB6A';
        ctx.fillRect(6, 9, 2, 2);
        ctx.fillRect(10, 9, 2, 2);

        // Tomatoes
        ctx.fillStyle = '#EF5350';
        ctx.beginPath();
        ctx.arc(7, 9, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(11, 10, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Cucumber
        ctx.fillStyle = '#A5D6A7';
        ctx.fillRect(9, 8, 2, 1);

        return canvas.toDataURL();
    },

    /**
     * Generate musical note sprite
     */
    generateMusicNote() {
        const canvas = this.createCanvas(12, 16);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#FFD700';
        // Note head
        ctx.beginPath();
        ctx.ellipse(4, 12, 3, 2, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Stem
        ctx.fillRect(6, 3, 2, 10);

        // Flag
        ctx.beginPath();
        ctx.moveTo(8, 3);
        ctx.quadraticCurveTo(12, 5, 10, 9);
        ctx.lineTo(8, 7);
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * Generate smoke/cloud puff sprite
     */
    generateSmokePuff() {
        const canvas = this.createCanvas(16, 12);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'rgba(200, 200, 200, 0.6)';
        ctx.beginPath();
        ctx.arc(5, 7, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(10, 6, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(8, 9, 3, 0, Math.PI * 2);
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * Generate star/sparkle sprite
     */
    generateSparkle() {
        const canvas = this.createCanvas(12, 12);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#FFFFFF';
        // Main star
        ctx.beginPath();
        ctx.moveTo(6, 0);
        ctx.lineTo(7, 4);
        ctx.lineTo(12, 5);
        ctx.lineTo(8, 7);
        ctx.lineTo(9, 12);
        ctx.lineTo(6, 8);
        ctx.lineTo(3, 12);
        ctx.lineTo(4, 7);
        ctx.lineTo(0, 5);
        ctx.lineTo(5, 4);
        ctx.closePath();
        ctx.fill();

        // Glow
        ctx.fillStyle = 'rgba(255, 255, 200, 0.5)';
        ctx.beginPath();
        ctx.arc(6, 6, 3, 0, Math.PI * 2);
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * Generate tree sprite for backgrounds
     */
    generateTree() {
        const canvas = this.createCanvas(24, 40);
        const ctx = canvas.getContext('2d');

        // Trunk
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(10, 25, 4, 15);
        ctx.fillStyle = '#4E342E';
        ctx.fillRect(10, 25, 2, 15);

        // Foliage layers
        const greens = ['#2E7D32', '#388E3C', '#43A047'];
        ctx.fillStyle = greens[0];
        ctx.beginPath();
        ctx.moveTo(12, 2);
        ctx.lineTo(22, 18);
        ctx.lineTo(2, 18);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = greens[1];
        ctx.beginPath();
        ctx.moveTo(12, 8);
        ctx.lineTo(20, 22);
        ctx.lineTo(4, 22);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = greens[2];
        ctx.beginPath();
        ctx.moveTo(12, 14);
        ctx.lineTo(18, 26);
        ctx.lineTo(6, 26);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * Generate bird sprite
     */
    generateBird() {
        const canvas = this.createCanvas(16, 12);
        const ctx = canvas.getContext('2d');

        // Body
        ctx.fillStyle = '#795548';
        ctx.beginPath();
        ctx.ellipse(8, 7, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head
        ctx.fillStyle = '#6D4C41';
        ctx.beginPath();
        ctx.arc(12, 5, 3, 0, Math.PI * 2);
        ctx.fill();

        // Eye
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(13, 4, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(13, 4, 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.fillStyle = '#FF9800';
        ctx.beginPath();
        ctx.moveTo(15, 5);
        ctx.lineTo(16, 5);
        ctx.lineTo(15, 6);
        ctx.closePath();
        ctx.fill();

        // Wing
        ctx.fillStyle = '#5D4037';
        ctx.beginPath();
        ctx.ellipse(7, 6, 3, 2, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Tail
        ctx.fillStyle = '#4E342E';
        ctx.beginPath();
        ctx.moveTo(3, 6);
        ctx.lineTo(0, 4);
        ctx.lineTo(0, 8);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * Generate butterfly sprite
     */
    generateButterfly() {
        const canvas = this.createCanvas(16, 14);
        const ctx = canvas.getContext('2d');

        // Wings
        ctx.fillStyle = '#E91E63';
        // Left wing
        ctx.beginPath();
        ctx.ellipse(5, 5, 4, 3, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(4, 9, 3, 2, 0.3, 0, Math.PI * 2);
        ctx.fill();
        // Right wing
        ctx.beginPath();
        ctx.ellipse(11, 5, 4, 3, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(12, 9, 3, 2, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Wing patterns
        ctx.fillStyle = '#F48FB1';
        ctx.beginPath();
        ctx.arc(5, 5, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(11, 5, 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(7, 3, 2, 9);

        // Antennae
        ctx.strokeStyle = '#1a1a1a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(8, 3);
        ctx.quadraticCurveTo(6, 0, 5, 1);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(8, 3);
        ctx.quadraticCurveTo(10, 0, 11, 1);
        ctx.stroke();

        return canvas.toDataURL();
    },

    /**
     * Generate tornado sprite
     */
    generateTornado() {
        const canvas = this.createCanvas(40, 60);
        const ctx = canvas.getContext('2d');

        // Funnel shape with gradient
        const gradient = ctx.createLinearGradient(20, 0, 20, 60);
        gradient.addColorStop(0, 'rgba(100, 100, 100, 0.9)');
        gradient.addColorStop(0.5, 'rgba(80, 80, 80, 0.8)');
        gradient.addColorStop(1, 'rgba(60, 60, 60, 0.6)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(30, 0);
        ctx.quadraticCurveTo(35, 20, 25, 40);
        ctx.quadraticCurveTo(22, 55, 21, 60);
        ctx.lineTo(19, 60);
        ctx.quadraticCurveTo(18, 55, 15, 40);
        ctx.quadraticCurveTo(5, 20, 10, 0);
        ctx.fill();

        // Debris particles
        ctx.fillStyle = '#5D4037';
        [[8, 15], [28, 12], [12, 35], [25, 40], [18, 50]].forEach(([x, y]) => {
            ctx.fillRect(x, y, 3, 2);
        });

        return canvas.toDataURL();
    },

    /**
     * Generate storm vehicle sprite
     */
    generateStormVehicle() {
        const canvas = this.createCanvas(32, 24);
        const ctx = canvas.getContext('2d');

        // Truck body
        ctx.fillStyle = '#D32F2F';
        ctx.fillRect(4, 10, 24, 10);

        // Cab
        ctx.fillStyle = '#B71C1C';
        ctx.fillRect(20, 6, 8, 14);

        // Windows
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(22, 8, 4, 4);

        // Equipment on back
        ctx.fillStyle = '#37474F';
        ctx.fillRect(6, 6, 12, 6);
        // Radar dish
        ctx.fillStyle = '#BDBDBD';
        ctx.beginPath();
        ctx.arc(12, 4, 4, Math.PI, 0);
        ctx.fill();

        // Wheels
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(10, 20, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(24, 20, 4, 0, Math.PI * 2);
        ctx.fill();
        // Hubcaps
        ctx.fillStyle = '#9E9E9E';
        ctx.beginPath();
        ctx.arc(10, 20, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(24, 20, 2, 0, Math.PI * 2);
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * Generate Gateway Arch sprite
     */
    generateArch() {
        const canvas = this.createCanvas(80, 100);
        const ctx = canvas.getContext('2d');

        // Arch with gradient (stainless steel look)
        const gradient = ctx.createLinearGradient(0, 0, 80, 0);
        gradient.addColorStop(0, '#9E9E9E');
        gradient.addColorStop(0.3, '#E0E0E0');
        gradient.addColorStop(0.5, '#F5F5F5');
        gradient.addColorStop(0.7, '#E0E0E0');
        gradient.addColorStop(1, '#9E9E9E');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        // Left leg
        ctx.moveTo(10, 100);
        ctx.lineTo(20, 100);
        ctx.quadraticCurveTo(25, 50, 40, 5);
        ctx.quadraticCurveTo(35, 50, 25, 100);
        ctx.closePath();
        ctx.fill();

        // Right leg
        ctx.beginPath();
        ctx.moveTo(70, 100);
        ctx.lineTo(60, 100);
        ctx.quadraticCurveTo(55, 50, 40, 5);
        ctx.quadraticCurveTo(45, 50, 55, 100);
        ctx.closePath();
        ctx.fill();

        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(15, 100);
        ctx.quadraticCurveTo(22, 50, 40, 8);
        ctx.quadraticCurveTo(30, 50, 18, 100);
        ctx.closePath();
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * Generate city building sprite
     */
    generateBuilding(height = 60, color = '#455A64') {
        const canvas = this.createCanvas(24, height);
        const ctx = canvas.getContext('2d');

        // Building body
        ctx.fillStyle = color;
        ctx.fillRect(2, 5, 20, height - 5);

        // Darker side
        ctx.fillStyle = this.darkenColor(color, 20);
        ctx.fillRect(2, 5, 5, height - 5);

        // Windows
        ctx.fillStyle = '#FFF59D';
        for (let y = 10; y < height - 10; y += 8) {
            for (let x = 6; x < 20; x += 6) {
                // Some windows lit, some dark
                ctx.fillStyle = Math.random() > 0.3 ? '#FFF59D' : '#37474F';
                ctx.fillRect(x, y, 3, 4);
            }
        }

        // Roof detail
        ctx.fillStyle = this.darkenColor(color, 30);
        ctx.fillRect(4, 2, 16, 4);

        return canvas.toDataURL();
    },

    /**
     * Generate dispensary sign sprite
     */
    generateDispensarySign() {
        const canvas = this.createCanvas(60, 24);
        const ctx = canvas.getContext('2d');

        // Sign background
        ctx.fillStyle = '#1B5E20';
        ctx.fillRect(0, 0, 60, 20);
        ctx.strokeStyle = '#A5D6A7';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 56, 16);

        // Text "3FIFTEEN"
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('3FIFTEEN', 30, 14);

        // Neon glow effect
        ctx.shadowColor = '#4CAF50';
        ctx.shadowBlur = 5;

        return canvas.toDataURL();
    },

    /**
     * Generate blanket sprite for Level 2
     */
    generateBlanket() {
        const canvas = this.createCanvas(40, 24);
        const ctx = canvas.getContext('2d');

        // Blanket base
        ctx.fillStyle = '#D32F2F';
        ctx.fillRect(0, 0, 40, 24);

        // Plaid pattern
        ctx.fillStyle = '#B71C1C';
        for (let x = 0; x < 40; x += 10) {
            ctx.fillRect(x, 0, 5, 24);
        }
        for (let y = 0; y < 24; y += 8) {
            ctx.fillRect(0, y, 40, 4);
        }

        // White stripes
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(5, 0, 2, 24);
        ctx.fillRect(15, 0, 2, 24);
        ctx.fillRect(25, 0, 2, 24);
        ctx.fillRect(35, 0, 2, 24);

        // Fringe on edges
        ctx.fillStyle = '#C62828';
        for (let x = 0; x < 40; x += 4) {
            ctx.fillRect(x, 22, 2, 2);
        }

        return canvas.toDataURL();
    },

    /**
     * Generate wine glass/bottle sprite
     */
    generateWine() {
        const canvas = this.createCanvas(12, 20);
        const ctx = canvas.getContext('2d');

        // Glass stem
        ctx.fillStyle = '#E0E0E0';
        ctx.fillRect(5, 10, 2, 6);

        // Glass base
        ctx.fillStyle = '#BDBDBD';
        ctx.fillRect(3, 16, 6, 2);

        // Glass bowl
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(2, 10);
        ctx.quadraticCurveTo(2, 2, 6, 2);
        ctx.quadraticCurveTo(10, 2, 10, 10);
        ctx.lineTo(10, 10);
        ctx.quadraticCurveTo(10, 11, 7, 11);
        ctx.lineTo(5, 11);
        ctx.quadraticCurveTo(2, 11, 2, 10);
        ctx.fill();

        // Wine inside
        ctx.fillStyle = '#7B1FA2';
        ctx.beginPath();
        ctx.moveTo(3, 10);
        ctx.quadraticCurveTo(3, 5, 6, 5);
        ctx.quadraticCurveTo(9, 5, 9, 10);
        ctx.lineTo(9, 10);
        ctx.quadraticCurveTo(9, 10, 7, 10);
        ctx.lineTo(5, 10);
        ctx.quadraticCurveTo(3, 10, 3, 10);
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * Generate guitar sprite (standalone)
     */
    generateGuitar() {
        const canvas = this.createCanvas(20, 40);
        const ctx = canvas.getContext('2d');

        // Body
        ctx.fillStyle = '#C9853C';
        ctx.beginPath();
        ctx.ellipse(10, 30, 8, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#B8742C';
        ctx.beginPath();
        ctx.ellipse(10, 28, 6, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // Sound hole
        ctx.fillStyle = '#3E2723';
        ctx.beginPath();
        ctx.arc(10, 28, 2, 0, Math.PI * 2);
        ctx.fill();

        // Neck
        ctx.fillStyle = '#6D4C41';
        ctx.fillRect(9, 5, 3, 20);

        // Headstock
        ctx.fillStyle = '#4E342E';
        ctx.fillRect(8, 0, 5, 6);

        // Tuning pegs
        ctx.fillStyle = '#C0C0C0';
        ctx.fillRect(6, 1, 2, 2);
        ctx.fillRect(6, 4, 2, 2);
        ctx.fillRect(13, 1, 2, 2);
        ctx.fillRect(13, 4, 2, 2);

        // Strings
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(9 + i, 6);
            ctx.lineTo(9 + i, 28);
            ctx.stroke();
        }

        return canvas.toDataURL();
    },

    /**
     * Generate phone/iPad sprite
     */
    generatePhone() {
        const canvas = this.createCanvas(14, 24);
        const ctx = canvas.getContext('2d');

        // Phone body
        ctx.fillStyle = '#37474F';
        ctx.fillRect(1, 1, 12, 22);

        // Screen
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(2, 3, 10, 17);

        // Screen content (name)
        ctx.fillStyle = '#4CAF50';
        ctx.font = '6px Arial';
        ctx.fillText('Emma', 3, 10);

        // Home button
        ctx.fillStyle = '#455A64';
        ctx.beginPath();
        ctx.arc(7, 21, 1.5, 0, Math.PI * 2);
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * Generate anxiety cloud sprite
     */
    generateAnxietyCloud() {
        const canvas = this.createCanvas(32, 24);
        const ctx = canvas.getContext('2d');

        // Purple wispy cloud
        const gradient = ctx.createRadialGradient(16, 12, 0, 16, 12, 16);
        gradient.addColorStop(0, 'rgba(156, 39, 176, 0.6)');
        gradient.addColorStop(0.5, 'rgba(123, 31, 162, 0.4)');
        gradient.addColorStop(1, 'rgba(74, 20, 140, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(10, 14, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(20, 12, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(14, 8, 6, 0, Math.PI * 2);
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * Generate speech bubble sprite
     */
    generateSpeechBubble() {
        const canvas = this.createCanvas(40, 30);
        const ctx = canvas.getContext('2d');

        // Bubble
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(5, 5);
        ctx.lineTo(35, 5);
        ctx.quadraticCurveTo(40, 5, 40, 10);
        ctx.lineTo(40, 20);
        ctx.quadraticCurveTo(40, 25, 35, 25);
        ctx.lineTo(15, 25);
        ctx.lineTo(10, 30);
        ctx.lineTo(12, 25);
        ctx.lineTo(5, 25);
        ctx.quadraticCurveTo(0, 25, 0, 20);
        ctx.lineTo(0, 10);
        ctx.quadraticCurveTo(0, 5, 5, 5);
        ctx.fill();

        // Border
        ctx.strokeStyle = '#BDBDBD';
        ctx.lineWidth = 1;
        ctx.stroke();

        return canvas.toDataURL();
    },

    /**
     * Generate clipboard/list icon sprite (for level select)
     */
    generateClipboard() {
        const canvas = document.createElement('canvas');
        canvas.width = 24;
        canvas.height = 28;
        const ctx = canvas.getContext('2d');

        // Clipboard body
        ctx.fillStyle = '#8D6E63';
        ctx.fillRect(2, 4, 20, 22);

        // Clipboard inner (paper)
        ctx.fillStyle = '#FAFAFA';
        ctx.fillRect(4, 6, 16, 18);

        // Clip at top
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(8, 0, 8, 6);
        ctx.fillRect(6, 2, 12, 4);

        // Lines on paper
        ctx.fillStyle = '#BDBDBD';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(6, 9 + i * 4, 12, 1);
        }

        return canvas.toDataURL();
    },

    /**
     * Generate graduation cap sprite
     */
    generateGradCap() {
        const canvas = document.createElement('canvas');
        canvas.width = 28;
        canvas.height = 24;
        const ctx = canvas.getContext('2d');

        // Cap top (diamond shape)
        ctx.fillStyle = '#1A237E';
        ctx.beginPath();
        ctx.moveTo(14, 2);
        ctx.lineTo(26, 10);
        ctx.lineTo(14, 14);
        ctx.lineTo(2, 10);
        ctx.closePath();
        ctx.fill();

        // Cap base
        ctx.fillStyle = '#283593';
        ctx.beginPath();
        ctx.moveTo(6, 10);
        ctx.lineTo(22, 10);
        ctx.lineTo(20, 18);
        ctx.lineTo(8, 18);
        ctx.closePath();
        ctx.fill();

        // Tassel
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(14, 10);
        ctx.lineTo(6, 16);
        ctx.lineTo(6, 22);
        ctx.stroke();

        // Tassel end
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(4, 20, 4, 3);

        return canvas.toDataURL();
    },

    /**
     * Generate couch/sofa sprite
     */
    generateCouch() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 24;
        const ctx = canvas.getContext('2d');

        // Back of couch
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(2, 4, 28, 10);

        // Cushions
        ctx.fillStyle = '#795548';
        ctx.fillRect(4, 10, 24, 8);

        // Armrests
        ctx.fillStyle = '#4E342E';
        ctx.fillRect(0, 6, 4, 14);
        ctx.fillRect(28, 6, 4, 14);

        // Cushion lines
        ctx.strokeStyle = '#3E2723';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(12, 10);
        ctx.lineTo(12, 18);
        ctx.moveTo(20, 10);
        ctx.lineTo(20, 18);
        ctx.stroke();

        // Legs
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(4, 18, 3, 4);
        ctx.fillRect(25, 18, 3, 4);

        return canvas.toDataURL();
    },

    /**
     * Generate museum/building icon sprite
     */
    generateMuseum() {
        const canvas = document.createElement('canvas');
        canvas.width = 28;
        canvas.height = 28;
        const ctx = canvas.getContext('2d');

        // Roof/pediment
        ctx.fillStyle = '#ECEFF1';
        ctx.beginPath();
        ctx.moveTo(14, 2);
        ctx.lineTo(26, 10);
        ctx.lineTo(2, 10);
        ctx.closePath();
        ctx.fill();

        // Main building
        ctx.fillStyle = '#CFD8DC';
        ctx.fillRect(3, 10, 22, 16);

        // Columns
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(5 + i * 6, 12, 3, 12);
        }

        // Base
        ctx.fillStyle = '#90A4AE';
        ctx.fillRect(2, 24, 24, 3);

        // Door
        ctx.fillStyle = '#37474F';
        ctx.fillRect(11, 18, 6, 8);

        return canvas.toDataURL();
    },

    /**
     * Generate car icon (smaller for menu)
     */
    generateCarIcon() {
        const canvas = document.createElement('canvas');
        canvas.width = 28;
        canvas.height = 20;
        const ctx = canvas.getContext('2d');

        // Car body
        ctx.fillStyle = '#E53935';
        ctx.fillRect(2, 8, 24, 8);

        // Car top
        ctx.fillStyle = '#C62828';
        ctx.beginPath();
        ctx.moveTo(6, 8);
        ctx.lineTo(10, 2);
        ctx.lineTo(20, 2);
        ctx.lineTo(24, 8);
        ctx.closePath();
        ctx.fill();

        // Windows
        ctx.fillStyle = '#81D4FA';
        ctx.beginPath();
        ctx.moveTo(8, 7);
        ctx.lineTo(10, 3);
        ctx.lineTo(13, 3);
        ctx.lineTo(13, 7);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(15, 7);
        ctx.lineTo(15, 3);
        ctx.lineTo(19, 3);
        ctx.lineTo(21, 7);
        ctx.closePath();
        ctx.fill();

        // Wheels
        ctx.fillStyle = '#212121';
        ctx.beginPath();
        ctx.arc(8, 16, 4, 0, Math.PI * 2);
        ctx.arc(20, 16, 4, 0, Math.PI * 2);
        ctx.fill();

        // Hubcaps
        ctx.fillStyle = '#757575';
        ctx.beginPath();
        ctx.arc(8, 16, 2, 0, Math.PI * 2);
        ctx.arc(20, 16, 2, 0, Math.PI * 2);
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * Generate city skyline icon
     */
    generateCityIcon() {
        const canvas = document.createElement('canvas');
        canvas.width = 28;
        canvas.height = 24;
        const ctx = canvas.getContext('2d');

        // Building 1 (left)
        ctx.fillStyle = '#37474F';
        ctx.fillRect(2, 8, 6, 16);

        // Building 2 (middle tall)
        ctx.fillStyle = '#455A64';
        ctx.fillRect(10, 2, 8, 22);

        // Building 3 (right)
        ctx.fillStyle = '#546E7A';
        ctx.fillRect(20, 6, 6, 18);

        // Windows
        ctx.fillStyle = '#FFF59D';
        // Left building
        for (let y = 0; y < 3; y++) {
            ctx.fillRect(4, 10 + y * 5, 2, 2);
        }
        // Middle building
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 2; x++) {
                ctx.fillRect(12 + x * 4, 4 + y * 5, 2, 2);
            }
        }
        // Right building
        for (let y = 0; y < 3; y++) {
            ctx.fillRect(22, 8 + y * 5, 2, 2);
        }

        return canvas.toDataURL();
    },

    /**
     * Generate star/sparkle icon
     */
    generateStar() {
        const canvas = document.createElement('canvas');
        canvas.width = 24;
        canvas.height = 24;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        const cx = 12, cy = 12;
        for (let i = 0; i < 5; i++) {
            const angle = (i * 72 - 90) * Math.PI / 180;
            const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180;
            if (i === 0) {
                ctx.moveTo(cx + 10 * Math.cos(angle), cy + 10 * Math.sin(angle));
            } else {
                ctx.lineTo(cx + 10 * Math.cos(angle), cy + 10 * Math.sin(angle));
            }
            ctx.lineTo(cx + 4 * Math.cos(innerAngle), cy + 4 * Math.sin(innerAngle));
        }
        ctx.closePath();
        ctx.fill();

        // Glow
        ctx.fillStyle = '#FFEB3B';
        ctx.beginPath();
        ctx.arc(12, 12, 3, 0, Math.PI * 2);
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * Generate door sprite
     */
    generateDoor() {
        const canvas = document.createElement('canvas');
        canvas.width = 20;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        // Door frame
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(0, 0, 20, 32);

        // Door
        ctx.fillStyle = '#795548';
        ctx.fillRect(2, 2, 16, 28);

        // Panels
        ctx.fillStyle = '#8D6E63';
        ctx.fillRect(4, 4, 12, 10);
        ctx.fillRect(4, 18, 12, 10);

        // Handle
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(14, 16, 2, 0, Math.PI * 2);
        ctx.fill();

        return canvas.toDataURL();
    },

    /**
     * Generate movie clapboard sprite
     */
    generateClapboard() {
        const canvas = document.createElement('canvas');
        canvas.width = 28;
        canvas.height = 24;
        const ctx = canvas.getContext('2d');

        // Clapboard body
        ctx.fillStyle = '#212121';
        ctx.fillRect(2, 8, 24, 14);

        // Clapper top
        ctx.fillStyle = '#424242';
        ctx.beginPath();
        ctx.moveTo(2, 8);
        ctx.lineTo(26, 8);
        ctx.lineTo(26, 2);
        ctx.lineTo(2, 6);
        ctx.closePath();
        ctx.fill();

        // Stripes on clapper
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(4 + i * 6, 2, 3, 6);
        }

        // Text area
        ctx.fillStyle = '#616161';
        ctx.fillRect(4, 10, 20, 10);

        // Lines
        ctx.strokeStyle = '#BDBDBD';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(6, 14);
        ctx.lineTo(22, 14);
        ctx.moveTo(6, 18);
        ctx.lineTo(22, 18);
        ctx.stroke();

        return canvas.toDataURL();
    },

    /**
     * Generate all game sprites and return as object
     */
    generateAllSprites() {
        return {
            // Characters
            emma: [
                this.generateEmma(0),
                this.generateEmma(1),
                this.generateEmma(2),
                this.generateEmma(3),
            ],
            barrett: this.generateBarrett(false),
            barrettGuitar: this.generateBarrett(true),
            barrettKeyboard: this.generateBarrettKeyboard(),
            minnie: this.generateCat(false),
            bowtieCat: this.generateCat(true),
            ghost: this.generateGhost(),
            neighborLady: this.generateNeighborLady(),

            // Collectibles
            heart: this.generateHeart('#FF69B4'),
            heartRed: this.generateHeart('#E91E63'),
            heartGold: this.generateHeart('#FFD700'),
            leaf: this.generateLeaf(),

            // Level 4 items
            popcorn: this.generatePopcorn(),
            remote: this.generateRemote(),
            alfredo: this.generateAlfredo(),
            salad: this.generateSalad(),
            musicNote: this.generateMusicNote(),
            smokePuff: this.generateSmokePuff(),

            // Vehicles
            car: this.generateCar('#FFFFFF'),  // Emma's white car
            carBlue: this.generateCar('#1976D2'),
            carGreen: this.generateCar('#388E3C'),
            carYellow: this.generateCar('#FBC02D'),
            carRed: this.generateCar('#D32F2F'),
            carPurple: this.generateCar('#7B1FA2'),
            stormVehicle: this.generateStormVehicle(),

            // Nature
            tree: this.generateTree(),
            bird: this.generateBird(),
            butterfly: this.generateButterfly(),
            sparkle: this.generateSparkle(),
            anxietyCloud: this.generateAnxietyCloud(),

            // Level 3
            tornado: this.generateTornado(),

            // Level 6 / Finale
            arch: this.generateArch(),
            building: this.generateBuilding(),
            buildingTall: this.generateBuilding(80, '#37474F'),
            buildingShort: this.generateBuilding(40, '#546E7A'),

            // Props
            dispensarySign: this.generateDispensarySign(),
            blanket: this.generateBlanket(),
            wine: this.generateWine(),
            guitar: this.generateGuitar(),
            electricKeyboard: this.generateElectricKeyboard(),
            phone: this.generatePhone(),
            speechBubble: this.generateSpeechBubble(),

            // UI Icons
            clipboard: this.generateClipboard(),
            gradCap: this.generateGradCap(),
            couch: this.generateCouch(),
            museum: this.generateMuseum(),
            carIcon: this.generateCarIcon(),
            cityIcon: this.generateCityIcon(),
            star: this.generateStar(),
            door: this.generateDoor(),
            clapboard: this.generateClapboard(),
        };
    }
};

// Export for use in game.js
window.SpriteGenerator = SpriteGenerator;
