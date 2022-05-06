// Type declarations

export type GKey = keyof typeof gKeys;
export type ReadableGKey = typeof gKeys[GKey];
export type Tag = typeof tags[number];
export type SimpleTag = Exclude<Tag, 'd'>;
export type LevelKey = keyof typeof levelKeys;
export type MappedStatKey = keyof typeof statKeys;
export type CoinStatKey = `unique_${number}_${number}`;
export type ReadableLevelKey = typeof levelKeys[LevelKey];
export type StatName = typeof statKeys[MappedStatKey];

type CoinStats = {
	[key in CoinStatKey]?: string;
};

export type StatKey = MappedStatKey & CoinStats;

export type StrObj<T> = {
	[key: string]: T;
};

export type PartialReadableSaveSpecifics = {
	officialLevels?: StrObj<Value>;
};

export type PartialReadableSave = {
	[key in ReadableGKey]?: Value;
};

export type Stats = CoinStats & {
	[key in StatName]?: number;
};

type ReadableSaveSpecifics = {
	stats?: Stats;
};

export type ReadableSaveOthers = {
	[key in Exclude<ReadableGKey, keyof ReadableSaveSpecifics>]?: Value;
};

export type ReadableSave = ReadableSaveSpecifics & ReadableSaveOthers;

export type Value =
	| string
	| number
	| boolean
	| {
			[key: string]: Value;
	  };

export type RawLevelMap = {
	[levelId: string]: {
		[key in LevelKey]: string;
	};
};

export type RawLevelList = {
	[levelId: string]: StrObj<Value>;
};

// KV maps

export const tags = <const>['d', 'r', 'i', 's', 't', 'f'];

export const orbAmounts = [0, 0, 50, 75, 125, 175, 225, 275, 350, 425, 500];

export const demonTypes = ['Unknown', 'Hard', 'Unknown', 'Easy', 'Medium', 'Insane', 'Extreme'];

export const demonTypesFull = {
	Unknown: 0,
	'Hard Demon': 1,
	Unknown2: 2,
	'Easy Demon': 3,
	'Medium Demon': 4,
	'Insane Demon': 5,
	'Extreme Demon': 6,
};

export const ratingColors = {
	Official: 'cyan',
	Epic: '#ff8000',
	Featured: 'yellow',
	Starred: '#ffffbb',
	Rated: '#ffffbb',
	Unrated: 'white',
	Unavailable: 'gray',
};

export const typeColors = {
	Daily: '#ff8000',
	Weekly: '#da0000',
	Gauntlet: 'salmon',
	Official: 'cyan',
	Online: 'lime',
};

export const gKeys = <const>{
	GS_value: 'stats',
	GS_completed: 'completedLevels',
	GS_3: 'userCoins',
	GS_4: 'bronzeUserCoins',
	GS_5: 'mapPackStars',
	GS_6: 'shopPurchases',
	GS_7: 'levelProgress',
	GS_8: '[unused]',
	GS_9: 'levelStars',
	GS_10: 'officialLevelProgress',
	GS_11: 'dailyRewards',
	GS_12: 'quests',
	GS_13: '[unused]',
	GS_14: 'questRewards',
	GS_15: 'queuedQuests',
	GS_16: 'dailyProgress',
	GS_17: 'dailyStars',
	GS_18: 'gauntletProgress',
	GS_19: 'treasureRoomRewards',
	GS_20: 'totalDemonKeys',
	GS_21: 'rewards',
	GS_22: 'gdWorldRewards',
	GS_23: 'gauntletProgress2',
	GS_24: 'dailyProgress2',
	GS_25: 'weeklyRewards',

	GLM_01: 'officialLevels',
	GLM_02: 'uploadedLevels',
	GLM_03: 'onlineLevels',
	GLM_04: 'starredLevels',
	GLM_05: '[unused]',
	GLM_06: 'followedAccounts',
	GLM_07: 'recentlyPlayed',
	GLM_08: 'enabledSearchFilters',
	GLM_09: 'availableSearchFilters',
	GLM_10: 'timelyLevels',
	GLM_11: 'dailyID',
	GLM_12: 'likes',
	GLM_13: 'ratedLevels',
	GLM_14: 'reportedLevels',
	GLM_15: 'ratedDemons',
	GLM_16: 'gauntlets',
	GLM_17: 'weeklyID',
	GLM_18: 'levelFolders',
	GLM_19: 'createdLevelFolders',

	GJA_001: 'username',
	GJA_002: 'password',
	GJA_003: 'accountID',
	GJA_004: 'sessionID',

	LLM_01: 'localLevels',
	LLM_02: 'binaryVersion',

	MDLM_001: 'songInfo',
	MDLM_002: 'songPriority',

	KBM_001: 'keybinds',
	KBM_002: 'keybinds2',

	texQuality: 'textureQuality',
	customObjectDict: 'customObjects',
	reportedAchievements: 'achievements',
	secretNumber: 'cod3breakerSolution',
	hasRP: 'isMod',
	valueKeeper: 'unlockedItems',
	unlockValueKeeper: 'unlockValueKeeper',
	bootups: 'bootups',
	binaryVersion: 'binaryVersion',
	resolution: 'resolution',

	bgVolume: 'backgroundVolume',
	sfxVolume: 'sfxVolume',
	showSongMarkers: 'showSongMarkers',
	showProgressBar: 'showProgressBar',

	clickedGarage: 'clickedIconKit',
	clickedEditor: 'clickedEditor',
	clickedName: 'clickedName',
	clickedPractice: 'clickedPractice',
	showedEditorGuide: 'showedEditorGuide',
	showedRateStarDialog: 'showedRateStarDialog',
	showedLowDetailDialog: 'showedLowDetailDialog',
	hasRatedGame: 'hasRatedGame',

	playerUDID: 'playerUDID',
	playerName: 'playerName',
	playerUserID: 'playerID',
	playerFrame: 'playerFrame',
	playerShip: 'playerShip',
	playerBall: 'playerBall',
	playerBird: 'playerUFO',
	playerDart: 'playerWave',
	playerRobot: 'playerRobot',
	playerSpider: 'playerSpider',
	playerColor: 'playerPrimaryColor',
	playerColor2: 'playerSecondaryColor',
	playerStreak: 'playerTrail',
	playerDeathEffect: 'playerDeathEffect',
	playerIconType: 'playerIconType',
	playerGlow: 'playerGlow',
};

export const kcekKeys = {
	4: 'level',
	6: 'song',
	7: 'quest',
	8: 'reward',
	9: 'rewardData',
};

export const statKeys = <const>{
	'1': 'jumps',
	'2': 'attempts',
	'3': 'officialLevelsCompleted',
	'4': 'onlineLevelsCompleted',
	'5': 'demons',
	'6': 'stars',
	'7': 'mapPacks',
	'8': 'coins',
	'9': 'destroyedPlayers',
	'10': 'likedLevels',
	'11': 'ratedLevels',
	'12': 'userCoins',
	'13': 'diamonds',
	'14': 'orbs',
	'15': 'completedDailies',
	'16': 'fireShards',
	'17': 'iceShards',
	'18': 'poisonShards',
	'19': 'shadowShards',
	'20': 'lavaShards',
	'21': 'demonKeys',
	'22': 'totalOrbs',
};

export const questKeys = {
	1: { name: 'itemType', bump: ['orbs', 'coins', 'stars'] },
	2: 'obtainedItems',
	3: 'requiredItems',
	4: 'diamonds',
	5: 'timeLeft',
	6: 'active',
	7: 'name',
	8: 'tier',
};

export const songKeys = {
	1: 'id',
	2: 'name',
	3: 'artistID',
	4: 'artist',
	5: 'size',
	6: 'youtubeID',
	7: 'youtubeChannel',
	8: 'scouted',
	9: 'priority',
	10: 'url',
};

export const chestKeys = {
	1: 'id',
	2: { name: 'chest', bump: ['small', 'large', 'small', 'large'] },
	3: 'rewards',
};

export const rewardKeys = {
	1: {
		name: 'item',
		bump: [
			'Fire Shard',
			'Ice Shard',
			'Poison Shard',
			'Shadow Shard',
			'Lava Shard',
			'Demon Key',
			'Mana Orbs',
			'Diamonds',
			'Icon',
		],
	},
	2: 'iconID',
	3: 'amount',
	4: {
		name: 'iconForm',
		bump: ['cube', 'color1', 'color2', 'ship', 'ball', 'ufo', 'wave', 'robot', 'spider', 'trail', 'deathEffect'],
	},
};

export const starDifficulties = [
	'Unrated',
	'Auto',
	'Easy',
	'Normal',
	'Hard',
	'Hard',
	'Harder',
	'Harder',
	'Insane',
	'Insane',
	'Demon',
];

export const levelKeys = <const>{
	k1: 'id',
	k2: 'name',
	k3: 'description',
	k4: 'levelData',
	k5: 'author',
	k6: 'playerID',
	k7: 'difficulty',
	k8: 'officialSongID',
	k9: 'ratingScore1',
	k10: 'ratingScore2',
	k11: 'downloads',
	k12: 'completions',
	k13: 'editable',
	k14: 'verified',
	k15: 'uploaded',
	k16: 'version',
	k17: 'gameVersion',
	k18: 'attempts',
	k19: 'percentage',
	k20: 'practicePercentage',
	k21: 'levelType',
	k22: 'likes',
	k23: 'length',
	k24: 'dislikes',
	k25: 'demon',
	k26: 'stars',
	k27: 'featuredPosition',
	k33: 'auto',
	k34: 'replayData',
	k35: 'playable',
	k36: 'jumps',
	k37: 'secretCoinsToUnlock',
	k38: 'levelUnlocked',
	k41: 'password',
	k42: 'copiedID',
	k43: 'twoPlayer',
	k45: 'customSongID',
	k46: 'revision',
	k47: 'edited',
	k48: 'objects',
	k50: 'binaryVersion',
	k60: 'accountID',
	k61: 'firstCoinCollected',
	k62: 'secondCoinCollected',
	k63: 'thirdCoinCollected',
	k64: 'totalCoins',
	k65: 'verifiedCoins',
	k66: 'requestedStars',
	k67: 'extraString',
	k68: 'antiCheatTriggered',
	k69: 'large',
	k71: 'manaOrbPercentage',
	k72: 'ldm',
	k73: 'ldmEnabled',
	k74: 'timelyID',
	k75: 'epic',
	k76: 'demonType',
	k77: 'isGauntlet',
	k78: 'isGauntlet2',
	k79: 'unlisted',
	k80: 'editorTime',
	k81: 'totalEditorTime',
	k82: 'favorited',
	k83: 'savedLevelIndex',
	k84: 'folder',
	k85: 'clicks',
	k86: 'bestAttemptTime',
	k87: 'seed',
	k88: 'scores',
	k89: 'leaderboardValid',
	k90: 'leaderboardPercentage',
	kI1: 'editorCameraX',
	kI2: 'editorCameraY',
	kI3: 'editorCameraZoom',
	kI4: 'editorBuildTabPage',
	kI5: 'editorBuildTabCategory',
	kI6: 'editorRecentPages',
	kI7: 'editorLayer',
};

export const difficulties = <const>['Easy', 'Normal', 'Hard', 'Harder', 'Insane', 'Demon'];
export const levelTypes = <const>['official', 'local', 'saved', 'online'];
export const lengths = <const>['Tiny', 'Short', 'Medium', 'Long', 'XL'];

export const levelKeysOld = <const>{
	k1: 'id',
	k2: 'name',
	k3: { name: 'description' },
	k4: 'levelData',
	k5: 'author',
	k6: 'playerID',
	k7: { name: 'difficulty', bump: ['Easy', 'Normal', 'Hard', 'Harder', 'Insane', 'Demon'] },
	k8: 'officialSongID',
	k9: 'ratingScore1',
	k10: 'ratingScore2',
	k11: 'downloads',
	k12: 'completions',
	k13: 'editable',
	k14: 'verified',
	k15: 'uploaded',
	k16: 'version',
	k17: 'gameVersion',
	k18: 'attempts',
	k19: 'percentage',
	k20: 'practicePercentage',
	k21: { name: 'levelType', bump: ['official', 'local', 'saved', 'online'] },
	k22: 'likes',
	k23: { name: 'length', bump: ['Tiny', 'Short', 'Medium', 'Long', 'XL'] },
	k24: 'dislikes',
	k25: 'demon',
	k26: 'stars',
	k27: 'featuredPosition',
	k33: 'auto',
	k34: 'replayData',
	k35: 'playable',
	k36: 'jumps',
	k37: 'secretCoinsToUnlock',
	k38: 'levelUnlocked',
	k41: 'password',
	k42: 'copiedID',
	k43: 'twoPlayer',
	k45: 'customSongID',
	k46: 'revision',
	k47: 'edited',
	k48: 'objects',
	k50: 'binaryVersion',
	k60: 'accountID',
	k61: 'firstCoinCollected',
	k62: 'secondCoinCollected',
	k63: 'thirdCoinCollected',
	k64: 'totalCoins',
	k65: 'verifiedCoins',
	k66: 'requestedStars',
	k67: 'extraString',
	k68: 'antiCheatTriggered',
	k69: 'large',
	k71: 'manaOrbPercentage',
	k72: 'ldm',
	k73: 'ldmEnabled',
	k74: 'timelyID',
	k75: 'epic',
	k76: 'demonType',
	k77: 'isGauntlet',
	k78: 'isGauntlet2',
	k79: 'unlisted',
	k80: 'editorTime',
	k81: 'totalEditorTime',
	k82: 'favorited',
	k83: 'savedLevelIndex',
	k84: 'folder',
	k85: 'clicks',
	k86: 'bestAttemptTime',
	k87: 'seed',
	k88: 'scores',
	k89: 'leaderboardValid',
	k90: 'leaderboardPercentage',
	kI1: 'editorCameraX',
	kI2: 'editorCameraY',
	kI3: 'editorCameraZoom',
	kI4: 'editorBuildTabPage',
	kI5: 'editorBuildTabCategory',
	kI6: 'editorRecentPages',
	kI7: 'editorLayer',
};

export const gameVariables = {
	'0001': 'editor.followPlayer',
	'0002': 'editor.playMusic',
	'0003': 'editor.swipe',
	'0004': 'editor.freeMove',
	'0005': 'editor.deleteFilter',
	'0006': 'editor.deleteObjectID',
	'0007': 'editor.rotateEnabled',
	'0008': 'editor.snapEnabled',
	'0009': 'editor.ignoreDamage',
	'0010': 'flip2PlayerControls',
	'0011': 'alwaysLimitControls',
	'0012': 'acceptedCommentRules',
	'0013': 'increaseMaxUndo',
	'0014': 'disableExplosionShake',
	'0015': 'flipPauseButton',
	'0016': 'acceptedSongTOS',
	'0018': 'noSongLimit',
	'0019': 'loadSongsToMemory',
	'0022': 'higherAudioQuality',
	'0023': 'smoothFix',
	'0024': 'showCursor',
	'0025': 'fullscreen',
	'0026': 'autoRetry',
	'0027': 'autoCheckpoints',
	'0028': 'disableThumbstick',
	'0029': 'showedUploadPopup',
	'0030': 'vsync',
	'0033': 'changeSongLocation',
	'0034': 'gameCenter',
	'0036': 'editor.previewMode',
	'0037': 'editor.showGround',
	'0038': 'editor.showGrid',
	'0039': 'editor.gridOnTop',
	'0040': 'showPercentage',
	'0041': 'editor.showObjectInfo',
	'0042': 'increaseMaxLevels',
	'0043': 'editor.effectLines',
	'0044': 'editor.triggerBoxes',
	'0045': 'editor.debugDraw',
	'0046': 'editor.hideUIOnTest',
	'0047': 'showedProfileText',
	'0049': 'editor.columns',
	'0050': 'editor.rows',
	'0051': 'showedNGMessage',
	'0052': 'fastPracticeReset',
	'0053': 'showedFreeGamesPopup',
	'0056': 'disableHighObjectAlert',
	'0057': 'editor.holdToSwipe',
	'0058': 'editor.durationLines',
	'0059': 'editor.swipeCycleMode',
	'0060': 'defaultMiniIcon',
	'0061': 'switchSpiderTeleportColor',
	'0062': 'switchDashFireColor',
	'0063': 'showedUnverifiedCoinsMessage',
	'0064': 'editor.selectFilter',
	'0065': 'enableMoveOptimization',
	'0066': 'highCapacityMode',
	'0067': 'highStartPosAccuracy',
	'0068': 'quickCheckpointMode',
	'0069': 'commentMode',
	'0070': 'showedUnlistedLevelMessage',
	'0072': 'disableGravityEffect',
	'0073': 'newCompletedFilter',
	'0074': 'showRestartButton',
	'0075': 'parental.disableComments',
	'0076': 'parental.disableAccountComments',
	'0077': 'parental.featuredLevelsOnly',
	'0078': 'editor.hideBackground',
	'0079': 'editor.hideGridOnPlay',
	'0081': 'disableShake',
	'0082': 'disableHighObjectAlert',
	'0083': 'disableSongAlert',
	'0084': 'manualOrder',
	'0088': 'compactComments',
	'0089': 'extendedInfoMode',
	'0090': 'autoLoadComments',
	'0091': 'createdLevelFolder',
	'0092': 'savedLevelFolder',
	'0093': 'increaseLevelsPerPage',
	'0094': 'moreComments',
	'0096': 'switchWaveTrailColor',
	'0097': 'editor.enableLinkControls',
	'0098': 'levelLeaderboardType',
	'0099': 'showLeaderboardPercent',
	'0100': 'practiceDeathEffect',
	'0101': 'forceSmoothFix',
	'0102': 'editor.editorSmoothFix',
};

export const gameEvents = {
	'1': 'challengeUnlocked',
	'2': 'glubfubHint1',
	'3': 'glubfubHint2',
	'4': 'challengeCompleted',
	'5': 'treasureRoomUnlocked',
	'6': 'chamberOfTimeUnlocked',
	'7': 'chamberOfTimeDiscovered',
	'8': 'foundMasterEmblem',
	'9': 'gatekeeperDialogue',
	'10': 'scratchDialogue',
	'11': 'scratchShopUnlocked',
	'12': 'monsterDialogue',
	'13': 'monsterFreed',
	'14': 'demonKey1',
	'15': 'demonKey2',
	'16': 'demonKey3',
	'17': 'shopkeeperDialogue',
	'18': 'gdwOnlineUnlocked',
	'19': 'monsterEncountered',
	'20': 'communityShopUnlocked',
	'21': 'potborDialogue',
	'22': 'youtubeChest',
	'23': 'facebookChest',
	'24': 'twitterChest',
};

// Helper functions

export function isGKey(key: string): key is GKey {
	return key in gKeys;
}

export function isTag(tag: string): tag is Tag {
	return tags.includes(tag as Tag);
}

export function isSimpleTag(tag: string): tag is SimpleTag {
	return tags.includes(tag as Tag) && tag !== 'd';
}

export function isLevelKey(key: string): key is LevelKey {
	return key in levelKeys;
}

export function isStatKey(key: string): key is MappedStatKey {
	return key in statKeys;
}

export function isStrObj(obj: any): obj is StrObj<any> {
	return typeof obj === 'object';
}
