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
    description: "Past → Present → Future"
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

FORMAT — THIS IS CRITICAL:
- Put a BLANK LINE between each card's paragraph
- One card = one short paragraph (2-3 sentences)
- End with a PRACTICAL STEPS section
- Use simple, everyday language

CONTENT PER CARD:
- Name the transient and status
- Use TEMPORAL framing: Too Much = "leaning into the future," Too Little = "caught in the past"
- Describe what's happening in felt/behavioral terms (not technical house names)
- Name the correction AND briefly explain why it helps

STRUCTURE:
1. Brief opening addressing their question
2. One paragraph per card with temporal framing + correction rationale
3. Final "Practical Steps:" section with one concrete action per correction

EXAMPLE CARD PARAGRAPH:
"Too Much Sacrifice in your situation shows the letting-go impulse leaning so far into the future that it's become draining rather than restorative. You're suspended ahead of your actual timing. Drive corrects here because it brings motion back to the present — engaging what's actually in front of you rather than waiting for something that hasn't arrived."`
  },
  practitioner: {
    name: "Practitioner", 
    description: "Structural & precise",
    instruction: `You speak with precision about the architecture.

FORMAT — THIS IS CRITICAL:
- Put a BLANK LINE between each card's paragraph
- One card = one paragraph with structural detail
- End with a PRACTICAL STEPS section

CONTENT PER CARD:
- Name transient, position, status
- Use TEMPORAL framing for status
- Show correction logic briefly (diagonal/vertical/number mirror)
- Explain WHY the correction works in one sentence
- Reference house dynamics through behavior, not jargon

STRUCTURE:
1. Address their question with structural framing
2. One paragraph per card with full detail + correction rationale
3. Note any cross-card patterns
4. Final "Practical Steps:" section with structural rationale

EXAMPLE CORRECTION RATIONALE:
"Correction via diagonal to Drive works because Drive is the balanced expression of directed motion where Sacrifice has stalled in suspension."`
  },
  philosopher: {
    name: "Philosopher",
    description: "Deep & contemplative",
    instruction: `You speak contemplatively, drawing out meaning.

FORMAT — THIS IS CRITICAL:
- Put a BLANK LINE between paragraphs
- Weave cards into reflection but keep paragraphs separate
- End with practical invitations, then a closing question

CONTENT:
- Use TEMPORAL framing poetically: "living in potential futures," "caught in echoes of the past," "not yet arrived in the now"
- Frame corrections as invitations that restore presence
- Connect to larger themes of time, presence, becoming

STRUCTURE:
1. Contemplative opening
2. Reflective paragraphs weaving the cards with temporal awareness
3. "The corrections invite:" section
4. Close with an open question about presence`
  },
  direct: {
    name: "Direct",
    description: "Brief & actionable",
    instruction: `Brief and clear. Every card on its own line.

FORMAT — THIS IS CRITICAL:
- Each card gets its OWN LINE
- Include temporal framing in parentheses
- End with numbered action steps

STRUCTURE:
"[One sentence summary.]

[Card 1]: [What's happening] (future-leaning/past-anchored/shadow). → [Correction]: [Why it helps].

[Card 2]: [What's happening] (temporal frame). → [Correction]: [Why it helps].

[Card 3]: [What's happening] (temporal frame). → [Correction]: [Why it helps].

Do this:
1. [Action]
2. [Action]
3. [Action]"

Keep each line SHORT. Simple words only.`
  }
};

// === CORRECTION LOGIC ===
function getArchetypeCorrection(position, status) {
  if (status === 1) return null;
  if (status === 2) return { type: "diagonal", target: 19 - position };
  if (status === 3) return { type: "vertical", target: 20 - position };
  if (status === 4) {
    const sum = String(position).split('').reduce((a, b) => a + parseInt(b), 0);
    const pairs = { 1: [1, 10, 19], 2: [2, 11, 20], 3: [3, 12, 21], 4: [4, 13], 5: [5, 14], 6: [6, 15], 7: [7, 16], 8: [8, 17], 9: [9, 18] };
    const key = sum > 9 ? (sum % 9 || 9) : sum;
    return { type: "reduction", targets: (pairs[key] || []).filter(p => p !== position) };
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
  if (correction.targets && correction.targets.length > 0) return correction.targets[0]; // Return first for click
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
  // Shuffle pools to draw without replacement
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
    
    return `**${context}**: ${statusPhrase}
Transient: ${transInfo}
Status: ${stat.name} — ${stat.desc}
${correctionText ? `Correction: ${correctionText}` : 'No correction needed'}`;
  }).join('\n\n');
}

const BASE_SYSTEM = `You are a structural reader within the Nirmanakaya Consciousness Architecture.

YOUR ROLE: Mirror, not mentor. You reflect what the structure shows. You do not diagnose, prescribe, or claim to see what the user cannot.

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
- "Assertion as correction means: name what you see, speak it, make it real"
- "Release here means: loosen grip on the timeline, let completion arrive"
- "Allure as correction means: reconnect with genuine attraction rather than forced direction"
- Every imbalanced card needs its correction explained

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

WHEN NAMING CORRECTIONS, BRIEFLY EXPLAIN WHY:
- Don't just name the correction — give one sentence on why it helps
- "Drive corrects here because it's the balanced expression of motion where Sacrifice has stalled"
- "Inspiration corrects because it draws energy forward through genuine attraction rather than mental effort"
- "Abstraction corrects by providing the wider view needed to see patterns the emotional field is too close to recognize"

HOUSE DYNAMICS — SHOW, DON'T NAME:
- Reference house qualities through behavior, not technical terms
- Instead of "Emotion House Fruition" say "your emotional field is under-responding"
- Instead of "Mind House Seed" say "your mental patterns are over-structuring"
- Let them feel the house without jargon

RESPOND TO THEIR QUESTION by reflecting what the structure shows about this moment. ALWAYS include practical guidance for each correction path. ALWAYS end with a clear practical steps section — this is essential.`;

// === CARD INFO MODAL COMPONENT ===
const CardInfoModal = ({ cardId, onClose }) => {
  if (cardId === null) return null;
  
  const component = getComponent(cardId);
  const isArchetype = component.type === "Archetype";
  const isBound = component.type === "Bound";
  const isAgent = component.type === "Agent";
  
  // Get associated archetype for Bounds/Agents
  const associatedArchetype = (isBound || isAgent) ? ARCHETYPES[component.archetype] : null;
  
  // Get associated cards for Archetypes
  const associations = isArchetype ? getAssociatedCards(cardId) : null;
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-zinc-900 rounded-xl border border-zinc-700 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold text-zinc-100">{component.name}</h3>
              <p className="text-sm text-zinc-500">{component.traditional}</p>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 text-xl">×</button>
          </div>
          
          {/* Type Badge */}
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
                {component.house} House • {component.function}
              </span>
            )}
            {isBound && (
              <span className="text-xs text-zinc-500 ml-2">
                {component.channel} • {component.number <= 5 ? 'Inner' : 'Outer'} Bound
              </span>
            )}
            {isAgent && (
              <span className="text-xs text-zinc-500 ml-2">
                {component.role} • {component.channel}
              </span>
            )}
          </div>
          
          {/* Description */}
          <p className="text-sm text-zinc-300 mb-4 leading-relaxed">
            {component.extended || component.description}
          </p>
          
          {/* Associated Archetype (for Bounds/Agents) */}
          {associatedArchetype && (
            <div className="border-t border-zinc-700/50 pt-4 mb-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                {isBound ? 'Expresses' : 'Embodies'}
              </p>
              <p className="text-sm text-zinc-300">
                <span className="text-zinc-100 font-medium">{associatedArchetype.name}</span>
                <span className="text-zinc-500"> — {associatedArchetype.description}</span>
              </p>
            </div>
          )}
          
          {/* Associated Cards (for Archetypes) */}
          {associations && (associations.bounds.length > 0 || associations.agents.length > 0) && (
            <div className="border-t border-zinc-700/50 pt-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Expressed By</p>
              
              {associations.bounds.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-zinc-600 mb-1">Bounds:</p>
                  <div className="flex flex-wrap gap-1">
                    {associations.bounds.map(b => (
                      <span key={b.id} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                        {b.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {associations.agents.length > 0 && (
                <div>
                  <p className="text-xs text-zinc-600 mb-1">Agents:</p>
                  <div className="flex flex-wrap gap-1">
                    {associations.agents.map(a => (
                      <span key={a.id} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                        {a.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
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
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTraditional, setShowTraditional] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isSharedReading, setIsSharedReading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null); // For tooltip/modal
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const performReadingWithDraws = async (drawsToUse) => {
    setLoading(true); setError(''); setMessages([]);
    const drawText = formatDrawForAI(drawsToUse, spreadType, spreadKey, showTraditional);
    const personaConfig = PERSONAS[persona];
    const spreadName = spreadType === 'durable' ? DURABLE_SPREADS[spreadKey].name : `${RANDOM_SPREADS[spreadKey].name} Random`;
    
    const systemPrompt = `${BASE_SYSTEM}\n\n${personaConfig.instruction}`;
    const userMessage = `QUESTION: "${question}"\n\nTHE DRAW (${spreadName}):\n\n${drawText}\n\nRemember: Answer their question directly, be warm, no headers or bullet points.`;

    try {
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: userMessage }], system: systemPrompt })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages([{ role: 'user', content: question, isQuestion: true }, { role: 'assistant', content: data.reading }]);
    } catch (e) { setError(`Error: ${e.message}`); }
    setLoading(false);
  };

  const performReading = async () => {
    if (!question.trim()) { setError('Please enter your question.'); return; }
    const isDurable = spreadType === 'durable';
    const count = isDurable ? DURABLE_SPREADS[spreadKey].count : RANDOM_SPREADS[spreadKey].count;
    const newDraws = generateSpread(count, isDurable);
    setDraws(newDraws);
    await performReadingWithDraws(newDraws);
  };

  const sendFollowUp = async () => {
    if (!followUp.trim() || !draws) return;
    setLoading(true); setError('');
    const drawText = formatDrawForAI(draws, spreadType, spreadKey, showTraditional);
    const personaConfig = PERSONAS[persona];
    const systemPrompt = `${BASE_SYSTEM}\n\n${personaConfig.instruction}\n\nCONTEXT — Follow-up on this reading:\n${drawText}`;
    const newMessages = [...messages, { role: 'user', content: followUp }];
    
    try {
      const res = await fetch('/api/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })), system: systemPrompt })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages([...newMessages, { role: 'assistant', content: data.reading }]);
      setFollowUp('');
    } catch (e) { setError(`Error: ${e.message}`); }
    setLoading(false);
  };

  const resetReading = () => {
    setDraws(null); setMessages([]); setQuestion(''); setFollowUp(''); setError('');
    setShareUrl(''); setIsSharedReading(false); setShowArchitecture(false);
    hasAutoInterpreted.current = false;
    window.history.replaceState({}, '', window.location.pathname);
  };

  // Get house for a card (for coloring)
  const getCardHouse = (draw, index) => {
    if (spreadType === 'durable') {
      return DURABLE_SPREADS[spreadKey].frames[index].house;
    } else if (draw.position !== null) {
      return ARCHETYPES[draw.position]?.house || 'Gestalt';
    }
    return 'Gestalt';
  };

  // === CARD DISPLAY ===
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

    return (
      <div className={`rounded-xl border-2 p-4 ${houseColors.border} ${houseColors.bg} transition-all`}>
        {/* Status Badge */}
        <div className="mb-3">
          <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[draw.status]}`}>
            {stat.name}
          </span>
        </div>

        {/* Transient (PRIMARY) */}
        <div className="mb-3">
          <div 
            className="text-xl text-zinc-100 font-semibold cursor-pointer hover:text-zinc-300 transition-colors"
            onClick={() => setSelectedCard(draw.transient)}
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

        {/* Context */}
        <div className="text-sm text-zinc-400 mb-3">
          in your <span className={`font-medium ${houseColors.text}`}>{contextLabel}</span>
          {contextSub && <span className="text-zinc-600 text-xs ml-1">({contextSub})</span>}
        </div>

        {/* Transient Details */}
        <div className="border-t border-zinc-700/30 pt-3 space-y-1">
          {trans.type === "Bound" && (
            <>
              <div className="text-sm">
                <span className={CHANNEL_COLORS[trans.channel]}>{trans.channel}</span>
                <span className="text-zinc-500"> Channel</span>
              </div>
              <div className="text-sm text-zinc-400">
                Expresses <span 
                  className="text-zinc-300 cursor-pointer hover:text-zinc-100 transition-colors"
                  onClick={() => setSelectedCard(trans.archetype)}
                >{transArchetype?.name}</span>
              </div>
            </>
          )}
          {trans.type === "Agent" && (
            <>
              <div className="text-sm">
                <span className="text-zinc-300">{trans.role}</span>
                <span className="text-zinc-500"> of </span>
                <span className={CHANNEL_COLORS[trans.channel]}>{trans.channel}</span>
              </div>
              <div className="text-sm text-zinc-400">
                Embodies <span 
                  className="text-zinc-300 cursor-pointer hover:text-zinc-100 transition-colors"
                  onClick={() => setSelectedCard(trans.archetype)}
                >{transArchetype?.name}</span>
              </div>
            </>
          )}
        </div>

        {/* Correction */}
        {correctionText && draw.status !== 1 && (
          <div className="border-t border-zinc-700/30 pt-3 mt-3">
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Correction</div>
            <div className="text-sm text-zinc-300">
              → <span 
                className={correctionTargetId !== null ? "cursor-pointer hover:text-zinc-100 transition-colors" : ""}
                onClick={() => correctionTargetId !== null && setSelectedCard(correctionTargetId)}
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
          <p className="text-zinc-700 text-[10px] mt-1">v0.7 alpha • experimental</p>
        </div>

        {/* Show intro only before reading */}
        {!draws && <IntroSection />}

        {/* Controls */}
        {!draws && (
          <>
            {/* Spread Type Toggle */}
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

            {/* Spread Selection */}
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

            {/* Spread Description */}
            {spreadType === 'durable' && DURABLE_SPREADS[spreadKey] && (
              <p className="text-center text-zinc-600 text-xs mb-4">{DURABLE_SPREADS[spreadKey].description}</p>
            )}

            {/* Persona Selection */}
            <div className="flex gap-2 mb-4 justify-center flex-wrap">
              {Object.entries(PERSONAS).map(([key, value]) => (
                <button key={key} onClick={() => setPersona(key)} title={value.description}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${persona === key ? 'bg-zinc-700 text-zinc-100' : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800'}`}>
                  {value.name}
                </button>
              ))}
            </div>

            {/* Traditional Toggle */}
            <div className="flex justify-center mb-6">
              <button onClick={() => setShowTraditional(!showTraditional)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all ${showTraditional ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-900/50 text-zinc-600 hover:text-zinc-400'}`}>
                {showTraditional ? '✓ Traditional Names' : 'Show Traditional Names'}
              </button>
            </div>

            {/* Question Input */}
            <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What's your question?"
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 resize-none transition-colors mb-4" rows={3} />

            {/* Draw Button */}
            <button onClick={performReading} disabled={loading}
              className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-700 py-4 rounded-xl transition-all duration-300 font-light tracking-wider">
              DRAW
            </button>
          </>
        )}

        {/* Loading */}
        {loading && (
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
            
            <div className={`grid gap-4 ${draws.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : draws.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-5'}`}>
              {draws.map((draw, i) => <CardDisplay key={i} draw={draw} index={i} />)}
            </div>

            {/* Architecture Panel */}
            {showArchitecture && (
              <div className="mt-6 bg-zinc-900/50 rounded-xl border border-zinc-800/50 p-4">
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-4">Architecture Details</div>
                
                {/* Individual Card Breakdowns */}
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
                        
                        {/* Position Info (Random only) */}
                        {pos && (
                          <div className="text-zinc-500 mb-2">
                            <span className="text-zinc-400">Position {draw.position}:</span> {pos.name} ({pos.traditional})
                            <br />
                            <span className="text-zinc-600">House: {pos.house} | Function: {pos.function}</span>
                          </div>
                        )}
                        
                        {/* Transient Info */}
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
                        
                        {/* Status + Correction Math */}
                        <div className="text-zinc-500">
                          <span className="text-zinc-400">Status:</span> {stat.name} ({stat.orientation})
                          {correction && draw.status !== 1 && (
                            <div className="mt-1 pl-3 border-l-2 border-zinc-700 text-zinc-600">
                              {trans.type === "Archetype" && (
                                <>
                                  {draw.status === 2 && <div>Diagonal correction: 19 - {draw.transient} = {19 - draw.transient} → {ARCHETYPES[19 - draw.transient]?.name}</div>}
                                  {draw.status === 3 && <div>Vertical correction: 20 - {draw.transient} = {20 - draw.transient} → {ARCHETYPES[20 - draw.transient]?.name}</div>}
                                  {draw.status === 4 && correction.targets && (
                                    <div>Reduction pair (digit sum): {correction.targets.map(t => `${ARCHETYPES[t]?.name} (${t})`).join(', ')}</div>
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
                                  <div>Agent corrects through embodied Archetype ({transArchetype?.name})</div>
                                  {draw.status === 2 && <div>Diagonal: 19 - {trans.archetype} = {correction.target} → {ARCHETYPES[correction.target]?.name}</div>}
                                  {draw.status === 3 && <div>Vertical: 20 - {trans.archetype} = {correction.target} → {ARCHETYPES[correction.target]?.name}</div>}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cross-Card Relationships */}
                {draws.length > 1 && (
                  <div className="border-t border-zinc-800/50 pt-4">
                    <div className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Relationships</div>
                    <div className="text-sm text-zinc-600 space-y-1">
                      {(() => {
                        const relationships = [];
                        const isDurable = spreadType === 'durable';
                        const spreadConfig = isDurable ? DURABLE_SPREADS[spreadKey] : null;
                        
                        // Check for shared houses
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
                        
                        // Check for shared channels in transients
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
                        
                        // Check for correction connections
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

        {/* Messages */}
        {messages.length > 0 && !loading && (
          <div className="space-y-4 mb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`rounded-xl p-4 ${msg.role === 'user' ? 'bg-zinc-800/50 ml-8' : 'bg-zinc-900/50 border border-zinc-800/50'}`}>
                {msg.isQuestion && <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Your Question</div>}
                <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap text-sm">{msg.content}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Follow-up */}
        {draws && messages.length > 0 && !loading && (
          <div className="flex gap-2">
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
      
      {/* Card Info Modal */}
      <CardInfoModal cardId={selectedCard} onClose={() => setSelectedCard(null)} />
    </div>
  );
}
