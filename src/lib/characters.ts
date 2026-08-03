import moses from "@/assets/characters/moses.png";
import noah from "@/assets/characters/noah.png";
import david from "@/assets/characters/david.png";
import abraham from "@/assets/characters/abraham.png";
import joseph from "@/assets/characters/joseph.png";
import daniel from "@/assets/characters/daniel.png";
import esther from "@/assets/characters/esther.png";
import samson from "@/assets/characters/samson.png";

export type Character = {
  name: string;
  image?: string;
  icon?: string;
  fact: string;
};

export const CHARACTERS: Character[] = [
  { name: "Moses", image: moses, fact: "Moses led the Israelites out of Egypt and received the ten commandments." },
  { name: "Noah", image: noah, fact: "Noah built the ark and his family survived the great flood." },
  { name: "David", image: david, fact: "David defeated Goliath with a sling and a stone, and later became king." },
  { name: "Abraham", image: abraham, fact: "Abraham left his home trusting a promise that his family would fill the earth." },
  { name: "Joseph", image: joseph, fact: "Joseph wore a coat of many colors and rose from prison to rule in Egypt." },
  { name: "Daniel", image: daniel, fact: "Daniel kept praying and was kept safe overnight in the lions' den." },
  { name: "Esther", image: esther, fact: "Queen Esther bravely spoke to the king and rescued her people." },
  { name: "Samson", image: samson, fact: "Samson's great strength was tied to his long, uncut hair." },
  { name: "Ruth", icon: "🌾", fact: "Ruth stayed loyal to Naomi and gathered grain in Boaz's fields." },
  { name: "Solomon", icon: "🏛️", fact: "Solomon asked for wisdom and built the first temple in Jerusalem." },
  { name: "Elijah", icon: "🔥", fact: "Elijah called down fire from heaven on Mount Carmel." },
  { name: "Deborah", icon: "🌳", fact: "Deborah was a prophet and judge who led Israel to victory." },
  { name: "Jonah", icon: "🐋", fact: "Jonah spent three days inside a great fish before preaching in Nineveh." },
  { name: "Joshua", icon: "📯", fact: "Joshua marched around Jericho and its walls came tumbling down." },
  { name: "Sarah", icon: "🌸", fact: "Sarah laughed with joy when she had a son in her old age." },
  { name: "Miriam", icon: "🥁", fact: "Miriam led the people in song and dance after crossing the Red Sea." },
  { name: "Isaiah", icon: "🕊️", fact: "Isaiah was a prophet who foretold the coming of a Prince of Peace." },
  { name: "Rebekah", icon: "🏺", fact: "Rebekah drew water for a stranger's camels and became Isaac's wife." },
];

export const FACTS: Record<string, string> = Object.fromEntries(
  CHARACTERS.map((c) => [c.name, c.fact]),
);
