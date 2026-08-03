import moses from "@/assets/characters/moses.png";
import noah from "@/assets/characters/noah.png";
import david from "@/assets/characters/david.png";
import abraham from "@/assets/characters/abraham.png";
import joseph from "@/assets/characters/joseph.png";
import daniel from "@/assets/characters/daniel.png";
import esther from "@/assets/characters/esther.png";
import samson from "@/assets/characters/samson.png";
import ruth from "@/assets/characters/ruth.png";
import solomon from "@/assets/characters/solomon.png";
import elijah from "@/assets/characters/elijah.png";
import jonah from "@/assets/characters/jonah.png";

export type Character = {
  name: string;
  image?: string | undefined;
  icon?: string | undefined;
  fact: string;
  verse: string;
};

export const CHARACTERS: Character[] = [
  { name: "Moses", image: moses, fact: "Moses led the Israelites out of Egypt and received the ten commandments.", verse: "Exodus 14:21" },
  { name: "Noah", image: noah, fact: "Noah built the ark and his family survived the great flood.", verse: "Genesis 7:7" },
  { name: "David", image: david, fact: "David defeated Goliath with a sling and a stone, and later became king.", verse: "1 Samuel 17:50" },
  { name: "Abraham", image: abraham, fact: "Abraham left his home trusting a promise that his family would fill the earth.", verse: "Genesis 12:1" },
  { name: "Joseph", image: joseph, fact: "Joseph wore a coat of many colors and rose from prison to rule in Egypt.", verse: "Genesis 37:3" },
  { name: "Daniel", image: daniel, fact: "Daniel kept praying and was kept safe overnight in the lions' den.", verse: "Daniel 6:22" },
  { name: "Esther", image: esther, fact: "Queen Esther bravely spoke to the king and rescued her people.", verse: "Esther 4:14" },
  { name: "Samson", image: samson, fact: "Samson's great strength was tied to his long, uncut hair.", verse: "Judges 16:17" },
  { name: "Ruth", image: ruth, fact: "Ruth stayed loyal to Naomi and gathered grain in Boaz's fields.", verse: "Ruth 1:16" },
  { name: "Solomon", image: solomon, fact: "Solomon asked for wisdom and built the first temple in Jerusalem.", verse: "1 Kings 3:9" },
  { name: "Elijah", image: elijah, fact: "Elijah called down fire from heaven on Mount Carmel.", verse: "1 Kings 18:38" },
  { name: "Jonah", image: jonah, fact: "Jonah spent three days inside a great fish before preaching in Nineveh.", verse: "Jonah 1:17" },
  { name: "Deborah", icon: "🌳", fact: "Deborah was a prophet and judge who led Israel to victory.", verse: "Judges 4:4" },
  { name: "Joshua", icon: "📯", fact: "Joshua marched around Jericho and its walls came tumbling down.", verse: "Joshua 6:20" },
  { name: "Sarah", icon: "🌸", fact: "Sarah laughed with joy when she had a son in her old age.", verse: "Genesis 21:6" },
  { name: "Miriam", icon: "🥁", fact: "Miriam led the people in song and dance after crossing the Red Sea.", verse: "Exodus 15:20" },
  { name: "Isaiah", icon: "🕊️", fact: "Isaiah was a prophet who foretold the coming of a Prince of Peace.", verse: "Isaiah 9:6" },
  { name: "Rebekah", icon: "🏺", fact: "Rebekah drew water for a stranger's camels and became Isaac's wife.", verse: "Genesis 24:19" },
];

export const FACTS: Record<string, { fact: string; verse: string }> = Object.fromEntries(
  CHARACTERS.map((c) => [c.name, { fact: c.fact, verse: c.verse }]),
);
