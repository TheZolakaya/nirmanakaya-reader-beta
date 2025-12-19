"use client";
import { useState, useRef, useEffect } from 'react';

// === CORE DATA WITH EXTENDED DESCRIPTIONS ===
const ARCHETYPES = {
  0: { name: "Potential", traditional: "The Fool", house: "Gestalt", channel: null, function: "Seed", 
       description: "Pure possibility before differentiation",
       extended: "The seed state of all becoming. Not naivety but infinite potential — the moment before choice collapses possibility into actuality. Contains everything, committed to nothing yet." },
  1: { name: "Will", traditional: "The Magician", house: "Gestalt", channel: null, function: "Medium", 
       description: "Directed agency, choosing direction",
       extended: "The capacity to direct attention and energy toward chosen ends. Not force but focused intention — the ability to say 'this, not that' and mean it." },
  2: { name: "Wisdom", traditional: "The High Priestess", house: "Spirit", channel: "Cognition", function: "Seed", 
       description: "Knowing what to attend to",
       extended: "Deep knowing that precedes analysis. The capacity to recognize what matters before understanding why. Wisdom isn't accumulated knowledge — it's seeing through to essence." },
  3: { name: "Nurturing", traditional: "The Empress", house: "Spirit", channel: "Structure", function: "Medium", 
       description: "Care for what is growing",
       extended: "Tending what needs to develop. Creating conditions for growth without forcing outcomes. The patient attention that allows emergence." },
  4: { name: "Order", traditional: "The Emperor", house: "Mind", channel: "Intent", function: "Seed", 
       description: "Establishing pattern and structure",
       extended: "The impulse to organize chaos into workable form. Not rigid control but functional architecture — creating containers that allow complexity to be navigated." },
  5: { name: "Culture", traditional: "The Hierophant", house: "Mind", channel: "Resonance", function: "Medium", 
       description: "Shared meaning and tradition",
       extended: "The transmission of meaning across time and between people. Rituals, languages, practices that carry wisdom forward. Living connection to what has proven valuable." },
  6: { name: "Compassion", traditional: "The Lovers", house: "Emotion", channel: "Resonance", function: "Seed", 
       description: "Relational connection and alignment",
       extended: "The capacity to feel with rather than just about. Genuine alignment between beings that recognizes shared experience. Connection that honors difference." },
  7: { name: "Drive", traditional: "The Chariot", house: "Emotion", channel: "Intent", function: "Medium", 
       description: "Directed momentum toward goals",
       extended: "Energy channeled toward destination. Not aggression but focused motion — the capacity to maintain direction through resistance without being consumed." },
  8: { name: "Fortitude", traditional: "Strength", house: "Body", channel: "Structure", function: "Seed", 
       description: "Endurance and holding capacity",
       extended: "The ability to bear what must be borne. Not hardness but resilient strength — capacity to hold form under pressure without breaking or becoming rigid." },
  9: { name: "Discipline", traditional: "The Hermit", house: "Body", channel: "Cognition", function: "Medium", 
       description: "Focused practice and refinement",
       extended: "Solitary cultivation of capacity through repetition. The hermit's lamp illuminates through sustained attention, not flash. Intention transformed into embodied skill." },
  10: { name: "Cycles", traditional: "Wheel of Fortune", house: "Portal", channel: null, function: "Ingress", 
        description: "What is entering now",
        extended: "The turning point where what was outside enters the system. Not fate but timing — recognizing what's arriving and how to meet it." },
  11: { name: "Equity", traditional: "Justice", house: "Body", channel: "Resonance", function: "Fruition", 
        description: "Fair calibration and balance",
        extended: "Right relationship made manifest. Not punishment but recalibration — adjusting what's out of proportion until balance returns." },
  12: { name: "Sacrifice", traditional: "The Hanged Man", house: "Body", channel: "Intent", function: "Feedback", 
        description: "Purposeful release",
        extended: "Conscious letting go of what no longer serves. Not loss but clearing — creating space by releasing grip. Revealing value hidden by habitual grasping." },
  13: { name: "Change", traditional: "Death", house: "Emotion", channel: "Structure", function: "Fruition", 
        description: "Necessary endings and clearing",
        extended: "The completion that allows new beginning. Not destruction but transformation — the moment when what was must fully end for what will be to emerge." },
  14: { name: "Balance", traditional: "Temperance", house: "Emotion", channel: "Cognition", function: "Feedback", 
        description: "Dynamic equilibrium",
        extended: "Continuous adjustment that maintains flow. Not static middle but active calibration — sensing when to add, when to subtract, how to blend." },
  15: { name: "Abstraction", traditional: "The Devil", house: "Mind", channel: "Cognition", function: "Fruition", 
        description: "Pure pattern, freed from literal",
        extended: "Recognition of pattern stripped of content. Not temptation but clarity about mechanism — seeing how things work beneath surface appearance." },
  16: { name: "Breakthrough", traditional: "The Tower", house: "Mind", channel: "Structure", function: "Feedback", 
        description: "Sudden clearing of false structure",
        extended: "Rapid dissolution of what couldn't hold. Not catastrophe but liberation — structures built on false premises collapse when truth arrives." },
  17: { name: "Inspiration", traditional: "The Star", house: "Spirit", channel: "Intent", function: "Fruition", 
        description: "Aspirational pull toward light",
        extended: "The draw toward what's genuinely desired. Not fantasy but orientation — knowing which star to steer by. Recognized, not given; remembered, not arrived." },
  18: { name: "Imagination", traditional: "The Moon", house: "Spirit", channel: "Resonance", function: "Feedback", 
        description: "Navigating ambiguity",
        extended: "Capacity to move through uncertainty without forcing clarity. The moon illuminates enough to walk, not enough to see everything. Trust the path that reveals itself." },
  19: { name: "Actualization", traditional: "The Sun", house: "Gestalt", channel: null, function: "Fruition", 
        description: "Becoming what you are",
        extended: "Full expression of inherent nature. Not achievement but authenticity — allowing what you are to shine without dimming or distortion." },
  20: { name: "Awareness", traditional: "Judgement", house: "Gestalt", channel: null, function: "Feedback", 
        description: "Seeing the whole pattern",
        extended: "The capacity to perceive from outside the system while remaining within it. Not judgment but recognition — seeing what's true across all layers." },
  21: { name: "Wholeness", traditional: "The World", house: "Portal", channel: null, function: "Egress", 
        description: "Integration and completion",
        extended: "The point of departure that is also arrival. Full integration that allows release into next becoming. Completion that opens rather than closes." }
};

const BOUNDS = {
  22: { name: "Activation", traditional: "Ace of Wands", channel: "Intent", number: 1, archetype: 19, description: "The spark of directed energy. Pure intent arising, ready to move." },
  23: { name: "Orientation", traditional: "2 of Wands", channel: "Intent", number: 2, archetype: 18, description: "Choosing direction from possibility. Surveying options before committing." },
  24: { name: "Assertion", traditional: "3 of Wands", channel: "Intent", number: 3, archetype: 4, description: "Declaring intention outward. Making your direction known." },
  25: { name: "Alignment", traditional: "4 of Wands", channel: "Intent", number: 4, archetype: 7, description: "Intent finding stable form. Celebration of direction clarified." },
  26: { name: "Offering", traditional: "5 of Wands", channel: "Intent", number: 5, archetype: 12, description: "Testing intent through engagement. Multiple directions meeting and sorting." },
  27: { name: "Recognition", traditional: "6 of Wands", channel: "Intent", number: 6, archetype: 12, description: "Intent acknowledged by others. Victory through visible commitment." },
  28: { name: "Resolve", traditional: "7 of Wands", channel: "Intent", number: 7, archetype: 7, description: "Defending chosen direction. Gathering strength to maintain course." },
  29: { name: "Command", traditional: "8 of Wands", channel: "Intent", number: 8, archetype: 4, description: "Intent in rapid motion. Messages sent, actions launched." },
  30: { name: "Resilience", traditional: "9 of Wands", channel: "Intent", number: 9, archetype: 18, description: "Intent weathered but unbroken. Strength from having persisted." },
  31: { name: "Realization", traditional: "10 of Wands", channel: "Intent", number: 10, archetype: 19, description: "Intent fully manifested. Carrying what you've created." },
  32: { name: "Perception", traditional: "Ace of Swords", channel: "Cognition", number: 1, archetype: 19, description: "Pure clarity arising. The moment of seeing through." },
  33: { name: "Reflection", traditional: "2 of Swords", channel: "Cognition", number: 2, archetype: 2, description: "Mind holding opposites. Balanced consideration before deciding." },
  34: { name: "Calculation", traditional: "3 of Swords", channel: "Cognition", number: 3, archetype: 15, description: "Truth that cuts. Clear seeing even when it hurts." },
  35: { name: "Dissonance", traditional: "4 of Swords", channel: "Cognition", number: 4, archetype: 14, description: "Mind at rest. Recovery through mental stillness." },
  36: { name: "Clash", traditional: "5 of Swords", channel: "Cognition", number: 5, archetype: 9, description: "Mental conflict and aftermath. The cost of intellect alone." },
  37: { name: "Guidance", traditional: "6 of Swords", channel: "Cognition", number: 6, archetype: 9, description: "Mind finding passage. Moving toward clearer waters." },
  38: { name: "Reconciliation", traditional: "7 of Swords", channel: "Cognition", number: 7, archetype: 14, description: "Gathering scattered thoughts. Strategic mental collection." },
  39: { name: "Absorption", traditional: "8 of Swords", channel: "Cognition", number: 8, archetype: 15, description: "Mind bound by its own constructs. The trap of over-thinking." },
  40: { name: "Multiplicity", traditional: "9 of Swords", channel: "Cognition", number: 9, archetype: 2, description: "Mental overwhelm. Too many thoughts, too little rest." },
  41: { name: "Clarity", traditional: "10 of Swords", channel: "Cognition", number: 10, archetype: 19, description: "Mental cycle complete. The end that allows new understanding." },
  42: { name: "Receptivity", traditional: "Ace of Cups", channel: "Resonance", number: 1, archetype: 20, description: "Heart open to receive. Pure emotional availability." },
  43: { name: "Merge", traditional: "2 of Cups", channel: "Resonance", number: 2, archetype: 6, description: "Two becoming one flow. Connection that honors both." },
  44: { name: "Ripple", traditional: "3 of Cups", channel: "Resonance", number: 3, archetype: 5, description: "Joy shared and multiplied. Celebration creating community." },
  45: { name: "Reverie", traditional: "4 of Cups", channel: "Resonance", number: 4, archetype: 6, description: "Emotional contemplation. Sitting with feelings before responding." },
  46: { name: "Ache", traditional: "5 of Cups", channel: "Resonance", number: 5, archetype: 11, description: "Grief acknowledged. Feeling loss fully rather than bypassing." },
  47: { name: "Reciprocity", traditional: "6 of Cups", channel: "Resonance", number: 6, archetype: 11, description: "Emotional exchange across time. Giving and receiving in balance." },
  48: { name: "Allure", traditional: "7 of Cups", channel: "Resonance", number: 7, archetype: 6, description: "Gathering emotional possibilities. Dreams and desires assembled." },
  49: { name: "Release", traditional: "8 of Cups", channel: "Resonance", number: 8, archetype: 5, description: "Walking away from completion. Emotional departure toward growth." },
  50: { name: "Fulfillment", traditional: "9 of Cups", channel: "Resonance", number: 9, archetype: 6, description: "Emotional abundance. Deep satisfaction with what is." },
  51: { name: "Completion", traditional: "10 of Cups", channel: "Resonance", number: 10, archetype: 20, description: "Emotional wholeness achieved. The heart at home." },
  52: { name: "Initiation", traditional: "Ace of Pentacles", channel: "Structure", number: 1, archetype: 1, description: "Material beginning. The seed of form ready to grow." },
  53: { name: "Flow", traditional: "2 of Pentacles", channel: "Structure", number: 2, archetype: 3, description: "Balancing material demands. Juggling resources with grace." },
  54: { name: "Formation", traditional: "3 of Pentacles", channel: "Structure", number: 3, archetype: 16, description: "Structure taking shape. Skilled work building something real." },
  55: { name: "Preservation", traditional: "4 of Pentacles", channel: "Structure", number: 4, archetype: 13, description: "Holding what you have. Security through careful stewardship." },
  56: { name: "Endurance", traditional: "5 of Pentacles", channel: "Structure", number: 5, archetype: 8, description: "Structure under strain. Persisting through material difficulty." },
  57: { name: "Support", traditional: "6 of Pentacles", channel: "Structure", number: 6, archetype: 8, description: "Resources flowing between people. Giving and receiving help." },
  58: { name: "Harvest", traditional: "7 of Pentacles", channel: "Structure", number: 7, archetype: 13, description: "Gathering what's grown. Patient waiting rewarded with results." },
  59: { name: "Commitment", traditional: "8 of Pentacles", channel: "Structure", number: 8, archetype: 16, description: "Dedicated craft. Building skill through devoted practice." },
  60: { name: "Flourishing", traditional: "9 of Pentacles", channel: "Structure", number: 9, archetype: 3, description: "Material abundance achieved. Enjoying what patience built." },
  61: { name: "Achievement", traditional: "10 of Pentacles", channel: "Structure", number: 10, archetype: 1, description: "Structural completion. Legacy established, foundation secure." }
};

const AGENTS = {
  62: { name: "Initiate of Intent", traditional: "Page of Wands", channel: "Intent", role: "Initiate", archetype: 17, description: "Fresh enthusiasm for new direction. The spark before it knows where it's going." },
  63: { name: "Catalyst of Intent", traditional: "Knight of Wands", channel: "Intent", role: "Catalyst", archetype: 4, description: "Intent in motion, charging forward. Action creating change through momentum." },
  64: { name: "Steward of Intent", traditional: "Queen of Wands", channel: "Intent", role: "Steward", archetype: 7, description: "Mature direction held with warmth. Tending the fire without burning out." },
  65: { name: "Executor of Intent", traditional: "King of Wands", channel: "Intent", role: "Executor", archetype: 12, description: "Mastery of directed will. Knowing when to release as well as push." },
  66: { name: "Initiate of Cognition", traditional: "Page of Swords", channel: "Cognition", role: "Initiate", archetype: 2, description: "Fresh curiosity, eager to understand. Mental energy before focus." },
  67: { name: "Catalyst of Cognition", traditional: "Knight of Swords", channel: "Cognition", role: "Catalyst", archetype: 15, description: "Thought in rapid motion. Cutting through to truth with speed." },
  68: { name: "Steward of Cognition", traditional: "Queen of Swords", channel: "Cognition", role: "Steward", archetype: 14, description: "Clear perception held with discernment. Truth-telling tempered with wisdom." },
  69: { name: "Executor of Cognition", traditional: "King of Swords", channel: "Cognition", role: "Executor", archetype: 9, description: "Mastery of mind. Authority from disciplined clarity." },
  70: { name: "Initiate of Resonance", traditional: "Page of Cups", channel: "Resonance", role: "Initiate", archetype: 18, description: "Fresh emotional sensitivity. The heart discovering its capacity." },
  71: { name: "Catalyst of Resonance", traditional: "Knight of Cups", channel: "Resonance", role: "Catalyst", archetype: 5, description: "Feeling in motion. Romantic pursuit of emotional truth." },
  72: { name: "Steward of Resonance", traditional: "Queen of Cups", channel: "Resonance", role: "Steward", archetype: 6, description: "Deep emotional attunement. Holding space with compassionate presence." },
  73: { name: "Executor of Resonance", traditional: "King of Cups", channel: "Resonance", role: "Executor", archetype: 11, description: "Mastery of emotion. Feeling deeply while maintaining equanimity." },
  74: { name: "Initiate of Structure", traditional: "Page of Pentacles", channel: "Structure", role: "Initiate", archetype: 3, description: "Fresh engagement with material world. Learning how things grow." },
  75: { name: "Catalyst of Structure", traditional: "Knight of Pentacles", channel: "Structure", role: "Catalyst", archetype: 16, description: "Steady progress through persistent effort. Slow but unstoppable." },
  76: { name: "Steward of Structure", traditional: "Queen of Pentacles", channel: "Structure", role: "Steward", archetype: 13, description: "Nurturing material abundance. Creating conditions for sustainable growth." },
  77: { name: "Executor of Structure", traditional: "King of Pentacles", channel: "Structure", role: "Executor", archetype: 8, description: "Mastery of material realm. Building that endures through generations." }
};

const STATUSES = {
  1: { name: "Balanced", orientation: "Now-aligned", desc: "Authentic expression", prefix: "" },
  2: { name: "Too Much", orientation: "Future-projected", desc: "Over-expressing", prefix: "Too Much" },
  3: { name: "Too Little", orientation: "Past-anchored", desc: "Under-expressing", prefix: "Too Little" },
  4: { name: "Unacknowledged", orientation: "Shadow", desc: "Operating without awareness", prefix: "Unacknowledged" }
};

// Extended status info for popups
const STATUS_INFO = {
  1: { 
    name: "Balanced", 
    orientation: "Now-aligned", 
    description: "Authentic expression — the function is operating correctly, present-centered, integrated.",
    extended: "When an archetype is balanced, it expresses naturally without excess or deficiency. There's no correction needed because the energy is flowing appropriately for the moment. This is the optimal state — full presence without distortion."
  },
  2: { 
    name: "Too Much", 
    orientation: "Future-projected", 
    description: "Over-expressing — anxiety, control, pushing ahead of natural timing.",
    extended: "Too Much indicates future-projection: you're leaning into what hasn't arrived yet, trying to control outcomes, or over-applying this energy. The correction is the Diagonal partner — the opposite pole that counterbalances the excess and rotates runaway momentum back into alignment."
  },
  3: { 
    name: "Too Little", 
    orientation: "Past-anchored", 
    description: "Under-expressing — withdrawn, avoidant, not fully arriving in the present.",
    extended: "Too Little indicates past-anchoring: energy is withdrawn, held back, caught in what was rather than what is. The correction is the Vertical partner — the same archetypal identity at the other scale, which restores recursion and reconnects you to your complete capacity."
  },
  4: { 
    name: "Unacknowledged", 
    orientation: "Shadow", 
    description: "Operating without awareness — steering without conscious integration.",
    extended: "Unacknowledged is shadow operation: this energy is running but you can't see it. It's influencing behavior without consent or alignment. The correction is the Reduction pair — returning to the generating source, the micro-level node from which this emerged. Going back to basics makes the shadow visible."
  }
};

// Channel data for popups
const CHANNELS = {
  Intent: {
    name: "Intent",
    traditional: "Wands",
    element: "Fire",
    description: "Directed will and action — the channel of purposeful movement toward chosen ends.",
    extended: "Intent is the fire channel — energy directed toward goals. It governs motivation, drive, ambition, and the capacity to move from vision to action. When healthy, Intent provides momentum without burning out. When imbalanced, it becomes either aggressive pushing or paralyzed inaction."
  },
  Cognition: {
    name: "Cognition",
    traditional: "Swords",
    element: "Air",
    description: "Mental clarity and understanding — the channel of thought, analysis, and perception.",
    extended: "Cognition is the air channel — the realm of mind, thought, and clarity. It governs how we perceive, analyze, communicate, and understand. When healthy, Cognition provides clear seeing without over-thinking. When imbalanced, it becomes either mental chaos or cold disconnection."
  },
  Resonance: {
    name: "Resonance",
    traditional: "Cups",
    element: "Water",
    description: "Emotional attunement and connection — the channel of feeling and relationship.",
    extended: "Resonance is the water channel — the realm of emotion, intuition, and connection. It governs how we feel, relate, and attune to others. When healthy, Resonance provides deep feeling without drowning. When imbalanced, it becomes either emotional flooding or numbness."
  },
  Structure: {
    name: "Structure",
    traditional: "Pentacles",
    element: "Earth",
    description: "Material form and manifestation — the channel of building, resources, and embodiment.",
    extended: "Structure is the earth channel — the realm of form, matter, and practical reality. It governs resources, health, work, and physical manifestation. When healthy, Structure provides stability without rigidity. When imbalanced, it becomes either hoarding or instability."
  }
};

// House data for popups
const HOUSES = {
  Gestalt: {
    name: "Gestalt",
    members: [0, 1, 19, 20],
    governor: 10,
    description: "The integrative whole — identity, will, actualization, and awareness.",
    extended: "Gestalt contains the archetypes of unified selfhood: Potential (0), Will (1), Actualization (19), and Awareness (20). Governed by Cycles (10), this house represents the complete self — not as a collection of parts, but as an integrated whole that is more than the sum of its components."
  },
  Spirit: {
    name: "Spirit",
    members: [2, 3, 17, 18],
    governor: 0,
    description: "Inner knowing and aspiration — wisdom, nurturing, inspiration, and imagination.",
    extended: "Spirit contains the archetypes of deep knowing: Wisdom (2), Nurturing (3), Inspiration (17), and Imagination (18). Governed by Potential (0), this house represents our connection to meaning, purpose, and the sources of guidance that transcend rational analysis."
  },
  Mind: {
    name: "Mind",
    members: [4, 5, 15, 16],
    governor: 19,
    description: "Pattern and structure — order, culture, abstraction, and breakthrough.",
    extended: "Mind contains the archetypes of mental organization: Order (4), Culture (5), Abstraction (15), and Breakthrough (16). Governed by Actualization (19), this house represents how we structure reality through thought, language, and systems."
  },
  Emotion: {
    name: "Emotion",
    members: [6, 7, 13, 14],
    governor: 20,
    description: "Feeling and drive — compassion, motivation, change, and balance.",
    extended: "Emotion contains the archetypes of feeling and motivation: Compassion (6), Drive (7), Change (13), and Balance (14). Governed by Awareness (20), this house represents our capacity to feel, connect, and be moved toward action."
  },
  Body: {
    name: "Body",
    members: [8, 9, 11, 12],
    governor: 1,
    description: "Form and practice — fortitude, discipline, equity, and sacrifice.",
    extended: "Body contains the archetypes of embodied practice: Fortitude (8), Discipline (9), Equity (11), and Sacrifice (12). Governed by Will (1), this house represents how we manifest in physical reality through endurance, skill, fairness, and release."
  },
  Portal: {
    name: "Portal",
    members: [10, 21],
    governor: null,
    description: "Threshold of entry and exit — cycles of beginning and completion.",
    extended: "Portal contains the archetypes of transition: Cycles (10) as Ingress and Wholeness (21) as Egress. This house has no governor — it represents the thresholds through which consciousness enters and exits the system, the turning points of becoming."
  }
};

// House colors matching Channel scheme
const HOUSE_COLORS = {
  Gestalt: { border: 'border-amber-500/50', bg: 'bg-amber-950/30', text: 'text-amber-400' },
  Spirit: { border: 'border-violet-500/50', bg: 'bg-violet-950/30', text: 'text-violet-400' },
  Mind: { border: 'border-cyan-500/50', bg: 'bg-cyan-950/30', text: 'text-cyan-400' },
  Emotion: { border: 'border-blue-500/50', bg: 'bg-blue-950/30', text: 'text-blue-400' },
  Body: { border: 'border-green-500/50', bg: 'bg-green-950/30', text: 'text-green-400' },
  Portal: { border: 'border-rose-500/50', bg: 'bg-rose-950/30', text: 'text-rose-400' }
};

// Status indicator colors (smaller, secondary)
const STATUS_COLORS = {
  1: 'text-emerald-400 bg-emerald-500/20',
  2: 'text-amber-400 bg-amber-500/20',
  3: 'text-sky-400 bg-sky-500/20',
  4: 'text-violet-400 bg-violet-500/20'
};

const CHANNEL_CROSSINGS = {
  2: { Cognition: "Intent", Intent: "Cognition", Resonance: "Structure", Structure: "Resonance" },
  3: { Cognition: "Structure", Intent: "Resonance", Resonance: "Intent", Structure: "Cognition" },
  4: { Cognition: "Resonance", Intent: "Structure", Resonance: "Cognition", Structure: "Intent" }
};

const CHANNEL_COLORS = {
  Intent: "text-orange-400",
  Cognition: "text-cyan-400", 
  Resonance: "text-blue-400",
  Structure: "text-green-400"
};

// === SPREAD DEFINITIONS ===
const DURABLE_SPREADS = {
  threeCard: { 
    name: "Three Card", 
    count: 3, 
    frames: [
      { name: "Situation", house: "Mind" },
      { name: "Path", house: "Spirit" },
      { name: "Outcome", house: "Gestalt" }
    ],
    description: "Situation → Path → Outcome"
  },
  fourAspects: {
    name: "Four Aspects",
    count: 4,
    frames: [
      { name: "Spirit", house: "Spirit" },
      { name: "Mind", house: "Mind" },
      { name: "Emotion", house: "Emotion" },
      { name: "Body", house: "Body" }
    ],
    description: "The four aspects of self"
  },
  fiveHouse: { 
    name: "Five Houses", 
    count: 5, 
    frames: [
      { name: "Gestalt", house: "Gestalt" },
      { name: "Spirit", house: "Spirit" },
      { name: "Mind", house: "Mind" },
      { name: "Emotion", house: "Emotion" },
      { name: "Body", house: "Body" }
    ],
    description: "Your five domains of experience"
  }
};

const RANDOM_SPREADS = {
  single: { name: "Single", count: 1 },
  three: { name: "Three", count: 3 },
  five: { name: "Five", count: 5 }
};

const PERSONAS = {
  seeker: {
    name: "Seeker",
    description: "Warm & accessible",
    instruction: `You are warm and accessible, like a thoughtful friend.

RESPONSE FORMAT — CRITICAL:
Use these exact markers to structure your response. Each marker must be on its own line.

[SUMMARY]
2-3 sentences directly answering their question based on the overall pattern. Reference their specific question.

[CARD:1]
What this card shows — the transient, status, and what's happening here. Use temporal framing (Too Much = future-projected, Too Little = past-anchored). Connect this specifically to their question. 2-3 sentences, warm and clear.

[CARD:2]
(Continue for each card... always connect back to their specific question)

[CORRECTION:1]
For Card 1's imbalance: Name the correction and explain what it means practically — what to actually do. Frame it in terms of their question. 2-3 sentences. Skip this section ENTIRELY if Card 1 is Balanced.

[CORRECTION:2]
For Card 2's imbalance. Skip ENTIRELY if Card 2 is Balanced.

(Continue this pattern — CORRECTION numbers MUST match CARD numbers. If Card 3 is imbalanced, use [CORRECTION:3]. If Card 5 is imbalanced, use [CORRECTION:5]. Never renumber sequentially.)

[LETTER]
A brief, warm letter addressed directly to them (use "you"). Acknowledge what they're navigating with their question. Weave together the key insights from the reading into an empathetic overview. End with encouragement. 3-4 sentences, heartfelt but not saccharine.

CONTENT GUIDELINES:
- ALWAYS connect each section back to their specific question — don't speak generically
- Use TEMPORAL framing: Too Much = "leaning into the future," Too Little = "caught in the past"
- For corrections, explain WHY it helps and WHAT to actually do
- Use simple, everyday language
- Be warm but direct`
  },
  practitioner: {
    name: "Practitioner", 
    description: "Structural & precise",
    instruction: `You speak with precision about the architecture.

RESPONSE FORMAT — CRITICAL:
Use these exact markers to structure your response. Each marker must be on its own line.

[SUMMARY]
2-3 sentences on the structural pattern — what the configuration reveals about their specific question.

[CARD:1]
Precise breakdown: transient, position context, status with temporal orientation. Note house dynamics through behavior (not jargon). Reference how this applies to their question. 2-4 sentences.

[CARD:2]
(Continue for each card... always ground in their question)

[CORRECTION:1]
For Card 1: Name the correction, show the logic briefly (diagonal/vertical/number mirror), explain WHY this correction addresses their situation. Skip ENTIRELY if Balanced.

[CORRECTION:2]
For Card 2. Skip ENTIRELY if Balanced.

(CORRECTION numbers MUST match CARD numbers. If Card 3 needs correction, use [CORRECTION:3]. If Card 5 needs correction, use [CORRECTION:5]. Never number sequentially.)

[LETTER]
A thoughtful note addressed to them. Acknowledge the structural reality they're facing with their question. Synthesize the key architectural insights into practical understanding. End with clear-eyed encouragement. 3-4 sentences, precise but warm.

CONTENT GUIDELINES:
- ALWAYS connect each section to their specific question
- Use TEMPORAL framing precisely
- Show correction logic briefly but clearly
- Reference house dynamics through observable behavior
- Maintain structural precision without coldness`
  },
  philosopher: {
    name: "Philosopher",
    description: "Deep & contemplative",
    instruction: `You speak contemplatively, drawing out meaning.

RESPONSE FORMAT — CRITICAL:
Use these exact markers to structure your response. Each marker must be on its own line.

[SUMMARY]
A contemplative opening that addresses their question through the lens of presence and becoming. 2-3 sentences.

[CARD:1]
Reflective exploration of what this card reveals about their question — weaving temporal orientation poetically ("living in potential futures," "caught in echoes of the past," "not yet arrived in the now"). 3-4 sentences.

[CARD:2]
(Continue for each card... always returning to their question)

[CORRECTION:1]
Frame the correction as an invitation that restores presence in relation to their question. Connect to larger themes of time, awareness, becoming. What does this correction ask of them? Skip ENTIRELY if Balanced.

[CORRECTION:2]
For Card 2. Skip ENTIRELY if Balanced.

(CORRECTION numbers MUST match CARD numbers. [CORRECTION:3] for Card 3, [CORRECTION:5] for Card 5, etc. Never number sequentially — skip numbers for balanced cards.)

[LETTER]
A contemplative letter addressed to them. Honor the depth of what they're asking. Weave the reading's insights into a reflection on their journey. Close with an open question or gentle invitation. 4-5 sentences, soulful.

CONTENT GUIDELINES:
- ALWAYS ground contemplation in their specific question
- Use temporal framing poetically
- Frame corrections as invitations
- Connect to themes of presence and becoming
- Maintain depth without obscurity`
  },
  direct: {
    name: "Direct",
    description: "Brief & actionable",
    instruction: `Brief and clear. Minimum words, maximum clarity.

RESPONSE FORMAT — CRITICAL:
Use these exact markers to structure your response. Each marker must be on its own line.

[SUMMARY]
One sentence answering their question directly.

[CARD:1]
One sentence: what's happening with their question (include temporal frame in parentheses).

[CARD:2]
(Continue for each card...)

[CORRECTION:1]
One sentence: correction → what to do about their situation. Skip ENTIRELY if Balanced.

[CORRECTION:2]
For Card 2. Skip ENTIRELY if Balanced.

(CORRECTION numbers MUST match CARD numbers. Never number sequentially.)

[LETTER]
2-3 sentences max. Acknowledge their question. State the bottom line. One clear encouragement.

CONTENT GUIDELINES:
- ALWAYS tie each point to their specific question
- Include temporal frame in parentheses: (future-leaning), (past-anchored), (shadow)
- Simple words only
- No filler`
  }
};

// Expansion type prompts
const EXPANSION_PROMPTS = {
  unpack: {
    label: "Unpack",
    prompt: "Go deeper on this specific section. Explore the layers, nuances, and implications. What's really happening here beneath the surface? Keep the same warm, clear tone."
  },
  clarify: {
    label: "Clarify",
    prompt: "Make this simpler. Plain English, short sentences, just the core point. Strip away any complexity — what's the essence?"
  },
  architecture: {
    label: "Architecture",
    prompt: "Show the structural derivation. What's the correction math? Why does this particular correction address this particular imbalance? Show the geometry."
  },
  example: {
    label: "Example",
    prompt: "Give a concrete real-world example of how this shows up in daily life. A specific scenario someone might recognize — make it tangible and relatable."
  }
};

// === CORRECTION LOGIC ===
// Diagonal pairs by position (staying within same house)
const DIAGONAL_PAIRS = {
  0: 19, 19: 0,   // Gestalt (sum 19)
  1: 20, 20: 1,   // Gestalt (sum 21)
  2: 17, 17: 2,   // Spirit (sum 19)
  3: 18, 18: 3,   // Spirit (sum 21)
  4: 15, 15: 4,   // Mind (sum 19)
  5: 16, 16: 5,   // Mind (sum 21)
  6: 13, 13: 6,   // Emotion (sum 19)
  7: 14, 14: 7,   // Emotion (sum 21)
  8: 11, 11: 8,   // Body (sum 19)
  9: 12, 12: 9,   // Body (sum 21)
  10: 21, 21: 10  // Portal (sum 31 - Portal pairs with itself)
};

// Vertical pairs (all sum to 20)
const VERTICAL_PAIRS = {
  0: 20, 20: 0,
  1: 19, 19: 1,
  2: 18, 18: 2,
  3: 17, 17: 3,
  4: 16, 16: 4,
  5: 15, 15: 5,
  6: 14, 14: 6,
  7: 13, 13: 7,
  8: 12, 12: 8,
  9: 11, 11: 9,
  10: null, // Portal: Cycles has no vertical partner (20-10=10, self)
  21: null  // Portal: Wholeness has no vertical partner (20-21=-1, invalid)
};

// Reduction pairs (same digit sum)
const REDUCTION_GROUPS = {
  1: [1, 10, 19],
  2: [2, 11, 20],
  3: [3, 12, 21],
  4: [4, 13],
  5: [5, 14],
  6: [6, 15],
  7: [7, 16],
  8: [8, 17],
  9: [9, 18]
};

function getDigitSum(n) {
  let sum = String(n).split('').reduce((a, b) => a + parseInt(b), 0);
  return sum > 9 ? (sum % 9 || 9) : sum;
}

function getArchetypeCorrection(position, status) {
  if (status === 1) return null;
  
  if (status === 2) {
    // Too Much → Diagonal partner
    const target = DIAGONAL_PAIRS[position];
    return target !== undefined ? { type: "diagonal", target } : null;
  }
  
  if (status === 3) {
    // Too Little → Vertical partner
    const target = VERTICAL_PAIRS[position];
    return (target !== null && target !== undefined) ? { type: "vertical", target } : null;
  }
  
  if (status === 4) {
    // Unacknowledged → Reduction pair(s)
    const key = getDigitSum(position);
    const targets = (REDUCTION_GROUPS[key] || []).filter(p => p !== position);
    return targets.length > 0 ? { type: "reduction", targets } : null;
  }
  
  return null;
}

// Get all Bounds and Agents that express/embody a given Archetype
function getAssociatedCards(archetypeId) {
  const bounds = Object.entries(BOUNDS)
    .filter(([_, b]) => b.archetype === archetypeId)
    .map(([id, b]) => ({ id: parseInt(id), ...b, type: 'Bound' }));
  const agents = Object.entries(AGENTS)
    .filter(([_, a]) => a.archetype === archetypeId)
    .map(([id, a]) => ({ id: parseInt(id), ...a, type: 'Agent' }));
  return { bounds, agents };
}

function getBoundCorrection(bound, status) {
  if (status === 1) return null;
  const targetChannel = CHANNEL_CROSSINGS[status]?.[bound.channel];
  const targetNumber = 11 - bound.number;
  if (!targetChannel) return null;
  const targetBound = Object.entries(BOUNDS).find(([id, b]) => b.channel === targetChannel && b.number === targetNumber);
  if (!targetBound) return null;
  return {
    type: status === 2 ? "diagonal" : status === 3 ? "vertical" : "reduction",
    targetId: parseInt(targetBound[0]),
    targetBound: targetBound[1],
    numberMirror: `${bound.number}→${targetNumber}`,
    channelCross: `${bound.channel}→${targetChannel}`
  };
}

function getAgentCorrection(agent, status) {
  return getArchetypeCorrection(agent.archetype, status);
}

function getComponent(id) {
  if (id < 22) return { ...ARCHETYPES[id], type: "Archetype", id };
  if (id < 62) return { ...BOUNDS[id], type: "Bound", id };
  return { ...AGENTS[id], type: "Agent", id };
}

function getFullCorrection(transientId, status) {
  const trans = getComponent(transientId);
  if (trans.type === "Archetype") return getArchetypeCorrection(transientId, status);
  if (trans.type === "Bound") return getBoundCorrection(trans, status);
  if (trans.type === "Agent") return getAgentCorrection(trans, status);
  return null;
}

function getCorrectionText(correction, trans) {
  if (!correction) return null;
  if (trans.type === "Bound" && correction.targetBound) return correction.targetBound.name;
  if (correction.target !== undefined) return ARCHETYPES[correction.target]?.name;
  if (correction.targets) return correction.targets.map(t => ARCHETYPES[t]?.name).join(", ");
  return null;
}

function getCorrectionTargetId(correction, trans) {
  if (!correction) return null;
  if (trans.type === "Bound" && correction.targetId !== undefined) return correction.targetId;
  if (correction.target !== undefined) return correction.target;
  if (correction.targets && correction.targets.length > 0) return correction.targets[0];
  return null;
}

// === UTILITY FUNCTIONS ===
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const rand = new Uint32Array(1);
    crypto.getRandomValues(rand);
    const j = rand[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateSpread(count, isDurable = false) {
  const positionPool = isDurable ? [] : shuffleArray([...Array(22).keys()]);
  const transientPool = shuffleArray([...Array(78).keys()]);
  
  return Array.from({ length: count }, (_, i) => {
    const statusArr = new Uint32Array(1);
    crypto.getRandomValues(statusArr);
    return {
      position: isDurable ? null : positionPool[i],
      transient: transientPool[i],
      status: (statusArr[0] % 4) + 1
    };
  });
}

function encodeDraws(draws, spreadType, spreadKey, persona, question) {
  return btoa(JSON.stringify({ d: draws, t: spreadType, k: spreadKey, p: persona, q: question }));
}

function decodeDraws(encoded) {
  try {
    const data = JSON.parse(atob(encoded));
    return { draws: data.d, spreadType: data.t, spreadKey: data.k, persona: data.p, question: data.q };
  } catch { return null; }
}

function formatDrawForAI(draws, spreadType, spreadKey, showTraditional) {
  const isDurable = spreadType === 'durable';
  const spreadConfig = isDurable ? DURABLE_SPREADS[spreadKey] : RANDOM_SPREADS[spreadKey];
  
  return draws.map((draw, i) => {
    const trans = getComponent(draw.transient);
    const stat = STATUSES[draw.status];
    const correction = getFullCorrection(draw.transient, draw.status);
    const correctionText = getCorrectionText(correction, trans);
    const transArchetype = trans.archetype !== undefined ? ARCHETYPES[trans.archetype] : null;
    
    let context = isDurable ? spreadConfig.frames[i].name : (draw.position !== null ? `${ARCHETYPES[draw.position]?.name} (Position ${draw.position})` : 'Draw');
    
    let transInfo = trans.name;
    if (showTraditional) transInfo += ` (${trans.traditional})`;
    if (trans.type === "Archetype") transInfo += ` — Major Archetype`;
    else if (trans.type === "Bound") transInfo += ` — ${trans.channel} Channel, expresses ${transArchetype?.name}`;
    else if (trans.type === "Agent") transInfo += ` — ${trans.role} of ${trans.channel}, embodies ${transArchetype?.name}`;
    
    const statusPhrase = stat.prefix ? `${stat.prefix} ${trans.name}` : `Balanced ${trans.name}`;
    
    return `**Card ${i + 1} — ${context}**: ${statusPhrase}
Transient: ${transInfo}
Status: ${stat.name} — ${stat.desc}
${correctionText ? `Correction: ${correctionText}` : 'No correction needed (Balanced)'}`;
  }).join('\n\n');
}

// === RESPONSE PARSING ===
function parseReadingResponse(responseText, draws) {
  const sections = {
    summary: null,
    cards: [],
    corrections: [],
    letter: null
  };
  
  // Extract summary
  const summaryMatch = responseText.match(/\[SUMMARY\]\s*([\s\S]*?)(?=\[CARD:|$)/);
  if (summaryMatch) {
    sections.summary = summaryMatch[1].trim();
  }
  
  // Extract card sections
  draws.forEach((_, i) => {
    const cardNum = i + 1;
    const cardRegex = new RegExp(`\\[CARD:${cardNum}\\]\\s*([\\s\\S]*?)(?=\\[CARD:|\\[CORRECTION:|\\[LETTER\\]|$)`);
    const cardMatch = responseText.match(cardRegex);
    if (cardMatch) {
      sections.cards.push({
        index: i,
        content: cardMatch[1].trim()
      });
    }
  });
  
  // Extract correction sections
  draws.forEach((draw, i) => {
    if (draw.status !== 1) { // Only for imbalanced cards
      const corrNum = i + 1;
      const corrRegex = new RegExp(`\\[CORRECTION:${corrNum}\\]\\s*([\\s\\S]*?)(?=\\[CORRECTION:|\\[LETTER\\]|$)`);
      const corrMatch = responseText.match(corrRegex);
      if (corrMatch) {
        sections.corrections.push({
          cardIndex: i,
          content: corrMatch[1].trim()
        });
      }
    }
  });
  
  // Extract letter section
  const letterMatch = responseText.match(/\[LETTER\]\s*([\s\S]*?)$/);
  if (letterMatch) {
    sections.letter = letterMatch[1].trim();
  }
  
  return sections;
}

const BASE_SYSTEM = `You are a structural reader within the Nirmanakaya Consciousness Architecture.

YOUR ROLE: Mirror, not mentor. You reflect what the structure shows. You do not diagnose, prescribe, or claim to see what the user cannot.

CRITICAL: Structure your response using the exact markers specified in the persona instructions. Each marker ([SUMMARY], [CARD:1], [CORRECTION:1], etc.) must be on its own line.

CRITICAL PRINCIPLES:

1. DESCRIPTIVE, NOT DIAGNOSTIC
- Describe observable archetypal behavior, not inferred psychology
- Wrong: "You're so focused on being right that you've become rigid"
- Right: "Order is running high here — often shows up as structure tightening beyond what's needed"

2. TRANSIENT-FIRST FRAMING
- The transient is WHAT is expressing, the position is WHERE
- Wrong: "Your Inspiration is in Too Much Alignment"
- Right: "Too Much Alignment in your Inspiration"

3. PASSIVE-STRUCTURAL TONE
- Wrong: "You need to let go of control"
- Right: "Integration improves when control loosens"
- Wrong: "You're pushing too hard"
- Right: "Pressure is concentrated here"

4. NO SHADOW AUTHORITY
- Wrong: "There's something steering you unconsciously"
- Right: "There's information in this configuration that hasn't been fully integrated yet"

5. CONCRETE CORRECTIONS — THIS IS ESSENTIAL
- ALWAYS explain what each correction means practically
- Don't just name the correction — say what to actually do
- Every imbalanced card needs its correction explained in a [CORRECTION:N] section
- CRITICAL: Correction numbers MUST match card numbers. If Card 3 is imbalanced, use [CORRECTION:3]. If Card 5 is imbalanced, use [CORRECTION:5]. Skip numbers for balanced cards — never renumber sequentially.

6. NO HIERARCHY
- The structure serves the user, not the other way around
- The reading reflects a moment, not a verdict

ARCHETYPAL RULES (NEVER BREAK):
- "7" numbers = HARVEST/GATHERING, never conflict
- Abstraction (15) = pure pattern recognition, NOT temptation
- Change (13) = necessary endings, NOT literal death  
- Breakthrough (16) = clearing false structure, NOT destruction
- Major Archetypes as transients carry amplified significance

STATUS MEANINGS — ALWAYS FRAME TEMPORALLY:
- Balanced: Present-aligned, authentic expression, integrated in the now
- Too Much: Future-projected — anxiety about what's coming, pushing ahead of natural timing
- Too Little: Past-anchored — energy withdrawn, holding onto what was, not fully arriving in the present  
- Unacknowledged: Shadow — operating beneath awareness, steering without conscious integration

WHEN DESCRIBING IMBALANCES, USE TEMPORAL FRAMING:
- Too Much: "leaning into the future," "ahead of the present," "pushing rather than being"
- Too Little: "caught in echoes of the past," "not fully arrived," "withdrawn from the now"
- Unacknowledged: "operating beneath awareness," "steering without being seen"

HOUSE DYNAMICS — SHOW, DON'T NAME:
- Reference house qualities through behavior, not technical terms
- Let them feel the house without jargon`;

// === CLICKABLE TERM COMPONENT ===
// Must be used inside a component that has access to setSelectedInfo
const ClickableTermContext = ({ type, id, children, setSelectedInfo }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    let data = null;
    if (type === 'card') {
      data = getComponent(id);
    } else if (type === 'channel') {
      data = CHANNELS[id];
    } else if (type === 'status') {
      data = STATUS_INFO[id];
    } else if (type === 'house') {
      data = HOUSES[id];
    }
    setSelectedInfo({ type, id, data });
  };
  
  return (
    <span 
      className="cursor-pointer hover:underline decoration-dotted underline-offset-2"
      onClick={handleClick}
    >
      {children}
    </span>
  );
};

// === UNIVERSAL INFO MODAL COMPONENT ===
const InfoModal = ({ info, onClose, setSelectedInfo }) => {
  if (!info) return null;
  
  const { type, id, data } = info;
  
  // Local ClickableTerm that has access to setSelectedInfo
  const ClickableTerm = ({ type: termType, id: termId, children }) => (
    <ClickableTermContext type={termType} id={termId} setSelectedInfo={setSelectedInfo}>
      {children}
    </ClickableTermContext>
  );
  
  // Render based on type
  const renderContent = () => {
    if (type === 'card') {
      const component = data;
      const isArchetype = component.type === "Archetype";
      const isBound = component.type === "Bound";
      const isAgent = component.type === "Agent";
      const associatedArchetype = (isBound || isAgent) ? ARCHETYPES[component.archetype] : null;
      const associations = isArchetype ? getAssociatedCards(id) : null;
      
      return (
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-zinc-100">{component.name}</h3>
              <p className="text-sm text-zinc-500">{component.traditional}</p>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-xl">×</button>
          </div>
          
          <div className="mb-4">
            <span className={`text-xs px-2 py-1 rounded-full ${
              isArchetype ? 'bg-amber-500/20 text-amber-300' :
              isBound ? 'bg-blue-500/20 text-blue-300' :
              'bg-violet-500/20 text-violet-300'
            }`}>
              {component.type}
            </span>
            {isArchetype && (
              <span className="text-xs text-zinc-500 ml-2">
                <ClickableTerm type="house" id={component.house}>{component.house}</ClickableTerm> House • {component.function}
              </span>
            )}
            {isBound && (
              <span className="text-xs text-zinc-500 ml-2">
                <ClickableTerm type="channel" id={component.channel}>{component.channel}</ClickableTerm> • {component.number <= 5 ? 'Inner' : 'Outer'} Bound
              </span>
            )}
            {isAgent && (
              <span className="text-xs text-zinc-500 ml-2">
                {component.role} • <ClickableTerm type="channel" id={component.channel}>{component.channel}</ClickableTerm>
              </span>
            )}
          </div>
          
          <p className="text-sm text-zinc-300 mb-4 leading-relaxed">
            {component.extended || component.description}
          </p>
          
          {associatedArchetype && (
            <div className="border-t border-zinc-700/50 pt-4 mb-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                {isBound ? 'Expresses' : 'Embodies'}
              </p>
              <p className="text-sm text-zinc-300">
                <ClickableTerm type="card" id={component.archetype}>{associatedArchetype.name}</ClickableTerm>
                <span className="text-zinc-500"> — {associatedArchetype.description}</span>
              </p>
            </div>
          )}
          
          {associations && (associations.bounds.length > 0 || associations.agents.length > 0) && (
            <div className="border-t border-zinc-700/50 pt-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Expressed By</p>
              
              {associations.bounds.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-zinc-600 mb-1">Bounds:</p>
                  <div className="flex flex-wrap gap-1">
                    {associations.bounds.map(b => (
                      <ClickableTerm key={b.id} type="card" id={b.id}>
                        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded hover:bg-zinc-700 cursor-pointer">
                          {b.name}
                        </span>
                      </ClickableTerm>
                    ))}
                  </div>
                </div>
              )}
              
              {associations.agents.length > 0 && (
                <div>
                  <p className="text-xs text-zinc-600 mb-1">Agents:</p>
                  <div className="flex flex-wrap gap-1">
                    {associations.agents.map(a => (
                      <ClickableTerm key={a.id} type="card" id={a.id}>
                        <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded hover:bg-zinc-700 cursor-pointer">
                          {a.name}
                        </span>
                      </ClickableTerm>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      );
    }
    
    if (type === 'channel') {
      const channel = CHANNELS[id];
      if (!channel) return null;
      
      return (
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-zinc-100">{channel.name}</h3>
              <p className="text-sm text-zinc-500">{channel.traditional} • {channel.element}</p>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-xl">×</button>
          </div>
          
          <div className="mb-4">
            <span className={`text-xs px-2 py-1 rounded-full bg-opacity-20 ${CHANNEL_COLORS[id]}`}>
              Channel
            </span>
          </div>
          
          <p className="text-sm text-zinc-300 mb-4 leading-relaxed">{channel.extended}</p>
        </>
      );
    }
    
    if (type === 'status') {
      const status = STATUS_INFO[id];
      if (!status) return null;
      
      return (
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-zinc-100">{status.name}</h3>
              <p className="text-sm text-zinc-500">{status.orientation}</p>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-xl">×</button>
          </div>
          
          <div className="mb-4">
            <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[id]}`}>
              Status
            </span>
          </div>
          
          <p className="text-sm text-zinc-300 mb-4 leading-relaxed">{status.extended}</p>
        </>
      );
    }
    
    if (type === 'house') {
      const house = HOUSES[id];
      if (!house) return null;
      const houseColors = HOUSE_COLORS[id];
      
      return (
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-zinc-100">{house.name} House</h3>
              <p className="text-sm text-zinc-500">
                {house.governor !== null ? `Governed by ${ARCHETYPES[house.governor]?.name}` : 'No governor'}
              </p>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-xl">×</button>
          </div>
          
          <div className="mb-4">
            <span className={`text-xs px-2 py-1 rounded-full ${houseColors?.bg} ${houseColors?.text}`}>
              House
            </span>
          </div>
          
          <p className="text-sm text-zinc-300 mb-4 leading-relaxed">{house.extended}</p>
          
          <div className="border-t border-zinc-700/50 pt-4">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Members</p>
            <div className="flex flex-wrap gap-1">
              {house.members.map(m => (
                <ClickableTerm key={m} type="card" id={m}>
                  <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded hover:bg-zinc-700 cursor-pointer">
                    {ARCHETYPES[m]?.name}
                  </span>
                </ClickableTerm>
              ))}
            </div>
          </div>
        </>
      );
    }
    
    return null;
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-zinc-900 rounded-xl border border-zinc-700 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-5">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// === READING SECTION COMPONENT ===
const ReadingSection = ({ 
  type, // 'summary' | 'card' | 'correction' | 'letter'
  index, // card index (for card/correction)
  content, 
  draw, // the draw object (for card/correction context)
  question, // the querent's question
  expansions,
  expanding,
  onExpand,
  showTraditional,
  spreadType,
  spreadKey,
  setSelectedInfo,
  onHeaderClick // callback when header is clicked (for scroll navigation)
}) => {
  const trans = draw ? getComponent(draw.transient) : null;
  const stat = draw ? STATUSES[draw.status] : null;
  const isDurable = spreadType === 'durable';
  const spreadConfig = isDurable ? DURABLE_SPREADS[spreadKey] : null;
  
  // Get position/frame label
  const posLabel = draw ? (isDurable 
    ? spreadConfig?.frames[index]?.name 
    : (draw.position !== null ? ARCHETYPES[draw.position]?.name : `Position ${index + 1}`)) : null;
  
  // Get house for coloring (for card/correction sections)
  const house = draw ? (isDurable 
    ? spreadConfig?.frames[index]?.house 
    : (draw.position !== null ? ARCHETYPES[draw.position]?.house : 'Gestalt')) : null;
  
  const houseColors = house ? HOUSE_COLORS[house] : null;
  
  // Helper to make terms clickable
  const ClickableTerm = ({ type: termType, id: termId, children, className = "" }) => (
    <span 
      className={`cursor-pointer hover:underline decoration-dotted underline-offset-2 ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        let data = null;
        if (termType === 'card') data = getComponent(termId);
        else if (termType === 'channel') data = CHANNELS[termId];
        else if (termType === 'status') data = STATUS_INFO[termId];
        else if (termType === 'house') data = HOUSES[termId];
        setSelectedInfo({ type: termType, id: termId, data });
      }}
    >
      {children}
    </span>
  );
  
  // Build section label with clickable terms
  const renderLabel = () => {
    if (type === 'summary') {
      return <span className="text-amber-300 font-medium">Overview</span>;
    } else if (type === 'card') {
      const statusPrefix = stat?.prefix || 'Balanced';
      return (
        <span className={houseColors?.text || 'text-zinc-300'}>
          <ClickableTerm type="status" id={draw.status} className={STATUS_COLORS[draw.status]?.split(' ')[0]}>
            {statusPrefix}
          </ClickableTerm>
          {' '}
          <ClickableTerm type="card" id={draw.transient}>{trans?.name}</ClickableTerm>
          {' in your '}
          <ClickableTerm type={isDurable ? "house" : "card"} id={isDurable ? house : draw.position}>
            {posLabel}
          </ClickableTerm>
        </span>
      );
    } else if (type === 'correction') {
      return (
        <span className="text-emerald-400">
          Path Forward: <ClickableTerm type="card" id={draw.transient}>{trans?.name}</ClickableTerm>
          {' → '}
          {(() => {
            const correction = getFullCorrection(draw.transient, draw.status);
            const correctionText = getCorrectionText(correction, trans);
            const correctionTargetId = getCorrectionTargetId(correction, trans);
            if (correctionTargetId !== null) {
              return <ClickableTerm type="card" id={correctionTargetId}>{correctionText}</ClickableTerm>;
            }
            return correctionText;
          })()}
        </span>
      );
    } else if (type === 'letter') {
      return <span className="text-zinc-400 italic">A Note for You</span>;
    }
    return null;
  };
  
  const sectionKey = type === 'summary' ? 'summary' : type === 'letter' ? 'letter' : `${type}:${index}`;
  const sectionExpansions = expansions[sectionKey] || {};
  const isExpanding = expanding?.section === sectionKey;
  
  // Determine section styling based on type
  const getSectionStyle = () => {
    if (type === 'summary') {
      return 'bg-gradient-to-br from-amber-950/40 to-amber-900/20 border-amber-500/50';
    } else if (type === 'letter') {
      return 'bg-zinc-900/80 border-zinc-700/50';
    } else if (houseColors) {
      return `${houseColors.bg} ${houseColors.border}`;
    }
    return 'bg-zinc-900/50 border-zinc-800/50';
  };
  
  const getBadgeStyle = () => {
    if (type === 'summary') return 'bg-amber-500/30 text-amber-300';
    if (type === 'letter') return 'bg-zinc-700 text-zinc-300';
    if (type === 'correction') return 'bg-emerald-900/50 text-emerald-400';
    if (houseColors) return `${houseColors.bg} ${houseColors.text}`;
    return 'bg-zinc-800 text-zinc-400';
  };
  
  const getContentStyle = () => {
    if (type === 'letter') return 'text-zinc-300/90 italic';
    if (type === 'summary') return 'text-amber-100/90';
    return 'text-zinc-300';
  };
  
  const getButtonStyle = (hasExpansion, isThisExpanding, isExpandingOther) => {
    return `text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
      hasExpansion 
        ? 'bg-zinc-700 text-zinc-200 border border-zinc-600' 
        : 'bg-zinc-800/50 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
    } ${isExpandingOther ? 'opacity-50 cursor-not-allowed' : ''}`;
  };
  
  return (
    <div className={`rounded-xl border-2 p-4 mb-4 ${getSectionStyle()}`}>
      {/* Section Header */}
      <div 
        className={`flex flex-col gap-1 mb-3 ${type === 'card' && onHeaderClick ? 'cursor-pointer group' : ''}`}
        onClick={type === 'card' && onHeaderClick ? onHeaderClick : undefined}
      >
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${getBadgeStyle()}`}>
            {type === 'summary' ? 'Overview' : type === 'card' ? 'Reading' : type === 'correction' ? 'Action' : 'Letter'}
          </span>
          <span className="text-sm font-medium">{renderLabel()}</span>
          {type === 'card' && onHeaderClick && (
            <span className="text-zinc-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">↑ view card</span>
          )}
        </div>
        {type === 'card' && showTraditional && trans?.traditional && (
          <span className="text-xs text-zinc-500 ml-1">{trans.traditional}</span>
        )}
      </div>
      
      {/* Main Content */}
      <div className={`leading-relaxed text-sm mb-4 whitespace-pre-wrap ${getContentStyle()}`}>
        {content}
      </div>
      
      {/* Expansion Buttons */}
      <div className="flex gap-2 flex-wrap">
        {Object.entries(EXPANSION_PROMPTS).map(([key, { label }]) => {
          const isThisExpanding = isExpanding && expanding?.type === key;
          const hasExpansion = !!sectionExpansions[key];
          const isExpandingOther = isExpanding && !isThisExpanding;
          
          return (
            <button
              key={key}
              onClick={() => onExpand(sectionKey, key)}
              disabled={isExpanding}
              className={getButtonStyle(hasExpansion, isThisExpanding, isExpandingOther)}
            >
              {isThisExpanding && (
                <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></span>
              )}
              {label}
            </button>
          );
        })}
      </div>
      
      {/* Expansion Content */}
      {Object.entries(sectionExpansions).map(([expType, expContent]) => (
        <div key={expType} className="mt-4 pt-4 border-t border-zinc-700/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase tracking-wider text-zinc-500">
              {EXPANSION_PROMPTS[expType]?.label}
            </span>
            <button 
              onClick={() => onExpand(sectionKey, expType, true)}
              className="text-xs text-zinc-600 hover:text-zinc-400"
            >
              ×
            </button>
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-400">
            {expContent}
          </div>
        </div>
      ))}
    </div>
  );
};

// === INTRO COMPONENT ===
const IntroSection = () => (
  <div className="mb-8 text-center">
    <div className="max-w-2xl mx-auto">
      <p className="text-zinc-400 text-sm leading-relaxed mb-6">
        The Nirmanakaya Reader reflects your present moment through the architecture of consciousness. 
        Ask any question — about decisions, relationships, work, direction, or what's alive for you right now — 
        and receive a reading that illuminates where you are, what's moving, and what might need attention.
      </p>
      
      <div className="bg-zinc-900/50 rounded-xl p-5 mb-6 border border-zinc-800/50">
        <p className="text-zinc-500 text-xs uppercase tracking-wider mb-3">Example Questions</p>
        <div className="space-y-2 text-sm text-zinc-400">
          <p>"What do I need to see about this relationship?"</p>
          <p>"Where am I stuck in my work right now?"</p>
          <p>"What's asking for my attention today?"</p>
          <p>"Am I on the right path with this decision?"</p>
        </div>
      </div>
      
      <p className="text-zinc-600 text-xs">
        Every reading captures a snapshot of your moment in relation to your question. 
        The structure doesn't predict — it reveals what's already present.
      </p>
    </div>
  </div>
);

// === MAIN COMPONENT ===
export default function NirmanakaReader() {
  const [question, setQuestion] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [spreadType, setSpreadType] = useState('random');
  const [spreadKey, setSpreadKey] = useState('single');
  const [persona, setPersona] = useState('seeker');
  const [draws, setDraws] = useState(null);
  const [parsedReading, setParsedReading] = useState(null);
  const [expansions, setExpansions] = useState({}); // {sectionKey: {unpack: '...', clarify: '...'}}
  const [expanding, setExpanding] = useState(null); // {section: 'card:1', type: 'unpack'}
  const [followUpMessages, setFollowUpMessages] = useState([]); // For general follow-ups after the reading
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTraditional, setShowTraditional] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isSharedReading, setIsSharedReading] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(null); // {type: 'card'|'channel'|'status'|'house', id: ..., data: ...}
  const messagesEndRef = useRef(null);
  const hasAutoInterpreted = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('r');
    if (encoded && !hasAutoInterpreted.current) {
      const decoded = decodeDraws(encoded);
      if (decoded) {
        setDraws(decoded.draws);
        setSpreadType(decoded.spreadType);
        setSpreadKey(decoded.spreadKey);
        setPersona(decoded.persona);
        if (decoded.question) {
          setQuestion(decoded.question);
          setIsSharedReading(true);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isSharedReading && draws && question && !hasAutoInterpreted.current) {
      hasAutoInterpreted.current = true;
      performReadingWithDraws(draws);
    }
  }, [isSharedReading, draws, question]);

  // Only scroll on new follow-up messages, NOT on initial reading load
  const prevFollowUpCount = useRef(0);
  useEffect(() => {
    if (followUpMessages.length > prevFollowUpCount.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevFollowUpCount.current = followUpMessages.length;
  }, [followUpMessages]);

  useEffect(() => {
    if (draws && question) {
      const encoded = encodeDraws(draws, spreadType, spreadKey, persona, question);
      setShareUrl(`${window.location.origin}${window.location.pathname}?r=${encoded}`);
    }
  }, [draws, spreadType, spreadKey, persona, question]);

  const copyShareUrl = async () => {
    try { await navigator.clipboard.writeText(shareUrl); alert('Link copied!'); }
    catch { prompt('Copy this link:', shareUrl); }
  };

  const performReadingWithDraws = async (drawsToUse, questionToUse = question) => {
    setLoading(true); setError(''); setParsedReading(null); setExpansions({}); setFollowUpMessages([]);
    const drawText = formatDrawForAI(drawsToUse, spreadType, spreadKey, showTraditional);
    const personaConfig = PERSONAS[persona];
    const spreadName = spreadType === 'durable' ? DURABLE_SPREADS[spreadKey].name : `${RANDOM_SPREADS[spreadKey].name} Random`;
    
    const systemPrompt = `${BASE_SYSTEM}\n\n${personaConfig.instruction}`;
    const userMessage = `QUESTION: "${questionToUse}"\n\nTHE DRAW (${spreadName}):\n\n${drawText}\n\nRespond using the exact section markers: [SUMMARY], [CARD:1], [CARD:2], etc., [CORRECTION:N] for each imbalanced card (where N matches the card number — use [CORRECTION:3] for Card 3, [CORRECTION:5] for Card 5, etc.), [LETTER]. Each marker on its own line.`;

    try {
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: userMessage }], system: systemPrompt })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      // Parse the structured response
      const parsed = parseReadingResponse(data.reading, drawsToUse);
      setParsedReading(parsed);
    } catch (e) { setError(`Error: ${e.message}`); }
    setLoading(false);
  };

  const performReading = async () => {
    const actualQuestion = question.trim() || 'General reading';
    setQuestion(actualQuestion);
    const isDurable = spreadType === 'durable';
    const count = isDurable ? DURABLE_SPREADS[spreadKey].count : RANDOM_SPREADS[spreadKey].count;
    const newDraws = generateSpread(count, isDurable);
    setDraws(newDraws);
    await performReadingWithDraws(newDraws, actualQuestion);
  };

  const handleExpand = async (sectionKey, expansionType, remove = false) => {
    // If removing, just clear that expansion
    if (remove) {
      setExpansions(prev => {
        const newExp = { ...prev };
        if (newExp[sectionKey]) {
          const { [expansionType]: _, ...rest } = newExp[sectionKey];
          newExp[sectionKey] = rest;
          if (Object.keys(rest).length === 0) delete newExp[sectionKey];
        }
        return newExp;
      });
      return;
    }
    
    // If already has this expansion, toggle it off
    if (expansions[sectionKey]?.[expansionType]) {
      handleExpand(sectionKey, expansionType, true);
      return;
    }
    
    // Otherwise, fetch the expansion
    setExpanding({ section: sectionKey, type: expansionType });
    
    // Build context for the expansion request
    const drawText = formatDrawForAI(draws, spreadType, spreadKey, showTraditional);
    let sectionContent = '';
    let sectionContext = '';
    
    if (sectionKey === 'summary') {
      sectionContent = parsedReading.summary;
      sectionContext = 'the summary of the reading';
    } else if (sectionKey === 'letter') {
      sectionContent = parsedReading.letter;
      sectionContext = 'the closing letter';
    } else if (sectionKey.startsWith('card:')) {
      const cardIndex = parseInt(sectionKey.split(':')[1]);
      const cardSection = parsedReading.cards.find(c => c.index === cardIndex);
      const draw = draws[cardIndex];
      const trans = getComponent(draw.transient);
      sectionContent = cardSection?.content || '';
      sectionContext = `the reading for ${trans.name} (Card ${cardIndex + 1})`;
    } else if (sectionKey.startsWith('correction:')) {
      const cardIndex = parseInt(sectionKey.split(':')[1]);
      const corrSection = parsedReading.corrections.find(c => c.cardIndex === cardIndex);
      const draw = draws[cardIndex];
      const trans = getComponent(draw.transient);
      sectionContent = corrSection?.content || '';
      sectionContext = `the correction path for ${trans.name} (Card ${cardIndex + 1})`;
    }
    
    const expansionPrompt = EXPANSION_PROMPTS[expansionType].prompt;
    const personaConfig = PERSONAS[persona];
    
    const systemPrompt = `${BASE_SYSTEM}\n\nYou are expanding on a specific section of a reading. Keep the same tone as the original reading. Be concise but thorough. Always connect your expansion back to the querent's specific question.`;
    const userMessage = `QUERENT'S QUESTION: "${question}"

THE DRAW:
${drawText}

SECTION BEING EXPANDED (${sectionContext}):
${sectionContent}

EXPANSION REQUEST:
${expansionPrompt}

Respond directly with the expanded content. No section markers needed. Keep it focused on this specific section AND relevant to their question: "${question}"`;

    try {
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: userMessage }], system: systemPrompt })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      setExpansions(prev => ({
        ...prev,
        [sectionKey]: {
          ...(prev[sectionKey] || {}),
          [expansionType]: data.reading
        }
      }));
    } catch (e) { 
      setError(`Expansion error: ${e.message}`); 
    }
    setExpanding(null);
  };

  const sendFollowUp = async () => {
    if (!followUp.trim() || !draws) return;
    setLoading(true); setError('');
    const drawText = formatDrawForAI(draws, spreadType, spreadKey, showTraditional);
    const personaConfig = PERSONAS[persona];
    
    // Build context from parsed reading
    let readingContext = '';
    if (parsedReading) {
      readingContext = `PREVIOUS READING:\n\nSummary: ${parsedReading.summary}\n\n`;
      parsedReading.cards.forEach((card, i) => {
        readingContext += `Card ${card.index + 1}: ${card.content}\n\n`;
      });
      parsedReading.corrections.forEach(corr => {
        readingContext += `Correction ${corr.cardIndex + 1}: ${corr.content}\n\n`;
      });
    }
    
    const systemPrompt = `${BASE_SYSTEM}\n\nYou are continuing a conversation about a reading. Answer their follow-up question directly, referencing the reading context as needed. No section markers — just respond naturally.`;
    
    const messages = [
      ...followUpMessages,
      { role: 'user', content: followUp }
    ];
    
    const contextMessage = `THE DRAW:\n${drawText}\n\n${readingContext}\n\nFOLLOW-UP QUESTION: ${followUp}`;
    
    try {
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: contextMessage }], 
          system: systemPrompt 
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setFollowUpMessages([...messages, { role: 'assistant', content: data.reading }]);
      setFollowUp('');
    } catch (e) { setError(`Error: ${e.message}`); }
    setLoading(false);
  };

  const resetReading = () => {
    setDraws(null); setParsedReading(null); setExpansions({}); setFollowUpMessages([]);
    setQuestion(''); setFollowUp(''); setError('');
    setShareUrl(''); setIsSharedReading(false); setShowArchitecture(false);
    hasAutoInterpreted.current = false;
    window.history.replaceState({}, '', window.location.pathname);
  };

  const getCardHouse = (draw, index) => {
    if (spreadType === 'durable') {
      return DURABLE_SPREADS[spreadKey].frames[index].house;
    } else if (draw.position !== null) {
      return ARCHETYPES[draw.position]?.house || 'Gestalt';
    }
    return 'Gestalt';
  };

  // === CARD DISPLAY (simplified, visual only) ===
  const CardDisplay = ({ draw, index }) => {
    const isDurable = spreadType === 'durable';
    const spreadConfig = isDurable ? DURABLE_SPREADS[spreadKey] : RANDOM_SPREADS[spreadKey];
    const trans = getComponent(draw.transient);
    const stat = STATUSES[draw.status];
    const transArchetype = trans.archetype !== undefined ? ARCHETYPES[trans.archetype] : null;
    const isMajor = trans.type === "Archetype";
    const correction = getFullCorrection(draw.transient, draw.status);
    const correctionText = getCorrectionText(correction, trans);
    const correctionTargetId = getCorrectionTargetId(correction, trans);
    
    const house = getCardHouse(draw, index);
    const houseColors = HOUSE_COLORS[house];
    
    const contextLabel = isDurable ? spreadConfig.frames[index].name : (draw.position !== null ? ARCHETYPES[draw.position]?.name : 'Draw');
    const contextSub = isDurable ? null : (draw.position !== null ? `Position ${draw.position}` : null);
    
    // Helper to open card info
    const openCardInfo = (cardId) => {
      setSelectedInfo({ type: 'card', id: cardId, data: getComponent(cardId) });
    };
    
    // Helper to open status info
    const openStatusInfo = (statusId) => {
      setSelectedInfo({ type: 'status', id: statusId, data: STATUS_INFO[statusId] });
    };
    
    // Helper to open channel info
    const openChannelInfo = (channelName) => {
      setSelectedInfo({ type: 'channel', id: channelName, data: CHANNELS[channelName] });
    };
    
    // Helper to open house info
    const openHouseInfo = (houseName) => {
      setSelectedInfo({ type: 'house', id: houseName, data: HOUSES[houseName] });
    };
    
    // Scroll to content section
    const scrollToContent = () => {
      document.getElementById(`content-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
      <div 
        id={`card-${index}`}
        className={`rounded-xl border-2 p-4 ${houseColors.border} ${houseColors.bg} transition-all cursor-pointer hover:border-opacity-80 group`}
        onClick={scrollToContent}
      >
        <div className="mb-3 flex justify-between items-start">
          <span 
            className={`text-xs px-2 py-1 rounded-full cursor-pointer hover:opacity-80 ${STATUS_COLORS[draw.status]}`}
            onClick={(e) => { e.stopPropagation(); openStatusInfo(draw.status); }}
          >
            {stat.name}
          </span>
          <span className="text-zinc-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">↓ read</span>
        </div>

        <div className="mb-3">
          <div 
            className="text-xl text-zinc-100 font-semibold cursor-pointer hover:text-zinc-300 transition-colors"
            onClick={(e) => { e.stopPropagation(); openCardInfo(draw.transient); }}
            title="Click for details"
          >
            {trans.name}
            <span className="text-zinc-600 text-sm ml-1">ⓘ</span>
          </div>
          {isMajor && (
            <div className="mt-1">
              <span className="text-xs bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full">MAJOR ARCHETYPE</span>
            </div>
          )}
          {showTraditional && <div className="text-sm text-zinc-500 mt-1">{trans.traditional}</div>}
        </div>

        <div className="text-sm text-zinc-400 mb-3">
          in your <span 
            className={`font-medium cursor-pointer hover:underline decoration-dotted ${houseColors.text}`}
            onClick={(e) => { e.stopPropagation(); isDurable ? openHouseInfo(house) : openCardInfo(draw.position); }}
          >{contextLabel}</span>
          {contextSub && <span className="text-zinc-600 text-xs ml-1">({contextSub})</span>}
        </div>

        <div className="border-t border-zinc-700/30 pt-3 space-y-1">
          {trans.type === "Bound" && (
            <>
              <div className="text-sm">
                <span 
                  className={`cursor-pointer hover:underline decoration-dotted ${CHANNEL_COLORS[trans.channel]}`}
                  onClick={(e) => { e.stopPropagation(); openChannelInfo(trans.channel); }}
                >{trans.channel}</span>
                <span className="text-zinc-500"> Channel</span>
              </div>
              <div className="text-sm text-zinc-400">
                Expresses <span 
                  className="text-zinc-300 cursor-pointer hover:text-zinc-100 transition-colors"
                  onClick={(e) => { e.stopPropagation(); openCardInfo(trans.archetype); }}
                >{transArchetype?.name}</span>
              </div>
            </>
          )}
          {trans.type === "Agent" && (
            <>
              <div className="text-sm">
                <span className="text-zinc-300">{trans.role}</span>
                <span className="text-zinc-500"> of </span>
                <span 
                  className={`cursor-pointer hover:underline decoration-dotted ${CHANNEL_COLORS[trans.channel]}`}
                  onClick={(e) => { e.stopPropagation(); openChannelInfo(trans.channel); }}
                >{trans.channel}</span>
              </div>
              <div className="text-sm text-zinc-400">
                Embodies <span 
                  className="text-zinc-300 cursor-pointer hover:text-zinc-100 transition-colors"
                  onClick={(e) => { e.stopPropagation(); openCardInfo(trans.archetype); }}
                >{transArchetype?.name}</span>
              </div>
            </>
          )}
        </div>

        {correctionText && draw.status !== 1 && (
          <div className="border-t border-zinc-700/30 pt-3 mt-3">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Correction</div>
            <div className="text-sm text-zinc-300">
              → <span 
                className={correctionTargetId !== null ? "cursor-pointer hover:text-zinc-100 transition-colors" : ""}
                onClick={(e) => { e.stopPropagation(); correctionTargetId !== null && openCardInfo(correctionTargetId); }}
              >{correctionText}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extralight tracking-[0.3em] mb-1">NIRMANAKAYA</h1>
          <p className="text-zinc-600 text-xs tracking-wide">Consciousness Architecture Reader</p>
          <p className="text-zinc-700 text-[10px] mt-1">v0.11 alpha • experimental</p>
        </div>

        {!draws && <IntroSection />}

        {/* Controls */}
        {!draws && (
          <>
            <div className="flex justify-center mb-4">
              <div className="inline-flex rounded-lg bg-zinc-900 p-1">
                <button onClick={() => { setSpreadType('random'); setSpreadKey('single'); }}
                  className={`px-4 py-2 rounded-md text-sm transition-all ${spreadType === 'random' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  Random Positions
                </button>
                <button onClick={() => { setSpreadType('durable'); setSpreadKey('threeCard'); }}
                  className={`px-4 py-2 rounded-md text-sm transition-all ${spreadType === 'durable' ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  Durable Spreads
                </button>
              </div>
            </div>

            <div className="flex gap-2 mb-4 justify-center flex-wrap">
              {spreadType === 'random' ? (
                Object.entries(RANDOM_SPREADS).map(([key, value]) => (
                  <button key={key} onClick={() => setSpreadKey(key)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${spreadKey === key ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800'}`}>
                    {value.name} ({value.count})
                  </button>
                ))
              ) : (
                Object.entries(DURABLE_SPREADS).map(([key, value]) => (
                  <button key={key} onClick={() => setSpreadKey(key)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${spreadKey === key ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800'}`}>
                    {value.name}
                  </button>
                ))
              )}
            </div>

            {spreadType === 'durable' && DURABLE_SPREADS[spreadKey] && (
              <p className="text-center text-zinc-600 text-xs mb-4">{DURABLE_SPREADS[spreadKey].description}</p>
            )}

            <div className="flex gap-2 mb-4 justify-center flex-wrap">
              {Object.entries(PERSONAS).map(([key, value]) => (
                <button key={key} onClick={() => setPersona(key)} title={value.description}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${persona === key ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800'}`}>
                  {value.name}
                </button>
              ))}
            </div>

            <div className="flex justify-center mb-6">
              <button onClick={() => setShowTraditional(!showTraditional)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${showTraditional ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-900/50 text-zinc-600 hover:text-zinc-400'}`}>
                {showTraditional ? '✓ Traditional Names' : 'Show Traditional Names'}
              </button>
            </div>

            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What's your question? (or leave blank for a general reading)"
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 resize-none transition-colors mb-4" rows={3} />

            <button onClick={performReading} disabled={loading}
              className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-700 py-4 rounded-xl transition-all duration-300 font-light tracking-wider">
              DRAW
            </button>
          </>
        )}

        {/* Loading */}
        {loading && !expanding && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-zinc-800 rounded-full"></div>
              <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-zinc-400 rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-zinc-500 text-sm animate-pulse">Analyzing your reflection of this moment...</p>
          </div>
        )}

        {/* Error */}
        {error && <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 my-4 text-red-400 text-sm">{error}</div>}

        {/* Cards Display */}
        {draws && !loading && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                {spreadType === 'durable' ? DURABLE_SPREADS[spreadKey]?.name : `${RANDOM_SPREADS[spreadKey]?.name} Random`} • {PERSONAS[persona].name}
              </span>
              <div className="flex gap-2">
                <button onClick={copyShareUrl} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1 rounded bg-zinc-800/50">Share</button>
                <button onClick={() => setShowTraditional(!showTraditional)} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1 rounded bg-zinc-800/50">{showTraditional ? 'Hide Trad.' : 'Trad.'}</button>
                <button onClick={() => setShowArchitecture(!showArchitecture)} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1 rounded bg-zinc-800/50">{showArchitecture ? 'Hide Arch.' : 'Arch.'}</button>
                <button onClick={resetReading} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1 rounded bg-zinc-800/50">New</button>
              </div>
            </div>
            
            <div className={`grid gap-4 ${
              draws.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 
              draws.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 
              draws.length === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
              'grid-cols-1 sm:grid-cols-3 lg:grid-cols-5'
            }`}>
              {draws.map((draw, i) => <CardDisplay key={i} draw={draw} index={i} />)}
            </div>

            {/* Architecture Panel */}
            {showArchitecture && (
              <div className="mt-6 bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-4">
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-4">Architecture Details</div>
                
                <div className="space-y-4 mb-6">
                  {draws.map((draw, i) => {
                    const isDurable = spreadType === 'durable';
                    const spreadConfig = isDurable ? DURABLE_SPREADS[spreadKey] : RANDOM_SPREADS[spreadKey];
                    const trans = getComponent(draw.transient);
                    const stat = STATUSES[draw.status];
                    const pos = draw.position !== null ? ARCHETYPES[draw.position] : null;
                    const transArchetype = trans.archetype !== undefined ? ARCHETYPES[trans.archetype] : null;
                    const correction = getFullCorrection(draw.transient, draw.status);
                    const label = isDurable ? spreadConfig.frames[i].name : (pos?.name || 'Draw');
                    
                    return (
                      <div key={i} className="bg-zinc-800/30 rounded-lg p-3 text-sm">
                        <div className="text-zinc-300 font-medium mb-2">{label}</div>
                        
                        {pos && (
                          <div className="text-zinc-500 mb-2">
                            <span className="text-zinc-400">Position {draw.position}:</span> {pos.name} ({pos.traditional})
                            <br />
                            <span className="text-zinc-600">House: {pos.house} | Function: {pos.function}</span>
                          </div>
                        )}
                        
                        <div className="text-zinc-500 mb-2">
                          <span className="text-zinc-400">Transient:</span> {trans.name} ({trans.traditional})
                          {trans.type === "Bound" && (
                            <>
                              <br />
                              <span className="text-zinc-600">
                                {trans.channel} Channel | Number {trans.number} ({trans.number <= 5 ? 'Inner' : 'Outer'} Bound)
                                <br />
                                Associated Archetype: {transArchetype?.name} (Position {trans.archetype})
                              </span>
                            </>
                          )}
                          {trans.type === "Agent" && (
                            <>
                              <br />
                              <span className="text-zinc-600">
                                {trans.role} of {trans.channel}
                                <br />
                                Embodies: {transArchetype?.name} (Position {trans.archetype})
                              </span>
                            </>
                          )}
                          {trans.type === "Archetype" && (
                            <>
                              <br />
                              <span className="text-amber-400/70">Major Archetype as Transient — amplified significance</span>
                            </>
                          )}
                        </div>
                        
                        <div className="text-zinc-500">
                          <span className="text-zinc-400">Status:</span> {stat.name} ({stat.orientation})
                          {correction && draw.status !== 1 && (
                            <div className="mt-1 pl-3 border-l-2 border-zinc-700 text-zinc-600">
                              {trans.type === "Archetype" && (
                                <>
                                  {draw.status === 2 && <div>Diagonal correction: {draw.transient} ↔ {DIAGONAL_PAIRS[draw.transient]} (sum {draw.transient + DIAGONAL_PAIRS[draw.transient]}) → {ARCHETYPES[DIAGONAL_PAIRS[draw.transient]]?.name}</div>}
                                  {draw.status === 3 && <div>Vertical correction: {draw.transient} ↔ {VERTICAL_PAIRS[draw.transient]} (sum 20) → {ARCHETYPES[VERTICAL_PAIRS[draw.transient]]?.name}</div>}
                                  {draw.status === 4 && correction.targets && (
                                    <div>Reduction pair (digit sum {getDigitSum(draw.transient)}): {correction.targets.map(t => `${ARCHETYPES[t]?.name} (${t})`).join(', ')}</div>
                                  )}
                                </>
                              )}
                              {trans.type === "Bound" && correction.targetBound && (
                                <>
                                  <div>Number mirror: {correction.numberMirror} (11 - {trans.number} = {11 - trans.number})</div>
                                  <div>Channel cross ({stat.name}): {correction.channelCross}</div>
                                  <div>Target: {correction.targetBound.name} ({correction.targetBound.traditional})</div>
                                </>
                              )}
                              {trans.type === "Agent" && correction.target !== undefined && (
                                <>
                                  <div>Agent corrects through embodied Archetype ({transArchetype?.name}, position {trans.archetype})</div>
                                  {draw.status === 2 && <div>Diagonal: {trans.archetype} ↔ {DIAGONAL_PAIRS[trans.archetype]} → {ARCHETYPES[correction.target]?.name}</div>}
                                  {draw.status === 3 && <div>Vertical: {trans.archetype} ↔ {VERTICAL_PAIRS[trans.archetype]} → {ARCHETYPES[correction.target]?.name}</div>}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {draws.length > 1 && (
                  <div className="border-t border-zinc-800/50 pt-4">
                    <div className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Relationships</div>
                    <div className="text-sm text-zinc-600 space-y-1">
                      {(() => {
                        const relationships = [];
                        const isDurable = spreadType === 'durable';
                        const spreadConfig = isDurable ? DURABLE_SPREADS[spreadKey] : null;
                        
                        const houseGroups = {};
                        draws.forEach((draw, i) => {
                          const house = isDurable ? spreadConfig.frames[i].house : (draw.position !== null ? ARCHETYPES[draw.position]?.house : null);
                          if (house) {
                            if (!houseGroups[house]) houseGroups[house] = [];
                            const label = isDurable ? spreadConfig.frames[i].name : ARCHETYPES[draw.position]?.name;
                            houseGroups[house].push(label);
                          }
                        });
                        Object.entries(houseGroups).forEach(([house, cards]) => {
                          if (cards.length > 1) {
                            relationships.push(`${house} House: ${cards.join(' & ')} share domain`);
                          }
                        });
                        
                        const channelGroups = {};
                        draws.forEach((draw, i) => {
                          const trans = getComponent(draw.transient);
                          if (trans.channel) {
                            if (!channelGroups[trans.channel]) channelGroups[trans.channel] = [];
                            const label = isDurable ? spreadConfig?.frames[i].name : (draw.position !== null ? ARCHETYPES[draw.position]?.name : `Card ${i+1}`);
                            channelGroups[trans.channel].push({ label, trans: trans.name });
                          }
                        });
                        Object.entries(channelGroups).forEach(([channel, items]) => {
                          if (items.length > 1) {
                            relationships.push(`${channel} Channel: ${items.map(it => it.trans).join(' & ')} resonate`);
                          }
                        });
                        
                        draws.forEach((draw, i) => {
                          const correction = getFullCorrection(draw.transient, draw.status);
                          if (correction) {
                            const corrTarget = correction.target !== undefined ? correction.target : 
                                             correction.targetBound?.archetype;
                            if (corrTarget !== undefined) {
                              draws.forEach((otherDraw, j) => {
                                if (i !== j) {
                                  const otherTrans = getComponent(otherDraw.transient);
                                  if (otherDraw.transient === corrTarget || otherTrans.archetype === corrTarget) {
                                    const label1 = isDurable ? spreadConfig?.frames[i].name : ARCHETYPES[draw.position]?.name;
                                    const label2 = isDurable ? spreadConfig?.frames[j].name : ARCHETYPES[otherDraw.position]?.name;
                                    relationships.push(`${label1} correction points toward ${label2}`);
                                  }
                                }
                              });
                            }
                          }
                        });
                        
                        return relationships.length > 0 ? 
                          relationships.map((r, i) => <div key={i}>• {r}</div>) : 
                          <div className="text-zinc-700">No direct structural relationships detected</div>;
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Parsed Reading Sections */}
        {parsedReading && !loading && (
          <div className="space-y-2">
            {/* Your Question */}
            <div className="bg-zinc-800/50 rounded-xl p-4 mb-4 ml-8">
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Your Question</div>
              <div className="text-zinc-300 text-sm">{question}</div>
            </div>
            
            {/* Summary Section */}
            {parsedReading.summary && (
              <ReadingSection
                type="summary"
                content={parsedReading.summary}
                question={question}
                expansions={expansions}
                expanding={expanding}
                onExpand={handleExpand}
                showTraditional={showTraditional}
                spreadType={spreadType}
                spreadKey={spreadKey}
                setSelectedInfo={setSelectedInfo}
              />
            )}
            
            {/* Card Sections with their Corrections */}
            {parsedReading.cards.map((card) => {
              const correction = parsedReading.corrections.find(c => c.cardIndex === card.index);
              return (
                <div key={`card-group-${card.index}`} id={`content-${card.index}`}>
                  <ReadingSection
                    type="card"
                    index={card.index}
                    content={card.content}
                    draw={draws[card.index]}
                    question={question}
                    expansions={expansions}
                    expanding={expanding}
                    onExpand={handleExpand}
                    showTraditional={showTraditional}
                    spreadType={spreadType}
                    spreadKey={spreadKey}
                    setSelectedInfo={setSelectedInfo}
                    onHeaderClick={() => document.getElementById(`card-${card.index}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  />
                  {correction && (
                    <ReadingSection
                      type="correction"
                      index={correction.cardIndex}
                      content={correction.content}
                      draw={draws[correction.cardIndex]}
                      question={question}
                      expansions={expansions}
                      expanding={expanding}
                      onExpand={handleExpand}
                      showTraditional={showTraditional}
                      spreadType={spreadType}
                      spreadKey={spreadKey}
                      setSelectedInfo={setSelectedInfo}
                    />
                  )}
                </div>
              );
            })}
            
            {/* Letter Section */}
            {parsedReading.letter && (
              <ReadingSection
                type="letter"
                content={parsedReading.letter}
                question={question}
                expansions={expansions}
                expanding={expanding}
                onExpand={handleExpand}
                showTraditional={showTraditional}
                spreadType={spreadType}
                spreadKey={spreadKey}
                setSelectedInfo={setSelectedInfo}
              />
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Follow-up Messages */}
        {followUpMessages.length > 0 && (
          <div className="space-y-4 mt-6">
            {followUpMessages.map((msg, i) => (
              <div key={i} className={`rounded-xl p-4 ${msg.role === 'user' ? 'bg-zinc-800/50 ml-8' : 'bg-zinc-900/50 border border-zinc-800/50'}`}>
                {msg.role === 'user' && <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Follow-up</div>}
                <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-sm">{msg.content}</div>
              </div>
            ))}
          </div>
        )}

        {/* Follow-up Input */}
        {parsedReading && !loading && (
          <div className="flex gap-2 mt-4">
            <input type="text" value={followUp} onChange={(e) => setFollowUp(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && sendFollowUp()}
              placeholder="Ask a follow-up question..."
              className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors text-sm" />
            <button onClick={sendFollowUp} disabled={loading || !followUp.trim()}
              className="bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-700 px-6 rounded-xl transition-all">→</button>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-zinc-800 text-[10px] mt-8 tracking-wider">The structure is the authority. Encounter precedes understanding.</p>
      </div>
      
      {/* Info Modal */}
      <InfoModal info={selectedInfo} onClose={() => setSelectedInfo(null)} setSelectedInfo={setSelectedInfo} />
    </div>
  );
}
