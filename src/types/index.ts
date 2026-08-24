// =============================================================================
// NFT Card Forge - Type Definitions
// =============================================================================

// =============================================================================
// Core Types
// =============================================================================

export interface NFTCard {
  id: string;
  title: string;
  description: string;
  image: string;
  character?: Character3D;
  template: CardTemplate;
  theme: CardTheme;
  effects: CardEffect[];
  metadata: NFTMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface NFTMetadata {
  name: string;
  creator: string;
  collection: string;
  attributes: CardAttribute[];
  rarity: Rarity;
  edition: number;
  blockchain: BlockchainType;
  smartContract?: string;
  tokenId?: string;
}

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
export type BlockchainType = 'ethereum' | 'solana' | 'polygon' | 'base' | 'arbitrum';

// =============================================================================
// Card Template Types
// =============================================================================

export interface CardTemplate {
  id: string;
  name: string;
  layout: CardLayout;
  dimensions: {
    width: number;
    height: number;
  };
  layers: CardLayer[];
  background: BackgroundConfig;
  border: BorderConfig;
  textStyles: TextStyles;
}

export type CardLayout = 'standard' | 'portrait' | 'landscape' | 'wide' | 'tall';

export interface CardLayer {
  id: string;
  type: 'image' | 'text' | 'shape' | 'effect' | 'character';
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation?: number;
  opacity?: number;
  zIndex: number;
  visible: boolean;
  content?: string | any;
  style?: any;
}

export interface BackgroundConfig {
  type: 'solid' | 'gradient' | 'image' | 'pattern' | 'video';
  color?: string;
  colors?: string[];
  image?: string;
  pattern?: PatternType;
  video?: string;
  opacity: number;
  blur?: number;
}

export type PatternType = 'stripes' | 'dots' | 'grid' | 'wave' | 'noise' | 'custom';

export interface BorderConfig {
  type: 'solid' | 'gradient' | 'image' | 'glow';
  color?: string;
  colors?: string[];
  width: number;
  radius: number;
  glow?: {
    color: string;
    intensity: number;
    spread: number;
  };
}

export interface TextStyles {
  title: TextStyle;
  subtitle: TextStyle;
  description: TextStyle;
  stats: TextStyle;
  label: TextStyle;
  value: TextStyle;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  letterSpacing?: number;
  lineHeight?: number;
  shadow?: {
    color: string;
    blur: number;
    offset: { x: number; y: number };
  };
  gradient?: {
    colors: string[];
    direction: string;
  };
}

// =============================================================================
// 3D Character Types
// =============================================================================

export interface Character3D {
  id: string;
  name: string;
  base: CharacterBase;
  body: CharacterBody;
  face: CharacterFace;
  hair: CharacterHair;
  outfit: CharacterOutfit;
  accessories: CharacterAccessory[];
  pose: CharacterPose;
  expression: CharacterExpression;
  customDesigns: CustomDesign[];
  animations: CharacterAnimation[];
  materials: CharacterMaterials;
  lighting: CharacterLighting;
}

export interface CharacterBase {
  model: CharacterModel;
  height: number;
  scale: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

export type CharacterModel = 
  | 'humanoid'
  | 'robot'
  | 'cyborg'
  | 'fantasy'
  | 'anime'
  | 'cartoon'
  | 'realistic'
  | 'stylized'
  | 'custom';

export interface CharacterBody {
  type: BodyType;
  build: BodyBuild;
  skin: {
    color: string;
    texture?: string;
    roughness: number;
    metallic: number;
    glow?: number;
  };
  proportions: BodyProportions;
}

export type BodyType = 'human' | 'android' | 'creature' | 'custom';
export type BodyBuild = 'slim' | 'average' | 'muscular' | 'stocky' | 'custom';

export interface BodyProportions {
  head: number;
  torso: number;
  arms: number;
  legs: number;
  hands: number;
  feet: number;
}

export interface CharacterFace {
  shape: FaceShape;
  features: FaceFeatures;
  eyes: EyeConfig;
  mouth: MouthConfig;
  nose: NoseConfig;
  eyebrows: EyebrowConfig;
}

export type FaceShape = 
  | 'round'
  | 'oval'
  | 'square'
  | 'heart'
  | 'diamond'
  | 'long'
  | 'custom';

export interface FaceFeatures {
  symmetry: number;
  masculinity: number;
  age: number;
  uniqueness: number;
}

export interface EyeConfig {
  shape: EyeShape;
  color: string;
  size: number;
  spacing: number;
  iris: {
    color: string;
    pattern?: EyePattern;
    size: number;
  };
  pupil: {
    color: string;
    size: number;
    shape: PupilShape;
  };
  glow?: {
    color: string;
    intensity: number;
  };
}

export type EyeShape = 'round' | 'almond' | 'slanted' | 'wide' | 'narrow' | 'custom';
export type EyePattern = 'solid' | 'striped' | 'spiral' | 'galaxy' | 'custom';
export type PupilShape = 'round' | 'slit' | 'square' | 'star' | 'custom';

export interface MouthConfig {
  shape: MouthShape;
  size: number;
  position: number;
  color: string;
  teeth?: {
    visible: boolean;
    color: string;
    count: number;
  };
  tongue?: {
    visible: boolean;
    color: string;
    length: number;
  };
}

export type MouthShape = 
  | 'smile'
  | 'frown'
  | 'neutral'
  | 'open'
  | 'pout'
  | 'grimace'
  | 'custom';

export interface NoseConfig {
  shape: NoseShape;
  size: number;
  width: number;
  position: number;
}

export type NoseShape = 'button' | 'hook' | 'roman' | 'flat' | 'upturned' | 'custom';

export interface EyebrowConfig {
  shape: EyebrowShape;
  thickness: number;
  color: string;
  arch: number;
  spacing: number;
}

export type EyebrowShape = 'straight' | 'curved' | 'angled' | 'thick' | 'thin' | 'custom';

export interface CharacterHair {
  style: HairStyle;
  color: string;
  colors?: string[];
  length: number;
  thickness: number;
  curliness: number;
  texture: HairTexture;
  accessories: HairAccessory[];
}

export type HairStyle = 
  | 'short'
  | 'bob'
  | 'long'
  | 'braided'
  | 'dreadlocks'
  | 'afro'
  | 'ponytail'
  | 'bun'
  | 'pixie'
  | 'mohawk'
  | 'undercut'
  | 'custom';

export type HairTexture = 'straight' | 'wavy' | 'curly' | 'kinky' | 'frizzy' | 'smooth';

export interface HairAccessory {
  type: 'headband' | 'hat' | 'bandana' | 'tiara' | 'hairpin' | 'custom';
  color: string;
  position: number;
  size: number;
}

export interface CharacterOutfit {
  base: OutfitBase;
  top: OutfitItem;
  bottom: OutfitItem;
  footwear: OutfitItem;
  accessories: OutfitAccessory[];
  materials: OutfitMaterials;
}

export interface OutfitBase {
  style: OutfitStyle;
  color: string;
  pattern?: PatternType;
  fit: OutfitFit;
}

export type OutfitStyle = 
  | 'casual'
  | 'formal'
  | 'sporty'
  | 'futuristic'
  | 'fantasy'
  | 'cyberpunk'
  | 'gothic'
  | 'retro'
  | 'military'
  | 'custom';

export type OutfitFit = 'tight' | 'loose' | 'regular' | 'oversized';

export interface OutfitItem {
  type: OutfitItemType;
  color: string;
  pattern?: PatternType;
  length?: number;
  sleeves?: number;
  neckline?: NecklineType;
  visible: boolean;
}

export type OutfitItemType = 
  | 'shirt'
  | 'hoodie'
  | 'jacket'
  | 'coat'
  | 'vest'
  | 'dress'
  | 'skirt'
  | 'pants'
  | 'shorts'
  | 'robe'
  | 'armor'
  | 'custom';

export type NecklineType = 
  | 'crew'
  | 'v-neck'
  | 'scoop'
  | 'collared'
  | 'off-shoulder'
  | 'halter'
  | 'custom';

export interface OutfitAccessory {
  type: OutfitAccessoryType;
  color: string;
  position: number;
  size: number;
  material: MaterialType;
}

export type OutfitAccessoryType = 
  | 'belt'
  | 'gloves'
  | 'scarf'
  | 'tie'
  | 'bowtie'
  | 'suspenders'
  | 'cumberbund'
  | 'sash'
  | 'cape'
  | 'wings'
  | 'custom';

export interface OutfitMaterials {
  fabric: MaterialType;
  trim?: MaterialType;
  buttons?: MaterialType;
  details?: MaterialType;
}

export type MaterialType = 
  | 'cotton'
  | 'leather'
  | 'silk'
  | 'metal'
  | 'plastic'
  | 'glass'
  | 'gemstone'
  | 'fur'
  | 'scale'
  | 'custom';

export interface CharacterAccessory {
  id: string;
  type: AccessoryType;
  position: AccessoryPosition;
  size: number;
  rotation: { x: number; y: number; z: number };
  color: string;
  material: MaterialType;
  glow?: {
    color: string;
    intensity: number;
    distance: number;
  };
  animation?: AccessoryAnimation;
}

export type AccessoryType = 
  | 'glasses'
  | 'hat'
  | 'jewelry'
  | 'mask'
  | 'weapon'
  | 'shield'
  | 'backpack'
  | 'wings'
  | 'tail'
  | 'horns'
  | 'ears'
  | 'fins'
  | 'custom';

export type AccessoryPosition = 
  | 'head'
  | 'face'
  | 'neck'
  | 'shoulders'
  | 'chest'
  | 'arms'
  | 'hands'
  | 'waist'
  | 'legs'
  | 'feet'
  | 'back'
  | 'custom';

export interface AccessoryAnimation {
  type: AnimationType;
  speed: number;
  amplitude: number;
  enabled: boolean;
}

export type AnimationType = 
  | 'none'
  | 'rotate'
  | 'bounce'
  | 'pulse'
  | 'wave'
  | 'float'
  | 'spin'
  | 'custom';

export type CharacterPose = 
  | 'standing'
  | 'sitting'
  | 'kneeling'
  | 'lying'
  | 'flying'
  | 'fighting'
  | 'dancing'
  | 'running'
  | 'jumping'
  | 'custom';

export type CharacterExpression = 
  | 'neutral'
  | 'happy'
  | 'angry'
  | 'sad'
  | 'surprised'
  | 'scared'
  | 'disgusted'
  | 'confident'
  | 'shy'
  | 'determined'
  | 'mysterious'
  | 'custom';

export interface CustomDesign {
  id: string;
  name: string;
  type: 'texture' | 'model' | 'material' | 'pattern';
  data: string | ArrayBuffer;
  position: number[];
  rotation: number[];
  scale: number[];
  opacity: number;
  blendMode: BlendMode;
}

export type BlendMode = 
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'additive'
  | 'subtract'
  | 'difference';

export interface CharacterAnimation {
  id: string;
  type: AnimationType;
  name: string;
  speed: number;
  loop: boolean;
  enabled: boolean;
  frames: AnimationFrame[];
}

export interface AnimationFrame {
  time: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

export interface CharacterMaterials {
  skin: MaterialConfig;
  hair: MaterialConfig;
  outfit: MaterialConfig;
  accessories: MaterialConfig;
  eyes: MaterialConfig;
}

export interface MaterialConfig {
  type: MaterialType;
  color: string;
  roughness: number;
  metallic: number;
  reflectivity: number;
  emission: number;
  emissionColor: string;
  transparent: boolean;
  opacity: number;
  texture?: string;
  normalMap?: string;
  bumpMap?: string;
  displacementMap?: string;
}

export interface CharacterLighting {
  ambient: LightConfig;
  directional: LightConfig[];
  point: LightConfig[];
  spot: LightConfig[];
  environment?: string;
  shadows: boolean;
}

export interface LightConfig {
  color: string;
  intensity: number;
  position?: { x: number; y: number; z: number };
  direction?: { x: number; y: number; z: number };
  distance?: number;
  angle?: number;
  penumbra?: number;
  decay?: number;
  castShadow?: boolean;
}

// =============================================================================
// Card Effects
// =============================================================================

export interface CardEffect {
  id: string;
  type: EffectType;
  name: string;
  enabled: boolean;
  intensity: number;
  config: any;
}

export type EffectType = 
  | 'glow'
  | 'shadow'
  | 'blur'
  | 'sharpen'
  | 'noise'
  | 'vignette'
  | 'chromatic_aberration'
  | 'distortion'
  | 'particles'
  | 'animation'
  | 'holographic'
  | 'neon'
  | 'gradient_overlay'
  | 'custom';

export interface GlowEffect extends CardEffect {
  type: 'glow';
  config: {
    color: string;
    innerRadius: number;
    outerRadius: number;
    blur: number;
  };
}

export interface ShadowEffect extends CardEffect {
  type: 'shadow';
  config: {
    color: string;
    blur: number;
    offset: { x: number; y: number };
    opacity: number;
  };
}

export interface BlurEffect extends CardEffect {
  type: 'blur';
  config: {
    amount: number;
    quality: 'low' | 'medium' | 'high';
  };
}

// =============================================================================
// Card Theme
// =============================================================================

export interface CardTheme {
  id: string;
  name: string;
  palette: ColorPalette;
  typography: TypographyConfig;
  spacing: SpacingConfig;
  borderRadius: number;
  shadows: ShadowConfig[];
  transitions: TransitionConfig;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface TypographyConfig {
  fontFamily: string;
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    bold: number;
    black: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
}

export interface SpacingConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
}

export interface ShadowConfig {
  name: string;
  offset: { x: number; y: number };
  blur: number;
  spread: number;
  color: string;
  opacity: number;
}

export interface TransitionConfig {
  duration: number;
  timingFunction: string;
  delay: number;
}

// =============================================================================
// Card Attributes
// =============================================================================

export interface CardAttribute {
  id: string;
  traitType: string;
  value: string | number;
  displayType?: 'number' | 'string' | 'date' | 'range';
  maxValue?: number;
  rarity?: Rarity;
  percentage?: number;
}

// =============================================================================
// UI State Types
// =============================================================================

export interface AppState {
  currentCard: NFTCard | null;
  cards: NFTCard[];
  currentCharacter: Character3D | null;
  characters: Character3D[];
  templates: CardTemplate[];
  themes: CardTheme[];
  selectedTemplate: CardTemplate | null;
  selectedTheme: CardTheme | null;
  editorMode: EditorMode;
  previewMode: boolean;
  exportQuality: ExportQuality;
  loading: boolean;
  error: string | null;
}

export type EditorMode = 
  | 'card'
  | 'character'
  | 'template'
  | 'theme'
  | 'effects';

export type ExportQuality = 'low' | 'medium' | 'high' | 'ultra';

export interface EditorState {
  selectedElement: string | null;
  selectedLayer: CardLayer | null;
  selectedAccessory: CharacterAccessory | null;
  transformMode: TransformMode;
  colorPicker: {
    open: boolean;
    color: string;
    onChange: (color: string) => void;
  };
  history: HistoryState;
}

export type TransformMode = 
  | 'move'
  | 'rotate'
  | 'scale'
  | 'resize'
  | 'none';

export interface HistoryState {
  undoStack: any[];
  redoStack: any[];
  currentIndex: number;
}

// =============================================================================
// Configuration Types
// =============================================================================

export interface AppConfig {
  version: string;
  settings: AppSettings;
  defaults: {
    card: Partial<NFTCard>;
    character: Partial<Character3D>;
    template: CardTemplate;
    theme: CardTheme;
  };
  presets: {
    templates: CardTemplate[];
    themes: CardTheme[];
    characters: Character3D[];
  };
}

export interface AppSettings {
  language: string;
  theme: 'light' | 'dark' | 'system';
  performance: {
    maxTextureSize: number;
    maxParticles: number;
    quality: ExportQuality;
  };
  storage: {
    autoSave: boolean;
    saveInterval: number;
    localStorage: boolean;
  };
  features: {
    experimental: boolean;
    analytics: boolean;
    updates: boolean;
  };
}

// =============================================================================
// Event Types
// =============================================================================

export interface CardEvent {
  type: CardEventType;
  payload: any;
  timestamp: number;
}

export type CardEventType = 
  | 'CARD_CREATED'
  | 'CARD_UPDATED'
  | 'CARD_DELETED'
  | 'CARD_SELECTED'
  | 'CHARACTER_CREATED'
  | 'CHARACTER_UPDATED'
  | 'CHARACTER_DELETED'
  | 'CHARACTER_SELECTED'
  | 'TEMPLATE_SELECTED'
  | 'THEME_SELECTED'
  | 'EFFECT_ADDED'
  | 'EFFECT_REMOVED'
  | 'EFFECT_UPDATED'
  | 'LAYER_ADDED'
  | 'LAYER_REMOVED'
  | 'LAYER_UPDATED'
  | 'EXPORT_STARTED'
  | 'EXPORT_COMPLETED'
  | 'PREVIEW_TOGGLED'
  | 'MODE_CHANGED';

// =============================================================================
// Action Types
// =============================================================================

export type CardAction = 
  | { type: 'SET_CARD'; payload: NFTCard }
  | { type: 'ADD_CARD'; payload: NFTCard }
  | { type: 'UPDATE_CARD'; payload: { id: string; updates: Partial<NFTCard> } }
  | { type: 'DELETE_CARD'; payload: string }
  | { type: 'SET_CHARACTER'; payload: Character3D }
  | { type: 'ADD_CHARACTER'; payload: Character3D }
  | { type: 'UPDATE_CHARACTER'; payload: { id: string; updates: Partial<Character3D> } }
  | { type: 'DELETE_CHARACTER'; payload: string }
  | { type: 'SET_TEMPLATE'; payload: CardTemplate }
  | { type: 'SET_THEME'; payload: CardTheme }
  | { type: 'SET_EDITOR_MODE'; payload: EditorMode }
  | { type: 'TOGGLE_PREVIEW'; payload?: boolean }
  | { type: 'SET_EXPORT_QUALITY'; payload: ExportQuality }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// =============================================================================
// Utility Types
// =============================================================================

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Euler {
  x: number;
  y: number;
  z: number;
}

export interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

export type Color = {
  r: number;
  g: number;
  b: number;
  a?: number;
} | string;

// =============================================================================
// Export Types
// =============================================================================

export interface ExportOptions {
  format: ExportFormat;
  quality: ExportQuality;
  resolution: { width: number; height: number };
  includeMetadata: boolean;
  includeThumbnail: boolean;
  filename: string;
  transparentBackground: boolean;
}

export type ExportFormat = 'png' | 'jpg' | 'webp' | 'svg' | 'pdf' | 'gif';

export interface ExportResult {
  success: boolean;
  data?: string | ArrayBuffer;
  filename: string;
  size: number;
  format: ExportFormat;
  error?: string;
  timestamp: number;
}

// =============================================================================
// 3D Renderer Types
// =============================================================================

export interface RendererConfig {
  canvas: HTMLCanvasElement | null;
  width: number;
  height: number;
  pixelRatio: number;
  antialias: boolean;
  alpha: boolean;
  shadows: boolean;
  toneMapping: string;
  toneMappingExposure: number;
}

export interface CameraConfig {
  type: 'perspective' | 'orthographic';
  fov: number;
  aspect: number;
  near: number;
  far: number;
  position: Vector3;
  target: Vector3;
  zoom: number;
}

export interface SceneConfig {
  background: string | null;
  environment: string | null;
  fog?: {
    color: string;
    near: number;
    far: number;
  };
}

// =============================================================================
// Custom Shader Types
// =============================================================================

export interface ShaderMaterialConfig {
  vertexShader: string;
  fragmentShader: string;
  uniforms: Record<string, any>;
  transparent: boolean;
  depthWrite: boolean;
  depthTest: boolean;
  blending: BlendMode;
}

// =============================================================================
// Animation Types
// =============================================================================

export interface Keyframe {
  time: number;
  value: any;
  interpolation: 'linear' | 'step' | 'cubic' | 'quadratic';
  tangent?: number[];
}

export interface AnimationTrack {
  name: string;
  type: 'position' | 'rotation' | 'scale' | 'color' | 'opacity' | 'custom';
  keyframes: Keyframe[];
  loop: boolean;
  clamp: boolean;
}

export interface AnimationClip {
  id: string;
  name: string;
  duration: number;
  tracks: AnimationTrack[];
  loop: boolean;
}

// =============================================================================
// Preset Types
// =============================================================================

export interface Preset {
  id: string;
  name: string;
  description: string;
  category: PresetCategory;
  data: any;
  thumbnail?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type PresetCategory = 
  | 'card'
  | 'character'
  | 'template'
  | 'theme'
  | 'effect'
  | 'accessory'
  | 'animation';

// =============================================================================
// User Types
// =============================================================================

export interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  settings: UserSettings;
  preferences: UserPreferences;
  collections: UserCollection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  displayName: string;
  bio?: string;
  socialLinks: Record<string, string>;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sound: boolean;
  };
}

export interface UserPreferences {
  editor: {
    theme: 'light' | 'dark' | 'system';
    layout: 'grid' | 'list' | 'compact';
    snapToGrid: boolean;
    gridSize: number;
    showGuides: boolean;
  };
  rendering: {
    quality: ExportQuality;
    format: ExportFormat;
    resolution: { width: number; height: number };
  };
}

export interface UserCollection {
  id: string;
  name: string;
  description: string;
  cards: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// API Types
// =============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: number;
}

export interface ApiRequest {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  params?: Record<string, string>;
  headers?: Record<string, string>;
}

// =============================================================================
// Web3 Types
// =============================================================================

export interface WalletConnection {
  address: string;
  provider: string;
  chainId: number;
  connected: boolean;
  balance?: string;
}

export interface MintOptions {
  cardId: string;
  collectionId: string;
  price: string;
  currency: string;
  royalty: number;
  supply: number;
  unlockable: boolean;
  attributes: CardAttribute[];
}

export interface MintResult {
  transactionHash: string;
  tokenId: string;
  contractAddress: string;
  explorerUrl: string;
  success: boolean;
  error?: string;
}

// =============================================================================
// IndexedDB Types
// =============================================================================

export interface DBConfig {
  name: string;
  version: number;
  stores: {
    cards: string;
    characters: string;
    templates: string;
    themes: string;
    presets: string;
    settings: string;
  };
}

// =============================================================================
// Error Types
// =============================================================================

export class CardError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public details?: any
  ) {
    super(message);
    this.name = 'CardError';
  }
}

export type ErrorCode = 
  | 'VALIDATION_ERROR'
  | 'RENDER_ERROR'
  | 'EXPORT_ERROR'
  | 'STORAGE_ERROR'
  | 'NETWORK_ERROR'
  | 'UNSUPPORTED_FORMAT'
  | 'INVALID_CONFIGURATION'
  | 'MISSING_DEPENDENCY'
  | 'WEBGL_ERROR'
  | 'UNKNOWN_ERROR';

// =============================================================================
// Analytics Types
// =============================================================================

export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
}

// =============================================================================
// Internationalization Types
// =============================================================================

export interface Translation {
  [key: string]: string | Translation;
}

export interface Locale {
  code: string;
  name: string;
  translations: Translation;
  rtl: boolean;
}

// =============================================================================
// Keyboard Shortcut Types
// =============================================================================

export interface KeyboardShortcut {
  key: string;
  modifier?: 'ctrl' | 'shift' | 'alt' | 'meta';
  action: string;
  description: string;
  category: string;
}

export interface ShortcutConfig {
  [category: string]: KeyboardShortcut[];
}
